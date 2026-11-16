import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { KeywordsBoard } from "@/components/admin/KeywordsBoard";
import { ErrorBanner, Kpi, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminDoc, getDraft } from "@/lib/content/store";
import { dbErrorHint, dbMode } from "@/lib/db";
import { auditSite, keywordMatch } from "@/lib/seo/audit";
import type { Coverage, Keyword } from "@/lib/seo/keywords";
import { SEO_ROUTES } from "@/lib/seo/routes";

async function Keywords() {
  await requireAdmin();
  let keywords: Keyword[] = [];
  const coverage: Record<string, Coverage> = {};
  let loadError = "";
  try {
    keywords = await getAdminDoc<Keyword[]>("keywords", []);
    const audits = await auditSite((await getDraft("seo")).data);
    for (const k of keywords) {
      const page = audits.find((a) => a.path === k.page);
      if (!page) coverage[k.id] = "unassigned";
      else {
        const inBody = keywordMatch(k.term, page.text) === 1;
        const inMeta = keywordMatch(k.term, `${page.title} ${page.description}`) === 1;
        const isFocus = page.focusKeyword.toLowerCase() === k.term;
        coverage[k.id] = (isFocus ? inBody && inMeta : inBody) ? "strong" : inBody || inMeta || keywordMatch(k.term, page.text) >= 0.6 ? "partial" : "missing";
      }
    }
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  // Status is worked out, not typed in: Ranking once a Google position is entered, Optimized when the page
  // fully covers the keyword, otherwise Planned.
  const status: Record<string, "planned" | "optimized" | "ranking"> = {};
  for (const k of keywords) status[k.id] = k.position ? "ranking" : coverage[k.id] === "strong" ? "optimized" : "planned";
  const tracked = new Set(keywords.map((k) => k.term));
  const recommended = new Set(SEO_ROUTES.flatMap((r) => [r.keyword, ...r.keywords]).filter((t) => !tracked.has(t))).size;
  const count = (c: Coverage) => keywords.filter((k) => coverage[k.id] === c).length;
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Keywords" description="The searches you want to appear for, the page each one should rank on, and whether that page actually covers it." />
      {loadError && <ErrorBanner title="Could not load keywords.">{loadError}</ErrorBanner>}
      <div className="mb-6 grid grid-cols-3 gap-4">
        <Kpi label="Tracked" value={keywords.length} sub={`${keywords.filter((k) => status[k.id] === "ranking").length} with a Google position`} />
        <Kpi label="Optimized" value={count("strong")} sub="Page fully covers the keyword" />
        <Kpi label="Content gaps" value={count("missing") + count("unassigned")} sub="Missing or no page" />
      </div>
      <KeywordsBoard keywords={keywords} coverage={coverage} pages={SEO_ROUTES.map((r) => ({ path: r.path, label: r.label }))} recommended={recommended} status={status} />
      <p className="mt-4 text-xs text-ash">Status is automatic: Planned = the page does not fully cover the keyword yet; Optimized = it does; Ranking = you have entered its Google position. Positions are typed in by hand from Google Search Console. This list is for your own planning and is never shown on the website.</p>
    </AdminShell>
  );
}

export default function KeywordsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading keywords…</p>}>
      <Keywords />
    </Suspense>
  );
}
