import {
  Client,
  Environment,
  LogLevel,
  OAuthAuthorizationController,
  OrdersController,
} from "@paypal/paypal-server-sdk";
import { Request, Response } from "express";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYMENTS_MODE } = process.env;

export const isPayPalConfigured = !!(PAYPAL_CLIENT_ID && PAYPAL_CLIENT_SECRET);

let ordersController: OrdersController | null = null;
let oAuthAuthorizationController: OAuthAuthorizationController | null = null;

function getPayPalEnvironment(): Environment {
  if (PAYMENTS_MODE === "live") {
    return Environment.Production;
  }
  return Environment.Sandbox;
}

if (isPayPalConfigured) {
  console.log(`PayPal initialized in ${PAYMENTS_MODE === "live" ? "PRODUCTION" : "SANDBOX"} mode`);
  
  const client = new Client({
    clientCredentialsAuthCredentials: {
      oAuthClientId: PAYPAL_CLIENT_ID!,
      oAuthClientSecret: PAYPAL_CLIENT_SECRET!,
    },
    timeout: 0,
    environment: getPayPalEnvironment(),
    logging: {
      logLevel: LogLevel.Info,
      logRequest: {
        logBody: true,
      },
      logResponse: {
        logHeaders: true,
      },
    },
  });
  ordersController = new OrdersController(client);
  oAuthAuthorizationController = new OAuthAuthorizationController(client);
}

export async function getClientToken() {
  if (!isPayPalConfigured || !oAuthAuthorizationController) {
    throw new Error("PayPal is not configured");
  }
  
  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`,
  ).toString("base64");

  const { result } = await oAuthAuthorizationController.requestToken(
    {
      authorization: `Basic ${auth}`,
    },
    { intent: "sdk_init", response_type: "client_token" },
  );

  return result.accessToken;
}

export async function createPaypalOrder(req: Request, res: Response) {
  if (!isPayPalConfigured || !ordersController) {
    return res.status(503).json({ error: "PayPal is not configured. Please add PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET." });
  }

  try {
    const { amount, currency, intent } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res.status(400).json({
        error: "Invalid amount. Amount must be a positive number.",
      });
    }

    if (!currency) {
      return res.status(400).json({ error: "Invalid currency. Currency is required." });
    }

    if (!intent) {
      return res.status(400).json({ error: "Invalid intent. Intent is required." });
    }

    const collect = {
      body: {
        intent: intent,
        purchaseUnits: [
          {
            amount: {
              currencyCode: currency,
              value: amount,
            },
          },
        ],
      },
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.createOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  if (!isPayPalConfigured || !ordersController) {
    return res.status(503).json({ error: "PayPal is not configured." });
  }

  try {
    const { orderID } = req.params;
    const collect = {
      id: orderID,
      prefer: "return=minimal",
    };

    const { body, ...httpResponse } = await ordersController.captureOrder(collect);

    const jsonResponse = JSON.parse(String(body));
    const httpStatusCode = httpResponse.statusCode;

    res.status(httpStatusCode).json(jsonResponse);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  if (!isPayPalConfigured) {
    return res.status(503).json({ error: "PayPal is not configured." });
  }
  
  try {
    const clientToken = await getClientToken();
    res.json({ clientToken });
  } catch (error) {
    console.error("Failed to get PayPal client token:", error);
    res.status(500).json({ error: "Failed to initialize PayPal." });
  }
}

export async function verifyPayPalPaymentById(orderId: string): Promise<{ success: boolean; status: string; amount?: string; currency?: string }> {
  if (!isPayPalConfigured || !ordersController) {
    return { success: false, status: "NOT_CONFIGURED" };
  }

  try {
    const { body } = await ordersController.getOrder({ id: orderId });
    const order = JSON.parse(String(body));
    
    if (order.status === "COMPLETED") {
      const amount = order.purchase_units?.[0]?.amount?.value;
      const currency = order.purchase_units?.[0]?.amount?.currency_code;
      return { 
        success: true, 
        status: "COMPLETED",
        amount,
        currency
      };
    }
    
    return { success: false, status: order.status || "UNKNOWN" };
  } catch (error: any) {
    console.error("PayPal payment verification error:", error);
    return { success: false, status: "VERIFICATION_ERROR" };
  }
}
