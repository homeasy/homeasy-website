import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { StepsCard } from "@/components/solutions/StepsCard";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import {
  BedDouble,
  Briefcase,
  CalendarClock,
  FileText,
  GraduationCap,
  Hammer,
  Hospital,
  Hotel,
  House,
  MapPin,
  Power,
} from "lucide-react";
import { Card, Faq, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { ChipList, FeatureGrid, StepList, type Feature } from "@/components/catalog";
import { EnquirySection } from "@/components/solutions/EnquirySection";
import { GOVERNMENT_FIELDS } from "@/components/solutions/enquiry-fields";
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

const STEPS = [
  { title: "Enquiry", body: "Send us the department, building type, location and approximate scale." },
  { title: "Building survey", body: "We check the switchboxes and wiring, and report what is possible." },
  { title: "Written proposal", body: "You get the scope and the price in writing before any work starts." },
  { title: "Installation", body: "We fit the modules inside the existing switchboxes." },
  { title: "Handover and support", body: "We set up the app and the schedules you need, and support the building afterwards." },
];

const FAQ = [
  {
    q: "Does the building need rewiring or civil work?",
    a: "No. The modules are fitted inside the existing switchboxes. We check every switchbox at the survey and report which ones are suitable, because not every one suits a module.",
  },
  {
    q: "How much electricity will it save?",
    a: "We do not quote saving figures until we have measured them ourselves. Central switching and schedules help cut wasted use.",
  },
  {
    q: "Can we start with one building?",
    a: "Yes. Ask for a survey of a single building. We check the switchboxes and report what is possible.",
  },
  {
    q: "Where do you work?",
    a: "We are based in Patna and survey across Bihar. Contact us for locations outside Bihar.",
  },
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
      <BreadcrumbJsonLd path="/solutions/government" />
      <PageHero
        eyebrow="Government and institutions"
        title="Smarter, energy-efficient public buildings — without rewiring."
        sub="Smart retrofit for government buildings: Homeasy gives departments central control and schedules for lights, fans and appliances across quarters, hostels and offices."
        aside={
          <StepsCard
            steps={[
            { title: "Send the building details", body: "Type of building, approximate scale and timeline, in the form below." },
            { title: "We visit and assess", body: "We check the switchboxes and wiring on site and note what can be controlled centrally." },
            { title: "You get a written proposal", body: "Scope, phases and the full price in writing, for your department to review." },
          ]}
          >
            <a href="#enquire" className="link inline-flex min-h-11 items-center font-semibold">
              Go to the form
            </a>
          </StepsCard>
        }
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
        <SectionHeading title="How a project runs" sub="The same steps for one building or many." />
        <div className="mt-10">
          <StepList items={STEPS} />
        </div>
      </Section>

      <Section tone="cloud">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
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
            {/* Placeholder until the capability statement PDF exists: it must not link to a file. */}
            <a
              href="#enquire"
              className="mt-5 flex min-h-12 items-center gap-3 rounded-input border border-dashed border-line bg-cloud px-4 py-3 text-ink no-underline hover:border-navy"
            >
              <FileText aria-hidden="true" size={22} strokeWidth={1.75} className="shrink-0 text-navy" />
              <span className="min-w-0">
                <span className="block font-semibold">Capability statement (PDF)</span>
                <span className="block text-[15px] text-body">Available on request. Ask for it in the enquiry form.</span>
              </span>
            </a>
          </Card>
          <div className="min-w-0">
            <h2 className="text-h3 leading-[1.2]">Questions departments ask</h2>
            <div className="mt-6">
              <Faq items={FAQ} />
            </div>
          </div>
        </div>
      </Section>

      <EnquirySection
        required={["email", "organisation", "city"]}
        kind="government"
        page="/solutions/government"
        title="Tell us about your requirement"
        sub="Send us the department, building type, location and number of rooms. We will propose a survey."
        organisationLabel="Department or organisation"
        messageLabel="Your requirement"
        submitLabel="Request a proposal"
        extraFields={GOVERNMENT_FIELDS}
      />

      <Related paths={["/how-it-works", "/installation", "/contact"]} />

      <CtaBand
        title="Start with one building"
        body="Ask for a survey of a single building. We'll check the switchboxes and report what is possible."
      />
    </>
  );
}
