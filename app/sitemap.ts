import type { MetadataRoute } from "next";
import { getPublicArticles } from "@/lib/blog/store";
import { getContent } from "@/lib/content/store";
import { flags } from "@/lib/flags";
import { SEO_ROUTES } from "@/lib/seo/routes";
import { site } from "@/lib/site";
import { getPublicProducts } from "@/lib/store/products";

/** sitemap.xml: the public pages plus every product and blog article on the website. Pages marked "hide from search" are left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seo, products, articles] = await Promise.all([getContent("seo"), getPublicProducts(), flags.SHOW_BLOG ? getPublicArticles() : []]);
  const pages = SEO_ROUTES.filter((r) => !seo.pages[r.path]?.noindex).map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    priority: r.kind === "home" ? 1 : r.kind === "legal" ? 0.2 : 0.7,
  }));
  return [
    ...pages,
    ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, priority: 0.6 })),
    ...articles.filter((a) => !a.noindex).map((a) => ({ url: `${site.url}/blog/${a.slug}`, lastModified: a.updated_at, priority: 0.6 })),
  ];
}
