import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import { CalendarClock, Gem, Hammer, Headset, MonitorPlay, PencilRuler, Wallet, Wrench } from "lucide-react";
import { Faq, PageHero, Section, SectionHeading, Steps } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { EnquiryCard, FeatureGrid, type Feature } from "@/components/catalog";
import { flags, usp } from "@/lib/flags";

const pageMeta: Metadata = {
  title: "Smart Home Solutions for Interior Designers — Homeasy",
  description: "Add smart control behind existing switchboards — no design change, no rewiring.",
};

export function generateMetadata() {
  return seoMetadata("/solutions/designers", pageMeta);
}

const BENEFITS: Feature[] = [
  { icon: PencilRuler, title: "Your design stays intact", body: "Modules sit inside the existing switchboxes, behind the switches." },
  { icon: Hammer, title: "No civil work", body: "No wall chasing. Install during finishing or after handover." },
  { icon: Gem, title: "Premium value", body: "Offer smart living as part of your projects." },
  { icon: Wrench, title: "We handle the technical side", body: "Survey, installation, app setup and support." },
];

const STEPS = [
  { title: "Joint site visit", body: "We visit the site with you or your site supervisor." },
  { title: "Proposal", body: "You get a proposal you can share with your client." },
  { title: "Installation", body: "We schedule the work around your timeline." },
  { title: "Client handover", body: "We set up the app for your client and support them afterwards." },
];

/** PRD §8.7.1 / §26.7 */
export default function DesignersPage() {
  const partner: Feature[] = [
    { icon: Wallet, title: "Trade pricing", body: "Shared on enquiry." },
    { icon: CalendarClock, title: "Priority scheduling", body: "We plan installation dates around your project." },
    ...(flags.SHOW_DEMO
      ? [{ icon: MonitorPlay, title: "Demo access", body: "Show your clients how it works before they decide." }]
      : []),
    { icon: Headset, title: "A direct contact", body: "One person at Homeasy for all your projects." },
  ];

  const support =
    usp("U2") && usp("U5")
      ? "Homeasy, directly. We reply on WhatsApp within 30 minutes in working hours. A technician visits within 24 hours in Patna."
      : "Homeasy, directly. Your client reaches us on WhatsApp or phone, and the modules carry a 3-year warranty.";

  const faq = [
    {
      q: "Can you work during renovation?",
      a: "Yes. We agree the right stage with you after the site visit.",
    },
    { q: "Who supports the client later?", a: support },
    {
      q: "Do you work outside Patna?",
      a: "Yes. We are based in Patna and survey across Bihar. Contact us for locations outside Bihar.",
    },
    {
      q: "Does it fit every switchboard?",
      a: "Not always. We check each switchbox at the site visit and tell you plainly what is possible.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Interior designers and architects"
        title="Smart homes without changing your design."
        sub="Add smart control behind the switchboards your clients chose. No wall chasing, no redesign."
      >
        <a href="#enquire" className="btn btn-primary min-h-12 px-6">
          Become a design partner
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="Why designers work with Homeasy" />
        <div className="mt-10">
          <FeatureGrid items={BENEFITS} cols={4} />
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="How we work with you" />
        <div className="mt-10">
          <Steps items={STEPS} />
        </div>
      </Section>

      <Section>
        <SectionHeading title="Partner benefits" sub="Our partner programme is new. We share the terms when you enquire." />
        <div className="mt-10">
          <FeatureGrid items={partner} />
        </div>
      </Section>

      <Section tone="cloud">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="min-w-0">
            <SectionHeading title="Questions designers ask" />
            <div className="mt-8">
              <Faq items={faq} />
            </div>
          </div>
          <div className="min-w-0">
            <EnquiryCard
              title="Tell us about your practice"
              body="Send us your studio name, city and the kind of projects you do. We will set up a call or a site visit."
            />
          </div>
        </div>
      </Section>

      <CtaBand
        title="Planning a project now?"
        body="Book a free survey for the site. We'll check the switchboxes and show you what's possible."
      />
    </>
  );
}
