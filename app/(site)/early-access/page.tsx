import type { Metadata } from "next";
import { CalendarClock, HandHeart, Tag } from "lucide-react";
import { EnquiryFormBase } from "@/components/forms/EnquiryFormBase";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Card, Faq, PageHero, Section, SectionHeading, Steps } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { Related } from "@/components/ui/Related";
import { HOME_TYPES } from "@/lib/leads/schema";
import { seoMetadata } from "@/lib/seo/meta";
import { site } from "@/lib/site";

const pageMeta: Metadata = {
  title: "Homeasy Early Access — Join the Pilot Before Launch",
  description:
    "Homeasy early access: join the list for our Patna pilot before the planned January 2027 launch and get a special early-access offer. Free, no payment.",
};

export function generateMetadata() {
  return seoMetadata("/early-access", pageMeta);
}

const WHAT = [
  { icon: CalendarClock, title: "First in line", body: "We contact early-access homes first, before the public launch." },
  {
    icon: Tag,
    title: "A special early-access offer",
    body: "Everyone on the list gets a special offer on their first installation. The exact offer is confirmed in your written quote, before you pay anything.",
  },
  { icon: HandHeart, title: "Help shape Homeasy", body: "Pilot homes tell us what works and what does not, and we fix it before launch." },
];

const STEPS = [
  { title: "Join the list", body: "It takes a minute and it is free. We take no payment now." },
  { title: "We call you", body: "We ask about your home and what you want to control, and answer your questions." },
  { title: "Pilot homes in Patna go first", body: "We choose pilot homes in Patna for the first installations. Everyone else on the list hears from us at launch." },
  { title: "Your quote, with your offer", body: "After a free home survey you get a written quote that includes your early-access offer. You decide after you see it." },
];

const FAQ = [
  { q: "When does Homeasy launch?", a: `We plan to launch in ${site.launch.label}. It is a plan, not a promise: if the date moves, everyone on the list hears it from us first.` },
  { q: "What is the early-access offer?", a: "A special offer on your first installation, for everyone who joins the list before launch. We confirm exactly what it is in your written quote, before you pay anything." },
  { q: "Do I pay anything now?", a: "No. Joining is free and there is no obligation to buy." },
  { q: "I am not in Patna. Can I join?", a: "Yes. Pilot installations are in Patna, but homes elsewhere in Bihar can join the list and will hear from us at launch." },
  { q: "What do you do with my details?", a: "We use them only to contact you about Homeasy early access and your survey. See our Privacy Policy." },
];

/** Early access (founder decision, 16 Nov 2026): collect interest for the pilot before the planned January 2027 launch. */
export default function EarlyAccessPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/early-access" />
      <PageHero
        eyebrow="Early access"
        title="Be one of Homeasy's first homes."
        sub={`Homeasy early access is open. We plan to launch in ${site.launch.label}; before that, we are inviting homes in Patna to our pilot. Join the list for a special early-access offer on home automation in Patna, without rewiring.`}
      >
        <a href="#join" className="btn btn-primary min-h-12 px-6">
          Join early access
        </a>
      </PageHero>

      <Section>
        <SectionHeading title="What early access means" />
        <ul className="mt-10 grid gap-4 md:grid-cols-3">
          {WHAT.map(({ icon: Icon, title, body }) => (
            <li key={title} className="min-w-0">
              <Card className="h-full">
                <Icon aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
                <h3 className="mt-4 text-h4">{title}</h3>
                <p className="mt-2 text-body">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="How it works" sub="From joining the list to your quote." />
        <div className="mt-10">
          <Steps items={STEPS} />
        </div>
      </Section>

      <Section tone="tint" id="join" className="scroll-mt-20">
        <div className="max-w-[760px]">
          <SectionHeading title="Join the early-access list" sub="Free, with no payment and no obligation. We reply during working hours." />
          <div className="mt-8">
            <EnquiryFormBase
              kind="early_access"
              page="/early-access"
              show={{ city: true, message: true }}
              required={["city"]}
              cityLabel="City or area"
              messageLabel="Anything we should know?"
              submitLabel="Join early access"
              successTitle="You are on the early-access list."
              successText="We will call or WhatsApp you during working hours with the next steps and your early-access offer."
              extraFields={[
                { name: "pincode", label: "Pincode", type: "number", required: true, placeholder: "For example: 800001" },
                { name: "home_type", label: "Home type", type: "select", options: [...HOME_TYPES], required: true },
                {
                  name: "wants",
                  label: "What would you like to control first?",
                  type: "select",
                  options: ["Lights and fans", "Lights, fans and geyser", "Lights, fans, geyser, AC and TV", "The whole home", "Not sure yet"],
                },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section>
        <div className="max-w-[820px]">
          <SectionHeading title="Early access questions" />
          <div className="mt-8">
            <Faq items={FAQ} />
          </div>
        </div>
      </Section>

      <Related paths={["/how-it-works", "/products", "/faq"]} />

      <CtaBand title="Prefer to talk first?" body="Book a free home survey or WhatsApp us. We'll check your switchboxes and show you what's possible." />
    </>
  );
}
