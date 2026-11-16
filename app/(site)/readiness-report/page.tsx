import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/ui/Breadcrumbs";
import Link from "next/link";
import { Cable, Camera, Gauge, ListChecks, ReceiptText, ShieldCheck } from "lucide-react";
import report from "@/data/readiness-report.json";
import { flags } from "@/lib/flags";
import { seoMetadata } from "@/lib/seo/meta";
import { getSite } from "@/lib/site-live";
import { Card, PageHero, Section, SectionHeading, StatusBadge, type Status } from "@/components/ui";
import { CtaBand } from "@/components/ui/CtaBand";
import { Related } from "@/components/ui/Related";
import { Callout, IconList, live } from "@/components/service";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { SwitchboxDiagram } from "@/components/readiness/SwitchboxDiagram";

const pageMeta: Metadata = {
  title: "Smart Home Readiness Report: See a Sample — Homeasy",
  description:
    "See a sample smart home readiness report from Homeasy: switchbox findings, wiring checks, suggested modules and the quote. Book a free survey in Bihar.",
};

export function generateMetadata() {
  return seoMetadata("/readiness-report", pageMeta);
}

type Verdict = "suitable" | "needs-fix" | "not-suitable";
const VERDICT: Record<Verdict, { label: string; status: Status }> = {
  suitable: { label: "Suitable", status: "available" },
  "needs-fix": { label: "Needs a fix first", status: "coming-soon" },
  "not-suitable": { label: "Not suitable for now", status: "planned" },
};

/** The label that keeps the sample unmistakably a sample (amber with navy text, PRD §6.2). */
function SampleTag({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-amber px-3 py-1 text-[13px] font-bold uppercase tracking-[0.08em] text-navy ${className}`}
    >
      {report.sampleLabel}
    </span>
  );
}

function PartHeading({ n, children }: { n: number; children: string }) {
  return (
    <h3 className="flex items-center gap-3 text-h4 leading-snug">
      <span
        aria-hidden="true"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-navy text-[14px] font-bold text-white"
      >
        {n}
      </span>
      {children}
    </h3>
  );
}

/** PRD §8.21, §26.19, §27.8 (report template), wireframe §25.12. USP U1 gates the written-report promise. */
export default async function ReadinessReportPage() {
  const site = await getSite();
  const boxes = report.boxes.map((b) => ({ ...b, verdict: b.verdict as Verdict }));
  const count = (v: Verdict) => boxes.filter((b) => b.verdict === v).length;
  const summary = [
    { label: "Points checked", value: boxes.length },
    { label: "Suitable", value: count("suitable") },
    { label: "Needs a fix first", value: count("needs-fix") },
    { label: "Not suitable for now", value: count("not-suitable") },
  ];
  const moduleRows = boxes.flatMap((b) => b.modules.map((m) => ({ module: m, where: `${b.room}: ${b.name}`, key: `${b.id}-${m}` })));
  const priceText = flags.SHOW_PRICES ? "Shown in your own quote" : "Price after free survey";

  return (
    <>
      <BreadcrumbJsonLd path="/readiness-report" />
      <PageHero
        eyebrow={report.sampleLabel}
        title={live.report ? "Your Smart Home Readiness Report" : "What our free survey tells you"}
        sub={
          live.report
            ? "After every free survey, you get a written smart home readiness report on WhatsApp. It is yours to keep, even if you don't buy, and it comes before any home automation work starts. Here is a sample."
            : "This sample smart home readiness report shows what our free survey checks in your home, and what we share with you afterwards, before any home automation work starts."
        }
      >
        <Link href="/book-survey" className="btn btn-primary min-h-12 px-6">
          {live.report ? "Get yours free: book a survey" : "Book a free home survey"}
        </Link>
        <a href="#sample" className="btn btn-outline min-h-12 px-6">
          See the sample
        </a>
      </PageHero>

      <Section>
        <SectionHeading
          title="What's inside"
          sub={
            live.report
              ? "Six things, written down for your home."
              : "Six things we check and share with you after the survey."
          }
        />
        <div className="mt-8">
          <IconList
            columns={3}
            items={[
              { icon: Camera, title: "Photos of each switchbox", body: "Front and inside, so you see what we saw." },
              { icon: Cable, title: "Neutral wire and box depth", body: "Checked box by box, because every box is different." },
              { icon: Gauge, title: "Appliance load notes", body: "Geysers, ACs and motors need the right module." },
              { icon: ShieldCheck, title: "Any safety issues we found", body: "Told to you first, with how urgent each one is." },
              { icon: ListChecks, title: "Suggested modules, room by room", body: "Only where they fit. We say so where they don't." },
              {
                icon: ReceiptText,
                title: live.fixedPrice ? "Your fixed quote" : "Your quote",
                body: live.fixedPrice
                  ? "One fixed price, with the date it is valid until."
                  : "One clear price, with the date it is valid until.",
              },
            ]}
          />
        </div>
      </Section>

      <Section tone="cloud" id="sample">
        <SectionHeading
          title="The sample report"
          sub="An example home, so you can see the layout before you book."
        />
        <div className="mt-6 max-w-[820px]">
          <Callout title="This is a sample, not a real home.">{report.sampleNote}</Callout>
        </div>

        <article
          aria-labelledby="report-title"
          className="mt-8 overflow-hidden rounded-card border-2 border-navy bg-white"
        >
          {/* Cover */}
          <header className="on-dark bg-navy p-5 text-white sm:p-8">
            <SampleTag />
            <h3 id="report-title" className="mt-4 text-h3 leading-[1.15]">
              {report.cover.title}
            </h3>
            <dl className="mt-6 grid gap-x-8 gap-y-3 sm:grid-cols-2 lg:grid-cols-3">
              {report.cover.rows.map((r) => (
                <div key={r.label} className="min-w-0">
                  <dt className="text-[13px] font-semibold uppercase tracking-[0.08em] text-mist">{r.label}</dt>
                  <dd className="mt-0.5 break-words text-[15px]">{r.value}</dd>
                </div>
              ))}
            </dl>
          </header>

          <div className="space-y-12 p-5 sm:p-8">
            {/* 1. Summary */}
            <section aria-label="Summary">
              <PartHeading n={1}>Summary</PartHeading>
              <dl className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
                {summary.map((s) => (
                  <div key={s.label} className="flex min-w-0 flex-col-reverse rounded-card bg-cloud p-4">
                    <dt className="mt-1 text-[14px] text-body">{s.label}</dt>
                    <dd className="text-h3 font-bold leading-none text-ink">{s.value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-4 text-body">{report.verdict}</p>
            </section>

            {/* 2. Switchbox findings */}
            <section aria-label="Findings for each switchbox">
              <PartHeading n={2}>Findings for each switchbox</PartHeading>
              <ul className="mt-5 grid gap-4 lg:grid-cols-2">
                {boxes.map((b) => (
                  <li key={b.id} className="min-w-0 rounded-card border border-line p-5">
                    <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <h4 className="text-[17px] font-semibold leading-snug">
                        <span className="block text-[13px] font-semibold uppercase tracking-[0.08em] text-slate">
                          {b.room}
                        </span>
                        {b.name}
                      </h4>
                      <StatusBadge status={VERDICT[b.verdict].status} label={VERDICT[b.verdict].label} />
                    </div>

                    <figure className="mt-4 rounded-card bg-cloud p-4">
                      <SwitchboxDiagram switches={b.switches} hasRegulator={b.hasRegulator} />
                      <figcaption className="mt-3 text-[13px] text-body">
                        Diagram only. Your own photos go here.
                      </figcaption>
                    </figure>

                    <dl className="mt-4 divide-y divide-line text-[15px]">
                      {b.checks.map((c) => (
                        <div key={c.label} className="flex flex-col gap-0.5 py-2 sm:flex-row sm:gap-4">
                          <dt className="shrink-0 font-semibold text-ink sm:w-36">{c.label}</dt>
                          <dd className="min-w-0 text-body">{c.value}</dd>
                        </div>
                      ))}
                    </dl>

                    <p className="mt-3 text-[15px] text-body">
                      <span className="font-semibold text-ink">What is possible: </span>
                      {b.finding}
                    </p>
                    <p className="mt-2 text-[15px] text-body">
                      <span className="font-semibold text-ink">Suggested: </span>
                      {b.modules.length ? b.modules.join(", ") : "No module for this box"}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* 3. Safety notes */}
            <section aria-label="Wiring and safety notes">
              <PartHeading n={3}>Wiring and safety notes</PartHeading>
              <ul className="mt-5 divide-y divide-line rounded-card border border-line">
                {report.safety.map((s) => (
                  <li key={s.where} className="flex flex-col gap-1 p-4 sm:flex-row sm:gap-5">
                    <span className="shrink-0 text-[14px] font-bold text-ink sm:w-32">{s.urgency}</span>
                    <span className="min-w-0 text-[15px] text-body">
                      <span className="font-semibold text-ink">{s.where}. </span>
                      {s.text}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {/* 4. What is possible */}
            <section aria-label="What you could control">
              <PartHeading n={4}>What you could control</PartHeading>
              <ul className="mt-5 list-disc space-y-2 pl-5 text-body marker:text-slate">
                {report.setup.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </section>

            {/* 5. Module list */}
            <section aria-label="Module list">
              <PartHeading n={5}>Module list</PartHeading>
              <ul className="mt-5 divide-y divide-line rounded-card border border-line">
                {moduleRows.map((m) => (
                  <li key={m.key} className="flex flex-col gap-0.5 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                    <span className="font-semibold text-ink">{m.module}</span>
                    <span className="min-w-0 text-[15px] text-body">{m.where}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[15px] text-body">
                Your own list also gives the number of each module.{" "}
                <Link href="/products" className="link">
                  See the Homeasy modules
                </Link>
                .
              </p>
            </section>

            {/* 6. Quote */}
            <section aria-label="Quote">
              <PartHeading n={6}>{live.fixedPrice ? "Fixed quote" : "Quote"}</PartHeading>
              <ul className="mt-5 divide-y divide-line rounded-card border border-line">
                {report.quote.lines.map((l) => (
                  <li key={l.item} className="flex flex-col gap-1 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                    <span className="min-w-0">
                      <span className="block font-semibold text-ink">{l.item}</span>
                      <span className="block text-[15px] text-body">{l.detail}</span>
                    </span>
                    <span className="shrink-0 text-[15px] font-semibold text-ink">{priceText}</span>
                  </li>
                ))}
                <li className="flex flex-col gap-1 bg-cloud p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5">
                  <span className="text-[17px] font-bold text-ink">{report.quote.total}</span>
                  <span className="shrink-0 text-[15px] font-bold text-ink">{priceText}</span>
                </li>
              </ul>
              <p className="mt-3 text-[15px] text-body">
                This sample shows no amounts. {report.quote.validity} See{" "}
                <Link href="/pricing" className="link">
                  how pricing works
                </Link>
                .
              </p>
            </section>

            {/* 7. Next steps */}
            <section aria-label="Next steps">
              <PartHeading n={7}>Next steps</PartHeading>
              <ol className="mt-5 list-decimal space-y-2 pl-5 text-body marker:font-semibold marker:text-ink">
                {report.nextSteps.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ol>
              <p className="mt-4 text-[15px] text-body">
                Homeasy modules carry a 3-year warranty. Our other promises, and which are in force, are on the{" "}
                <Link href="/guarantee" className="link">
                  guarantee page
                </Link>
                .
              </p>
            </section>
          </div>

          <footer className="flex flex-col items-start gap-3 border-t border-line bg-cloud p-5 sm:flex-row sm:items-center sm:px-8">
            <SampleTag />
            <p className="text-[14px] text-body">Example only. Not a real home, customer or quote.</p>
          </footer>
        </article>
      </Section>

      <Section>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="sm:p-8">
            <h2 className="text-h3 leading-[1.15]">{live.report ? "Get yours free" : "See what your home needs"}</h2>
            <p className="mt-3 text-body">
              {live.report
                ? "Book a free home survey anywhere in Bihar. The report is yours to keep, even if you don't buy."
                : "Book a free home survey anywhere in Bihar. We check every switchbox, then share our findings, photos and a quote with you on WhatsApp."}
            </p>
            <Link href="/book-survey" className="btn btn-primary mt-6 min-h-12 px-6">
              Book a free home survey
            </Link>
          </Card>
          <Card className="sm:p-8">
            <h2 className="text-h3 leading-[1.15]">Not sure yet?</h2>
            <p className="mt-3 text-body">
              Send us a photo of one switchboard on WhatsApp. We will tell you what looks possible before any visit.
            </p>
            <a
              href={site.whatsappHref("photo")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline mt-6 min-h-12 px-6"
            >
              <WhatsAppIcon size={18} /> Send a switchboard photo
            </a>
          </Card>
        </div>
      </Section>

      <Related paths={["/installation", "/how-it-works", "/pricing"]} />

      <CtaBand />
    </>
  );
}
