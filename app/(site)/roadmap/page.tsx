import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import { Related } from "@/components/ui/Related";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { PageHero, Section, StatusBadge } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import roadmapData from "@/data/roadmap.json";

const pageMeta: Metadata = {
  title: "Homeasy Roadmap — What Is Live and What Is Planned",
  description:
    "The Homeasy roadmap: what is available today and what is planned next for smart home retrofit in India, each item clearly marked.",
};

export function generateMetadata() {
  return seoMetadata("/roadmap", pageMeta);
}

type RoadmapStatus = "done" | "in-progress" | "planned";
type RoadmapItem = { period: string; title: string; detail?: string; status: RoadmapStatus };

const roadmap = roadmapData as RoadmapItem[];

const CHIP = "inline-flex items-center rounded-full px-2.5 py-1 text-[12px] font-semibold";

function StatusChip({ status }: { status: RoadmapStatus }) {
  if (status === "planned") return <StatusBadge status="planned" />;
  if (status === "done") {
    return <span className={`${CHIP} bg-[var(--badge-available-bg)] text-[var(--badge-available-text)]`}>Done</span>;
  }
  return <span className={`${CHIP} bg-[var(--badge-soon-bg)] text-[var(--badge-soon-text)]`}>In progress</span>;
}

const DOT: Record<RoadmapStatus, string> = {
  done: "border-navy bg-navy",
  "in-progress": "border-amber bg-amber",
  planned: "border-line bg-white",
};

/** PRD §8.9 + §26.12. Items live in data/roadmap.json. No dates beyond those approved in the PRD. */
export default function RoadmapPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/roadmap" />
      <PageHero
        eyebrow="Roadmap"
        title="Where Homeasy is headed"
        sub="The Homeasy roadmap: what we've done, what we're building, and what's next. Plans may change — we'll keep this page honest."
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          Book a free survey
        </Link>
        <Link href="/solutions" className="btn btn-outline min-h-12 px-6">
          Partner with us
        </Link>
      </PageHero>

      <Section>
        <ol className="relative max-w-[760px] border-l border-line">
          {roadmap.map((item) => (
            <li key={item.title} className="relative pb-8 pl-6 last:pb-0 sm:pl-8">
              <span
                aria-hidden="true"
                className={`absolute -left-[7px] top-1.5 size-[13px] rounded-full border-2 ${DOT[item.status]}`}
              />
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-[13px] font-semibold uppercase tracking-[0.1em] text-slate">{item.period}</span>
                <StatusChip status={item.status} />
              </div>
              <h2 className="mt-2 text-[1.1875rem] font-semibold leading-snug tracking-normal">{item.title}</h2>
              {item.detail && <p className="mt-1 text-[15px] text-body">{item.detail}</p>}
            </li>
          ))}
        </ol>

        <p className="mt-10 max-w-[760px] rounded-card border border-line bg-cloud p-5 text-[15px] text-body">
          Roadmap reflects current plans and may change.
        </p>
        <h2 className="mt-10 text-h4">How to read this roadmap</h2>
        <p className="mt-3 max-w-[760px] text-body">
          Items marked as done are finished. Items in progress are being built or tested now. Items marked as planned have not started: we do not take orders
          for them or promise a date, and we only move an item forward on this page when it is real. If something you need is still planned, tell us; it helps us decide
          what to build next.
        </p>
        <p className="mt-6 text-body">
          Designer, builder or electrician?{" "}
          <Link href="/solutions" className="link">
            Partner with us
          </Link>
          .
        </p>
      </Section>

      <Related paths={["/products", "/app", "/about"]} />

      <CtaBand title="Want to be part of it?" body="Book a free home survey, or talk to us about working together." />
    </>
  );
}
