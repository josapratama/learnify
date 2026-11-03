import crypto from "crypto";

const PAYGATEWAY_URL =
  process.env.PAYGATEWAY_URL || "https://pay.josapratama.com";
const PAYGATEWAY_API_KEY =
  process.env.PAYGATEWAY_API_KEY || "pay_sec_learnify_2026";
const PAYGATEWAY_WEBHOOK_SECRET =
  process.env.PAYGATEWAY_WEBHOOK_SECRET || "whsec_learnify_super_secret_2026";

export interface CreatePayTransactionParams {
  orderId: string;
  amount: number;
  paymentMethod?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface PayGatewayCreateResponse {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    orderId: string;
    amount: number;
    uniqueCode: number;
    totalAmount: number;
    paymentMethod: string;
    checkoutUrl: string;
    status: string;
  };
}

/**
 * Buat invoice / transaksi baru di self-hosted PayGateway Hub
 */
export async function createPayGatewayInvoice(
  params: CreatePayTransactionParams
): Promise<PayGatewayCreateResponse> {
  const url = `${PAYGATEWAY_URL}/api/v1/transactions/create`;
  
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": PAYGATEWAY_API_KEY,
    },
    body: JSON.stringify(params),
    cache: "no-store",
  });

  const data = await response.json();
  return data;
}

/**
 * Verifikasi signature webhook HMAC-SHA256 dari PayGateway Hub
 */
export function verifyPayGatewayWebhook(
  rawBody: string,
  signature: string | null
): boolean {
  if (!signature) return false;
  try {
    const expected = crypto
      .createHmac("sha256", PAYGATEWAY_WEBHOOK_SECRET)
      .update(rawBody)
      .digest("hex");

    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expected, "hex")
    );
  } catch (err) {
    console.error("Signature verification error:", err);
    return false;
  }
}

