import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { requireAdmin } from "@/lib/admin/session";
import { getArticle, getPublicArticles } from "@/lib/blog/store";
import { dbMode } from "@/lib/db";
import { site } from "@/lib/site";

async function EditArticle({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const a = await getArticle(id);
  if (!a) notFound();
  const live = (await getPublicArticles()).some((x) => x.id === a.id);
  const { created_at: _c, updated_at: _u, ...rest } = a;
  void _c;
  void _u;
  return (
    <AdminShell mode={dbMode()}>
      <h1 className="sr-only">Edit article: {a.title}</h1>
      {/* key: a fresh editor for each article */}
      <ArticleEditor key={a.id} live={live} siteHost={new URL(site.url).host} initial={{ ...rest, cover_url: a.cover_url ?? "", published_on: a.published_on ?? "" }} />
    </AdminShell>
  );
}

export default function EditArticlePage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading article…</p>}>
      <EditArticle params={params} />
    </Suspense>
  );
}
