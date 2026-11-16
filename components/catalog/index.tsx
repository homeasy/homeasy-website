/**
 * Shared blocks for the catalogue pages (products, pricing, app, solutions).
 * Server components, flat brand style. Built on the kit in "@/components/ui".
 */
import type { ReactNode } from "react";
import { Check, type LucideIcon } from "lucide-react";
import { Card, StatusBadge, type Status } from "@/components/ui";

/** Neutral square icon tile, used where no product image or screenshot exists yet. */
export function IconTile({ icon: Icon, large = false }: { icon: LucideIcon; large?: boolean }) {
  return (
    <span
      className={`fx-pop inline-flex shrink-0 items-center justify-center rounded-xl bg-tint text-navy ${large ? "size-14" : "size-11"}`}
    >
      <Icon aria-hidden="true" size={large ? 28 : 22} strokeWidth={1.75} />
    </span>
  );
}

export type Feature = { icon: LucideIcon; title: string; body?: ReactNode; status?: Status };

const COLS = {
  2: "sm:grid-cols-2",
  3: "sm:grid-cols-2 lg:grid-cols-3",
  4: "sm:grid-cols-2 lg:grid-cols-4",
} as const;

/** Grid of icon + title + line cards. One column on phones. */
export function FeatureGrid({ items, cols = 3 }: { items: Feature[]; cols?: 2 | 3 | 4 }) {
  return (
    <ul className={`grid gap-4 sm:gap-6 ${COLS[cols]}`}>
      {items.map((f) => (
        <li key={f.title} className="min-w-0">
          <Card className="h-full">
            <div className="flex items-start justify-between gap-3">
              <IconTile icon={f.icon} />
              {f.status && <StatusBadge status={f.status} />}
            </div>
            <h3 className="mt-4 text-[1.1875rem] leading-snug">{f.title}</h3>
            {f.body && <p className="mt-2 text-[15px] text-body">{f.body}</p>}
          </Card>
        </li>
      ))}
    </ul>
  );
}

/** Tick list for "includes" style content. */
export function CheckList({ items, className = "" }: { items: ReactNode[]; className?: string }) {
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2.5 text-[15px] text-body">
          <Check aria-hidden="true" size={18} className="mt-0.5 shrink-0 text-success" />
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** Wrapping row of plain labels (use cases, building types). */
export function ChipList({ items }: { items: { icon: LucideIcon; label: string }[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, label }) => (
        <li
          key={label}
          className="flex min-h-14 min-w-0 items-center gap-3 rounded-card border border-line bg-white px-4 py-3 font-semibold"
        >
          <Icon aria-hidden="true" size={20} strokeWidth={1.75} className="shrink-0 text-navy" />
          <span className="min-w-0">{label}</span>
        </li>
      ))}
    </ul>
  );
}

/** Numbered steps for five-step processes (the shared Steps kit is laid out for four). */
export function StepList({ items }: { items: { title: string; body: string }[] }) {
  return (
    <ol className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((s, i) => (
        <li key={s.title} className="min-w-0 rounded-card border border-line bg-white p-6">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-amber text-[15px] font-bold text-navy">
            {i + 1}
          </span>
          <h3 className="mt-4 text-[1.1875rem] leading-snug">{s.title}</h3>
          <p className="mt-2 text-[15px] text-body">{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
