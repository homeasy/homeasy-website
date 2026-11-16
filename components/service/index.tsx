/**
 * Shared blocks for the service pages (how it works, installation, FAQ, guarantee, warranty).
 * Server components. Time and guarantee promises are gated by USP flags (PRD §5.7, R13).
 */
import type { ComponentType, ReactNode } from "react";
import { Cable, Gauge, Info, Ruler, ShieldCheck, ToggleRight, Wifi } from "lucide-react";
import { usp } from "@/lib/flags";
import { StatusBadge } from "@/components/ui";

type IconType = ComponentType<{ size?: number; className?: string; "aria-hidden"?: boolean }>;

/** Which promises are live. Everything else shows softer, truthful wording. */
export const live = {
  report: usp("U1"),
  reply: usp("U2"),
  sameLook: usp("U3"),
  fixedPrice: usp("U4"),
  visit: usp("U5"),
};

/** `hours` is the published working hours, e.g. "9 am – 9 pm, every day": pass `(await getSite()).contact.hours`. */
export const replyLine = (hours: string) =>
  live.reply
    ? `We reply on WhatsApp within 30 minutes during working hours (${hours}).`
    : `We reply on WhatsApp during working hours, ${hours}.`;

export const visitLine = live.visit
  ? "In Patna, a technician visits within 24 hours."
  : "If a visit is needed, we arrange a technician as soon as we can.";

export const PILOT_LABEL = "Launching after our Patna pilot";

/** Badge for a gated promise: live, or launching after the pilot. */
export function PromiseStatus({ on, liveLabel = "Live" }: { on: boolean; liveLabel?: string }) {
  return on ? (
    <StatusBadge status="available" label={liveLabel} />
  ) : (
    <StatusBadge status="coming-soon" label={PILOT_LABEL} />
  );
}

/** Icon + title + text rows in a responsive grid. */
export function IconList({
  items,
  columns = 2,
}: {
  items: { icon: IconType; title: string; body?: ReactNode }[];
  columns?: 2 | 3;
}) {
  return (
    <ul className={`grid gap-4 sm:grid-cols-2 ${columns === 3 ? "lg:grid-cols-3" : ""}`}>
      {items.map(({ icon: Icon, title, body }) => (
        <li key={title} className="flex min-w-0 gap-4 rounded-card border border-line bg-white p-5">
          <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-tint text-ink">
            <Icon size={22} aria-hidden />
          </span>
          <div className="min-w-0">
            <h3 className="text-[17px] font-semibold leading-snug">{title}</h3>
            {body && <p className="mt-1 text-[15px] text-body">{body}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

/** What the technician checks in the free survey (PRD §8.2, §26.1). */
export function SurveyChecklist() {
  return (
    <IconList
      columns={3}
      items={[
        { icon: Ruler, title: "Switchbox depth", body: "Is there room for a module?" },
        { icon: Cable, title: "Neutral wire", body: "Some modules need it. We check every box." },
        { icon: Gauge, title: "Appliance loads", body: "Fans, geysers, ACs and motors need the right module." },
        { icon: Wifi, title: "Wi-Fi signal", body: "In every room you want to control." },
        { icon: ShieldCheck, title: "Wiring condition", body: "Any safety issues are reported to you first." },
        { icon: ToggleRight, title: "Switch types", body: "We note two-way switches and fan regulators on each board." },
      ]}
    />
  );
}

/** Flat info callout on blue tint. */
export function Callout({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="flex gap-4 rounded-card bg-tint p-5 text-ink sm:p-6">
      <Info size={24} aria-hidden className="mt-0.5 shrink-0" />
      <div className="min-w-0">
        {title && <p className="font-semibold">{title}</p>}
        <div className={`text-body ${title ? "mt-1" : ""}`}>{children}</div>
      </div>
    </div>
  );
}

/** Plain bulleted list with consistent spacing. */
export function BulletList({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-body marker:text-slate">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Service levels in one strip (PRD §5.7): WhatsApp reply, service visit, warranty. Time promises show their
 * numbers only when the USP flag is on; otherwise the softer, truthful wording.
 */
export function ServiceLevelsStrip({ hours, className = "" }: { hours: string; className?: string }) {
  const items = [
    { title: live.reply ? "Reply within 30 minutes" : "WhatsApp replies", body: live.reply ? `On WhatsApp, during working hours (${hours}).` : `On WhatsApp during working hours, ${hours}.` },
    { title: live.visit ? "Visit within 24 hours" : "Local technicians", body: live.visit ? "In Patna, counted from when you report the problem." : "If a visit is needed, we arrange a technician as soon as we can." },
    { title: "3-year warranty", body: "On Homeasy modules, from your installation date." },
  ];
  return (
    <ul className={`grid gap-4 md:grid-cols-3 ${className}`}>
      {items.map((i) => (
        <li key={i.title} className="min-w-0 rounded-card border border-line bg-white p-5">
          <p className="text-[1.0625rem] font-semibold text-ink">{i.title}</p>
          <p className="mt-1 text-[15px] text-body">{i.body}</p>
        </li>
      ))}
    </ul>
  );
}
