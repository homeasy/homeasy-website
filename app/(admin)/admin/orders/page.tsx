import Link from "next/link";
import { Suspense } from "react";
import { AdminShell, formatWhen, StatusChip } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";
import { listOrders, ORDER_STATUSES, orderStatusLabel, type Order } from "@/lib/store/orders";
import { inr } from "@/lib/store/pricing";

type Search = Promise<{ status?: string; q?: string }>;
const PAID = ["booking_paid", "paid", "processing", "delivered", "installed"];

async function Orders({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const { status = "", q = "" } = await searchParams;
  let all: Order[] = [];
  let loadError = false;
  try {
    all = await listOrders();
  } catch {
    loadError = true;
  }
  const good = all.filter((o) => PAID.includes(o.status));
  const stats = [
    { label: "To process", value: all.filter((o) => ["booking_paid", "paid", "new"].includes(o.status)).length },
    { label: "Orders paid", value: good.length },
    { label: "Money received", value: inr(all.reduce((n, o) => n + (o.status === "refunded" ? 0 : o.amount_paid), 0)) },
    { label: "Balance to collect", value: inr(good.reduce((n, o) => n + Math.max(0, o.total - o.amount_paid), 0)) },
  ];
  const needle = q.toLowerCase();
  const orders = all.filter(
    (o) => (!status || o.status === status) && (!q || [o.ref, o.contact.name, o.contact.mobile, o.contact.locality, o.contact.pincode].join(" ").toLowerCase().includes(needle)),
  );
  return (
    <AdminShell mode={dbMode()} active="orders">
      <h1 className="sr-only">Orders</h1>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label} className="rounded-card border border-line bg-white p-4">
            <span className="block text-[1.75rem] font-bold leading-none text-ink">{s.value}</span>
            <span className="mt-2 block text-[14px] text-body">{s.label}</span>
          </li>
        ))}
      </ul>
      <form method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="q">
          Search orders
        </label>
        <input id="q" name="q" defaultValue={q} placeholder="Search order no., name, mobile, area" className="h-11 min-w-0 flex-1 rounded-input border border-line bg-white px-4" />
        <label className="sr-only" htmlFor="status">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className="h-11 rounded-input border border-line bg-white px-3">
          <option value="">All statuses</option>
          {ORDER_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-secondary min-h-11 px-5">
          Filter
        </button>
        {(status || q) && (
          <Link href="/admin/orders" className="btn btn-outline min-h-11 px-5">
            Clear
          </Link>
        )}
      </form>
      {loadError && (
        <p role="alert" className="mt-6 rounded-card bg-tint p-4">
          Could not load orders. Check the Supabase keys and that supabase/02-store.sql has been run.
        </p>
      )}
      <p className="mt-6 text-[14px] text-body">
        {orders.length} {orders.length === 1 ? "order" : "orders"}
      </p>
      {orders.length === 0 ? (
        <p className="mt-3 rounded-card border border-line bg-white p-8 text-center text-body">
          {all.length === 0 ? "No orders yet. Orders placed on the website will appear here." : "No orders match this filter."}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
          {orders.map((o) => (
            <li key={o.ref}>
              <Link
                href={`/admin/orders/${o.ref}`}
                className="grid gap-x-4 gap-y-1 p-4 text-ink no-underline hover:bg-cloud sm:grid-cols-[minmax(0,1.3fr)_minmax(0,1.3fr)_auto_auto] sm:items-center"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{o.contact.name}</span>
                  <span className="block text-[14px] text-body">
                    {o.contact.locality}, {o.contact.pincode}
                  </span>
                </span>
                <span className="min-w-0 text-[14px] text-body">
                  <span className="block truncate">{o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</span>
                  <span className="block">
                    {inr(o.total)} · paid {inr(o.amount_paid)}
                  </span>
                </span>
                <StatusChip status={o.status} label={orderStatusLabel(o.status)} />
                <span className="text-[13px] text-slate sm:text-right">
                  {formatWhen(o.created_at)}
                  <span className="block">{o.ref}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}

export default function AdminOrdersPage({ searchParams }: { searchParams: Search }) {
  return (
    <Suspense fallback={<p className="p-8 text-body">Loading orders…</p>}>
      <Orders searchParams={searchParams} />
    </Suspense>
  );
}
