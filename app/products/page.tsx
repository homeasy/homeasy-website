import type { Metadata } from "next";
import Link from "next/link";
import {
  AirVent,
  Cable,
  ClipboardList,
  Fan,
  Plug,
  ShieldCheck,
  ToggleRight,
  Wrench,
  Zap,
  type LucideIcon,
} from "lucide-react";
import data from "@/data/products.json";
import { Card, CtaBand, PageHero, Section, SectionHeading, StatusBadge, type Status } from "@/components/ui";
import { IconTile } from "@/components/catalog";

export const metadata: Metadata = {
  title: "Homeasy Smart Modules for Indian Switchboxes",
  description:
    "Smart relay, fan controller, power module and IR remote — installed inside your existing switchbox.",
};

const ICONS: Record<string, LucideIcon> = {
  relay: ToggleRight,
  fan: Fan,
  power: Zap,
  ir: AirVent,
  "no-neutral": Cable,
  plug: Plug,
};

const INFO: { icon: LucideIcon; text: string }[] = [
  { icon: Wrench, text: "All Homeasy modules are installed by our trained electricians after a free survey." },
  { icon: ShieldCheck, text: "3-year warranty on every Homeasy module." },
  { icon: ClipboardList, text: "Full specifications will be published once certification and testing are complete." },
];

/** PRD §8.3 / §26.2. No detail pages, specs or images until the modules are final. */
export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Products"
        title="Homeasy smart modules"
        sub="Designed to fit inside Indian switchboxes and make everyday appliances smart."
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free home survey
        </Link>
        <Link href="/how-it-works" className="btn btn-outline min-h-12 px-6">
          See how it works
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          title="The module line-up"
          sub="Every module is installed by our trained electricians after a free survey. We confirm the right ones for your home at the survey."
        />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {data.products.map((p) => (
            <li key={p.slug} id={p.slug} className="min-w-0 scroll-mt-28">
              <Card className="flex h-full flex-col">
                <div className="flex items-start justify-between gap-3">
                  <IconTile icon={ICONS[p.icon] ?? ToggleRight} large />
                  <StatusBadge status={p.status as Status} />
                </div>
                <p className="mt-5 text-[13px] font-semibold uppercase tracking-[0.08em] text-slate">{p.headline}</p>
                <h3 className="mt-1 text-h4 leading-snug">{p.name}</h3>
                <p className="mt-2 text-[15px] text-body">{p.line}</p>
                <div className="mt-auto pt-5">
                  <p className="text-[13px] font-semibold text-ink">Controls</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {p.controls.map((c) => (
                      <li key={c} className="rounded-full border border-line bg-cloud px-3 py-1 text-[13px] text-body">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="How Homeasy modules are sold" />
        <ul className="mt-10 grid gap-4 sm:gap-6 lg:grid-cols-3">
          {INFO.map((item) => (
            <li key={item.text} className="min-w-0">
              <Card className="flex h-full items-start gap-4">
                <IconTile icon={item.icon} />
                <p className="min-w-0 text-body">{item.text}</p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-8 max-w-[720px] text-body">
          Not every switchbox suits every module. We check yours at the survey and tell you plainly what is possible.{" "}
          <Link href="/pricing" className="link">
            See packages
          </Link>
        </p>
      </Section>

      <CtaBand
        title="Not sure which modules you need?"
        body="That's what the free survey is for. We check your switchboxes and suggest the right modules."
      />
    </>
  );
}
