import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SpeedBoard } from "@/components/admin/SpeedBoard";
import { fmtDateTime, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { getAdminDoc } from "@/lib/content/store";
import { dbMode } from "@/lib/db";
import type { SpeedRun } from "@/lib/seo/keywords";
import { SEO_ROUTES } from "@/lib/seo/routes";
import { site } from "@/lib/site";

// a PageSpeed test can take up to a minute
export const maxDuration = 120;

async function Speed() {
  await requireAdmin();
  let runs: SpeedRun[] = [];
  try {
    runs = await getAdminDoc<SpeedRun[]>("pagespeed", []);
  } catch (e) {
    console.error(e);
  }
  const local = /localhost|127\.0\.0\.1/.test(site.url);
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Page speed" description={`Google PageSpeed Insights for ${site.url}: the same scores Google uses for Core Web Vitals.`} />
      {!process.env.PAGESPEED_API_KEY && (
        <p className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          No PAGESPEED_API_KEY is set, so tests use Google&rsquo;s shared free quota, which is often used up. A key is free from Google Cloud; add it in the hosting settings.
        </p>
      )}
      {local && <p className="mb-6 rounded-lg border border-navy-700 bg-navy px-4 py-3 text-sm text-mist">Google cannot reach a site running on this computer. Tests work once the site is on a public address.</p>}
      <SpeedBoard
        siteUrl={site.url}
        pages={SEO_ROUTES.map((r) => ({ path: r.path, label: r.label }))}
        runs={runs}
        when={Object.fromEntries(runs.map((r) => [`${r.path}|${r.strategy}|${r.at}`, fmtDateTime(r.at)]))}
      />
    </AdminShell>
  );
}

export default function SpeedPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <Speed />
    </Suspense>
  );
}
