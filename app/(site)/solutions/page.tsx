import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { ArrowRight, Building2, Landmark, PencilRuler, Wrench, type LucideIcon } from "lucide-react";
import { Card, PageHero, Section } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { IconTile } from "@/components/catalog";

const pageMeta: Metadata = {
  title: "Smart Home Solutions for Business — Homeasy",
  description:
    "Smart home solutions for interior designers, builders, electricians and government buildings: retrofit with no rewiring and no new switchboards.",
};

export function generateMetadata() {
  return seoMetadata("/solutions", pageMeta);
}

const SOLUTIONS: { href: string; icon: LucideIcon; title: string; body: string }[] = [
  {
    href: "/solutions/designers",
    icon: PencilRuler,
    title: "Interior designers and architects",
    body: "Smart features without changing your design.",
  },
  {
    href: "/solutions/builders",
    icon: Building2,
    title: "Builders and commercial",
    body: "Smart-ready flats, offices and shops.",
  },
  {
    href: "/solutions/electricians",
    icon: Wrench,
    title: "Electricians",
    body: "Grow your work with Homeasy.",
  },
  {
    href: "/solutions/government",
    icon: Landmark,
    title: "Government and institutions",
    body: "Central control and schedules for public buildings.",
  },
];

/** PRD §8.7 / §26.6 */
export default function SolutionsPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/solutions" />
      <PageHero
        eyebrow="Solutions"
        title="Homeasy for business"
        sub="Smart home solutions, by retrofit, for the people who build, design, wire and run India's buildings."
      />

      <Section>
        <h2 className="sr-only">Choose your solution</h2>
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6">
          {SOLUTIONS.map((s) => (
            <li key={s.href} className="min-w-0">
              <Link href={s.href} className="group block h-full rounded-card focus-visible:outline-offset-4">
                <Card className="flex h-full flex-col transition-colors group-hover:border-navy">
                  <IconTile icon={s.icon} large />
                  <h3 className="mt-5 text-h4 leading-snug">{s.title}</h3>
                  <p className="mt-2 text-body">{s.body}</p>
                  <span className="mt-auto inline-flex min-h-11 items-center gap-1.5 pt-4 font-semibold text-link">
                    Learn more <ArrowRight aria-hidden="true" size={18} />
                  </span>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-body">
          Not sure where you fit?{" "}
          <Link href="/contact" className="link">
            Contact us
          </Link>
        </p>
      </Section>

      <Section tone="cloud">
        <h2 className="text-h3 leading-[1.15]">Why retrofit works for projects</h2>
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            ["No rewiring", "Homeasy modules fit inside the existing switchbox, behind the switches already installed. Walls and finishes stay untouched."],
            ["The design stays the same", "From the outside, the switchboard looks the same. If a switchbox needs a visible change, we agree it with you in the quote first."],
            ["One team, survey to support", "We survey, quote, install, set up the app and support it, so you deal with one company from start to finish."],
          ].map(([title, body]) => (
            <li key={title} className="min-w-0">
              <Card className="h-full">
                <h3 className="text-h4">{title}</h3>
                <p className="mt-2 text-body">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
        <h2 className="mt-12 text-h4">How a project starts</h2>
        <p className="mt-3 max-w-[720px] text-body">
          Tell us about the building and what needs control. We survey the site, share a written quote and agree an installation plan with you. Homes, flats,
          offices, shops and public buildings in Bihar are all in scope; our base is Patna.
        </p>
      </Section>

      <Related paths={["/how-it-works", "/products", "/contact"]} />

      <CtaBand
        title="Have a home, not a project?"
        body="Book a free home survey. We'll check your switchboxes and show you what's possible."
      />
    </>
  );
}
