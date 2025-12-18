import { Cashfree, CFEnvironment, CreateOrderRequest } from "cashfree-pg";
import { Request, Response } from "express";
import { sendPaymentAlertEmail } from "./emailService";

const { CASHFREE_APP_ID, CASHFREE_SECRET_KEY, PAYMENTS_MODE } = process.env;

export const isCashfreeConfigured = !!(CASHFREE_APP_ID && CASHFREE_SECRET_KEY);

let cashfreeClient: Cashfree | null = null;

function getCashfreeEnvironment(): CFEnvironment {
  if (PAYMENTS_MODE === "live") {
    return CFEnvironment.PRODUCTION;
  }
  return CFEnvironment.SANDBOX;
}

if (isCashfreeConfigured) {
  const environment = getCashfreeEnvironment();
  console.log(`Cashfree initialized in ${PAYMENTS_MODE === "live" ? "PRODUCTION" : "SANDBOX"} mode`);
  
  cashfreeClient = new Cashfree(
    environment,
    CASHFREE_APP_ID!,
    CASHFREE_SECRET_KEY!
  );
}

interface OrderRequestBody {
  amount: number;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  returnUrl?: string;
}

export async function createCashfreeOrder(req: Request, res: Response) {
  if (!isCashfreeConfigured || !cashfreeClient) {
    return res.status(503).json({ 
      error: "Cashfree is not configured. Please add CASHFREE_APP_ID and CASHFREE_SECRET_KEY." 
    });
  }

  try {
    const { amount, customerId, customerName, customerEmail, customerPhone, returnUrl } = req.body as OrderRequestBody;

    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount. Amount must be a positive number." });
    }

    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required." });
    }

    const orderId = `i2u_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const baseUrl = process.env.REPLIT_DEV_DOMAIN 
      ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
      : 'http://localhost:5000';
    
    const orderRequest: CreateOrderRequest = {
      order_amount: amount,
      order_currency: "INR",
      order_id: orderId,
      customer_details: {
        customer_id: customerId,
        customer_phone: customerPhone || "9999999999",
        customer_name: customerName || "User",
        customer_email: customerEmail || "user@example.com"
      },
      order_meta: {
        return_url: returnUrl || `${baseUrl}/payment/callback?order_id={order_id}`,
        notify_url: `${baseUrl}/api/cashfree/webhook`
      }
    };

    const response = await cashfreeClient.PGCreateOrder(orderRequest);
    
    res.json({
      success: true,
      orderId: response.data?.order_id,
      paymentSessionId: response.data?.payment_session_id,
      orderStatus: response.data?.order_status
    });
  } catch (error: any) {
    console.error("Failed to create Cashfree order:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to create order.", 
      details: error.response?.data?.message || error.message 
    });
  }
}

export async function verifyCashfreePayment(req: Request, res: Response) {
  if (!isCashfreeConfigured || !cashfreeClient) {
    return res.status(503).json({ error: "Cashfree is not configured." });
  }

  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const response = await cashfreeClient.PGOrderFetchPayments(orderId);
    const payments = response.data || [];
    
    let status = "PENDING";
    let paymentDetails = null;

    const successfulPayment = payments.find((p: any) => p.payment_status === "SUCCESS");
    const pendingPayment = payments.find((p: any) => p.payment_status === "PENDING");
    
    if (successfulPayment) {
      status = "SUCCESS";
      paymentDetails = successfulPayment;
    } else if (pendingPayment) {
      status = "PENDING";
      paymentDetails = pendingPayment;
    } else if (payments.length > 0) {
      status = "FAILED";
      paymentDetails = payments[0];
    }

    res.json({
      success: status === "SUCCESS",
      status,
      orderId,
      paymentDetails
    });
  } catch (error: any) {
    console.error("Failed to verify Cashfree payment:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to verify payment.",
      details: error.response?.data?.message || error.message
    });
  }
}

export async function getCashfreeOrderStatus(req: Request, res: Response) {
  if (!isCashfreeConfigured || !cashfreeClient) {
    return res.status(503).json({ error: "Cashfree is not configured." });
  }

  try {
    const { orderId } = req.params;
    
    if (!orderId) {
      return res.status(400).json({ error: "Order ID is required." });
    }

    const response = await cashfreeClient.PGFetchOrder(orderId);
    
    res.json({
      success: true,
      order: response.data
    });
  } catch (error: any) {
    console.error("Failed to fetch Cashfree order:", error.response?.data || error.message);
    res.status(500).json({ 
      error: "Failed to fetch order status.",
      details: error.response?.data?.message || error.message
    });
  }
}

export async function handleCashfreeWebhook(req: Request, res: Response) {
  try {
    const signature = req.headers["x-webhook-signature"] as string;
    const timestamp = req.headers["x-webhook-timestamp"] as string;
    const rawBody = typeof req.body === "string" ? req.body : JSON.stringify(req.body);

    if (isCashfreeConfigured && cashfreeClient && signature && timestamp) {
      try {
        cashfreeClient.PGVerifyWebhookSignature(signature, rawBody, timestamp);
      } catch (err) {
        console.error("Webhook signature verification failed:", err);
        return res.status(400).json({ error: "Invalid webhook signature" });
      }
    }

    const webhookData = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    console.log("Cashfree webhook received:", webhookData);

    const paymentData = webhookData.data?.payment || webhookData.data;
    const orderData = webhookData.data?.order || {};
    const customerData = webhookData.data?.customer_details || {};
    const eventType = webhookData.type || webhookData.event_type;

    if (eventType === "PAYMENT_SUCCESS_WEBHOOK" || paymentData?.payment_status === "SUCCESS") {
      await sendPaymentAlertEmail({
        to: "girish@i2u.ai",
        subject: `[Cashfree] Payment SUCCESS - INR ${paymentData.payment_amount || orderData.order_amount}`,
        userEmail: customerData.customer_email || "unknown",
        amount: paymentData.payment_amount || orderData.order_amount || 0,
        currency: "INR",
        status: "success",
        orderId: orderData.order_id || paymentData.cf_payment_id || "",
        transactionId: paymentData.cf_payment_id,
        planType: "Registration",
        paymentMethod: paymentData.payment_group || "Cashfree"
      });
    } else if (eventType === "PAYMENT_FAILED_WEBHOOK" || paymentData?.payment_status === "FAILED") {
      await sendPaymentAlertEmail({
        to: "girish@i2u.ai",
        subject: `[Cashfree] Payment FAILED - INR ${paymentData.payment_amount || orderData.order_amount}`,
        userEmail: customerData.customer_email || "unknown",
        amount: paymentData.payment_amount || orderData.order_amount || 0,
        currency: "INR",
        status: "failed",
        orderId: orderData.order_id || "",
        planType: "Registration",
        paymentMethod: paymentData.payment_group || "Cashfree",
        errorMessage: paymentData.payment_message || "Payment failed"
      });
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Webhook processing error:", error);
    res.status(500).json({ error: "Webhook processing failed" });
  }
}

export function getCashfreeConfig(req: Request, res: Response) {
  res.json({
    configured: isCashfreeConfigured,
    environment: PAYMENTS_MODE === "live" ? "production" : "sandbox",
    mode: PAYMENTS_MODE || "mock"
  });
}

export async function verifyCashfreePaymentById(orderId: string): Promise<{ success: boolean; status: string; amount?: number; currency?: string }> {
  if (!isCashfreeConfigured || !cashfreeClient) {
    return { success: false, status: "NOT_CONFIGURED" };
  }

  try {
    const response = await cashfreeClient.PGOrderFetchPayments(orderId);
    const payments = response.data || [];
    
    const successfulPayment = payments.find((p: any) => p.payment_status === "SUCCESS");
    
    if (successfulPayment) {
      if (!successfulPayment.payment_currency) {
        console.log("Cashfree payment missing currency data");
        return { success: false, status: "MISSING_CURRENCY" };
      }
      return { 
        success: true, 
        status: "SUCCESS",
        amount: successfulPayment.payment_amount,
        currency: successfulPayment.payment_currency
      };
    }
    
    return { success: false, status: "PENDING_OR_FAILED" };
  } catch (error: any) {
    console.error("Cashfree payment verification error:", error.response?.data || error.message);
    return { success: false, status: "VERIFICATION_ERROR" };
  }
}
