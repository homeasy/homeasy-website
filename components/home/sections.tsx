/**
 * Homepage sections below the hero (PRD §8.1). Copy lives in data/home.json so it can be edited without code.
 * Promises that depend on operations (30-min reply, "Same look", 24-h visit) appear only when their
 * USP flag is on (PRD R13, F27).
 */
import Image from "next/image";
import Link from "next/link";
import {
  AirVent,
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ClipboardCheck,
  Droplets,
  Fan,
  Landmark,
  Lightbulb,
  MapPin,
  Moon,
  PencilRuler,
  ShieldCheck,
  ShowerHead,
  Sparkles,
  Timer,
  ToggleRight,
  Wrench,
  X,
  type LucideIcon,
} from "lucide-react";
import home from "@/data/home.json";
import { flags, usp } from "@/lib/flags";
import { site, whatsappHref } from "@/lib/site";
import { Card, CtaBand, Faq, Section, SectionHeading, StatusBadge, Steps, type Status } from "@/components/ui";
import { reveal } from "@/components/ui/reveal";
import { PincodeChecker } from "./PincodeChecker";
import { SwitchSelector } from "./SwitchSelector";

const ICONS: Record<string, LucideIcon> = {
  light: Lightbulb,
  fan: Fan,
  geyser: ShowerHead,
  ac: AirVent,
  motor: Droplets,
  night: Moon,
  survey: ClipboardCheck,
  photo: Camera,
  install: Wrench,
  warranty: ShieldCheck,
  local: MapPin,
  switch: ToggleRight,
  designers: PencilRuler,
  builders: Building2,
  electricians: Wrench,
  government: Landmark,
};

function IconTile({ name, onDark = false }: { name: string; onDark?: boolean }) {
  const Icon = ICONS[name] ?? Sparkles;
  return (
    <span
      className={`inline-flex size-11 items-center justify-center rounded-xl transition-colors duration-200 ${
        onDark ? "bg-navy-700 text-amber group-hover:bg-amber group-hover:text-navy" : "bg-tint text-blue-800 group-hover:bg-blue group-hover:text-navy"
      }`}
    >
      <Icon size={22} aria-hidden="true" />
    </span>
  );
}

export function Problem() {
  const p = home.problem;
  return (
    <Section>
      <SectionHeading title={p.title} sub={p.body} />
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {p.options.map((o, i) => (
          <li
            key={o.title}
            {...reveal(i)}
            className={`fx-card rounded-card border p-6 ${o.good ? "border-blue bg-tint" : "border-line bg-white"}`}
          >
            <h3 className="text-[1.25rem] leading-snug">{o.title}</h3>
            <ul className="mt-4 space-y-2">
              {o.points.map((pt) => (
                <li key={pt} className="flex items-start gap-2 text-body">
                  {o.good ? (
                    <Check size={18} aria-hidden="true" className="mt-1 shrink-0 text-success" />
                  ) : (
                    <X size={18} aria-hidden="true" className="mt-1 shrink-0 text-slate" />
                  )}
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function HowItWorks() {
  const h = home.how;
  return (
    <Section tone="navy">
      <SectionHeading title={h.title} sub={h.sub} onDark />
      <div className="mt-10">
        <Steps items={h.steps} onDark />
      </div>
      <Link href="/how-it-works" className="mt-8 inline-flex min-h-11 items-center gap-2 font-semibold text-blue-300 no-underline hover:underline">
        See the full process <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </Section>
  );
}

export function Appliances() {
  const a = home.appliances;
  return (
    <Section tone="cloud">
      <SectionHeading title={a.title} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {a.items.map((it, i) => (
          <li key={it.name} {...reveal(i)} className="fx-card group rounded-card border border-line bg-white p-6">
            <div className="flex items-start justify-between gap-3">
              <IconTile name={it.icon} />
              {it.status && <StatusBadge status={it.status as Status} />}
            </div>
            <h3 className="mt-4 text-[1.1875rem]">{it.name}</h3>
            <p className="mt-1 text-body">{it.benefit}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-slate">{a.note}</p>
    </Section>
  );
}

export function Process() {
  const p = home.process;
  return (
    <Section>
      <SectionHeading title={p.title} />
      <ol className="mt-10 grid gap-x-10 gap-y-0 lg:grid-cols-5 lg:gap-6">
        {p.steps.map((s, i) => (
          <li key={s.title} {...reveal(i)} className="relative flex gap-4 pb-8 lg:block lg:pb-0">
            {/* connector line: vertical on mobile, hidden on desktop */}
            {i < p.steps.length - 1 && (
              <span aria-hidden="true" className="absolute left-[17px] top-9 h-[calc(100%-36px)] w-px bg-line lg:hidden" />
            )}
            <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-amber text-[15px] font-bold text-navy">
              {i + 1}
            </span>
            <div className="lg:mt-4">
              <h3 className="text-[1.125rem] leading-snug">{s.title}</h3>
              <p className="mt-1 text-[15px] text-body">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <Link href="/book-survey" className="btn btn-primary mt-8 min-h-12 px-6">
        Book a free home survey
      </Link>
    </Section>
  );
}

export function PromiseSection() {
  const p = home.promise;
  const photoHref = whatsappHref("photo");
  const cards = p.cards.map((c) => ({ ...c }));
  if (usp("U2")) {
    const photo = cards.find((c) => c.icon === "photo");
    if (photo) photo.body = "Not sure? Send a photo of your switchboard. We reply within 30 minutes during working hours.";
  }
  const extra: { Icon: LucideIcon; title: string; body: string; href: string; cta: string }[] = [];
  if (usp("U3"))
    extra.push({
      Icon: BadgeCheck,
      title: "“Same look” guarantee",
      body: "Your switchboard looks the same afterwards and we leave your home clean, or we redo it free.",
      href: "/guarantee",
      cta: "Guarantee terms",
    });
  if (usp("U5"))
    extra.push({
      Icon: Timer,
      title: "Technician within 24 hours",
      body: "In Patna, a Homeasy technician visits within 24 hours of your complaint.",
      href: "/guarantee",
      cta: "Service details",
    });

  return (
    <Section tone="navy">
      <SectionHeading title={p.title} onDark />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c, i) => {
          const external = c.href.startsWith("whatsapp:");
          const href = external ? photoHref : c.href;
          const inner = (
            <>
              <IconTile name={c.icon} onDark />
              <h3 className="mt-4 text-[1.1875rem] text-white">{c.title}</h3>
              <p className="mt-1 text-[15px] text-mist">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-300">
                {c.cta} <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </>
          );
          const cls = "fx-card fx-card-dark group block h-full rounded-card border border-navy-700 bg-navy-800 p-6 no-underline";
          return (
            <li key={c.title} {...reveal(i)}>
              {external ? (
                <a href={href} target="_blank" rel="noopener noreferrer" className={cls}>
                  {inner}
                </a>
              ) : (
                <Link href={href} className={cls}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
        {extra.map((c, j) => (
          <li key={c.title} {...reveal(cards.length + j)}>
            <Link href={c.href} className="fx-card fx-card-dark group block h-full rounded-card border border-navy-700 bg-navy-800 p-6 no-underline">
              <span className="inline-flex size-11 items-center justify-center rounded-xl bg-navy-700 text-amber transition-colors duration-200 group-hover:bg-amber group-hover:text-navy">
                <c.Icon size={22} aria-hidden="true" />
              </span>
              <h3 className="mt-4 text-[1.1875rem] text-white">{c.title}</h3>
              <p className="mt-1 text-[15px] text-mist">{c.body}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-semibold text-blue-300">
                {c.cta} <ArrowRight size={16} aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <p className="mt-8 text-sm text-mist">{p.line}</p>
    </Section>
  );
}

export function Switches() {
  const s = home.switches;
  return (
    <Section tone="cloud">
      <SectionHeading title={s.title} sub="Tap the brand on your switchboard." />
      <div className="mt-8">
        <SwitchSelector brands={s.brands} result={s.result} note={s.note} photoHref={whatsappHref("photo")} />
      </div>
    </Section>
  );
}

export function Parents() {
  const p = home.parents;
  return (
    <Section>
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading title={p.title} sub={p.body} />
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-3">
            {p.badges.map((b) => (
              <li key={b.label} className="flex items-center gap-2 text-[15px] text-body">
                {b.label} <StatusBadge status={b.status as Status} />
              </li>
            ))}
          </ul>
          <Link href="/book-survey" className="btn btn-primary mt-8 min-h-12 px-6">
            {p.cta}
          </Link>
        </div>
        {/* app-style card: an illustration of the idea, not a screenshot of a released app */}
        <div className="min-w-0">
          <div className="on-dark mx-auto max-w-[360px] rounded-[28px] border border-navy-700 bg-navy p-5 text-white">
            <div className="flex items-center justify-between">
              <p className="text-[15px] font-semibold">Maa-Papa&apos;s home, Patna</p>
              <StatusBadge status="coming-soon" label="Preview" />
            </div>
            <ul className="mt-4 space-y-2">
              {[
                { n: "Geyser", s: "Off", on: false },
                { n: "Night light", s: "On", on: true },
                { n: "Bedroom fan", s: "On", on: true },
              ].map((r) => (
                <li key={r.n} className="flex min-h-12 items-center justify-between rounded-xl bg-navy-800 px-4">
                  <span className="text-[15px]">{r.n}</span>
                  <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${r.on ? "bg-amber text-navy" : "bg-navy-700 text-mist"}`}>
                    {r.s}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function IndianHomes() {
  const d = home.indian;
  return (
    <Section tone="cloud">
      <SectionHeading title={d.title} />
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {d.tiles.map((t, i) => (
          <li key={t.title} {...reveal(i)}>
            <Card className="h-full">
              <StatusBadge status={t.status as Status} />
              <h3 className="mt-4 text-[1.1875rem]">{t.title}</h3>
              <p className="mt-1 text-body">{t.body}</p>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function Packages() {
  const p = home.packages;
  return (
    <Section>
      <SectionHeading title={p.title} sub={p.note} />
      <ul className="mt-10 grid gap-4 lg:grid-cols-3">
        {p.items.map((it, i) => (
          <li key={it.name} {...reveal(i)}>
            <Card className="flex h-full flex-col">
              <h3 className="text-[1.25rem]">{it.name}</h3>
              <p className="mt-1 text-body">{it.body}</p>
              <p className="mt-6 text-[17px] font-semibold text-ink">
                {it.price ?? (flags.SHOW_PRICES ? "Price on request" : "Price after free survey")}
              </p>
            </Card>
          </li>
        ))}
      </ul>
      <Link href="/pricing" className="link mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold">
        See packages <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </Section>
  );
}

export function AppSection() {
  const a = home.app;
  return (
    <Section tone="navy">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="min-w-0">
          <SectionHeading title={a.title} sub={a.body} onDark />
          <div className="mt-6 flex items-center gap-3 text-[15px] text-mist">
            Android and iOS {!flags.APP_LIVE && <StatusBadge status="coming-soon" />}
          </div>
          <Link href="/app" className="mt-6 inline-flex min-h-11 items-center gap-2 font-semibold text-blue-300 no-underline hover:underline">
            Explore the app <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <ul className="grid min-w-0 gap-3 sm:grid-cols-2">
          {a.features.map((f, i) => (
            <li key={f} {...reveal(i)} className="flex min-h-14 items-center gap-3 rounded-card border border-navy-700 bg-navy-800 px-5 text-[15px] font-semibold">
              <Check size={18} aria-hidden="true" className="shrink-0 text-amber" />
              {f}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

export function Business() {
  const b = home.business;
  return (
    <Section>
      <SectionHeading title={b.title} />
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {b.cards.map((c, i) => (
          <li key={c.href} {...reveal(i)}>
            <Link href={c.href} className="fx-card group block h-full rounded-card border border-line bg-white p-6 no-underline">
              <IconTile name={c.icon} />
              <h3 className="mt-4 text-[1.1875rem] text-ink">{c.title}</h3>
              <p className="mt-1 text-[15px] text-body">{c.body}</p>
            </Link>
          </li>
        ))}
      </ul>
    </Section>
  );
}

export function ServiceArea() {
  const a = home.area;
  return (
    <Section tone="tint" id="service-area">
      <SectionHeading title={a.title} sub={a.body} />
      <div className="mt-8">
        <PincodeChecker whatsappHref={whatsappHref("general")} />
      </div>
    </Section>
  );
}

export function FounderNote() {
  return (
    <Section>
      <figure className="mx-auto flex max-w-[860px] flex-col items-start gap-6 sm:flex-row sm:items-center sm:gap-8">
        <Image
          src={site.founder.photo}
          alt={`${site.founder.name}, ${site.founder.role} of Homeasy`}
          width={144}
          height={144}
          className="size-28 shrink-0 rounded-full object-cover sm:size-36"
        />
        <div className="min-w-0">
          <blockquote className="text-[1.25rem] leading-relaxed text-ink">&ldquo;{home.founder.quote}&rdquo;</blockquote>
          <figcaption className="mt-4 text-[15px] text-body">
            <span className="font-semibold text-ink">{site.founder.name}</span>, {site.founder.role} ·{" "}
            {site.shortLegalName} · Incorporated {site.foundedYear} · {site.address.city}
          </figcaption>
        </div>
      </figure>
    </Section>
  );
}

export function HomeFaq() {
  return (
    <Section tone="cloud">
      <div className="mx-auto max-w-[820px]">
        <SectionHeading title="Questions people ask first" />
        <div className="mt-8">
          <Faq items={home.faq} />
        </div>
        <Link href="/faq" className="link mt-6 inline-flex min-h-11 items-center gap-1.5 font-semibold">
          All questions <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </Section>
  );
}

export { CtaBand };
