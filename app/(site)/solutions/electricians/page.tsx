import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import { Gift, GraduationCap, Headset, Wallet } from "lucide-react";
import { Card, Faq, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { CheckList, FeatureGrid, StepList, type Feature } from "@/components/catalog";
import { EnquirySection } from "@/components/solutions/EnquirySection";
import { ELECTRICIAN_FIELDS } from "@/components/solutions/enquiry-fields";

const pageMeta: Metadata = {
  title: "Smart Home Installation Training for Electricians",
  description:
    "Smart home installation training for electricians: join the Homeasy electrician network in Bihar and take paid jobs, with support from our team.",
};

export function generateMetadata() {
  return seoMetadata("/solutions/electricians", pageMeta);
}

const BENEFITS: Feature[] = [
  { icon: GraduationCap, title: "Training", body: "Learn Homeasy modules and our installation method." },
  { icon: Wallet, title: "Paid installation jobs", body: "Jobs come from Homeasy. Payout details are shared on enquiry." },
  { icon: Gift, title: "Referral rewards", body: "For customers you bring. Details are shared on enquiry." },
  { icon: Headset, title: "Backup from our team", body: "Technical help on WhatsApp when you need it." },
];

const WHO = ["Experienced house-wiring electricians", "Your own smartphone"];

const STEPS = [
  { title: "Apply", body: "Send us your name, area and years of experience." },
  { title: "Short interview", body: "We talk about your work and what you want to learn." },
  { title: "Training session", body: "You learn the modules and how we install them." },
  { title: "First jobs with a lead", body: "You work alongside a Homeasy lead." },
  { title: "Independent jobs", body: "You take jobs on your own." },
];

const FAQ = [
  {
    q: "Do I need smart-home experience?",
    a: "No. You need house-wiring experience. The training covers Homeasy modules and how we install them.",
  },
  {
    q: "Do I have to be in Patna?",
    a: "No. We are starting in Patna and building the network across Bihar. Tell us your area when you apply.",
  },
  { q: "How are jobs paid?", a: "Jobs come from Homeasy. We share the payout details when you apply." },
  { q: "Do I need a licence?", a: "We confirm any ID or licence requirements when you apply." },
];

/** PRD §8.7.3 / §26.9 */
export default function ElectriciansPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/solutions/electricians" />
      <PageHero
        eyebrow="Electricians"
        title="Grow your work with Homeasy."
        sub="We are building the Homeasy electrician network in Bihar, starting in Patna. Get smart home installation training and take on new work."
      >
        <a href="#enquire" className="btn btn-primary min-h-12 px-6">
          Join the network
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="What you get" />
        <div className="mt-10">
          <FeatureGrid items={BENEFITS} cols={4} />
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="How it works" />
        <div className="mt-10">
          <StepList items={STEPS} />
        </div>
      </Section>

      <Section>
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start lg:gap-12">
          <Card className="min-w-0 p-6 sm:p-8">
            <h2 className="text-h3 leading-[1.2]">Who can join</h2>
            <CheckList items={WHO} className="mt-5" />
            <p className="mt-5 text-[15px] text-body">
              We confirm any ID or licence requirements when you apply.
            </p>
          </Card>
          <div className="min-w-0">
            <h2 className="text-h3 leading-[1.2]">Questions electricians ask</h2>
            <div className="mt-6">
              <Faq items={FAQ} />
            </div>
          </div>
        </div>
      </Section>

      <EnquirySection
        required={["city"]}
        cityLabel="Area"
        kind="electrician"
        page="/solutions/electricians"
        title="Apply to join"
        sub="Send us your name, phone number, area and years of experience. We will call you back."
        organisationLabel="Firm or shop name"
        messageLabel="The kind of work you do"
        submitLabel="Apply to join"
        extraFields={ELECTRICIAN_FIELDS}
      />

      <Related paths={["/installation", "/careers", "/contact"]} />

      <CtaBand
        title="Know a home that wants to go smart?"
        body="Ask the owner to book a free home survey. We'll check the switchboxes and show what's possible."
      />
    </>
  );
}
