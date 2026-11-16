import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Hand, House, Smartphone, Video } from "lucide-react";
import { flags } from "@/lib/flags";
import type { ExtraField } from "@/lib/enquiries/schema";
import { seoMetadata } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-live";
import { Card, PageHero, Section, SectionHeading, Steps } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { Related } from "@/components/ui/Related";
import { IconList } from "@/components/service";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { EnquiryFormBase } from "@/components/forms/EnquiryFormBase";

const pageMeta: Metadata = {
  title: "Smart Home Demo in Patna: See It Working — Homeasy",
  description:
    "Book a smart home demo with Homeasy: visit our Patna demo home or take a 15-minute WhatsApp video call, and see the modules working before you decide.",
};

export function generateMetadata() {
  return seoMetadata("/demo", pageMeta);
}

const HOME_VISIT = "Visit the Patna demo home";
const VIDEO_CALL = "Video demo on WhatsApp";

/** PRD §8.19: name, mobile, demo type, preferred date/slot, consent. */
const demoFields: ExtraField[] = [
  { name: "demo_type", label: "Demo type", type: "select", options: [HOME_VISIT, VIDEO_CALL], required: true },
  { name: "preferred_day", label: "Preferred day", type: "text", required: true, placeholder: "For example: Saturday, or 22 November" },
  {
    name: "preferred_time",
    label: "Preferred time",
    type: "select",
    options: ["Morning (9 am to 12 noon)", "Afternoon (12 noon to 4 pm)", "Evening (4 pm to 9 pm)"],
    required: true,
  },
];

/** PRD §8.19, §26.21, wireframe §25.12, USP U12. Hidden (404) until SHOW_DEMO is on, i.e. until a demo setup exists. */
export default async function DemoPage() {
  if (!flags.SHOW_DEMO) notFound();
  const site = await getSite();

  return (
    <>
      <BreadcrumbJsonLd path="/demo" />
      <PageHero
        eyebrow="Demo"
        title="See Homeasy working before you decide."
        sub="Book a smart home demo: visit our Patna demo home, or take a short video call on WhatsApp."
      >
        <a href="#book-demo" className="btn btn-primary min-h-12 px-6">
          Book my demo
        </a>
        <a
          href={site.whatsappHref("general")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline min-h-12 px-6"
        >
          <WhatsAppIcon size={18} /> Ask on WhatsApp
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="Two ways to see it" sub="Pick whichever is easier for you." />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          <Card className="sm:p-8">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-tint text-ink">
              <House size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-h4 leading-snug">Visit our Patna demo home</h3>
            <p className="mt-2 text-body">See real switchboards, real modules, real control.</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-body marker:text-slate">
              <li>Use the switches by hand, then from the app.</li>
              <li>Look at a module and where it sits in the switchbox.</li>
              <li>We share the address on WhatsApp when we confirm your visit.</li>
            </ul>
          </Card>
          <Card className="sm:p-8">
            <span className="inline-flex size-11 items-center justify-center rounded-full bg-tint text-ink">
              <Video size={22} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-h4 leading-snug">Video demo on WhatsApp</h3>
            <p className="mt-2 text-body">15 minutes from your sofa.</p>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] text-body marker:text-slate">
              <li>A WhatsApp video call with our team, from anywhere in Bihar.</li>
              <li>We show the switches and the app working live.</li>
              <li>Ask anything about your own home as we go.</li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What you will see" />
        <div className="mt-8">
          <IconList
            columns={3}
            items={[
              { icon: Hand, title: "Same switches, still by hand", body: "The switchboard looks the same and every switch works as before." },
              { icon: Smartphone, title: "Control from the Homeasy app", body: "Lights, fan speed, geyser, AC and TV from a phone." },
              { icon: House, title: "Scenes and schedules", body: "Several devices at once, or at a set time." },
            ]}
          />
        </div>
        <p className="mt-6 max-w-[720px] text-[15px] text-body">
          A demo shows how Homeasy works. Whether it fits your own switchboxes is checked at a{" "}
          <Link href="/book-survey" className="link">
            free home survey
          </Link>
          .
        </p>
      </Section>

      <Section>
        <SectionHeading title="How booking works" />
        <div className="mt-8">
          <Steps
            items={[
              { title: "Send the form", body: "Tell us which demo you want and when suits you." },
              { title: "We confirm on WhatsApp", body: `During working hours, ${site.contact.hours}. Your slot is fixed only once we confirm it.` },
              { title: "See it working", body: "At the demo home, or on a video call. There is no obligation to buy." },
            ]}
          />
        </div>
      </Section>

      <Section tone="cloud" id="book-demo" className="scroll-mt-24">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr] lg:gap-12">
          <div className="min-w-0">
            <SectionHeading title="Book my demo" sub="Four details and we will confirm a slot with you." />
            <p className="mt-6 text-body">
              Prefer to talk first? Call{" "}
              <a href={site.telHref} className="link whitespace-nowrap">
                {site.contact.phoneDisplay}
              </a>{" "}
              or{" "}
              <a href={site.whatsappHref("general")} target="_blank" rel="noopener noreferrer" className="link">
                message us on WhatsApp
              </a>
              .
            </p>
          </div>
          <div className="min-w-0">
            <EnquiryFormBase
              kind="demo"
              page="/demo"
              show={{}}
              extraFields={demoFields}
              submitLabel="Book my demo"
              successTitle="Thank you. We have your demo request."
              successText="We'll confirm your slot on WhatsApp during working hours."
            />
          </div>
        </div>
      </Section>

      <Related paths={["/how-it-works", "/app", "/book-survey"]} />

      <CtaBand />
    </>
  );
}
