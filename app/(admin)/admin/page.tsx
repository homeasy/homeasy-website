import Link from "next/link";
import { Suspense } from "react";
import { AdminShell, formatWhen, StatusChip } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/admin/session";
import { LEAD_STATUSES, statusLabel } from "@/lib/leads/schema";
import { listLeads, storageMode, type Lead } from "@/lib/leads/store";

type Search = Promise<{ status?: string; q?: string }>;

const OPEN = ["new", "contacted", "survey_scheduled", "surveyed", "quoted"];

function matches(l: Lead, q: string) {
  const hay = [l.ref, l.full_name, l.mobile, l.whatsapp, l.locality, l.pincode, l.email].join(" ").toLowerCase();
  return hay.includes(q.toLowerCase());
}

function countSince(leads: Lead[], days: number) {
  const since = Date.now() - days * 24 * 60 * 60 * 1000;
  return leads.filter((l) => new Date(l.created_at).getTime() > since).length;
}

async function Dashboard({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const { status = "", q = "" } = await searchParams;
  let all: Lead[] = [];
  let loadError = false;
  try {
    all = await listLeads();
  } catch {
    loadError = true;
  }
  const stats = [
    { label: "New, not yet contacted", value: all.filter((l) => l.status === "new").length, href: "/admin?status=new" },
    { label: "Open (in progress)", value: all.filter((l) => OPEN.includes(l.status)).length, href: "/admin" },
    { label: "Last 7 days", value: countSince(all, 7), href: "/admin" },
    { label: "Won or installed", value: all.filter((l) => l.status === "won" || l.status === "installed").length, href: "/admin?status=won" },
  ];
  const leads = all.filter((l) => (!status || l.status === status) && (!q || matches(l, q)));

  return (
    <AdminShell mode={storageMode()}>
      <h1 className="sr-only">Leads dashboard</h1>
      <ul className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s) => (
          <li key={s.label}>
            <Link href={s.href} className="block rounded-card border border-line bg-white p-4 no-underline hover:border-blue">
              <span className="block text-[2rem] font-bold leading-none text-ink">{s.value}</span>
              <span className="mt-2 block text-[14px] text-body">{s.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      <form method="get" className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="q">
          Search leads
        </label>
        <input
          id="q"
          name="q"
          defaultValue={q}
          placeholder="Search name, mobile, area, request no."
          className="h-11 min-w-0 flex-1 rounded-input border border-line bg-white px-4"
        />
        <label className="sr-only" htmlFor="status">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className="h-11 rounded-input border border-line bg-white px-3">
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn-secondary min-h-11 px-5">
          Filter
        </button>
        {(status || q) && (
          <Link href="/admin" className="btn btn-outline min-h-11 px-5">
            Clear
          </Link>
        )}
      </form>

      {loadError && (
        <p role="alert" className="mt-6 rounded-card bg-tint p-4">
          Could not load leads from Supabase. Check the keys and that the table exists (supabase/schema.sql).
        </p>
      )}

      <p className="mt-6 text-[14px] text-body">
        {leads.length} {leads.length === 1 ? "lead" : "leads"}
        {status || q ? " match" : ""}
      </p>
      {leads.length === 0 ? (
        <p className="mt-3 rounded-card border border-line bg-white p-8 text-center text-body">
          {all.length === 0 ? "No leads yet. New survey requests will appear here." : "No leads match this filter."}
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
          {leads.map((l) => (
            <li key={l.ref}>
              <Link
                href={`/admin/leads/${l.ref}`}
                className="grid gap-x-4 gap-y-1 p-4 text-ink no-underline hover:bg-cloud sm:grid-cols-[minmax(0,1.4fr)_minmax(0,1.2fr)_auto_auto] sm:items-center"
              >
                <span className="min-w-0">
                  <span className="block truncate font-semibold">{l.full_name}</span>
                  <span className="block text-[14px] text-body">+91 {l.mobile}</span>
                </span>
                <span className="min-w-0 text-[14px] text-body">
                  <span className="block truncate">
                    {l.locality}, {l.pincode}
                  </span>
                  <span className="block truncate">
                    {l.home_type}
                    {l.appliances?.length ? ` · ${l.appliances.join(", ")}` : ""}
                  </span>
                </span>
                <StatusChip status={l.status} label={statusLabel(l.status)} />
                <span className="text-[13px] text-slate sm:text-right">
                  {formatWhen(l.created_at)}
                  <span className="block">{l.ref}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}

export default function AdminPage({ searchParams }: { searchParams: Search }) {
  return (
    <Suspense fallback={<p className="p-8 text-body">Loading leads…</p>}>
      <Dashboard searchParams={searchParams} />
    </Suspense>
  );
}
