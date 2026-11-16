import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  Eye,
  Feather,
  Handshake,
  Headset,
  Home,
  Landmark,
  MapPin,
  PencilRuler,
  ShieldCheck,
  Smartphone,
  Target,
  ToggleRight,
  Wrench,
  Zap,
} from "lucide-react";
import { Card, CtaBand, PageHero, Section, SectionHeading } from "@/components/ui";
import { reveal } from "@/components/ui/reveal";
import { LinkedInIcon } from "@/components/icons/brand-icons";
import { fullAddress, mailHref, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Homeasy — Smart Home Retrofit Company, Patna",
  description:
    "Homeasy Automation Pvt. Ltd. (founded 2025, Patna) makes traditional homes smart without rewiring.",
};

const VALUES = [
  { icon: Feather, title: "Simplicity", body: "Smart living should be easy to buy, easy to use and easy to explain." },
  { icon: Handshake, title: "Honesty", body: "We say what is ready and what is still planned. No inflated claims." },
  { icon: ShieldCheck, title: "Safety first", body: "We check your wiring before we fit anything inside a switchbox." },
  { icon: MapPin, title: "Built for India", body: "Designed around Indian switchboxes, Indian homes and Indian families." },
  { icon: Headset, title: "Reliable support", body: "We install what we sell, and we stay reachable after installation." },
];

const PURPOSE = [
  {
    icon: Eye,
    label: "Our vision",
    text: "A country where any home can be a smart home, whatever its age, wiring or budget.",
  },
  {
    icon: Target,
    label: "Our mission",
    text: "Make every Indian home smart, safe and easy to live in, without rebuilding it.",
  },
  {
    icon: Handshake,
    label: "Our promise",
    text: "We tell you what is possible in your home before you pay, and we install what we sell.",
  },
];

const DIFFERENT = [
  { icon: ToggleRight, title: "Your switches stay", body: "Modules sit inside the existing switchbox. The switches your family knows keep working by hand." },
  { icon: Wrench, title: "Done for you", body: "We survey, install and set up the app. You don't buy parts online and hope they fit." },
  { icon: Home, title: "Made for Indian homes", body: "Fans with speed control, geysers on a schedule, older wiring and modular switchboards." },
  { icon: Smartphone, title: "One easy app", body: "Rooms, scenes and schedules in one place, shared with the whole family." },
  { icon: MapPin, title: "A local team", body: "Based in Patna and serving Bihar. You can call the people who installed your home." },
  { icon: Zap, title: "Start small", body: "Begin with one room and add more later. There is no need to do the whole home at once." },
];

const JOURNEY = [
  { when: "2025", title: "Homeasy Automation Pvt. Ltd. incorporated in Patna", body: "The company is registered with its office at Mauryalok Complex." },
  { when: "2025–2026", title: "Product research and app design", body: "We study Indian switchboxes, wiring and how families actually use their homes." },
  { when: "November 2026", title: "Retrofit-first", body: "We commit to one idea: make existing homes smart without changing switches or rewiring." },
  { when: "Next", title: "Pilot homes in Patna", body: "First installations with real families, so every promise we publish is one we have kept." },
];

const WORK_WITH = [
  { icon: Home, title: "Homeowners", body: "Apartments and independent houses.", href: "/how-it-works" },
  { icon: PencilRuler, title: "Interior designers", body: "Smart control behind the switchboards your clients chose.", href: "/solutions/designers" },
  { icon: Building2, title: "Builders", body: "Smart-ready flats, offices and shops.", href: "/solutions/builders" },
  { icon: Wrench, title: "Electricians", body: "Training and installation work with Homeasy.", href: "/solutions/electricians" },
  { icon: Landmark, title: "Government", body: "Central control for public buildings.", href: "/solutions/government" },
  { icon: Handshake, title: "Investors", body: "Our model, stage and company facts.", href: "/investors" },
];

/** PRD §8.8. Recognition is hidden until there are confirmed items; GST is omitted until provided. */
export default function AboutPage() {
  const facts: { label: string; value: ReactNode }[] = [
    { label: "Legal name", value: site.legalName },
    { label: "CIN", value: site.cin },
    { label: "Incorporated", value: String(site.foundedYear) },
    { label: "Registered office", value: fullAddress },
    {
      label: "Email",
      value: (
        <a href={mailHref} className="link">
          {site.contact.email}
        </a>
      ),
    },
  ];

  return (
    <>
      <PageHero
        eyebrow="About Homeasy"
        title="Making Indian homes smart — the easy way."
        sub="Homeasy is a Patna-based company converting traditional homes into smart homes, without changing switches or rewiring."
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free survey
        </Link>
        <Link href="/solutions" className="btn btn-outline min-h-12 px-6">
          Partner with us
        </Link>
      </PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-16">
          <div className="min-w-0">
            <SectionHeading title="Our story" />
            <div className="mt-6 max-w-[640px] space-y-4 text-lg text-body">
              <p>Most Indian families live in homes built long before smart homes existed.</p>
              <p>
                Going smart usually means new switchboards or fresh wiring. That is costly and dusty, and it changes a
                home people already like.
              </p>
              <p>
                Modules sold online are cheaper, but they leave the family to work out the wiring alone. When
                something stops working, there is no one to call.
              </p>
              <p>
                We started Homeasy in {site.foundedYear} to close that gap. Small modules go inside the switchboxes a
                home already has, installed and supported by our own team.
              </p>
              <p>The switches stay. The walls stay. The home simply does more.</p>
            </div>
          </div>
          <div className="min-w-0">
            <blockquote className="rounded-card bg-navy p-6 text-white lg:p-8">
              <p className="text-h4 font-semibold leading-snug">
                &ldquo;Most families want a smarter home. They just don&apos;t want broken walls or new
                switchboards.&rdquo;
              </p>
              <footer className="mt-4 text-[15px] text-mist">
                {site.founder.name}, {site.founder.role}
              </footer>
            </blockquote>
          </div>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What drives us" />
        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {PURPOSE.map(({ icon: Icon, label, text }, i) => (
            <li key={label} {...reveal(i)} className="min-w-0">
              <Card className="h-full">
                <Icon aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
                <h3 className="mt-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-body">{label}</h3>
                <p className="mt-2 text-h4 font-semibold leading-snug text-ink">{text}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="navy">
        <SectionHeading title="What makes Homeasy different" sub="We own the whole job, from the first survey to support." onDark />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DIFFERENT.map(({ icon: Icon, title, body }, i) => (
            <li
              key={title}
              {...reveal(i)}
              className="fx-card fx-card-dark group min-w-0 rounded-card border border-navy-700 bg-navy-800 p-6"
            >
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-navy-700 text-amber transition-colors duration-200 group-hover:bg-amber group-hover:text-navy">
                <Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[1.1875rem] text-white">{title}</h3>
              <p className="mt-1 text-[15px] text-mist">{body}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading title="Our journey so far" sub="We are a young company, and we would rather show an honest short timeline than a long one." />
        <ol className="mt-10 max-w-[760px]">
          {JOURNEY.map((j, i) => (
            <li key={j.title} {...reveal(i)} className="relative flex gap-5 pb-8 last:pb-0">
              {i < JOURNEY.length - 1 && <span aria-hidden="true" className="absolute left-[7px] top-5 h-full w-px bg-line" />}
              <span aria-hidden="true" className={`relative mt-1.5 size-[15px] shrink-0 rounded-full border-2 ${j.when === "Next" ? "border-amber bg-white" : "border-amber bg-amber"}`} />
              <div className="min-w-0">
                <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{j.when}</p>
                <h3 className="mt-1 text-[1.1875rem] leading-snug">{j.title}</h3>
                <p className="mt-1 text-body">{j.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <Link href="/roadmap" className="link mt-8 inline-flex min-h-11 items-center gap-1.5 font-semibold">
          See what&apos;s next on our roadmap <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="What we value" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map(({ icon: Icon, title, body }) => (
            <li key={title} className="min-w-0">
              <Card className="h-full">
                <Icon aria-hidden="true" className="size-6 text-link" strokeWidth={1.75} />
                <h3 className="mt-4 text-[1.1875rem] leading-snug">{title}</h3>
                <p className="mt-2 text-[15px] text-body">{body}</p>
              </Card>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading title="Founder" />
        <div className="mt-10 flex flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
          <Image
            src={site.founder.photo}
            alt={`${site.founder.name}, ${site.founder.role} of Homeasy`}
            width={160}
            height={160}
            className="size-40 shrink-0 rounded-full border border-line object-cover"
          />
          <div className="min-w-0 max-w-[640px]">
            <h3 className="text-h4">{site.founder.name}</h3>
            <p className="mt-1 text-slate">{site.founder.role}</p>
            <p className="mt-4 text-body">
              Vishwjeet brings 13+ years of personal experience in interior design, automation and smart-home
              integration.
            </p>
            <ul className="mt-4 list-disc space-y-1 pl-5 text-body">
              <li>B.Tech, MAIT Rohini (GGSIPU)</li>
              <li>Diploma in Mechanical Engineering, Government Polytechnic Purnea</li>
            </ul>
            <a
              href={site.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="link mt-4 inline-flex min-h-11 items-center gap-2"
            >
              <LinkedInIcon size={18} /> Homeasy on LinkedIn
            </a>
            <p className="mt-6 border-t border-line pt-6 text-body">
              We&apos;re a small, focused team building Homeasy from Patna.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="Who we work with" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {WORK_WITH.map(({ icon: Icon, title, body, href }, i) => (
            <li key={title} {...reveal(i)} className="min-w-0">
              <Link href={href} className="fx-card group block h-full rounded-card border border-line bg-white p-6 no-underline">
                <span className="inline-flex size-11 items-center justify-center rounded-xl bg-tint text-blue-800 transition-colors duration-200 group-hover:bg-blue group-hover:text-navy">
                  <Icon size={22} aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-[1.1875rem] text-ink">{title}</h3>
                <p className="mt-1 text-[15px] text-body">{body}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <SectionHeading title="Company facts" />
        <Card className="mt-10 max-w-[720px]">
          <dl className="divide-y divide-line">
            {facts.map((f) => (
              <div key={f.label} className="grid gap-1 py-4 first:pt-0 last:pb-0 sm:grid-cols-[180px_1fr] sm:gap-6">
                <dt className="text-[15px] text-slate">{f.label}</dt>
                <dd className="min-w-0 break-words font-semibold text-ink">{f.value}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </Section>

      <CtaBand />
    </>
  );
}
