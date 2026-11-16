import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { AdminShell, formatWhen, StatusChip } from "@/components/admin/AdminShell";
import { OrderEditor } from "@/components/admin/OrderEditor";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";
import { getOrder, orderStatusLabel } from "@/lib/store/orders";
import { inr } from "@/lib/store/pricing";

async function OrderDetail({ params }: { params: Promise<{ ref: string }> }) {
  await requireAdmin();
  const o = await getOrder(decodeURIComponent((await params).ref));
  if (!o) notFound();
  const c = o.contact;
  const money: [string, string][] = [
    ["Items", inr(o.items_total)],
    [`GST (${o.gst_rate}%)${o.prices_include_gst ? ", included" : ""}`, inr(o.gst)],
    ["Delivery", o.delivery_fee ? inr(o.delivery_fee) : "Free"],
    ["Total", inr(o.total)],
    ["Chosen at checkout", o.pay_mode === "booking" ? `Booking amount ${inr(o.amount_due_now)}` : "Pay in full"],
    ["Received", inr(o.amount_paid)],
    ["Balance due", inr(Math.max(0, o.total - o.amount_paid))],
  ];
  return (
    <AdminShell mode={dbMode()} active="orders">
      <Link href="/admin/orders" className="link inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold">
        <ArrowLeft size={16} aria-hidden="true" /> All orders
      </Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="text-h3 leading-tight">Order {o.ref}</h1>
        <StatusChip status={o.status} label={orderStatusLabel(o.status)} />
        <span className="text-[14px] text-slate">{formatWhen(o.created_at)}</span>
      </div>
      <div className="mt-4 flex flex-col gap-3 sm:flex-row">
        <a href={`tel:+91${c.mobile}`} className="btn btn-secondary min-h-12 px-5">
          <Phone size={18} aria-hidden="true" /> Call +91 {c.mobile}
        </a>
        <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer" className="btn btn-outline min-h-12 px-5">
          <WhatsAppIcon size={18} /> WhatsApp
        </a>
      </div>
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-6">
          <div className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h4">Items</h2>
            <ul className="mt-3 divide-y divide-line">
              {o.items.map((i) => (
                <li key={i.product_id} className="flex justify-between gap-4 py-3">
                  <span className="min-w-0">
                    <span className="block font-semibold">{i.name}</span>
                    <span className="text-[14px] text-body">
                      {inr(i.price)} × {i.qty}
                    </span>
                  </span>
                  <span className="font-semibold">{inr(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="mt-3 space-y-2 border-t border-line pt-3 text-[15px]">
              {money.map(([k, v]) => (
                <div key={k} className={`flex justify-between gap-4 ${k === "Total" || k === "Balance due" ? "font-bold" : ""}`}>
                  <dt className={k === "Total" || k === "Balance due" ? "" : "text-body"}>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="rounded-card border border-line bg-white p-5">
            <h2 className="text-h4">Customer and delivery</h2>
            <address className="mt-3 break-words not-italic text-body">
              <strong className="text-ink">{c.name}</strong>
              <br />
              {c.address}
              <br />
              {c.locality} {c.pincode}
              <br />
              +91 {c.mobile}
              {c.email && (
                <>
                  <br />
                  {c.email}
                </>
              )}
              {c.gstin && (
                <>
                  <br />
                  GSTIN {c.gstin}
                </>
              )}
            </address>
            {c.notes && <p className="mt-3 rounded-card bg-cloud p-3 text-[15px]">Customer note: {c.notes}</p>}
            {o.razorpay_payment_id && <p className="mt-3 break-all text-[13px] text-slate">Razorpay payment {o.razorpay_payment_id}</p>}
          </div>
        </div>
        <div className="rounded-card border border-line bg-white p-5">
          <h2 className="mb-4 text-h4">Manage order</h2>
          <OrderEditor orderRef={o.ref} status={o.status} amountPaid={o.amount_paid} notes={o.admin_notes ?? ""} />
        </div>
      </div>
    </AdminShell>
  );
}

export default function OrderPage({ params }: { params: Promise<{ ref: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-body">Loading order…</p>}>
      <OrderDetail params={params} />
    </Suspense>
  );
}
