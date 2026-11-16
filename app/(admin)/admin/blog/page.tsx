import Link from "next/link";
import { Suspense } from "react";
import { ExternalLink, Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, EmptyState, ErrorBanner, PageHeader, Pill, ScoreBadge, fmtDateTime } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { scoreArticle } from "@/lib/blog/score";
import { longDate, type Article } from "@/lib/blog/shared";
import { getPublicArticles, listArticles } from "@/lib/blog/store";
import { dbErrorHint, dbMode } from "@/lib/db";

async function Articles() {
  await requireAdmin();
  let articles: Article[] = [];
  let problem = "";
  try {
    articles = await listArticles();
  } catch (e) {
    console.error(e);
    problem = dbErrorHint(e);
  }
  const live = new Map((await getPublicArticles()).map((a) => [a.id, a]));
  const newButton = (
    <Link href="/admin/blog/new" className="adm-btn adm-btn-primary">
      <Plus size={16} aria-hidden="true" /> New article
    </Link>
  );
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader
        title="Blog articles"
        description="Write articles for the blog. They are saved as drafts and reach the website when you tick “Show on the website” and press “Publish changes”."
        actions={newButton}
      />
      {problem && (
        <ErrorBanner title="The articles could not be read.">
          {problem} If the blog has not been set up yet, run supabase/07-blog.sql once in the Supabase SQL editor.
        </ErrorBanner>
      )}
      <Card bodyClassName="p-0">
        {articles.length === 0 ? (
          <EmptyState title="No articles yet" text="Write the first one. The editor shows an SEO score while you write, so you can fix it before it goes live." action={newButton} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b border-navy-700 text-xs uppercase tracking-wider text-ash">
                <tr>
                  <th className="px-5 py-3 font-medium">Article</th>
                  <th className="px-3 py-3 font-medium">SEO</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Last edited</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {articles.map((a) => {
                  const { score, words } = scoreArticle(a);
                  const onSite = live.get(a.id);
                  const changed = onSite && onSite.updated_at !== a.updated_at;
                  return (
                    <tr key={a.id} className="hover:bg-white/[0.03]">
                      <td className="max-w-[420px] px-5 py-3">
                        <Link href={`/admin/blog/${a.id}`} className="block truncate font-medium text-white no-underline hover:text-amber">
                          {a.title || "Untitled"}
                        </Link>
                        <span className="block truncate text-xs text-mist">
                          /blog/{a.slug} · {words.toLocaleString("en-IN")} words{a.published_on ? ` · ${longDate(a.published_on)}` : ""}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <ScoreBadge score={score} size="sm" />
                      </td>
                      <td className="px-3 py-3">
                        {!a.active ? (
                          <Pill>{onSite ? "Hidden on next publish" : "Draft"}</Pill>
                        ) : onSite ? (
                          <Pill tone={changed ? "amber" : "green"}>{changed ? "Live · edits waiting" : "Live"}</Pill>
                        ) : (
                          <Pill tone="amber">Ready · not published</Pill>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-3 py-3 text-mist">{fmtDateTime(a.updated_at)}</td>
                      <td className="px-5 py-3 text-right">
                        {onSite && (
                          <a href={`/blog/${onSite.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-mist no-underline hover:text-amber">
                            View <ExternalLink size={12} aria-hidden="true" />
                          </a>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </AdminShell>
  );
}

export default function BlogAdminPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading articles…</p>}>
      <Articles />
    </Suspense>
  );
}
