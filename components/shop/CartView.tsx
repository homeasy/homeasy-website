"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useState, useTransition } from "react";
import { Lock, Trash2 } from "lucide-react";
import { confirmPayment, placeOrder } from "@/app/(site)/cart/actions";
import { ProductVisual } from "@/components/catalog/ProductCard";
import { checkPincode } from "@/lib/service-area";
import { computeTotals, inr, type StoreSettings } from "@/lib/store/pricing";
import { cart, useCart } from "./cart-store";
import { QtyStepper } from "./QtyStepper";

export type CartProduct = { id: string; slug: string; name: string; price: number; image_url: string | null; icon: string };

type RazorpayResponse = { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string };
type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  theme: { color: string };
  handler: (r: RazorpayResponse) => void;
  modal: { ondismiss: () => void };
};
declare global {
  interface Window {
    Razorpay?: new (o: RazorpayOptions) => { open: () => void };
  }
}

function loadRazorpay(): Promise<boolean> {
  if (window.Razorpay) return Promise.resolve(true);
  return new Promise((resolve) => {
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

const input = "h-12 w-full rounded-input border border-line bg-white px-4 text-ink placeholder:text-slate";
const labelCls = "mb-1.5 block text-[15px] font-semibold text-ink";

export function CartView({
  products,
  settings,
  whatsappHref,
  online,
}: {
  products: CartProduct[];
  settings: StoreSettings;
  whatsappHref: string;
  /** true when Razorpay is connected; otherwise the order is saved and payment is arranged by phone */
  online: boolean;
}) {
  const lines = useCart();
  const router = useRouter();
  const uid = useId();
  const [ready, setReady] = useState(false);
  const [mode, setMode] = useState<"full" | "booking">("full");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  useEffect(() => {
    queueMicrotask(() => setReady(true)); // the cart lives in the browser, so wait for it before deciding it is empty
  }, []);

  const rows = lines.flatMap((l) => {
    const p = products.find((x) => x.id === l.id);
    return p ? [{ ...p, qty: l.qty }] : [];
  });
  const missing = lines.length - rows.length;
  const bookingOn = settings.booking_enabled && settings.booking_amount > 0;
  const t = computeTotals(rows, settings, bookingOn ? mode : "full");
  const fid = (n: string) => `${uid}-${n}`;
  const err = (n: string) => (errors[n] ? <p className="mt-1.5 text-sm text-error">{errors[n]}</p> : null);

  if (!ready) return <p className="text-body">Loading your cart…</p>;
  if (rows.length === 0) {
    return (
      <div className="rounded-card border border-line bg-white p-8 text-center">
        <h2 className="text-h4">Your cart is empty</h2>
        <p className="mt-2 text-body">Add a module from the products page, or book a free survey and we will suggest what your home needs.</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/products" className="btn btn-primary min-h-12 px-6">
            See products
          </Link>
          <Link href="/book-survey" className="btn btn-outline min-h-12 px-6">
            Book a free survey
          </Link>
        </div>
      </div>
    );
  }

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const payload = {
      lines: rows.map((r) => ({ id: r.id, qty: r.qty })),
      mode: bookingOn ? mode : "full",
      name: fd.get("name"),
      mobile: fd.get("mobile"),
      email: fd.get("email"),
      address: fd.get("address"),
      locality: fd.get("locality"),
      pincode: fd.get("pincode"),
      gstin: fd.get("gstin"),
      notes: fd.get("notes"),
      consent: fd.get("consent") === "on",
      company: fd.get("company") ?? "",
    };
    setMessage(null);
    startTransition(async () => {
      let res: Awaited<ReturnType<typeof placeOrder>>;
      try {
        res = await placeOrder(payload);
      } catch {
        res = { ok: false, message: "We couldn't reach the server. Please check your connection and try again." };
      }
      if (!res.ok) {
        setErrors(res.errors ?? {});
        setMessage(res.message ?? "Please check the highlighted fields.");
        const first = res.errors && Object.keys(res.errors)[0];
        if (first) document.getElementById(fid(first))?.focus();
        return;
      }
      setErrors({});
      const { ref, razorpay } = res;
      if (!razorpay) {
        cart.clear();
        router.push(`/order-placed?ref=${ref}&pay=later`);
        return;
      }
      if (!(await loadRazorpay()) || !window.Razorpay) {
        setMessage("The payment window could not load. Please check your connection and try again.");
        return;
      }
      new window.Razorpay({
        key: razorpay.keyId,
        amount: razorpay.amount,
        currency: "INR",
        name: razorpay.name,
        description: `Order ${ref}`,
        order_id: razorpay.orderId,
        prefill: { name: String(payload.name ?? ""), email: razorpay.email, contact: razorpay.contact },
        theme: { color: "#3A9ADB" },
        handler: (r) => {
          startTransition(async () => {
            const ok = (await confirmPayment({ ref, orderId: r.razorpay_order_id, paymentId: r.razorpay_payment_id, signature: r.razorpay_signature })).ok;
            if (ok) cart.clear();
            router.push(`/order-placed?ref=${ref}&pay=${ok ? "done" : "check"}`);
          });
        },
        modal: { ondismiss: () => setMessage(`Payment was not completed. Your order ${ref} is saved: you can try again, or WhatsApp us.`) },
      }).open();
    });
  }

  return (
    <form
      onSubmit={submit}
      // clear a field's error as soon as the person edits it (the pincode field manages its own message)
      onChange={(e) => {
        const name = (e.target as unknown as { name?: string }).name;
        if (name && name !== "pincode" && errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
      }}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]"
    >
      <div className="min-w-0 space-y-6">
        <ul className="divide-y divide-line rounded-card border border-line bg-white">
          {rows.map((r) => (
            <li key={r.id} className="flex gap-4 p-4">
              <ProductVisual product={r} className="size-20 shrink-0 rounded-lg border border-line" sizes="80px" />
              <div className="min-w-0 flex-1">
                <Link href={`/products/${r.slug}`} className="font-semibold text-ink no-underline hover:underline">
                  {r.name}
                </Link>
                <p className="text-[14px] text-body">{inr(r.price)} each</p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <QtyStepper value={r.qty} onChange={(n) => cart.setQty(r.id, n)} label={`Quantity of ${r.name}`} />
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">{inr(r.price * r.qty)}</span>
                    <button type="button" onClick={() => cart.remove(r.id)} aria-label={`Remove ${r.name}`} className="inline-flex size-11 items-center justify-center rounded-button text-slate hover:bg-cloud hover:text-error">
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {missing > 0 && <p className="text-[14px] text-body">Some items in your cart are no longer available and were left out.</p>}

        <div className="space-y-5 rounded-card border border-line bg-white p-5 sm:p-6">
          <h2 className="text-h4">Delivery details</h2>
          <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
            <label>
              Company
              <input name="company" tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={fid("name")} className={labelCls}>
                Full name
              </label>
              <input id={fid("name")} name="name" autoComplete="name" className={input} />
              {err("name")}
            </div>
            <div className="min-w-0">
              <label htmlFor={fid("mobile")} className={labelCls}>
                Mobile number
              </label>
              <input id={fid("mobile")} name="mobile" type="tel" inputMode="numeric" autoComplete="tel-national" className={input} />
              {err("mobile")}
            </div>
          </div>
          <div>
            <label htmlFor={fid("email")} className={labelCls}>
              Email <span className="font-normal text-slate">(optional, for your receipt)</span>
            </label>
            <input id={fid("email")} name="email" type="email" autoComplete="email" className={input} />
            {err("email")}
          </div>
          <div>
            <label htmlFor={fid("address")} className={labelCls}>
              Delivery address
            </label>
            <textarea id={fid("address")} name="address" rows={3} autoComplete="street-address" className={`${input} h-auto py-3`} />
            {err("address")}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={fid("locality")} className={labelCls}>
                Area or city
              </label>
              <input id={fid("locality")} name="locality" autoComplete="address-level2" className={input} />
              {err("locality")}
            </div>
            <div className="min-w-0">
              <label htmlFor={fid("pincode")} className={labelCls}>
                Pincode
              </label>
              <input
                id={fid("pincode")}
                name="pincode"
                inputMode="numeric"
                maxLength={6}
                autoComplete="postal-code"
                className={input}
                onChange={(e) => {
                  const v = e.target.value;
                  const out = v.length === 6 && checkPincode(v).status === "out_of_area";
                  setErrors((p) => ({ ...p, pincode: out ? "We deliver across Bihar. This pincode is outside our delivery area." : "" }));
                }}
              />
              {err("pincode")}
            </div>
          </div>
          <div>
            <label htmlFor={fid("gstin")} className={labelCls}>
              GSTIN <span className="font-normal text-slate">(optional, for a business invoice)</span>
            </label>
            <input id={fid("gstin")} name="gstin" maxLength={15} className={input} />
            {err("gstin")}
          </div>
          <div>
            <label htmlFor={fid("notes")} className={labelCls}>
              Note for us <span className="font-normal text-slate">(optional)</span>
            </label>
            <textarea id={fid("notes")} name="notes" rows={2} maxLength={500} className={`${input} h-auto py-3`} />
          </div>
        </div>
      </div>

      <div className="min-w-0 space-y-4 lg:sticky lg:top-24">
        <div className="rounded-card border border-line bg-white p-5 sm:p-6">
          <h2 className="text-h4">Order summary</h2>
          <dl className="mt-4 space-y-2 text-[15px]">
            <div className="flex justify-between gap-4">
              <dt className="text-body">Items</dt>
              <dd>{inr(t.items)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-body">
                GST ({settings.gst_rate}%){settings.prices_include_gst ? ", included" : ""}
              </dt>
              <dd className={settings.prices_include_gst ? "text-slate" : ""}>{inr(t.gst)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-body">Delivery</dt>
              <dd>{t.delivery ? inr(t.delivery) : "Free"}</dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-3 text-[17px] font-bold">
              <dt>Total</dt>
              <dd>{inr(t.total)}</dd>
            </div>
          </dl>

          {bookingOn && (
            <fieldset className="mt-5">
              <legend className={labelCls}>How would you like to pay?</legend>
              {(
                [
                  ["full", "Pay in full now", inr(t.total)],
                  ["booking", "Pay a booking amount now", `${inr(Math.min(settings.booking_amount, t.total))} now, balance later`],
                ] as const
              ).map(([id, title, sub]) => (
                <label key={id} className="mt-2 flex cursor-pointer items-start gap-3 rounded-card border border-line p-3 has-[:checked]:border-blue has-[:checked]:bg-tint">
                  <input type="radio" name="mode" checked={mode === id} onChange={() => setMode(id)} className="mt-1 size-5 accent-[var(--brand-navy)]" />
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="block text-[14px] text-body">{sub}</span>
                  </span>
                </label>
              ))}
            </fieldset>
          )}

          <label className="mt-5 flex cursor-pointer items-start gap-3 text-[14px] text-body">
            <input name="consent" type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[var(--brand-navy)]" />
            <span>
              I agree to the{" "}
              <Link href="/terms-of-service" target="_blank" className="link">
                Terms
              </Link>
              ,{" "}
              <Link href="/refund-policy" target="_blank" className="link">
                Refund policy
              </Link>{" "}
              and{" "}
              <Link href="/delivery-policy" target="_blank" className="link">
                Delivery policy
              </Link>
              , and to be contacted about my order.
            </span>
          </label>
          {err("consent")}

          {message && (
            <p role="alert" className="mt-4 rounded-card bg-tint p-3 text-[14px] text-ink">
              {message}{" "}
              <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                WhatsApp us
              </a>
            </p>
          )}

          <button type="submit" disabled={pending} className="btn btn-primary mt-5 min-h-12 w-full px-6 disabled:opacity-60">
            {online && <Lock size={16} aria-hidden="true" />}
            {pending ? "Please wait…" : online ? `Pay ${inr(t.payNow)}` : "Place order"}
          </button>
          {online ? (
            <>
              {t.balance > 0 && <p className="mt-2 text-center text-[13px] text-body">Balance of {inr(t.balance)} is due before delivery.</p>}
              <p className="mt-3 text-center text-[13px] text-slate">Payments are processed securely by Razorpay.</p>
            </>
          ) : (
            <p className="mt-3 text-center text-[13px] text-body">No payment is taken now. We will call you to confirm the order and arrange payment.</p>
          )}
        </div>
      </div>
    </form>
  );
}
