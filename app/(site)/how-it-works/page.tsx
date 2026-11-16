import type { Metadata } from "next";
import { site as company } from "@/lib/site";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { Box, Camera, Check, Cpu, Smartphone, ToggleRight, Wifi, WifiOff, Zap } from "lucide-react";
import { flags } from "@/lib/flags";
import { getSite } from "@/lib/site-live";
import { Card, Faq, PageHero, Section, SectionHeading, StatusBadge, Steps } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { Callout, SurveyChecklist, live, replyLine, visitLine } from "@/components/service";

const pageMeta: Metadata = {
  title: "How Homeasy Works — Retrofit Smart Switch, No Rewiring",
  description:
    "See how Homeasy fits a retrofit smart switch module behind your existing switches to make them smart. Free survey, professional installation, easy app.",
};

export function generateMetadata() {
  return seoMetadata("/how-it-works", pageMeta);
}

const DIAGRAM = [
  { icon: ToggleRight, label: "Your switchboard", note: "Looks the same as before." },
  { icon: Box, label: "The switchbox in the wall", note: "The box behind your switches." },
  { icon: Cpu, label: "Homeasy module", note: "Fitted inside the box, out of sight." },
  { icon: Wifi, label: "Your Wi-Fi", note: "Connects the module to the app." },
  { icon: Smartphone, label: "Homeasy app", note: "Control from your phone." },
];

const STAYS = [
  "Your switchboard and its design",
  "Your switches. They still work by hand.",
  "Your wiring",
  "Your walls. No breaking, no chasing.",
];

const GAINS = [
  "Control from your phone, anywhere",
  "Schedules, like geyser at 6 am or lights at sunset",
  "One-tap scenes like “Good night”",
  "Family sharing",
];

/** PRD §8.2, §26.1, wireframe §25.3 */
export default async function HowItWorksPage() {
  const site = await getSite();
  const steps = [
    {
      title: "Free home survey",
      body: "Our technician visits, opens a few switchboxes, and checks wiring and loads.",
    },
    live.report
      ? {
          title: live.fixedPrice ? "Readiness Report and fixed quote" : "Readiness Report and quote",
          body: "You get photos, findings and one clear price on WhatsApp.",
        }
      : {
          title: live.fixedPrice ? "Findings and fixed quote" : "Findings and quote",
          body: "We share what we found and one clear price on WhatsApp.",
        },
    {
      title: "Installation",
      body: "Trained Homeasy electricians install everything. We confirm timing at your survey.",
    },
    {
      title: "App setup",
      body: (
        <>
      <BreadcrumbJsonLd path="/how-it-works" />
          We set up rooms, scenes and family access, and show you how it works.
          {!flags.APP_LIVE && (
            <span className="mt-2 block">
              <StatusBadge status="coming-soon" label={`App launching ${company.launch.short}`} />
            </span>
          )}
        </>
      ),
    },
    {
      title: "Support",
      body: `${replyLine(site.contact.hours)} ${visitLine}`,
    },
  ];

  const faqs = [
    {
      q: "What's a neutral wire?",
      a: "One of the wires in your switchbox that many smart modules need. We check it during the survey.",
    },
    {
      q: "Will it damage my wiring?",
      a: (
        <>
          Our electricians connect to your existing wiring following a safety checklist. If anything needs fixing, we
          tell you first.{" "}
          {live.sameLook && (
            <>
              The{" "}
              <Link href="/guarantee" className="link">
                &ldquo;Same look&rdquo; guarantee
              </Link>{" "}
              covers our work.
            </>
          )}
        </>
      ),
    },
    {
      q: "Can I do this in a rented home?",
      a: "Usually yes, because nothing visible changes. Check with your landlord first.",
    },
    {
      q: "Can I add more rooms later?",
      a: "Yes, anytime. Many families start with one or two rooms.",
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="How it works"
        title="How Homeasy makes your home smart"
        sub="Home automation the simple way: Homeasy fits a retrofit smart switch module inside your existing switchbox, behind the switches you already have. It is how we convert a normal switch to a smart switch without rewiring. Same switches. Smarter home."
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free home survey
        </Link>
        <a
          href={site.whatsappHref("photo")}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline min-h-12 px-6"
        >
          <Camera size={20} aria-hidden /> Send a switchboard photo
        </a>
      </PageHero>

      <Section>
        <SectionHeading
          title="The smart part hides behind your switch."
          sub="Every switchboard has a box in the wall behind it. Homeasy fits a compact smart module inside that box. It connects to your existing switches."
        />
        <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {DIAGRAM.map(({ icon: Icon, label, note }, i) => (
            <li key={label} className="min-w-0 rounded-card border border-line bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-amber text-[14px] font-bold text-navy">
                  {i + 1}
                </span>
                <Icon size={24} aria-hidden className="text-ink" />
              </div>
              <h3 className="mt-4 text-[17px] font-semibold leading-snug">{label}</h3>
              <p className="mt-1 text-[15px] text-body">{note}</p>
            </li>
          ))}
        </ol>
        <p className="mt-6 max-w-[720px] text-body">
          Nothing changes on the outside. Your lights, fans and appliances can also be controlled from your phone.
        </p>
      </Section>

      <Section tone="cloud">
        <SectionHeading
          title="Spot the difference. (There isn't one.)"
          sub="Same switches, same look. Now smart."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="min-w-0">
            <h3 className="text-h4">What stays the same</h3>
            <ul className="mt-4 space-y-3 text-body">
              {STAYS.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check size={20} aria-hidden className="mt-0.5 shrink-0 text-ink" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Card>
          <Card className="min-w-0">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-h4">What you gain</h3>
              {!flags.APP_LIVE && <StatusBadge status="coming-soon" label={`App launching ${company.launch.short}`} />}
            </div>
            <ul className="mt-4 space-y-3 text-body">
              {GAINS.map((item) => (
                <li key={item} className="flex gap-3">
                  <Check size={20} aria-hidden className="mt-0.5 shrink-0 text-ink" />
                  <span>{item}</span>
                </li>
              ))}
              <li className="flex gap-3">
                <Check size={20} aria-hidden className="mt-0.5 shrink-0 text-ink" />
                <span>
                  Voice control and energy insights <StatusBadge status="planned" />
                </span>
              </li>
            </ul>
          </Card>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Five steps, start to finish" sub="We handle everything, from the first visit to support." />
        <div className="mt-10">
          <Steps items={steps} />
        </div>
        {!live.report && (
          <p className="mt-6 flex flex-wrap items-center gap-2 text-body">
            A written Readiness Report with photos of each switchbox.
            <StatusBadge status="coming-soon" label="Launching after our Patna pilot" />
          </p>
        )}
        <p className="mt-4 text-body">
          <Link href="/installation" className="link">
            See how installation works
          </Link>{" "}
          or{" "}
          <Link href="/guarantee" className="link">
            read our promises in writing
          </Link>
          .
        </p>
      </Section>

      <Section tone="cloud">
        <SectionHeading
          title="What we check in the survey"
          sub="The survey is free. It tells you what's possible before you pay anything."
        />
        <div className="mt-10">
          <SurveyChecklist />
        </div>
        <div className="mt-8 max-w-[820px]">
          <Callout title="Most homes are suitable.">
            Some older switchboxes or wiring need a small fix first. Your survey tells you exactly what&apos;s
            possible, before you pay anything.
          </Callout>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Internet down? Power cut? Your switches still work." />
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <Card className="min-w-0">
            <WifiOff size={24} aria-hidden />
            <h3 className="mt-4 text-h4">No internet?</h3>
            <p className="mt-2 text-body">
              Your switches work by hand exactly as before. App control needs Wi-Fi and internet.
            </p>
          </Card>
          <Card className="min-w-0">
            <Zap size={24} aria-hidden />
            <h3 className="mt-4 text-h4">Power cut?</h3>
            <p className="mt-2 text-body">When power returns, your switches work as normal.</p>
          </Card>
        </div>
      </Section>

      <Section tone="tint">
        <div className="max-w-[720px]">
          <h2 className="text-h3 leading-[1.15]">Living in an older home?</h2>
          <p className="mt-4 text-lg text-body">
            Many homes in Bihar have switchboards that are 10, 20 or even 30 years old. That&apos;s exactly what
            we&apos;re built for.
          </p>
          <p className="mt-3 text-lg text-body">
            {live.report
              ? "If something needs attention, your Readiness Report will show it with photos. No surprises."
              : "If something needs attention, we show you with photos before any work starts. No surprises."}
          </p>
        </div>
      </Section>

      <Section>
        <SectionHeading title="Common questions" />
        <div className="mt-10 max-w-[820px]">
          <Faq items={faqs} />
          <p className="mt-6 text-body">
            <Link href="/faq" className="link">
              See all questions
            </Link>
          </p>
        </div>
      </Section>

      <Related paths={["/products", "/readiness-report", "/pricing"]} />

      <CtaBand title="Ready to see what's possible in your home?" />
    </>
  );
}
