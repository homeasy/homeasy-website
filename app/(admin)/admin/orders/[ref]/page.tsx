import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { OrderEditor } from "@/components/admin/OrderEditor";
import { BACK_LINK, Card, fmtDateTime, InfoRow, OrderStatusBadge } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";
import { getOrder } from "@/lib/store/orders";
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
  const strong = (k: string) => k === "Total" || k === "Balance due";
  return (
    <AdminShell mode={dbMode()}>
      <Link href="/admin/orders" className={BACK_LINK}>
        <ArrowLeft size={16} aria-hidden="true" /> All orders
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-semibold tracking-tight text-white">Order {o.ref}</h1>
            <OrderStatusBadge status={o.status} />
          </div>
          <p className="mt-1 text-sm text-mist">
            {c.name} · Placed {fmtDateTime(o.created_at)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <a href={`tel:+91${c.mobile}`} className="adm-btn adm-btn-primary">
            <Phone size={16} aria-hidden="true" /> Call
          </a>
          <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-secondary">
            <WhatsAppIcon size={16} /> WhatsApp
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 space-y-6 lg:col-span-2">
          <Card title="Items">
            <ul className="-mt-3 divide-y divide-navy-700">
              {o.items.map((i) => (
                <li key={i.product_id} className="flex justify-between gap-4 py-3 text-sm">
                  <span className="min-w-0">
                    <span className="block font-medium text-white">{i.name}</span>
                    <span className="text-mist">
                      {inr(i.price)} × {i.qty}
                    </span>
                  </span>
                  <span className="tabular-nums text-white">{inr(i.price * i.qty)}</span>
                </li>
              ))}
            </ul>
            <dl className="space-y-2 border-t border-navy-700 pt-3 text-sm">
              {money.map(([k, v]) => (
                <div key={k} className={`flex justify-between gap-4 ${strong(k) ? "font-semibold text-white" : ""}`}>
                  <dt className={strong(k) ? "" : "text-mist"}>{k}</dt>
                  <dd className="tabular-nums text-white">{v}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card title="Customer and delivery">
            <dl className="-my-2.5 divide-y divide-navy-700">
              <InfoRow label="Name">{c.name}</InfoRow>
              <InfoRow label="Mobile">+91 {c.mobile}</InfoRow>
              <InfoRow label="Email">{c.email}</InfoRow>
              <InfoRow label="Address">
                {c.address}, {c.locality} {c.pincode}
              </InfoRow>
              <InfoRow label="GSTIN">{c.gstin}</InfoRow>
              <InfoRow label="Customer note">{c.notes}</InfoRow>
              <InfoRow label="Razorpay">{o.razorpay_payment_id}</InfoRow>
            </dl>
          </Card>
        </div>
        <Card title="Manage order" className="self-start">
          <OrderEditor orderRef={o.ref} status={o.status} amountPaid={o.amount_paid} notes={o.admin_notes ?? ""} />
        </Card>
      </div>
    </AdminShell>
  );
}

export default function OrderPage({ params }: { params: Promise<{ ref: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading order…</p>}>
      <OrderDetail params={params} />
    </Suspense>
  );
}
