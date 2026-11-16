/**
 * Admin UI kit (server-safe). Mirrors the Kynyx admin's building blocks in Homeasy colours:
 * dark navy surfaces, amber as the single accent.
 */
import type { ReactNode } from "react";
import Link from "next/link";
import { TriangleAlert } from "lucide-react";
import { CountUp } from "./CountUp";
import { statusLabel } from "@/lib/leads/schema";
import { orderStatusLabel } from "@/lib/store/order-statuses";

export function Card({
  title,
  action,
  children,
  className = "",
  bodyClassName = "p-5",
}: {
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <section className={`adm-card min-w-0 rounded-xl border border-navy-700 bg-navy ${className}`}>
      {title && (
        <header className="flex items-center justify-between gap-3 border-b border-navy-700 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-white">{title}</h2>
          {action}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function Kpi({ label, value, sub, href }: { label: string; value: ReactNode; sub?: ReactNode; href?: string }) {
  const body = (
    <div className="h-full min-w-0 rounded-xl border border-navy-700 bg-navy p-5 transition-colors hover:border-mist/40">
      <p className="text-xs font-medium uppercase tracking-wider text-mist">{label}</p>
      <p className="mt-2 text-3xl font-semibold tabular-nums tracking-tight text-white">{typeof value === "number" ? <CountUp value={value} /> : value}</p>
      {sub && <div className="mt-1.5 text-xs text-mist">{sub}</div>}
    </div>
  );
  return href ? (
    <Link href={href} className="adm-card block h-full no-underline">
      {body}
    </Link>
  ) : (
    <div className="adm-card h-full">{body}</div>
  );
}

export function InfoRow({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 py-2.5 sm:flex-row sm:gap-4">
      <dt className="w-28 shrink-0 text-xs uppercase tracking-wider text-ash">{label}</dt>
      <dd className="min-w-0 break-words text-sm text-white">{children || <span className="text-ash">—</span>}</dd>
    </div>
  );
}

export const BACK_LINK = "mb-4 inline-flex items-center gap-1.5 text-sm text-mist no-underline hover:text-white";

export function PageHeader({ title, description, actions }: { title: string; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-mist">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function Field({ label, hint, error, children, className = "" }: { label: string; hint?: string; error?: string; children: ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">{label}</span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ash">{hint}</span>}
      {error && <span className="mt-1 block text-xs text-red-300">{error}</span>}
    </label>
  );
}

export function EmptyState({ title, text, action }: { title: string; text?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <p className="text-sm font-medium text-white">{title}</p>
      {text && <p className="mt-1 max-w-md text-sm text-mist">{text}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div role="alert" className="mb-6 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
      <p className="flex items-center gap-2 font-medium">
        <TriangleAlert size={16} aria-hidden="true" className="shrink-0" /> {title}
      </p>
      {children && <p className="mt-1 text-red-200/85">{children}</p>}
    </div>
  );
}

const BADGE = "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset";
const TONES = {
  amber: "bg-amber/15 text-amber ring-amber/30",
  blue: "bg-blue/15 text-blue-300 ring-blue/30",
  green: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/25",
  grey: "bg-white/5 text-mist ring-white/10",
  red: "bg-red-400/10 text-red-300 ring-red-400/25",
} as const;

const LEAD_TONE: Record<string, keyof typeof TONES> = {
  new: "amber",
  contacted: "blue",
  survey_scheduled: "blue",
  surveyed: "blue",
  quoted: "blue",
  won: "green",
  installed: "green",
  lost: "grey",
  out_of_area: "grey",
};
const ORDER_TONE: Record<string, keyof typeof TONES> = {
  awaiting_payment: "grey",
  new: "amber",
  booking_paid: "blue",
  paid: "green",
  processing: "blue",
  delivered: "green",
  installed: "green",
  cancelled: "grey",
  refunded: "red",
};

function Badge({ tone, children }: { tone: keyof typeof TONES; children: ReactNode }) {
  return (
    <span className={`${BADGE} ${TONES[tone]}`}>
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
export const LeadStatusBadge = ({ status }: { status: string }) => <Badge tone={LEAD_TONE[status] ?? "grey"}>{statusLabel(status)}</Badge>;
export const OrderStatusBadge = ({ status }: { status: string }) => <Badge tone={ORDER_TONE[status] ?? "grey"}>{orderStatusLabel(status)}</Badge>;

const PRIORITY: Record<string, { glyph: string; cls: string }> = {
  high: { glyph: "▲", cls: "text-red-300" },
  medium: { glyph: "●", cls: "text-mist" },
  low: { glyph: "▼", cls: "text-ash" },
};
export function PriorityBadge({ priority = "medium" }: { priority?: string }) {
  const p = PRIORITY[priority] ?? PRIORITY.medium;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium capitalize ${p.cls}`}>
      <span aria-hidden="true" className="text-[9px]">
        {p.glyph}
      </span>
      {priority}
    </span>
  );
}

export function Pill({ children, tone = "grey" }: { children: ReactNode; tone?: keyof typeof TONES }) {
  return <span className={`${BADGE} ${TONES[tone]}`}>{children}</span>;
}

/** Dates in India time, wherever the server runs. */
export function fmtDateTime(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(iso));
}
export function timeAgo(iso: string, now: number) {
  const s = Math.max(0, (now - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 86400 * 30) return `${Math.floor(s / 86400)}d ago`;
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short" }).format(new Date(iso));
}

const SCORE = { good: "bg-emerald-400/10 text-emerald-300 ring-emerald-400/30", ok: "bg-amber/15 text-amber ring-amber/30", bad: "bg-red-400/10 text-red-300 ring-red-400/30" };
/** 0–100 score in a coloured circle: 80+ good, 55+ needs work, below that poor. */
export function ScoreBadge({ score, size = "md" }: { score: number | null; size?: "sm" | "md" | "lg" }) {
  const tone = score === null ? "bg-white/5 text-mist ring-white/10" : SCORE[score >= 80 ? "good" : score >= 55 ? "ok" : "bad"];
  const box = size === "lg" ? "size-14 text-lg" : size === "sm" ? "size-8 text-xs" : "size-10 text-sm";
  return <span className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold tabular-nums ring-1 ring-inset ${box} ${tone}`}>{score ?? "–"}</span>;
}

const DOT = { good: "bg-emerald-400", ok: "bg-amber", bad: "bg-red-400" };
export function CheckList({ checks }: { checks: { label: string; level: "good" | "ok" | "bad"; detail: string }[] }) {
  return (
    <ul className="space-y-2">
      {checks.map((c) => (
        <li key={c.label} className="flex gap-2.5 text-sm">
          <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${DOT[c.level]}`} />
          <span className="min-w-0">
            <span className="text-white">{c.label}</span>
            <span className="sr-only"> ({c.level === "good" ? "good" : c.level === "ok" ? "could be better" : "needs fixing"})</span>
            <span className="block break-words text-xs text-mist">{c.detail}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}
