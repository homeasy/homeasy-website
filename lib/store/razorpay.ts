/** Razorpay (server only). Keys: RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET, optional RAZORPAY_WEBHOOK_SECRET. */
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const razorpayConfigured = () => !!(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
export const razorpayKeyId = () => process.env.RAZORPAY_KEY_ID ?? "";

/** Creates a Razorpay order for `rupees`. Returns its id, or null on failure. */
export async function createRazorpayOrder(rupees: number, receipt: string): Promise<string | null> {
  const auth = Buffer.from(`${process.env.RAZORPAY_KEY_ID}:${process.env.RAZORPAY_KEY_SECRET}`).toString("base64");
  try {
    const res = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round(rupees * 100), currency: "INR", receipt, notes: { ref: receipt } }),
      cache: "no-store",
    });
    if (!res.ok) {
      console.error(`[razorpay] order failed: ${res.status} ${await res.text()}`);
      return null;
    }
    return ((await res.json()) as { id: string }).id;
  } catch (e) {
    console.error("[razorpay] request failed", e);
    return null;
  }
}

function equal(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/** Checks the signature Razorpay Checkout returns to the browser after a payment. */
export function verifyPaymentSignature(orderId: string, paymentId: string, signature: string): boolean {
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET ?? "").update(`${orderId}|${paymentId}`).digest("hex");
  return equal(expected, signature);
}

/** Checks a webhook call: HMAC of the raw body with the webhook secret. */
export function verifyWebhookSignature(rawBody: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) return false;
  return equal(createHmac("sha256", secret).update(rawBody).digest("hex"), signature);
}
