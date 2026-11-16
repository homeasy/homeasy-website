import Link from "next/link";
import { Suspense } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, CheckList, ErrorBanner, Kpi, PageHeader, ScoreBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { getDraft } from "@/lib/content/store";
import { dbErrorHint, dbMode } from "@/lib/db";
import { auditSite, type PageAudit } from "@/lib/seo/audit";
import { isTestSite, site } from "@/lib/site";

async function Health() {
  await requireAdmin();
  let pages: PageAudit[] = [];
  let loadError = "";
  try {
    pages = await auditSite((await getDraft("seo")).data);
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  const sorted = [...pages].sort((a, b) => a.score - b.score);
  const avg = pages.length ? Math.round(pages.reduce((n, p) => n + p.score, 0) / pages.length) : 0;
  const critical = pages.reduce((n, p) => n + p.checks.filter((c) => c.level === "bad").length, 0);
  const titles = pages.map((p) => p.title).filter(Boolean);
  const duplicates = titles.length - new Set(titles).size;
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="SEO health" description="How every public page looks to Google, Bing and AI search (ChatGPT, Claude, Gemini, Perplexity). Checked live each time you open this page." />
      {loadError && <ErrorBanner title="Could not run the check.">{loadError}</ErrorBanner>}
      {isTestSite && (
        <p className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          This site is on a test address ({site.url}), so search engines are blocked from every page on purpose. That lifts automatically on homeasy.io.
        </p>
      )}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Kpi label="Average SEO score" value={avg} sub={`${pages.length} pages checked`} />
        <Kpi label="Pages needing work" value={pages.filter((p) => p.score < 80).length} sub="Score below 80" />
        <Kpi label="Critical issues" value={critical} sub={`${duplicates} duplicate title${duplicates === 1 ? "" : "s"}`} />
        <Kpi label="Search engines" value={isTestSite ? "Blocked" : "Allowed"} sub={isTestSite ? "Test address" : "Live address"} />
      </div>
      <Card bodyClassName="p-0">
        <ul className="divide-y divide-navy-700">
          {sorted.map((p) => {
            const issues = p.checks.filter((c) => c.level !== "good").length;
            return (
              <li key={p.path}>
                <details className="group">
                  <summary className="flex cursor-pointer list-none items-center gap-4 px-4 py-3 hover:bg-white/[0.03] sm:px-5">
                    <ScoreBadge score={p.score} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-medium text-white">{p.label}</span>
                      <span className="block truncate text-xs text-mist">
                        {p.path}
                        {p.focusKeyword && ` · keyword: ${p.focusKeyword}`}
                      </span>
                    </span>
                    <span className="hidden text-xs text-mist sm:block">{issues ? `${issues} to improve` : "All good"}</span>
                    <ChevronDown size={16} aria-hidden="true" className="shrink-0 -rotate-90 text-mist transition-transform group-open:rotate-0" />
                  </summary>
                  <div className="grid gap-5 border-t border-navy-700 bg-navy-800/40 p-4 sm:p-5 lg:grid-cols-2">
                    <div className="min-w-0">
                      <p className="text-xs uppercase tracking-wider text-ash">As shown in search</p>
                      <p className="mt-2 break-words text-sm text-blue-300">{p.title || "No title"}</p>
                      <p className="mt-1 break-words text-sm text-mist">{p.description || "No description"}</p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <Link href={`/admin/seo/pages?path=${encodeURIComponent(p.path)}`} className="adm-btn adm-btn-primary adm-btn-sm">
                          Edit SEO
                        </Link>
                        <a href={p.path} target="_blank" rel="noreferrer" className="adm-btn adm-btn-secondary adm-btn-sm">
                          View page <ExternalLink size={12} aria-hidden="true" />
                        </a>
                        <a href={`https://search.google.com/test/rich-results?url=${encodeURIComponent(site.url + p.path)}`} target="_blank" rel="noreferrer" className="adm-btn adm-btn-ghost adm-btn-sm">
                          Rich results test
                        </a>
                        <a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(site.url + p.path)}`} target="_blank" rel="noreferrer" className="adm-btn adm-btn-ghost adm-btn-sm">
                          PageSpeed
                        </a>
                      </div>
                    </div>
                    <CheckList checks={p.checks} />
                  </div>
                </details>
              </li>
            );
          })}
        </ul>
      </Card>
    </AdminShell>
  );
}

export default function SeoHealthPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Checking every page…</p>}>
      <Health />
    </Suspense>
  );
}
