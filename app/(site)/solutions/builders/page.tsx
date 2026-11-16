import type { Metadata } from "next";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import {
  Armchair,
  Hotel,
  BedDouble,
  Briefcase,
  Building2,
  Hammer,
  House,
  LifeBuoy,
  MonitorPlay,
  Smartphone,
  Sparkles,
  Stethoscope,
  Store,
} from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { ChipList, EnquiryCard, FeatureGrid, StepList, type Feature } from "@/components/catalog";

const pageMeta: Metadata = {
  title: "Home Automation for Builders & Commercial — Homeasy",
  description:
    "Home automation for builders, offices and shops: Homeasy retrofits smart control into ready flats and commercial spaces without rewiring.",
};

export function generateMetadata() {
  return seoMetadata("/solutions/builders", pageMeta);
}

const USE_CASES = [
  { icon: House, label: "Ready-to-move flats" },
  { icon: MonitorPlay, label: "Show flats" },
  { icon: Hammer, label: "Under-construction projects" },
  { icon: Briefcase, label: "Offices" },
  { icon: Store, label: "Shops" },
  { icon: Armchair, label: "Showrooms" },
  { icon: Stethoscope, label: "Clinics" },
  { icon: BedDouble, label: "PGs and hostels" },
  { icon: Hotel, label: "Guest houses" },
];

const BENEFITS: Feature[] = [
  { icon: Sparkles, title: "Sell the smart-home story", body: "Offer smart control without changing your electrical design." },
  { icon: MonitorPlay, title: "Show-flat demo", body: "Let buyers try it themselves." },
  { icon: Smartphone, title: "Resident onboarding", body: "Homeasy sets up the app for every buyer." },
  { icon: LifeBuoy, title: "After-sales handled", body: "Warranty and service come from Homeasy." },
];

const STEPS = [
  { title: "Project survey", body: "We visit the site and check the switchboxes and wiring." },
  { title: "BOQ and proposal", body: "You get a bill of quantities and a written proposal." },
  { title: "Pilot or show flat", body: "We fit one unit first, so you can see it working." },
  { title: "Rollout", body: "We install unit by unit, to your schedule." },
  { title: "Resident support", body: "We help residents with the app and with service." },
];

/** PRD §8.7.2 / §26.8 */
export default function BuildersPage() {
  return (
    <>
      <PageHero
        eyebrow="Builders and commercial"
        title="Smart-ready homes and spaces, without redesign."
        sub="Home automation for builders and commercial spaces: upgrade ready flats, show flats, offices and shops with Homeasy retrofit. Give buyers one more reason to choose you. Based in Patna, we bring smart home solutions to projects across Bihar."
      >
        <a href="#enquire" className="btn btn-primary min-h-12 px-6">
          Discuss a project
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="Where Homeasy fits" sub="We check every site first. Not every switchbox suits a retrofit module." />
        <div className="mt-10">
          <ChipList items={USE_CASES} />
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What you get" />
        <div className="mt-10">
          <FeatureGrid items={BENEFITS} cols={4} />
        </div>
      </Section>

      <Section>
        <SectionHeading title="How it works" />
        <div className="mt-10">
          <StepList items={STEPS} />
        </div>
      </Section>

      <Section tone="cloud">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card className="min-w-0 p-6 sm:p-8">
            <Building2 aria-hidden="true" size={28} strokeWidth={1.75} className="text-navy" />
            <h2 className="mt-4 text-h3 leading-[1.2]">Project pricing</h2>
            <p className="mt-3 text-body">
              Project pricing is based on units and scope. Share your project and we will prepare a proposal.
            </p>
            <p className="mt-3 text-body">Homeasy modules carry a 3-year warranty.</p>
          </Card>
          <div className="min-w-0">
            <EnquiryCard
              title="Tell us about your project"
              body="Send us the project name, location, number of units and stage. We will arrange a project survey."
            />
          </div>
        </div>
      </Section>

      <Related paths={["/solutions/designers", "/products", "/installation"]} />

      <CtaBand
        title="Want to see it in one flat first?"
        body="Book a free survey for a single unit. We'll check the switchboxes and show you what's possible."
      />
    </>
  );
}
