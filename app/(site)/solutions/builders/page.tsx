import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { StepsCard } from "@/components/solutions/StepsCard";
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
import { Card, Faq, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { ChipList, FeatureGrid, StepList, type Feature } from "@/components/catalog";
import { EnquirySection } from "@/components/solutions/EnquirySection";
import { BUILDER_FIELDS } from "@/components/solutions/enquiry-fields";

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

const FAQ = [
  {
    q: "Can you retrofit flats that are already finished?",
    a: "Yes. The modules fit inside the existing switchboxes, so walls and finishes stay untouched. We check each switchbox at the survey, because not every one suits a module.",
  },
  {
    q: "How is project pricing worked out?",
    a: "By the number of units and the scope in each one. You get a written proposal after the project survey.",
  },
  {
    q: "Who supports residents after handover?",
    a: "Homeasy, directly. Residents reach us on WhatsApp or phone, and the modules carry a 3-year warranty.",
  },
  {
    q: "Do you work outside Patna?",
    a: "Yes. We are based in Patna and survey across Bihar. Contact us for locations outside Bihar.",
  },
];

/** PRD §8.7.2 / §26.8 */
export default function BuildersPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/solutions/builders" />
      <PageHero
        eyebrow="Builders and commercial"
        title="Smart-ready homes and spaces, without redesign."
        sub="Home automation for builders and commercial spaces: upgrade ready flats, show flats, offices and shops with Homeasy retrofit. Give buyers one more reason to choose you. Based in Patna, we bring smart home solutions to projects across Bihar."
        aside={
          <StepsCard
            steps={[
            { title: "Send your project details", body: "Type of project, number of units and its stage, in the form below." },
            { title: "We visit the site", body: "We look at sample units or the show flat and check the switchboxes." },
            { title: "You get a written proposal", body: "What can be made smart, how the work is phased, and the full price in writing." },
          ]}
          >
            <a href="#enquire" className="link inline-flex min-h-11 items-center font-semibold">
              Go to the form
            </a>
          </StepsCard>
        }
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
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <Card className="min-w-0 p-6 sm:p-8">
            <Building2 aria-hidden="true" size={28} strokeWidth={1.75} className="text-navy" />
            <h2 className="mt-4 text-h3 leading-[1.2]">Project pricing</h2>
            <p className="mt-3 text-body">
              Project pricing is based on units and scope. Share your project and we will prepare a proposal.
            </p>
            <p className="mt-3 text-body">Homeasy modules carry a 3-year warranty.</p>
          </Card>
          <div className="min-w-0">
            <h2 className="text-h3 leading-[1.2]">Questions builders ask</h2>
            <div className="mt-6">
              <Faq items={FAQ} />
            </div>
          </div>
        </div>
      </Section>

      <EnquirySection
        required={["email", "organisation", "city"]}
        kind="builder"
        page="/solutions/builders"
        title="Tell us about your project"
        sub="Send us the project name, location, number of units and stage. We will arrange a project survey."
        organisationLabel="Company"
        messageLabel="Project name and anything else we should know"
        submitLabel="Send project enquiry"
        extraFields={BUILDER_FIELDS}
      />

      <Related paths={["/solutions/designers", "/products", "/installation"]} />

      <CtaBand
        title="Want to see it in one flat first?"
        body="Book a free survey for a single unit. We'll check the switchboxes and show you what's possible."
      />
    </>
  );
}
