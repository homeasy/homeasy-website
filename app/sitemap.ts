import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content/store";
import { SEO_ROUTES } from "@/lib/seo/routes";
import { site } from "@/lib/site";
import { getPublicProducts } from "@/lib/store/products";

/** sitemap.xml: the public pages plus every product on the website. Pages marked "hide from search" are left out. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [seo, products] = await Promise.all([getContent("seo"), getPublicProducts()]);
  const pages = SEO_ROUTES.filter((r) => !seo.pages[r.path]?.noindex).map((r) => ({
    url: `${site.url}${r.path === "/" ? "" : r.path}`,
    priority: r.kind === "home" ? 1 : r.kind === "legal" ? 0.2 : 0.7,
  }));
  return [...pages, ...products.map((p) => ({ url: `${site.url}/products/${p.slug}`, priority: 0.6 }))];
}
