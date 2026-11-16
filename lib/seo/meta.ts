import "server-only";
import type { Metadata } from "next";
import { getContent } from "@/lib/content/store";
import { site } from "@/lib/site";
import { routeFor } from "./routes";

export const DEFAULT_TITLE = "Home Automation in Patna Without Rewiring — Homeasy";
export const DEFAULT_DESCRIPTION =
  "Home automation in Patna without rewiring: Homeasy fits smart modules inside your existing switchbox. Free home survey anywhere in Bihar.";

/**
 * A page's search title and description: the page's own defaults, replaced by whatever was set in
 * Admin → SEO → Titles & descriptions (and published). Also sets the canonical address and share tags.
 */
export async function seoMetadata(path: string, base: Metadata = {}): Promise<Metadata> {
  const o = (await getContent("seo")).pages[path];
  const route = routeFor(path);
  const title = o?.title || (typeof base.title === "string" ? base.title : DEFAULT_TITLE);
  const description = o?.description || base.description || DEFAULT_DESCRIPTION;
  return {
    ...base,
    title,
    description,
    keywords: o?.keywords?.length ? o.keywords : route ? [route.keyword, ...route.keywords] : undefined,
    ...(o?.noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: path },
    // a page-level openGraph replaces the site-wide one, so the share image (app/opengraph-image.png) is named again here
    openGraph: { type: "website", siteName: site.brand, locale: "en_IN", url: path, title, description, images: ["/opengraph-image.png"] },
  };
}
