import { getContent } from "@/lib/content/store";
import { DEFAULT_DESCRIPTION } from "@/lib/seo/meta";
import { SEO_ROUTES } from "@/lib/seo/routes";
import { isTestSite, site } from "@/lib/site";

/** /llms.txt: a short plain-text guide to the site for AI assistants. The summary is edited in Admin → SEO → Search tools. */
export async function GET() {
  if (isTestSite) return new Response("This is a test address. See https://homeasy.io\n", { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  const seo = await getContent("seo");
  const lines = [
    `# ${site.brand}`,
    "",
    `> ${seo.llmsSummary || DEFAULT_DESCRIPTION}`,
    "",
    `${site.legalName}, Patna, Bihar, India. Incorporated ${site.foundedYear}.`,
    "",
    "## Pages",
    ...SEO_ROUTES.filter((r) => r.kind !== "legal" && !seo.pages[r.path]?.noindex).map((r) => `- [${r.label}](${site.url}${r.path === "/" ? "" : r.path})`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
