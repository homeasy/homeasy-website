import { getContent } from "@/lib/content/store";
import { DEFAULT_DESCRIPTION } from "@/lib/seo/meta";
import { SEO_ROUTES } from "@/lib/seo/routes";
import { getSite } from "@/lib/site-live";
import { getPublicProducts } from "@/lib/store/products";

const TEXT = { "Content-Type": "text/plain; charset=utf-8" };

/**
 * /llms.txt: a plain-text guide to Homeasy for AI assistants (ChatGPT, Claude, Gemini, Perplexity).
 * Facts only, taken from the same published data as the site. The opening summary is edited in Admin → SEO → Search tools.
 */
export async function GET() {
  const [seo, site, products] = await Promise.all([getContent("seo"), getSite(), getPublicProducts()]);
  const url = (path: string) => `${site.url}${path === "/" ? "" : path}`;
  const pages = SEO_ROUTES.filter((r) => !seo.pages[r.path]?.noindex);
  const list = (kind: string) => pages.filter((r) => r.kind === kind).map((r) => `- [${r.label}](${url(r.path)}): ${r.summary}`);
  const lines = [
    `# ${site.brand}`,
    "",
    `> ${seo.llmsSummary || DEFAULT_DESCRIPTION}`,
    "",
    "## What Homeasy does",
    `- ${site.brand} is a home automation company in Patna, Bihar, India (${site.legalName}, incorporated ${site.foundedYear}).`,
    "- It makes existing homes smart by retrofit: compact modules are installed inside the existing electrical switchbox, behind the switches already on the wall.",
    "- No rewiring and no new switchboards. The switches keep working by hand.",
    "- The service is end to end: free home survey, written quote, professional installation, the Homeasy app, and support.",
    "- Service area: home surveys across Bihar. Office in Patna.",
    "- Customers: homes, interior designers, builders, electricians and government buildings.",
    "",
    "## Products",
    ...products.map((p) => `- [${p.name}](${url(`/products/${p.slug}`)}): ${p.line || p.headline}${p.status === "available" ? "" : " (planned, not available yet)"}`),
    "",
    "## Contact",
    `- Phone and WhatsApp: ${site.contact.phoneDisplay} (${site.contact.hours})`,
    `- Email: ${site.contact.email}`,
    `- Address: ${site.fullAddress}, India`,
    `- Book a free home survey: ${url("/book-survey")}`,
    "",
    "## Pages",
    ...list("home"),
    ...list("page"),
    "",
    "## Policies",
    ...list("legal"),
    "",
  ];
  return new Response(lines.join("\n"), { headers: TEXT });
}
