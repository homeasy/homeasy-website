import type { Metadata } from "next";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import {
  BedDouble,
  Briefcase,
  CalendarClock,
  GraduationCap,
  Hammer,
  Hospital,
  Hotel,
  House,
  MapPin,
  Power,
} from "lucide-react";
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { ChipList, EnquiryCard, FeatureGrid, type Feature } from "@/components/catalog";
import { getSite } from "@/lib/site-live";
import { usp } from "@/lib/flags";

const pageMeta: Metadata = {
  title: "Smart Retrofit for Government Buildings — Homeasy",
  description:
    "Smart retrofit for government buildings and institutions: central control and schedules for lights and fans, without rewiring.",
};

export function generateMetadata() {
  return seoMetadata("/solutions/government", pageMeta);
}

const USE_CASES = [
  { icon: House, label: "Government quarters" },
  { icon: BedDouble, label: "Hostels" },
  { icon: Briefcase, label: "Offices" },
  { icon: GraduationCap, label: "Schools and colleges" },
  { icon: Hospital, label: "Hospitals and health centres" },
  { icon: Hotel, label: "Guest houses" },
];

/** PRD §8.7.4 / §26.10. No empanelment, GeM, tender, reference or energy-saving % claims (R8, R11). */
export default async function GovernmentPage() {
  const site = await getSite();
  const benefits: Feature[] = [
    { icon: Power, title: "Central control", body: "Switch off unused areas across a building." },
    { icon: CalendarClock, title: "Schedules", body: "Lights and fans run only when needed." },
    { icon: Hammer, title: "No civil work", body: "Retrofit inside the existing switchboxes." },
    {
      icon: MapPin,
      title: "Local accountability",
      body:
        usp("U2") && usp("U5")
          ? "A Patna-based team with written service levels."
          : "A Patna-based team you can reach directly.",
    },
  ];

  const credentials = [
    { label: "Legal name", value: site.legalName },
    { label: "CIN", value: site.cin },
    { label: "Incorporated", value: String(site.foundedYear) },
    { label: "Registered office", value: site.fullAddress },
  ];

  return (
    <>
      <PageHero
        eyebrow="Government and institutions"
        title="Smarter, energy-efficient public buildings — without rewiring."
        sub="Smart retrofit for government buildings: Homeasy gives departments central control and schedules for lights, fans and appliances across quarters, hostels and offices."
      >
        <a href="#enquire" className="btn btn-primary min-h-12 px-6">
          Request a proposal
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="Where it can be used" sub="We survey each building first and report what is possible." />
        <div className="mt-10">
          <ChipList items={USE_CASES} />
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading
          title="What departments get"
          sub="Central switching and schedules help cut wasted electricity. We do not quote saving figures until we have measured them."
        />
        <div className="mt-10">
          <FeatureGrid items={benefits} cols={4} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
          <Card className="min-w-0 p-6 sm:p-8">
            <h2 className="text-h3 leading-[1.2]">Company credentials</h2>
            <dl className="mt-5 divide-y divide-line">
              {credentials.map((c) => (
                <div key={c.label} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-4">
                  <dt className="text-[15px] text-slate sm:w-40 sm:shrink-0">{c.label}</dt>
                  <dd className="min-w-0 break-words font-semibold text-ink">{c.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[15px] text-body">Homeasy modules carry a 3-year warranty.</p>
          </Card>
          <div className="min-w-0">
            <EnquiryCard
              title="Tell us about your requirement"
              body="Send us the department, building type, location and number of rooms. We will propose a survey."
            />
          </div>
        </div>
      </Section>

      <Related paths={["/how-it-works", "/installation", "/contact"]} />

      <CtaBand
        title="Start with one building"
        body="Ask for a survey of a single building. We'll check the switchboxes and report what is possible."
      />
    </>
  );
}
