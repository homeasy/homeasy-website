import { routeFor } from "@/lib/seo/routes";
import { site } from "@/lib/site";

/** BreadcrumbList structured data for a page (PRD §13.4): Home › (parent) › this page. Renders no visible markup. */
export function BreadcrumbJsonLd({ path, name }: { path: string; name?: string }) {
  const parts = path.split("/").filter(Boolean);
  const trail = parts.map((_, i) => `/${parts.slice(0, i + 1).join("/")}`);
  const items = [{ name: "Home", url: site.url }, ...trail.map((p) => ({ name: (p === path && name) || routeFor(p)?.label || p.split("/").pop()!, url: site.url + p }))];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: item.url })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
