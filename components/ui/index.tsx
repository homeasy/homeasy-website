/**
 * Shared page building blocks (server components). Flat brand style: no shadows, glows or gradients.
 * Import from "@/components/ui".
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { whatsappHref } from "@/lib/site";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { reveal } from "./reveal";

type Tone = "white" | "cloud" | "navy" | "tint";
const TONES: Record<Tone, string> = {
  white: "bg-white text-ink",
  cloud: "bg-cloud text-ink",
  tint: "bg-tint text-ink",
  navy: "on-dark bg-navy text-white",
};

/** Full-width band with the standard container and vertical rhythm (64 px mobile / 112 px desktop). */
export function Section({
  tone = "white",
  id,
  className = "",
  children,
}: {
  tone?: Tone;
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`${TONES[tone]} py-16 lg:py-28 ${className}`}>
      <div className="container-page">{children}</div>
    </section>
  );
}

/** H2 + optional intro. `onDark` switches the intro colour for navy sections. */
export function SectionHeading({
  title,
  sub,
  onDark = false,
  center = false,
  as: Tag = "h2",
}: {
  title: ReactNode;
  sub?: ReactNode;
  onDark?: boolean;
  center?: boolean;
  as?: "h2" | "h3";
}) {
  return (
    <div {...reveal()} className={`max-w-[720px] ${center ? "mx-auto text-center" : ""}`}>
      <Tag className={`${Tag === "h2" ? "text-h2" : "text-h3"} leading-[1.15]`}>{title}</Tag>
      {sub && <p className={`mt-4 text-lg ${onDark ? "text-mist" : "text-body"}`}>{sub}</p>}
    </div>
  );
}

/** Top-of-page hero for inner pages: one H1 per page. */
export function PageHero({
  eyebrow,
  title,
  sub,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  sub?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <section className="bg-cloud">
      <div className="container-page py-14 lg:py-24">
        {eyebrow && <p className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{eyebrow}</p>}
        <h1 className="mt-3 max-w-[820px] text-h1 leading-[1.1]">{title}</h1>
        {sub && <p className="mt-5 max-w-[720px] text-lg text-body">{sub}</p>}
        {children && <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">{children}</div>}
      </div>
    </section>
  );
}

export type Status = "available" | "coming-soon" | "planned";
const BADGE: Record<Status, { label: string; cls: string }> = {
  available: { label: "Available", cls: "bg-[var(--badge-available-bg)] text-[var(--badge-available-text)]" },
  "coming-soon": { label: "Coming soon", cls: "bg-[var(--badge-soon-bg)] text-[var(--badge-soon-text)]" },
  planned: { label: "Planned", cls: "bg-[var(--badge-planned-bg)] text-[var(--badge-planned-text)]" },
};

/** Honesty rule R1: anything not launched carries this badge. */
export function StatusBadge({ status, label }: { status: Status; label?: string }) {
  const b = BADGE[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold ${b.cls}`}>
      {label ?? b.label}
    </span>
  );
}

/** White card with the standard 1 px border and 16 px radius. */
export function Card({ className = "", children }: { className?: string; children: ReactNode }) {
  return <div className={`fx-card rounded-card border border-line bg-white p-6 ${className}`}>{children}</div>;
}

/** Numbered steps. Renders as an ordered list. */
export function Steps({ items, onDark = false }: { items: { title: string; body: ReactNode }[]; onDark?: boolean }) {
  // columns follow the number of steps so a row is never left with an empty slot
  const lg = items.length === 5 ? "lg:grid-cols-5" : items.length % 3 === 0 ? "lg:grid-cols-3" : "lg:grid-cols-4";
  const odd = items.length % 2 === 1;
  return (
    <ol className={`grid gap-6 sm:grid-cols-2 ${lg}`}>
      {items.map((s, i) => (
        <li
          key={s.title}
          {...reveal(i)}
          className={`fx-card rounded-card border p-6 ${odd ? "sm:last:col-span-2 lg:last:col-span-1" : ""} ${
            onDark ? "fx-card-dark border-navy-700 bg-navy-800" : "border-line bg-white"
          }`}
        >
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-amber text-[15px] font-bold text-navy">
            {i + 1}
          </span>
          <h3 className="mt-4 text-[1.1875rem] leading-snug">{s.title}</h3>
          <p className={`mt-2 text-[15px] ${onDark ? "text-mist" : "text-body"}`}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}

/** FAQ accordion built on native <details>: keyboard accessible with no JavaScript. */
export function Faq({ items }: { items: { q: string; a: ReactNode }[] }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-white">
      {items.map((f) => (
        <details key={f.q} className="group px-5">
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 text-[17px] font-semibold">
            {f.q}
            <span aria-hidden="true" className="text-xl text-slate transition-transform group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="pb-5 text-body">{f.a}</div>
        </details>
      ))}
    </div>
  );
}

/** Closing call-to-action band: Book a free home survey + WhatsApp. */
export function CtaBand({
  title = "Ready to make your home smart?",
  body = "Book a free home survey. We'll check your switchboxes and show you what's possible.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <Section tone="navy">
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-[640px]">
          <h2 className="text-h2 leading-[1.15]">{title}</h2>
          <p className="mt-3 text-lg text-mist">{body}</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link href="/book-survey" className="btn btn-primary min-h-12 whitespace-nowrap px-6">
            Book a free home survey
          </Link>
          <a
            href={whatsappHref("general")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-on-dark min-h-12 whitespace-nowrap"
          >
            <WhatsAppIcon size={18} /> WhatsApp us
          </a>
        </div>
      </div>
    </Section>
  );
}
