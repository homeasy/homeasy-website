import type { Metadata } from "next";
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
import { CtaBand, PageHero, Section, SectionHeading, StatusBadge } from "@/components/ui";
import { FeatureGrid, IconTile, type Feature } from "@/components/catalog";
import { flags, usp } from "@/lib/flags";

export const metadata: Metadata = {
  title: "Homeasy App — Control Your Whole Home",
  description: "Rooms, scenes, schedules and family sharing. Free for every Homeasy customer.",
};

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
      <PageHero
        eyebrow="The Homeasy app"
        title="One easy app for your whole home."
        sub={
          live
            ? "Free for every Homeasy customer, on Android and iOS. We set it up for you at installation."
            : "Free for every Homeasy customer. Android and iOS versions are coming soon."
        }
      >
        {/* Store badges go here once APP_LIVE=true and the store links exist. */}
        {!live && (
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge status="coming-soon" />
            <span className="text-[15px] text-body">Coming soon with your installation.</span>
          </div>
        )}
      </PageHero>

      <Section>
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

      <CtaBand
        title="Get the app with your installation"
        body="Book a free home survey. We set up the app for your family when your modules are installed."
      />
    </>
  );
}
