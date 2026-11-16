import Link from "next/link";
import { Suspense } from "react";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { LeadsFilters } from "@/components/admin/LeadsFilters";
import { LeadsTable } from "@/components/admin/LeadsTable";
import { Card, EmptyState, ErrorBanner, fmtDateTime, PageHeader, timeAgo } from "@/components/admin/ui";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { dbErrorHint } from "@/lib/db";
import { filterLeads, parseLeadFilters } from "@/lib/leads/filter";
import { listLeads, storageMode, type Lead } from "@/lib/leads/store";

type Search = Promise<Record<string, string | string[] | undefined>>;
const PER_PAGE = 25;

async function Leads({ searchParams }: { searchParams: Search }) {
  await requireAdmin();
  const sp = await searchParams;
  const filters = parseLeadFilters(sp);
  const now = await requestTime();
  let all: Lead[] = [];
  let loadError = "";
  try {
    all = await listLeads();
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  const matched = filterLeads(all, filters);
  const pages = Math.max(1, Math.ceil(matched.length / PER_PAGE));
  const page = Math.min(pages, Math.max(1, Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1));
  const items = matched.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const query = new URLSearchParams();
  for (const [k, v] of Object.entries(filters)) if (v && !(k === "sort" && v === "newest")) query.set(k, v);
  const hasFilters = [...query.keys()].some((k) => k !== "sort");
  const pageHref = (n: number) => {
    const q = new URLSearchParams(query);
    if (n > 1) q.set("page", String(n));
    return `/admin/leads${q.size ? `?${q}` : ""}`;
  };
  const pagerBtn = "adm-btn adm-btn-ghost adm-btn-sm";

  return (
    <AdminShell mode={storageMode()}>
      <PageHeader
        title="Leads"
        description="Every free-survey request from the website: your sales pipeline."
        actions={
          <a href={`/admin/export${query.size ? `?${query}` : ""}`} className="adm-btn adm-btn-secondary">
            <Download size={16} aria-hidden="true" /> Export CSV
          </a>
        }
      />
      <LeadsFilters />
      {filters.district && (
        <p className="mb-4 flex flex-wrap items-center gap-3 text-sm text-mist">
          <span>
            Showing leads from <span className="font-medium text-white">{filters.district}</span> district (by pincode).
          </span>
          <Link href="/admin/leads" className="text-mist underline underline-offset-2 hover:text-white">
            Show all districts
          </Link>
        </p>
      )}
      {loadError && <ErrorBanner title="Could not load leads.">{loadError}</ErrorBanner>}
      <Card bodyClassName="p-0">
        {items.length === 0 ? (
          <EmptyState
            title={hasFilters ? "No leads match these filters" : "No leads yet"}
            text={hasFilters ? "Try clearing a filter." : "Survey requests from the website will appear here."}
          />
        ) : (
          <>
            <LeadsTable
              key={`${query}-${page}`}
              rows={items.map((l) => ({
                ref: l.ref,
                name: l.full_name,
                mobile: l.mobile,
                area: `${l.locality}, ${l.pincode}`,
                home: l.home_type || "Home details not given yet",
                partial: !!l.partial,
                wants: l.appliances?.join(", ") ?? "",
                priority: l.priority,
                status: l.status,
                ago: timeAgo(l.created_at, now),
                when: fmtDateTime(l.created_at),
              }))}
            />
            <div className="flex items-center justify-between border-t border-navy-700 px-4 py-3 text-xs text-mist">
              <span>
                {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, matched.length)} of {matched.length}
              </span>
              <div className="flex items-center gap-1">
                {page > 1 ? (
                  <Link href={pageHref(page - 1)} aria-label="Previous page" className={pagerBtn}>
                    <ChevronLeft size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <span className={`${pagerBtn} opacity-40`}>
                    <ChevronLeft size={16} aria-hidden="true" />
                  </span>
                )}
                <span className="px-2">
                  Page {page} / {pages}
                </span>
                {page < pages ? (
                  <Link href={pageHref(page + 1)} aria-label="Next page" className={pagerBtn}>
                    <ChevronRight size={16} aria-hidden="true" />
                  </Link>
                ) : (
                  <span className={`${pagerBtn} opacity-40`}>
                    <ChevronRight size={16} aria-hidden="true" />
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </Card>
    </AdminShell>
  );
}

export default function AdminLeadsPage({ searchParams }: { searchParams: Search }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading leads…</p>}>
      <Leads searchParams={searchParams} />
    </Suspense>
  );
}
