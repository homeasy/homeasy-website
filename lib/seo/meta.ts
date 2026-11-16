import "server-only";
import type { Metadata } from "next";
import { getContent } from "@/lib/content/store";
import { site } from "@/lib/site";

export const DEFAULT_TITLE = "Homeasy — Make Your Existing Home Smart Without Rewiring";
export const DEFAULT_DESCRIPTION =
  "Smart modules inside your existing switchbox. Control lights, fans, geyser and AC from your phone. Free home survey in Bihar.";

/**
 * A page's search title and description: the page's own defaults, replaced by whatever was set in
 * Admin → SEO → Titles & descriptions (and published). Also sets the canonical address and share tags.
 */
export async function seoMetadata(path: string, base: Metadata = {}): Promise<Metadata> {
  const o = (await getContent("seo")).pages[path];
  const title = o?.title || (typeof base.title === "string" ? base.title : DEFAULT_TITLE);
  const description = o?.description || base.description || DEFAULT_DESCRIPTION;
  return {
    ...base,
    title,
    description,
    ...(o?.keywords?.length ? { keywords: o.keywords } : {}),
    ...(o?.noindex ? { robots: { index: false, follow: true } } : {}),
    alternates: { canonical: path },
    // a page-level openGraph replaces the site-wide one, so the share image (app/opengraph-image.png) is named again here
    openGraph: { type: "website", siteName: site.brand, locale: "en_IN", url: path, title, description, images: ["/opengraph-image.png"] },
  };
}
