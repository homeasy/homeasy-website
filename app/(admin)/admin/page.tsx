import Link from "next/link";
import { Suspense } from "react";
import { ArrowDownRight, ArrowRight, ArrowUpRight, CreditCard, Database, Mail } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BiharMap } from "@/components/admin/BiharMap";
import { CountUp } from "@/components/admin/CountUp";
import { DailyBars, HBarList } from "@/components/admin/charts";
import { RangeSelect } from "@/components/admin/RangeSelect";
import { Card, ErrorBanner, Kpi, LeadStatusBadge, OrderStatusBadge, PageHeader, PriorityBadge, timeAgo } from "@/components/admin/ui";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { dbErrorHint, dbMode } from "@/lib/db";
import { districtId } from "@/lib/leads/districts";
import { istDay } from "@/lib/leads/filter";
import { LEAD_STATUSES, OPEN_LEAD_STATUSES } from "@/lib/leads/schema";
import { listLeads, type Lead } from "@/lib/leads/store";
import { listOrders, type Order } from "@/lib/store/orders";
import { inr } from "@/lib/store/pricing";
import { listAllProducts } from "@/lib/store/products";
import { razorpayConfigured } from "@/lib/store/razorpay";

const RANGES = [7, 30, 90, 180];
const DAY = 24 * 60 * 60 * 1000;
const PAID = ["booking_paid", "paid", "processing", "delivered", "installed"];

function Delta({ now, prev }: { now: number; prev: number }) {
  if (prev === 0) return <span>{now > 0 ? "No data for the previous period" : "No leads yet"}</span>;
  const pct = Math.round(((now - prev) / prev) * 100);
  const up = pct >= 0;
  return (
    <span className="inline-flex items-center gap-1">
      {up ? <ArrowUpRight size={14} aria-hidden="true" className="text-emerald-300" /> : <ArrowDownRight size={14} aria-hidden="true" className="text-red-300" />}
      <span className="text-white">
        {up ? "+" : ""}
        {pct}%
      </span>{" "}
      vs previous period
    </span>
  );
}

/** Counts by label, biggest first. */
function tally(values: string[], limit = 6) {
  const m = new Map<string, number>();
  for (const v of values) m.set(v, (m.get(v) ?? 0) + 1);
  return [...m].map(([label, count]) => ({ label, count })).sort((a, b) => b.count - a.count).slice(0, limit);
}

function SystemRow({ icon, label, ok, okText, badText }: { icon: React.ReactNode; label: string; ok: boolean; okText: string; badText: string }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="flex items-center gap-2 text-mist">
        {icon} {label}
      </span>
      <span className={`inline-flex items-center gap-1.5 text-xs ${ok ? "text-emerald-300" : "text-amber"}`}>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" /> {ok ? okText : badText}
      </span>
    </li>
  );
}

async function Dashboard({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  await requireAdmin();
  const asked = Number((await searchParams).days);
  const days = RANGES.includes(asked) ? asked : 30;
  const now = await requestTime();

  let leads: Lead[] = [];
  let orders: Order[] = [];
  let loadError = "";
  try {
    [leads, orders] = await Promise.all([listLeads(), listOrders()]);
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  let products: Awaited<ReturnType<typeof listAllProducts>>["products"] = [];
  try {
    products = (await listAllProducts()).products;
  } catch (e) {
    console.error(e);
  }

  const at = (l: { created_at: string }) => new Date(l.created_at).getTime();
  const inPeriod = leads.filter((l) => at(l) > now - days * DAY);
  const prevPeriod = leads.filter((l) => at(l) <= now - days * DAY && at(l) > now - 2 * days * DAY).length;
  const converted = leads.filter((l) => l.status === "won" || l.status === "installed").length;
  const open = leads.filter((l) => OPEN_LEAD_STATUSES.includes(l.status)).length;

  const perDay = new Map<string, number>();
  for (const l of inPeriod) perDay.set(istDay(l.created_at), (perDay.get(istDay(l.created_at)) ?? 0) + 1);
  const daily = Array.from({ length: days }, (_, i) => {
    const date = istDay(now - (days - 1 - i) * DAY);
    return { date, count: perDay.get(date) ?? 0 };
  });

  // for the map: where each lead of the period came from, and on which day
  const dayIndex = new Map(daily.map((d, i) => [d.date, i]));
  const mapPoints: { d: number; t: number }[] = [];
  let offMap = 0;
  for (const l of inPeriod) {
    const d = districtId(l.pincode);
    const t = dayIndex.get(istDay(l.created_at));
    if (d === null || t === undefined) offMap++;
    else mapPoints.push({ d, t });
  }

  const byStatus = LEAD_STATUSES.map((s) => ({ id: s.id, count: leads.filter((l) => l.status === s.id).length }));
  const funnelMax = Math.max(1, ...byStatus.map((s) => s.count));

  const paidOrders = orders.filter((o) => PAID.includes(o.status));
  const ordersInPeriod = orders.filter((o) => at(o) > now - days * DAY && o.status !== "awaiting_payment").length;
  const received = orders.reduce((n, o) => n + (o.status === "refunded" ? 0 : o.amount_paid), 0);
  const balance = paidOrders.reduce((n, o) => n + Math.max(0, o.total - o.amount_paid), 0);
  const toProcess = orders.filter((o) => ["new", "booking_paid", "paid"].includes(o.status)).length;

  const live = products.filter((p) => p.active).length;
  const content = [
    { label: "Products on the website", value: live, extra: products.length - live ? `+${products.length - live} hidden` : "", href: "/admin/products" },
    { label: "Products with a price", value: products.filter((p) => p.price).length, extra: "", href: "/admin/products" },
  ];

  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Dashboard" description="Leads, orders and the website at a glance." actions={<RangeSelect days={days} options={RANGES} />} />
      {loadError && <ErrorBanner title="Could not load the data.">{loadError}</ErrorBanner>}

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Kpi label={`Leads · ${days}d`} value={inPeriod.length} sub={<Delta now={inPeriod.length} prev={prevPeriod} />} href="/admin/leads" />
          <Kpi label="Awaiting reply" value={leads.filter((l) => l.status === "new").length} sub="Status: new" href="/admin/leads?status=new" />
          <Kpi label="Open pipeline" value={open} sub="New to quoted" href="/admin/leads" />
          <Kpi
            label="Conversion rate"
            value={<CountUp value={leads.length ? (converted / leads.length) * 100 : 0} decimals={1} suffix="%" />}
            sub={`${converted} of ${leads.length} all-time`}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <Kpi label={`Orders · ${days}d`} value={ordersInPeriod} sub={`${orders.length} all-time`} href="/admin/orders" />
          <Kpi label="Orders to process" value={toProcess} sub="New, booking paid or paid" href="/admin/orders" />
          <Kpi label="Money received" value={<CountUp value={received} prefix="₹" />} sub="All orders, refunds excluded" />
          <Kpi label="Balance to collect" value={<CountUp value={balance} prefix="₹" />} sub="On paid and booked orders" />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card title="Leads per day" className="lg:col-span-2">
            <DailyBars data={daily} label="Leads" />
          </Card>
          <Card title="Pipeline">
            <ul className="space-y-2.5">
              {byStatus.map((s) => (
                <li key={s.id}>
                  <Link href={`/admin/leads?status=${s.id}`} className="group block no-underline">
                    <div className="mb-1 flex items-center justify-between">
                      <LeadStatusBadge status={s.id} />
                      <span className="text-sm tabular-nums text-white group-hover:text-amber">{s.count}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-white/5">
                      <div className="adm-grow h-1.5 rounded-full bg-amber/70" style={{ width: `${Math.max(s.count ? 2 : 0, (s.count / funnelMax) * 100)}%` }} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <Card title={`Leads across Bihar · last ${days} days`}>
          <BiharMap points={mapPoints} dates={daily.map((d) => d.date)} offMap={offMap} />
        </Card>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card title="Most wanted controls">
            <HBarList data={tally(leads.flatMap((l) => l.appliances ?? []))} />
          </Card>
          <Card title="Lead sources">
            <HBarList data={tally(leads.map((l) => l.heard_from || (l.utm_source ? `Campaign: ${l.utm_source}` : "Not said")))} />
          </Card>
          <Card title="Home types">
            <HBarList data={tally(leads.map((l) => l.home_type).filter(Boolean))} />
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="min-w-0 space-y-6 lg:col-span-2">
            <Card
              title="New leads"
              bodyClassName="p-0"
              action={
                <Link href="/admin/leads" className="inline-flex items-center gap-1 text-xs text-mist no-underline hover:text-amber">
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              }
            >
              {leads.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-mist">No leads yet. They appear here as soon as someone books a free survey.</p>
              ) : (
                <ul className="divide-y divide-navy-700">
                  {leads.slice(0, 8).map((l) => (
                    <li key={l.ref}>
                      <Link href={`/admin/leads/${l.ref}`} className="flex items-center gap-4 px-5 py-3 no-underline hover:bg-white/[0.03]">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-white">
                            {l.full_name} <span className="font-normal text-mist">· {l.locality}</span>
                          </span>
                          <span className="block truncate text-xs text-mist">{l.appliances?.join(", ") || l.home_type}</span>
                        </span>
                        <span className="hidden sm:block">
                          <PriorityBadge priority={l.priority} />
                        </span>
                        <LeadStatusBadge status={l.status} />
                        <span className="w-16 shrink-0 text-right text-xs text-ash">{timeAgo(l.created_at, now)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>

            <Card
              title="Latest orders"
              bodyClassName="p-0"
              action={
                <Link href="/admin/orders" className="inline-flex items-center gap-1 text-xs text-mist no-underline hover:text-amber">
                  View all <ArrowRight size={14} aria-hidden="true" />
                </Link>
              }
            >
              {orders.length === 0 ? (
                <p className="px-5 py-10 text-center text-sm text-mist">No orders yet. Orders placed on the website appear here.</p>
              ) : (
                <ul className="divide-y divide-navy-700">
                  {orders.slice(0, 5).map((o) => (
                    <li key={o.ref}>
                      <Link href={`/admin/orders/${o.ref}`} className="flex items-center gap-4 px-5 py-3 no-underline hover:bg-white/[0.03]">
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-medium text-white">
                            {o.contact.name} <span className="font-normal text-mist">· {o.ref}</span>
                          </span>
                          <span className="block truncate text-xs text-mist">{o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</span>
                        </span>
                        <span className="hidden text-sm tabular-nums text-white sm:block">{inr(o.total)}</span>
                        <OrderStatusBadge status={o.status} />
                        <span className="w-16 shrink-0 text-right text-xs text-ash">{timeAgo(o.created_at, now)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </div>

          <div className="min-w-0 space-y-6">
            <Card title="Website content">
              <ul className="space-y-2.5 text-sm">
                {content.map((c) => (
                  <li key={c.label}>
                    <Link href={c.href} className="flex items-center justify-between gap-3 no-underline hover:text-amber">
                      <span className="text-mist">{c.label}</span>
                      <span className="tabular-nums text-white">
                        {c.value}
                        {c.extra && <span className="ml-1.5 text-xs text-mist">{c.extra}</span>}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            <Card title="System">
              <ul className="space-y-2.5 text-sm">
                <SystemRow icon={<Database size={16} aria-hidden="true" />} label="Database" ok={dbMode() === "supabase"} okText="Connected" badText={dbMode() === "local" ? "Test mode" : "Not connected"} />
                <SystemRow icon={<Mail size={16} aria-hidden="true" />} label="Email (Resend)" ok={!!process.env.RESEND_API_KEY} okText="Configured" badText="Not configured" />
                <SystemRow icon={<CreditCard size={16} aria-hidden="true" />} label="Payments (Razorpay)" ok={razorpayConfigured()} okText="Configured" badText="Not configured" />
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}

export default function AdminPage({ searchParams }: { searchParams: Promise<{ days?: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading dashboard…</p>}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}
