import type { MetadataRoute } from "next";
import { isTestSite, site } from "@/lib/site";

/** robots.txt. Test addresses (beta, previews) block everything; the real site blocks only private areas. */
export default function robots(): MetadataRoute.Robots {
  if (isTestSite) return { rules: { userAgent: "*", disallow: "/" } };
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api", "/cart", "/order-placed"] },
    host: site.url,
  };
}
