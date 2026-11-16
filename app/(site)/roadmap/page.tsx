import type { Metadata } from "next";
import { seoMetadata } from "@/lib/seo/meta";
import Link from "next/link";
import { PageHero, Section, StatusBadge } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import roadmapData from "@/data/roadmap.json";

const pageMeta: Metadata = {
  title: "Homeasy Roadmap",
  description: "What we've built and what's next for Homeasy in India.",
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
      <PageHero
        eyebrow="Roadmap"
        title="Where Homeasy is headed"
        sub="What we've done, what we're building, and what's next. Plans may change — we'll keep this page honest."
      />

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
        <p className="mt-6 text-body">
          Designer, builder or electrician?{" "}
          <Link href="/solutions" className="link">
            Partner with us
          </Link>
          .
        </p>
      </Section>

      <CtaBand title="Want to be part of it?" body="Book a free home survey, or talk to us about working together." />
    </>
  );
}
