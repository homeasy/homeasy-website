import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { routeFor } from "@/lib/seo/routes";
import { Card, Section } from "./index";

/** "Keep exploring": three related pages at the foot of a page. Titles and one-line summaries come from lib/seo/routes.ts. */
export function Related({ paths, title = "Keep exploring" }: { paths: string[]; title?: string }) {
  const pages = paths.map(routeFor).filter((r) => r !== undefined);
  if (!pages.length) return null;
  return (
    <Section>
      <h2 className="text-h4">{title}</h2>
      <ul className="mt-6 grid gap-4 md:grid-cols-3">
        {pages.map((p) => (
          <li key={p.path} className="min-w-0">
            <Link href={p.path} className="group block h-full rounded-card no-underline focus-visible:outline-offset-4">
              <Card className="flex h-full flex-col transition-colors group-hover:border-navy">
                <span className="text-[1.0625rem] font-semibold text-ink">{p.label}</span>
                <span className="mt-2 text-[15px] text-body">{p.summary}</span>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-[15px] font-semibold text-link">
                  Open <ArrowRight aria-hidden="true" size={16} />
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}
