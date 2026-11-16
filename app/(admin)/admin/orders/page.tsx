import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, EmptyState, ErrorBanner, fmtDateTime, Kpi, OrderStatusBadge, PageHeader, timeAgo } from "@/components/admin/ui";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { dbErrorHint, dbMode } from "@/lib/db";
import { listOrders, ORDER_STATUSES, type Order } from "@/lib/store/orders";
import { inr } from "@/lib/store/pricing";

type Search = Promise<{ status?: string; q?: string }>;
const PAID = ["booking_paid", "paid", "processing", "delivered", "installed"];

async function Orders({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const { status = "", q = "" } = await searchParams;
  const now = await requestTime();
  let all: Order[] = [];
  let loadError = "";
  try {
    all = await listOrders();
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  const good = all.filter((o) => PAID.includes(o.status));
  const needle = q.toLowerCase();
  const orders = all.filter(
    (o) => (!status || o.status === status) && (!q || [o.ref, o.contact.name, o.contact.mobile, o.contact.locality, o.contact.pincode].join(" ").toLowerCase().includes(needle)),
  );
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Orders" description="Modules bought on the website, with what has been paid and what is still to collect." />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="To process" value={all.filter((o) => ["booking_paid", "paid", "new"].includes(o.status)).length} sub="New, booking paid or paid" />
        <Kpi label="Orders paid" value={good.length} sub={`${all.length} placed in all`} />
        <Kpi label="Money received" value={inr(all.reduce((n, o) => n + (o.status === "refunded" ? 0 : o.amount_paid), 0))} sub="Refunds excluded" />
        <Kpi label="Balance to collect" value={inr(good.reduce((n, o) => n + Math.max(0, o.total - o.amount_paid), 0))} sub="On paid and booked orders" />
      </div>

      <form method="get" className="mb-4 flex flex-wrap items-center gap-2">
        <input name="q" defaultValue={q} placeholder="Search order no., name, mobile, area" aria-label="Search orders" className="adm-control w-full sm:w-72" />
        <select name="status" defaultValue={status} aria-label="Status" className="adm-control w-auto sm:w-56">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="adm-btn adm-btn-secondary">
          Filter
        </button>
        {(status || q) && (
          <Link href="/admin/orders" className="adm-btn adm-btn-ghost">
            Clear
          </Link>
        )}
      </form>

      {loadError && <ErrorBanner title="Could not load orders.">{loadError}</ErrorBanner>}

      <Card bodyClassName="p-0">
        {orders.length === 0 ? (
          <EmptyState
            title={all.length === 0 ? "No orders yet" : "No orders match this filter"}
            text={all.length === 0 ? "Orders placed on the website will appear here." : "Try clearing the filter."}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-mist">
                <tr>
                  <th className="px-4 py-3 font-medium">Order</th>
                  <th className="px-3 py-3 font-medium">Customer</th>
                  <th className="px-3 py-3 font-medium">Items</th>
                  <th className="px-3 py-3 text-right font-medium">Total</th>
                  <th className="px-3 py-3 text-right font-medium">Paid</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">Placed</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {orders.map((o) => (
                  <tr key={o.ref} className="hover:bg-white/[0.03]">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.ref}`} className="font-mono text-xs font-medium text-white no-underline hover:text-amber">
                        {o.ref}
                      </Link>
                    </td>
                    <td className="max-w-[220px] px-3 py-3">
                      <Link href={`/admin/orders/${o.ref}`} className="block truncate font-medium text-white no-underline hover:text-amber">
                        {o.contact.name}
                      </Link>
                      <p className="truncate text-xs text-mist">
                        {o.contact.locality}, {o.contact.pincode}
                      </p>
                    </td>
                    <td className="max-w-[240px] px-3 py-3">
                      <p className="truncate text-mist">{o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</p>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-white">{inr(o.total)}</td>
                    <td className="whitespace-nowrap px-3 py-3 text-right tabular-nums text-mist">{inr(o.amount_paid)}</td>
                    <td className="px-3 py-3">
                      <OrderStatusBadge status={o.status} />
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-xs text-mist" title={fmtDateTime(o.created_at)}>
                      {timeAgo(o.created_at, now)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminShell>
  );
}

export default function AdminOrdersPage({ searchParams }: { searchParams: Search }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading orders…</p>}>
      <Orders searchParams={searchParams} />
    </Suspense>
  );
}
