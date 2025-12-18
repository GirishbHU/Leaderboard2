import { isPayPalConfigured } from "./paypal";
import { isCashfreeConfigured } from "./cashfree";
import { sendPaymentAlertEmail } from "./emailService";

const PAYMENTS_MODE = process.env.PAYMENTS_MODE || "mock";
const ADMIN_EMAIL = "girish@i2u.ai";

export interface PaymentResult {
  success: boolean;
  orderId?: string;
  transactionId?: string;
  message?: string;
  error?: string;
  requiresRedirect?: boolean;
  redirectUrl?: string;
  paymentSessionId?: string;
}

export interface PaymentRequest {
  userId: string;
  amount: number;
  currency: "INR" | "USD";
  planType: string;
  email: string;
  customerName?: string;
  customerPhone?: string;
}

export async function processPayment(request: PaymentRequest): Promise<PaymentResult> {
  if (PAYMENTS_MODE === "mock") {
    const result = await mockPayment(request);
    if (result.success) {
      await sendPaymentAlertEmail({
        to: ADMIN_EMAIL,
        subject: `[MOCK] Payment Success - ${request.currency} ${request.amount}`,
        userEmail: request.email,
        amount: request.amount,
        currency: request.currency,
        status: "success",
        orderId: result.orderId || "",
        planType: request.planType
      });
    }
    return result;
  }
  
  if (PAYMENTS_MODE === "sandbox" || PAYMENTS_MODE === "live") {
    return livePayment(request);
  }
  
  return { success: false, error: "Invalid payment mode" };
}

async function mockPayment(request: PaymentRequest): Promise<PaymentResult> {
  await new Promise(resolve => setTimeout(resolve, 500));
  
  const mockOrderId = `MOCK-${Date.now()}-${Math.random().toString(36).substring(7)}`;
  const mockTransactionId = `TXN-${Date.now()}`;
  
  return {
    success: true,
    orderId: mockOrderId,
    transactionId: mockTransactionId,
    message: `Mock payment successful for ${request.planType} plan (${request.currency} ${request.amount})`,
  };
}

async function livePayment(request: PaymentRequest): Promise<PaymentResult> {
  if (request.currency === "USD") {
    if (!isPayPalConfigured) {
      return {
        success: false,
        error: "PayPal is not configured. Please use manual payment or contact support.",
        requiresRedirect: false
      };
    }
    return {
      success: true,
      requiresRedirect: true,
      message: "Redirect to PayPal checkout",
      orderId: `PAYPAL-PENDING-${Date.now()}`
    };
  }
  
  if (request.currency === "INR") {
    if (!isCashfreeConfigured) {
      return {
        success: false,
        error: "Cashfree is not configured yet (pending whitelisting). Please use manual UPI/Bank payment.",
        requiresRedirect: false
      };
    }
    return {
      success: true,
      requiresRedirect: true,
      message: "Redirect to Cashfree checkout",
      orderId: `CASHFREE-PENDING-${Date.now()}`
    };
  }
  
  return { success: false, error: "Unsupported currency" };
}

export function getPaymentMode(): string {
  return PAYMENTS_MODE;
}

export function isMockMode(): boolean {
  return PAYMENTS_MODE === "mock";
}

export function getPaymentGatewayStatus() {
  return {
    mode: PAYMENTS_MODE,
    paypal: {
      configured: isPayPalConfigured,
      currency: "USD"
    },
    cashfree: {
      configured: isCashfreeConfigured,
      currency: "INR"
    },
    manual: {
      available: true,
      methods: ["UPI", "Bank Transfer"]
    }
  };
}
