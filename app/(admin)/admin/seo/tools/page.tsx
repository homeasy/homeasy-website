import { Suspense } from "react";
import { ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SeoToolsForm } from "@/components/admin/SeoToolsForm";
import { Card, ErrorBanner, PageHeader, Pill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { getDraft } from "@/lib/content/store";
import { dbErrorHint, dbMode } from "@/lib/db";
import { crawlerFiles } from "@/lib/seo/audit";
import { isTestSite, site } from "@/lib/site";

const LINKS = [
  ["Google Search Console", "https://search.google.com/search-console"],
  ["Bing Webmaster Tools", "https://www.bing.com/webmasters"],
  ["Google Business Profile", "https://business.google.com"],
  ["Schema validator", "https://validator.schema.org"],
];

async function Tools() {
  await requireAdmin();
  let seo: Awaited<ReturnType<typeof getDraft<"seo">>>["data"] | null = null;
  let loadError = "";
  try {
    seo = (await getDraft("seo")).data;
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  const files = await crawlerFiles();
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Search tools" description="Verification, crawler access and the files search engines and AI assistants read to understand Homeasy." />
      {isTestSite && (
        <p className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          On the test address ({site.url}) robots.txt blocks every crawler, whatever is set here. These settings apply on homeasy.io.
        </p>
      )}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="min-w-0 lg:col-span-2">
          {seo ? <SeoToolsForm initial={{ verification: seo.verification, aiCrawlers: seo.aiCrawlers, llmsSummary: seo.llmsSummary }} /> : <ErrorBanner title="Could not load the settings.">{loadError}</ErrorBanner>}
        </div>
        <div className="min-w-0 space-y-6">
          <Card title="Crawler files on this site">
            <ul className="-my-2.5 divide-y divide-navy-700">
              {files.map((f) => (
                <li key={f.name} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                  <a href={f.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-mono text-xs text-white no-underline hover:text-amber">
                    {f.name} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                  <Pill tone={f.ok ? "green" : "red"}>{f.ok ? "OK" : "Missing"}</Pill>
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Submit & monitor">
            <ul className="space-y-2.5 text-sm">
              {LINKS.map(([label, href]) => (
                <li key={href}>
                  <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-mist no-underline hover:text-amber">
                    {label} <ExternalLink size={12} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-ash">After the site moves to homeasy.io, submit {site.url}/sitemap.xml in Search Console and Bing.</p>
          </Card>
        </div>
      </div>
    </AdminShell>
  );
}

export default function SeoToolsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <Tools />
    </Suspense>
  );
}
