import type { MetadataRoute } from "next";
import { getContent } from "@/lib/content/store";
import { isTestSite, site } from "@/lib/site";

const PRIVATE = ["/admin", "/api", "/cart", "/order-placed"];
// AI assistants that fetch pages to answer a question, and crawlers that collect text to train models.
const AI_SEARCH = ["OAI-SearchBot", "ChatGPT-User", "Claude-SearchBot", "Claude-User", "PerplexityBot", "Perplexity-User"];
const AI_TRAINING = ["GPTBot", "ClaudeBot", "CCBot", "Google-Extended", "Meta-ExternalAgent", "Bytespider", "Applebot-Extended"];

/** robots.txt. Test addresses (beta, previews) block everything; the real site blocks only private areas. */
export default async function robots(): Promise<MetadataRoute.Robots> {
  if (isTestSite) return { rules: { userAgent: "*", disallow: "/" } };
  const { aiCrawlers } = await getContent("seo"); // Admin → SEO → Search tools
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: PRIVATE },
      { userAgent: AI_SEARCH, ...(aiCrawlers.search ? { allow: "/", disallow: PRIVATE } : { disallow: "/" }) },
      { userAgent: AI_TRAINING, ...(aiCrawlers.training ? { allow: "/", disallow: PRIVATE } : { disallow: "/" }) },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
