import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
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
import { Card, PageHero, Section, SectionHeading } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { reveal } from "@/components/ui/reveal";
import { LinkedInIcon } from "@/components/icons/brand-icons";
import { getSite } from "@/lib/site-live";

const pageMeta: Metadata = {
  title: "About Homeasy — Home Automation Company in Patna",
  description:
    "Homeasy Automation Pvt. Ltd. is a home automation company in Patna, founded in 2025, that makes traditional homes smart without rewiring.",
};

export function generateMetadata() {
  return seoMetadata("/about", pageMeta);
}

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
  { when: "Now", title: "Early access", body: "We are inviting homes to our pilot. Everyone on the early-access list gets a special offer." },
  { when: "Next", title: "Pilot homes in Patna", body: "First installations with real families, so every promise we publish is one we have kept." },
  { when: "January 2027 (planned)", title: "Patna launch", body: "Surveys and installations open to more homes." },
];

const WORK_WITH = [
  { icon: Home, title: "Homeowners", body: "Apartments and independent houses.", href: "/how-it-works" },
  { icon: PencilRuler, title: "Interior designers", body: "Smart control behind the switchboards your clients chose.", href: "/solutions/designers" },
  { icon: Building2, title: "Builders", body: "Smart-ready flats, offices and shops.", href: "/solutions/builders" },
  { icon: Wrench, title: "Electricians", body: "Training and installation work with Homeasy.", href: "/solutions/electricians" },
  { icon: Landmark, title: "Government", body: "Central control for public buildings.", href: "/solutions/government" },
  { icon: Handshake, title: "Investors", body: "Our model, stage and company facts.", href: "/investors" },
];

/**
 * PRD §8.8, reworked 17 Nov 2026 (founder): story beside the founder's quote and photo, values folded into
 * "What drives us", an animated journey, a fuller founder section with the company's legal facts as a small card
 * (the separate "Company facts" section went: the same facts are in the footer of every page).
 * Recognition is hidden until there are confirmed items; GST is omitted until provided.
 */
export default async function AboutPage() {
  const site = await getSite();
  const facts: { label: string; value: string }[] = [
    { label: "Legal name", value: site.legalName },
    { label: "CIN", value: site.cin },
    { label: "Incorporated", value: String(site.foundedYear) },
    { label: "Registered office", value: site.fullAddress },
  ];

  return (
    <>
      <BreadcrumbJsonLd path="/about" />
      <PageHero
        eyebrow="About Homeasy"
        title="Making Indian homes smart — the easy way."
        sub="Homeasy is a home automation company in Patna converting traditional homes into smart homes, without changing switches or rewiring."
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free survey
        </Link>
        <Link href="/solutions" className="btn btn-outline min-h-12 px-6">
          Partner with us
        </Link>
      </PageHero>

      <Section>
        <SectionHeading title="Our story" />
        {/* both columns start on the same line and end on the same line */}
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.35fr_1fr] lg:items-stretch lg:gap-14">
          <div {...reveal()} className="min-w-0 space-y-4 text-lg text-body">
            <p>Most Indian families live in homes built long before smart homes existed.</p>
            <p>
              Going smart usually means new switchboards or fresh wiring. That is costly and dusty, and it changes a home
              people already like.
            </p>
            <p>
              Modules sold online are cheaper, but they leave the family to work out the wiring alone. When something
              stops working, there is no one to call.
            </p>
            <p>
              We started Homeasy in {site.foundedYear} to close that gap. Small modules go inside the switchboxes a home
              already has, installed and supported by our own team.
            </p>
            <p className="font-semibold text-ink">The switches stay. The walls stay. The home simply does more.</p>
          </div>
          <figure {...reveal(1)} className="on-dark flex min-w-0 flex-col justify-between gap-8 rounded-card bg-navy p-6 text-white lg:p-8">
            <blockquote>
              <span aria-hidden="true" className="block h-8 text-[4rem] font-bold leading-none text-amber">&ldquo;</span>
              <p className="mt-4 text-h4 font-semibold leading-snug">
                Most families want a smarter home. They just don&apos;t want broken walls or new switchboards.
              </p>
            </blockquote>
            <figcaption className="flex items-center gap-4 border-t border-navy-700 pt-6">
              <Image
                src={site.founder.photo}
                alt={`${site.founder.name}, ${site.founder.role} of Homeasy`}
                width={88}
                height={88}
                className="size-[88px] shrink-0 rounded-2xl object-cover"
              />
              <span className="min-w-0">
                <span className="block text-[1.0625rem] font-semibold text-white">{site.founder.name}</span>
                <span className="block text-[15px] text-mist">{site.founder.role}, Homeasy</span>
              </span>
            </figcaption>
          </figure>
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
        <h3 className="mt-12 text-[13px] font-semibold uppercase tracking-[0.1em] text-body">What we value</h3>
        <ul className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-5">
          {VALUES.map(({ icon: Icon, title, body }, i) => (
            <li key={title} {...reveal(i)} className="min-w-0 border-t border-line pt-4">
              <p className="flex items-center gap-2 font-semibold text-ink">
                <Icon aria-hidden="true" className="size-5 shrink-0 text-link" strokeWidth={1.75} /> {title}
              </p>
              <p className="mt-1.5 text-[15px] text-body">{body}</p>
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
        <div className="grid gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
          <div className="min-w-0 lg:sticky lg:top-28 lg:self-start">
            <SectionHeading title="Our journey so far" sub="We are a young company, and we would rather show an honest short timeline than a long one." />
            <Link href="/roadmap" className="link mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold">
              See what&apos;s next on our roadmap <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>
          {/* the amber line fills as you scroll, each dot pops in with its step, and "Now" pulses (app/globals.css) */}
          <ol className="journey relative min-w-0">
            <span aria-hidden="true" className="journey-track">
              <span className="journey-fill" />
            </span>
            {JOURNEY.map((j, i) => {
              const state = j.when === "Now" ? "now" : i > JOURNEY.findIndex((x) => x.when === "Now") ? "ahead" : "done";
              return (
                <li key={j.title} {...reveal(i)} className="relative flex gap-5 pb-9 last:pb-0">
                  <span
                    aria-hidden="true"
                    className={`fx-pop relative z-[1] mt-1.5 size-4 shrink-0 rounded-full border-2 border-amber ${state === "ahead" ? "bg-white" : "bg-amber"} ${state === "now" ? "journey-now" : ""}`}
                  />
                  <div className="min-w-0">
                    <p className={`text-[13px] font-semibold uppercase tracking-[0.1em] ${state === "now" ? "text-amber-700" : "text-slate"}`}>
                      {j.when}
                      {state === "now" && <span className="sr-only"> (where we are today)</span>}
                    </p>
                    <h3 className="mt-1 text-[1.1875rem] leading-snug">{j.title}</h3>
                    <p className="mt-1 text-body">{j.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      <Section tone="cloud">
        <SectionHeading title="The founder" />
        <div className="mt-10 grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start lg:gap-12">
          <div {...reveal()} className="flex min-w-0 flex-col gap-6 sm:flex-row sm:items-start sm:gap-8">
            <Image
              src={site.founder.photo}
              alt={`${site.founder.name}, ${site.founder.role} of Homeasy`}
              width={200}
              height={200}
              className="size-40 shrink-0 rounded-card border border-line object-cover sm:size-[200px]"
            />
            <div className="min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h3 className="text-h4">{site.founder.name}</h3>
                  <p className="mt-1 text-slate">{site.founder.role}</p>
                </div>
                {site.founder.linkedin && (
                  <a
                    href={site.founder.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${site.founder.name} on LinkedIn (opens in a new tab)`}
                    title="LinkedIn"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-button border border-line bg-white text-link transition-colors hover:border-navy hover:text-navy"
                  >
                    <LinkedInIcon size={22} />
                  </a>
                )}
              </div>
              <div className="mt-4 space-y-3 text-body">
                <p>
                  Vishwjeet brings 13+ years of personal experience in interior design, automation and smart-home
                  integration.
                </p>
                <p>
                  That background covers both sides of the job: how a home is designed and finished, and how its
                  electrical and automation systems are put together.
                </p>
                <p>
                  He started Homeasy in Patna in {site.foundedYear} around one idea: a home should become smart without
                  breaking walls or changing the switchboards a family already has.
                </p>
                <p>
                  He also set the rule this website follows: publish only what is true today, and mark everything else
                  as planned.
                </p>
              </div>
              <ul className="mt-5 flex flex-wrap gap-2 text-[15px]">
                <li className="rounded-full border border-line bg-white px-3 py-1.5 text-body">B.Tech, MAIT Rohini (GGSIPU)</li>
                <li className="rounded-full border border-line bg-white px-3 py-1.5 text-body">
                  Diploma in Mechanical Engineering, Government Polytechnic Purnea
                </li>
              </ul>
            </div>
          </div>

          <Card className="min-w-0">
            <h3 className="text-[13px] font-semibold uppercase tracking-[0.1em] text-body">The company</h3>
            <dl className="mt-3 divide-y divide-line">
              {facts.map((f) => (
                <div key={f.label} className="py-3 last:pb-0">
                  <dt className="text-[14px] text-slate">{f.label}</dt>
                  <dd className="mt-0.5 min-w-0 break-words font-semibold text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 border-t border-line pt-4 text-[15px] text-body">We&apos;re a small, focused team building Homeasy from Patna.</p>
          </Card>
        </div>
      </Section>

      <Section>
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

      <Related paths={["/how-it-works", "/careers", "/contact"]} />

      <CtaBand />
    </>
  );
}
