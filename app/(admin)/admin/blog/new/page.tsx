import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ArticleEditor } from "@/components/admin/ArticleEditor";
import { requireAdmin } from "@/lib/admin/session";
import { DEFAULT_AUTHOR } from "@/lib/blog/shared";
import { dbMode } from "@/lib/db";
import { site } from "@/lib/site";

async function NewArticle() {
  await requireAdmin();
  return (
    <AdminShell mode={dbMode()}>
      <h1 className="sr-only">New article</h1>
      <ArticleEditor
        live={false}
        siteHost={new URL(site.url).host}
        initial={{
          id: "", slug: "", title: "", excerpt: "", body_html: "", cover_url: "", cover_alt: "", author: DEFAULT_AUTHOR, category: "",
          focus_keyword: "", seo_title: "", seo_description: "", noindex: false, active: false, published_on: "",
        }}
      />
    </AdminShell>
  );
}

export default function NewArticlePage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <NewArticle />
    </Suspense>
  );
}
