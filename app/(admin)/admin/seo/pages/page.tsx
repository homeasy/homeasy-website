import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SeoPanel } from "@/components/admin/SeoPanel";
import { Card, CheckList, PageHeader, ScoreBadge } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { getDraft } from "@/lib/content/store";
import { dbMode } from "@/lib/db";
import { auditSite } from "@/lib/seo/audit";
import { SEO_ROUTES } from "@/lib/seo/routes";
import { site } from "@/lib/site";

async function Pages({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  await requireAdmin();
  const asked = (await searchParams).path ?? "/";
  const route = SEO_ROUTES.find((r) => r.path === asked) ?? SEO_ROUTES[0];
  const seo = (await getDraft("seo")).data;
  const audits = await auditSite(seo);
  const audit = audits.find((a) => a.path === route.path);
  const saved = seo.pages[route.path] ?? { title: "", description: "", focusKeyword: "", keywords: [], noindex: false };
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Titles & descriptions" description="The title and description each page shows in Google, plus its focus keyword. Product pages take theirs from the product itself." />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <Card bodyClassName="p-2" className="self-start">
          <ul className="max-h-[70vh] overflow-y-auto">
            {SEO_ROUTES.map((r) => {
              const a = audits.find((x) => x.path === r.path);
              const active = r.path === route.path;
              return (
                <li key={r.path}>
                  <Link
                    href={`/admin/seo/pages?path=${encodeURIComponent(r.path)}`}
                    aria-current={active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 no-underline ${active ? "bg-amber/10" : "hover:bg-white/5"}`}
                  >
                    <ScoreBadge score={a?.score ?? null} size="sm" />
                    <span className="min-w-0">
                      <span className="block truncate text-sm text-white">{r.label}</span>
                      <span className="block truncate text-xs text-ash">
                        {r.path}
                        {seo.pages[r.path] ? " · edited" : ""}
                      </span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </Card>
        <div className="min-w-0 space-y-6">
          <Card title={`${route.label} · ${route.path}`}>
            <SeoPanel key={route.path} path={route.path} address={site.url + (route.path === "/" ? "" : route.path)} saved={saved} live={{ title: audit?.title ?? "", description: audit?.description ?? "" }} />
          </Card>
          {audit && (
            <Card title="Checks on the live page" action={<ScoreBadge score={audit.score} size="sm" />}>
              <CheckList checks={audit.checks} />
              <p className="mt-4 text-xs text-ash">Title and description checks read the published page, so they update after you publish.</p>
            </Card>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

export default function SeoPagesPage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <Pages searchParams={searchParams} />
    </Suspense>
  );
}
