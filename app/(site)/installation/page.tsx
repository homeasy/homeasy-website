import type { Metadata } from "next";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import {
  Camera,
  ClipboardCheck,
  Gauge,
  Hand,
  House,
  ListChecks,
  MessageCircle,
  Power,
  ShieldCheck,
  Wifi,
  Wrench,
} from "lucide-react";
import serviceAreas from "@/data/service-areas.json";
import { flags } from "@/lib/flags";
import { Card, PageHero, Section, SectionHeading, StatusBadge, Steps } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { IconList, PromiseStatus, SurveyChecklist, live } from "@/components/service";
import { getSite } from "@/lib/site-live";
import { PincodeChecker } from "@/components/service/PincodeChecker";

const pageMeta: Metadata = {
  title: "Smart Home Installation in Patna — Homeasy",
  description:
    "Smart home installation in Patna by trained Homeasy electricians, inside your existing switchbox. It starts with a free home survey in Bihar.",
};

export function generateMetadata() {
  return seoMetadata("/installation", pageMeta);
}

function Who({ children }: { children: string }) {
  return <span className="mt-3 block text-[14px] font-semibold text-ink">Who: {children}</span>;
}

/** PRD §8.4, §26.3, wireframe §25.5 */
export default async function InstallationPage() {
  const { hours } = (await getSite()).contact;
  const timeline = [
    {
      title: "Survey",
      body: (
        <>
          Switchbox, wiring, load and Wi-Fi checks.
          <Who>Homeasy technician</Who>
        </>
      ),
    },
    {
      title: live.report ? "Report and quote" : "Findings and quote",
      body: (
        <>
          {live.fixedPrice
            ? "Photos, findings and a fixed price on WhatsApp."
            : "Photos, findings and one clear price on WhatsApp."}
          <Who>Homeasy team</Who>
        </>
      ),
    },
    {
      title: "Installation",
      body: (
        <>
          Modules fitted, switchboards closed, everything tested.
          <Who>Homeasy electricians</Who>
        </>
      ),
    },
    {
      title: "App setup",
      body: (
        <>
          Rooms, scenes, schedules and family accounts.
          <Who>Homeasy technician</Who>
          {!flags.APP_LIVE && (
            <span className="mt-2 block">
              <StatusBadge status="coming-soon" label="App coming soon" />
            </span>
          )}
        </>
      ),
    },
    {
      title: "Handover",
      body: (
        <>
          Before and after photos shared. Your warranty starts.
          <Who>Homeasy technician</Who>
        </>
      ),
    },
  ];

  const levels = [
    {
      figure: live.reply ? "30 min" : hours.split(",")[0],
      label: live.reply ? "WhatsApp reply, during working hours" : "WhatsApp replies, every day",
      note: live.reply ? `Working hours: ${hours}.` : "30-minute reply promise:",
      on: live.reply,
      gated: true,
    },
    {
      figure: live.visit ? "24 hours" : "Patna",
      label: live.visit ? "Technician visit in Patna" : "Technician visits, arranged as soon as we can",
      note: live.visit ? "Counted from when you raise the issue." : "24-hour visit promise in Patna:",
      on: live.visit,
      gated: true,
    },
    {
      figure: "3 years",
      label: "Warranty on Homeasy modules",
      note: "Against manufacturing defects.",
      on: true,
      gated: false,
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="Installation"
        title="Professional installation, done right."
        sub="Smart home installation in Patna, with free home surveys across Bihar. From survey to app setup, our trained electricians handle everything."
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free home survey
        </Link>
      </PageHero>

      <Section>
        <SectionHeading
          title="What happens, and who comes"
          sub="Five steps from survey to handover. We confirm timing for your home at the survey."
        />
        <div className="mt-10">
          <Steps items={timeline} />
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading
          title="What the technician checks"
          sub="Our free survey checks your switchboxes and wiring first."
        />
        <div className="mt-10">
          <SurveyChecklist />
        </div>
      </Section>

      <Section>
        <SectionHeading title="Safety on every job. No shortcuts." sub="Our electricians follow this checklist." />
        <div className="mt-10">
          <IconList
            columns={3}
            items={[
              { icon: Power, title: "Main power off before any work." },
              { icon: Gauge, title: "Load checked for every appliance before choosing a module." },
              { icon: Wrench, title: "Every connection tightened, insulated and checked." },
              { icon: Hand, title: "Every switch tested by hand and from the app before we leave." },
              { icon: Camera, title: "Photos of every switchbox, before and after." },
              { icon: ShieldCheck, title: "Any wiring problem we find is reported to you. Never hidden." },
            ]}
          />
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What you need to do" sub="Three small things make the visit quick." />
        <div className="mt-10">
          <IconList
            columns={3}
            items={[
              { icon: House, title: "Be at home", body: "Or have someone there during the visit." },
              { icon: Wifi, title: "Keep Wi-Fi details handy", body: "We need your Wi-Fi name and password." },
              { icon: ListChecks, title: "Tell us what matters", body: "Which rooms and appliances matter most." },
            ]}
          />
        </div>
      </Section>

      <Section>
        <SectionHeading
          title="Warranty and support"
          sub="Raise an issue on WhatsApp or by phone. We give you a ticket number."
        />
        <ul className="mt-10 grid gap-6 md:grid-cols-3">
          {levels.map((l) => (
            <li key={l.label} className="min-w-0">
              <Card className="h-full">
                <p className="text-h3 font-bold leading-tight">{l.figure}</p>
                <p className="mt-2 font-semibold">{l.label}</p>
                <p className="mt-2 flex flex-wrap items-center gap-2 text-[15px] text-body">
                  {l.note}
                  {l.gated && !l.on && <PromiseStatus on={false} />}
                </p>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-body">
          <Link href="/guarantee" className="link inline-flex min-h-11 items-center gap-2">
            <ClipboardCheck size={20} aria-hidden /> Read our promises in full
          </Link>
          <Link href="/warranty" className="link inline-flex min-h-11 items-center gap-2">
            <ShieldCheck size={20} aria-hidden /> Warranty policy
          </Link>
          <Link href="/contact" className="link inline-flex min-h-11 items-center gap-2">
            <MessageCircle size={20} aria-hidden /> Contact support
          </Link>
        </p>
      </Section>

      <Section tone="cloud" id="service-area">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="min-w-0">
            <SectionHeading
              title="Free surveys across Bihar"
              sub="Enter your pincode to check. Not covered yet? Leave your details and we'll tell you when we arrive."
            />
            <p className="mt-4 text-body">
              Our head office and pilot are in Patna.
              {live.visit && " The 24-hour technician visit promise applies in Patna only."}
            </p>
          </div>
          <div className="min-w-0">
            <PincodeChecker regions={serviceAreas.regions} visitPromiseLive={live.visit} />
          </div>
        </div>
      </Section>

      <Related paths={["/how-it-works", "/pricing", "/warranty"]} />

      <CtaBand />
    </>
  );
}
