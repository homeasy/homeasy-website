"use server";

import { headers } from "next/headers";
import { randomInt } from "node:crypto";
import { z } from "zod";
import { allow } from "@/lib/leads/rate-limit";
import { checkPincode } from "@/lib/service-area";
import { site } from "@/lib/site";
import { notifyOrder } from "@/lib/store/notify-order";
import { getOrder, insertOrder, markPaid, type Order } from "@/lib/store/orders";
import { computeTotals, MAX_QTY } from "@/lib/store/pricing";
import { getPublicProducts } from "@/lib/store/products";
import { createRazorpayOrder, razorpayConfigured, razorpayKeyId, verifyPaymentSignature } from "@/lib/store/razorpay";
import { getPublicSettings } from "@/lib/store/settings";

const REF_CHARS = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
const makeRef = () => `HO-${Array.from({ length: 6 }, () => REF_CHARS[randomInt(REF_CHARS.length)]).join("")}`;
const blank = (v: unknown) => (v === "" || v == null ? undefined : v);

const schema = z.object({
  lines: z.array(z.object({ id: z.string().min(1).max(80), qty: z.number().int().min(1).max(MAX_QTY) })).min(1).max(30),
  mode: z.enum(["full", "booking"]),
  name: z.string().trim().min(2, "Please enter your name.").max(60),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
    .pipe(z.string().regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number.")),
  email: z.preprocess(blank, z.email("Enter a valid email address.").optional()),
  address: z.string().trim().min(8, "Please enter your full delivery address.").max(300),
  locality: z.string().trim().min(2, "Please enter your area or locality.").max(80),
  pincode: z.string().trim().regex(/^[1-9]\d{5}$/, "Enter a 6-digit pincode."),
  gstin: z.preprocess(blank, z.string().trim().toUpperCase().regex(/^[0-9A-Z]{15}$/, "A GSTIN has 15 letters and numbers.").optional()),
  notes: z.preprocess(blank, z.string().trim().max(500).optional()),
  consent: z.literal(true, { error: "Please accept the terms to continue." }),
  company: z.string().max(0).optional(), // honeypot
});

export type PlaceOrderResult =
  | { ok: true; ref: string; razorpay: null | { keyId: string; orderId: string; amount: number; name: string; email: string; contact: string } }
  | { ok: false; errors?: Record<string, string>; message?: string };

/** Creates the order. Prices come from the published products on the server; the browser's numbers are ignored. */
export async function placeOrder(input: unknown): Promise<PlaceOrderResult> {
  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (!allow(`order:${ip}`)) return { ok: false, message: "Too many attempts. Please wait a few minutes, or WhatsApp us." };

  const parsed = schema.safeParse(input);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const i of parsed.error.issues) errors[String(i.path[0])] ??= i.message;
    return { ok: false, errors };
  }
  const d = parsed.data;
  if (checkPincode(d.pincode).status !== "served") {
    return { ok: false, errors: { pincode: "We deliver across Bihar. This pincode is outside our delivery area." } };
  }

  const [products, settings] = await Promise.all([getPublicProducts(), getPublicSettings()]);
  const items = d.lines.flatMap((l) => {
    const p = products.find((x) => x.id === l.id);
    return p && p.price && p.status === "available" ? [{ product_id: p.id, slug: p.slug, name: p.name, price: p.price, qty: l.qty }] : [];
  });
  if (items.length === 0 || items.length !== d.lines.length) {
    return { ok: false, message: "Some items in your cart are no longer available. Please review your cart." };
  }

  const t = computeTotals(items, settings, d.mode);
  const ref = makeRef();
  const now = new Date().toISOString();
  const online = razorpayConfigured();
  const rzpOrderId = online ? await createRazorpayOrder(t.payNow, ref) : null;
  if (online && !rzpOrderId) return { ok: false, message: "We couldn't start the payment. Please try again, or WhatsApp us." };

  const order: Order = {
    ref,
    items,
    items_total: t.items,
    gst: t.gst,
    gst_rate: settings.gst_rate,
    prices_include_gst: settings.prices_include_gst,
    delivery_fee: t.delivery,
    total: t.total,
    pay_mode: t.balance > 0 ? "booking" : "full",
    amount_due_now: t.payNow,
    amount_paid: 0,
    status: online ? "awaiting_payment" : "new",
    contact: { name: d.name, mobile: d.mobile, email: d.email ?? null, address: d.address, locality: d.locality, pincode: d.pincode, gstin: d.gstin ?? null, notes: d.notes ?? null },
    razorpay_order_id: rzpOrderId,
    razorpay_payment_id: null,
    admin_notes: null,
    created_at: now,
    updated_at: now,
  };
  if (!(await insertOrder(order))) return { ok: false, message: "We couldn't save your order. Please WhatsApp or call us." };

  if (!online) {
    await notifyOrder(order, "placed");
    return { ok: true, ref, razorpay: null };
  }
  return {
    ok: true,
    ref,
    razorpay: { keyId: razorpayKeyId(), orderId: rzpOrderId!, amount: t.payNow * 100, name: site.brand, email: d.email ?? "", contact: `+91${d.mobile}` },
  };
}

/** Called by the browser after Razorpay reports success. The signature proves the payment is real. */
export async function confirmPayment(input: { ref: string; orderId: string; paymentId: string; signature: string }): Promise<{ ok: boolean }> {
  const order = await getOrder(String(input.ref));
  if (!order || order.razorpay_order_id !== input.orderId) return { ok: false };
  if (!verifyPaymentSignature(input.orderId, input.paymentId, input.signature)) return { ok: false };
  const already = order.amount_paid > 0;
  const ok = await markPaid(order, input.paymentId);
  if (ok && !already) await notifyOrder({ ...order, amount_paid: order.amount_due_now }, "paid");
  return { ok };
}
