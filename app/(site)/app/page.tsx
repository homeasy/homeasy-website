import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import {
  BatteryCharging,
  Blocks,
  CalendarClock,
  ChartColumn,
  Clapperboard,
  Fan,
  HeartHandshake,
  Languages,
  LayoutGrid,
  Mic,
  Users,
} from "lucide-react";
import { PageHero, Section, SectionHeading, StatusBadge } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { FeatureGrid, IconTile, type Feature } from "@/components/catalog";
import { AppDemo } from "@/components/app-demo/AppDemo";
import { site } from "@/lib/site";
import { flags, usp } from "@/lib/flags";

const pageMeta: Metadata = {
  title: "Homeasy Smart Home App — Control Your Whole Home",
  description:
    "The Homeasy smart home app puts every room on your phone: rooms, scenes, schedules and family sharing. Free for every Homeasy customer.",
};

export function generateMetadata() {
  return seoMetadata("/app", pageMeta);
}

const PLANNED: Feature[] = [
  { icon: Mic, title: "Voice assistants", body: "Control by voice through popular assistants.", status: "planned" },
  { icon: ChartColumn, title: "Energy insights", body: "See which appliances run, and for how long.", status: "planned" },
  { icon: Languages, title: "Hindi with simple mode", body: "A simpler screen in Hindi for the whole family.", status: "planned" },
  { icon: Blocks, title: "Other smart brands", body: "Other smart devices in the same app.", status: "planned" },
  {
    icon: HeartHandshake,
    title: "Parents' home",
    body: "Look after your parents' home from another city.",
    status: "planned",
  },
  {
    icon: BatteryCharging,
    title: "Inverter-aware automation",
    body: "Heavy loads switch off in a power cut. We are still testing if this is feasible.",
    status: "planned",
  },
];

/** PRD §8.6 / §26.5. The app launches with the website (APP_LIVE). Store badges and screenshots are added when the store links and real screens exist. */
export default function AppPage() {
  const live = flags.APP_LIVE;

  const features: Feature[] = [
    { icon: LayoutGrid, title: "Rooms at a glance", body: "Every room and every switch on one screen." },
    { icon: Fan, title: "Fan speed, from your phone", body: "Change speed without getting up." },
    {
      icon: Clapperboard,
      title: "Scenes",
      body: usp("U9")
        ? "One tap, many switches. Ready-made Indian routines such as Morning geyser and Puja lights."
        : "“Good morning”, “Movie time”, “Good night”. One tap, many switches.",
    },
    {
      icon: CalendarClock,
      title: "Schedules",
      body: "Geyser at 6 am, outdoor lights in the evening, everything off at midnight.",
    },
    { icon: Users, title: "Family sharing", body: "Give each family member their own access." },
  ];

  return (
    <>
      <BreadcrumbJsonLd path="/app" />
      <PageHero
        eyebrow="The Homeasy app"
        title="One easy app for your whole home."
        sub={
          live
            ? "The Homeasy smart home app is free for every Homeasy customer, on Android and iOS. Control lights, fans, the geyser and the AC from your phone. App control needs Wi-Fi and internet; we set it up for you at installation."
            : "The Homeasy smart home app is free for every Homeasy customer. Control lights, fans, the geyser and the AC from your phone. App control needs Wi-Fi and internet. Android and iOS versions launch with Homeasy."
        }
      >
        {/* Store badges go here too once the store links exist. */}
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free home survey
        </Link>
        {!live && (
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="coming-soon" />
            <span className="text-[15px] text-body">The app launches with Homeasy, and we set it up at your installation.</span>
          </div>
        )}
      </PageHero>

      <Section id="try-the-app">
        <SectionHeading
          title="Try the app"
          sub="An interactive preview, not the real app. Tap the switches, press a scene, or play an example day of schedules."
        />
        <div className="mt-10">
          <AppDemo
            launchNote={
              live
                ? undefined
                : `The Homeasy app launches with our public launch, planned for ${site.launch.label}.`
            }
          />
        </div>
      </Section>

      <Section className="pt-0 lg:pt-0">
        <SectionHeading
          title="What you can do with it"
          sub={
            live
              ? "Everything in your home, in one place."
              : "This is what we are building for launch. We will confirm the final feature list when the app goes live."
          }
        />
        <ul className="mt-10 divide-y divide-line rounded-card border border-line bg-white">
          {features.map((f) => (
            <li key={f.title} className="flex items-start gap-4 p-5 sm:items-center sm:p-6">
              <IconTile icon={f.icon} large />
              <div className="min-w-0">
                <h3 className="text-[1.1875rem] leading-snug">{f.title}</h3>
                <p className="mt-1 text-body">{f.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cloud">
        <SectionHeading
          title="Planned for later"
          sub="These are on our plan, not in the app yet. We will not promise dates until they are ready."
        />
        <div className="mt-10">
          <FeatureGrid items={PLANNED} />
        </div>
        <p className="mt-6 text-[15px] text-body">
          <Link href="/roadmap" className="link">
            See the Homeasy roadmap
          </Link>
        </p>
      </Section>

      <Section>
        <SectionHeading
          title="Your home, your data."
          sub={
            <>
              Read how we protect it in our{" "}
              <Link href="/privacy-policy" className="link">
                privacy policy
              </Link>
              .
            </>
          }
        />
      </Section>

      <Related paths={["/how-it-works", "/products", "/faq"]} />

      <CtaBand
        title="Get the app with your installation"
        body="Book a free home survey. We set up the app for your family when your modules are installed."
      />
    </>
  );
}
