import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Landmark, PencilRuler, Wrench, type LucideIcon } from "lucide-react";
import { Card, CtaBand, PageHero, Section } from "@/components/ui";
import { IconTile } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Homeasy for Business — Smart Retrofit Solutions",
  description:
    "Smart retrofit for interior designers, builders, electricians and government buildings. No rewiring, no new switchboards.",
};

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
      <PageHero
        eyebrow="Solutions"
        title="Homeasy for business"
        sub="Smart retrofit for the people who build, design, wire and run India's buildings."
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

      <CtaBand
        title="Have a home, not a project?"
        body="Book a free home survey. We'll check your switchboxes and show you what's possible."
      />
    </>
  );
}
