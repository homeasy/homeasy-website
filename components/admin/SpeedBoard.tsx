"use client";

import { useState } from "react";
import { ExternalLink, Play } from "lucide-react";
import { runPageSpeed } from "@/app/(admin)/admin/seo/actions";
import type { SpeedRun } from "@/lib/seo/keywords";
import { useToast } from "./toast";
import { ScoreBadge } from "./ui";

type Device = "mobile" | "desktop";
const DEFAULT_PAGES = ["/", "/products", "/pricing", "/how-it-works", "/book-survey", "/contact"];
// good / needs-work limits, as Google uses for Core Web Vitals
const LIMITS = { lcp: [2500, 4000], fcp: [1800, 3000], tbt: [200, 600], cls: [0.1, 0.25], si: [3400, 5800], inp: [200, 500] } as const;
const tone = (k: keyof typeof LIMITS, v: number | null) => (v === null ? "text-mist" : v <= LIMITS[k][0] ? "text-emerald-300" : v <= LIMITS[k][1] ? "text-amber" : "text-red-300");
const secs = (v: number | null) => (v === null ? "–" : `${(v / 1000).toFixed(1)} s`);
const ms = (v: number | null) => (v === null ? "–" : `${Math.round(v)} ms`);
const shift = (v: number | null) => (v === null ? "–" : v.toFixed(2));

function Metric({ label, value, cls }: { label: string; value: string; cls: string }) {
  return (
    <div>
      <dt className="text-xs text-ash">{label}</dt>
      <dd className={`text-sm tabular-nums ${cls}`}>{value}</dd>
    </div>
  );
}

export function SpeedBoard({ siteUrl, pages, runs: initial, when }: { siteUrl: string; pages: { path: string; label: string }[]; runs: SpeedRun[]; when: Record<string, string> }) {
  const toast = useToast();
  const [device, setDevice] = useState<Device>("mobile");
  const [runs, setRuns] = useState(initial);
  const [testing, setTesting] = useState<string | null>(null);
  const [all, setAll] = useState(false);
  const shown = all ? pages : pages.filter((p) => DEFAULT_PAGES.includes(p.path));

  async function test(path: string) {
    setTesting(path);
    const r = await runPageSpeed(path, device);
    setTesting(null);
    if (r.ok && r.run) setRuns((old) => [r.run!, ...old.filter((x) => !(x.path === path && x.strategy === device))]);
    else toast("error", r.error ?? "The test failed.");
  }

  return (
    <>
      <div className="mb-4 inline-flex rounded-lg border border-navy-700 p-1" role="group" aria-label="Device">
        {(["mobile", "desktop"] as const).map((d) => (
          <button key={d} type="button" aria-pressed={device === d} onClick={() => setDevice(d)} className={`adm-btn adm-btn-sm capitalize ${device === d ? "adm-btn-primary" : "adm-btn-ghost"}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {shown.map((p) => {
          const run = runs.find((r) => r.path === p.path && r.strategy === device);
          const busy = testing === p.path;
          return (
            <section key={p.path} className="min-w-0 rounded-xl border border-navy-700 bg-navy p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold text-white">{p.label}</h2>
                  <p className="truncate text-xs text-mist">{p.path}</p>
                </div>
                <div className="flex shrink-0 gap-1">
                  <a href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(siteUrl + p.path)}`} target="_blank" rel="noreferrer" aria-label="Open in PageSpeed Insights" className="adm-btn adm-btn-ghost adm-btn-sm">
                    <ExternalLink size={14} />
                  </a>
                  <button type="button" disabled={testing !== null} onClick={() => test(p.path)} className="adm-btn adm-btn-secondary adm-btn-sm">
                    <Play size={14} aria-hidden="true" /> {busy ? "Testing… (up to a minute)" : run ? "Re-test" : "Test"}
                  </button>
                </div>
              </div>
              {run ? (
                <div className="mt-4 space-y-4">
                  <ul className="grid grid-cols-4 gap-2 text-center">
                    {(
                      [
                        ["Performance", run.scores.performance],
                        ["Accessibility", run.scores.accessibility],
                        ["Best practices", run.scores.bestPractices],
                        ["SEO", run.scores.seo],
                      ] as const
                    ).map(([label, score]) => (
                      <li key={label}>
                        <ScoreBadge score={score} />
                        <p className="mt-1 text-[11px] text-mist">{label}</p>
                      </li>
                    ))}
                  </ul>
                  <dl className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                    <Metric label="LCP" value={secs(run.metrics.lcp)} cls={tone("lcp", run.metrics.lcp)} />
                    <Metric label="FCP" value={secs(run.metrics.fcp)} cls={tone("fcp", run.metrics.fcp)} />
                    <Metric label="TBT" value={ms(run.metrics.tbt)} cls={tone("tbt", run.metrics.tbt)} />
                    <Metric label="CLS" value={shift(run.metrics.cls)} cls={tone("cls", run.metrics.cls)} />
                    <Metric label="Speed index" value={secs(run.metrics.si)} cls={tone("si", run.metrics.si)} />
                  </dl>
                  {run.field && (
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-ash">Real users (Chrome UX Report)</p>
                      <dl className="grid grid-cols-3 gap-3">
                        <Metric label="LCP" value={secs(run.field.lcp)} cls={tone("lcp", run.field.lcp)} />
                        <Metric label="INP" value={ms(run.field.inp)} cls={tone("inp", run.field.inp)} />
                        <Metric label="CLS" value={shift(run.field.cls)} cls={tone("cls", run.field.cls)} />
                      </dl>
                    </div>
                  )}
                  {run.opportunities.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs uppercase tracking-wider text-ash">Biggest opportunities</p>
                      <ul className="space-y-1 text-sm">
                        {run.opportunities.map((o) => (
                          <li key={o.title} className="flex justify-between gap-3">
                            <span className="min-w-0 truncate text-mist">{o.title}</span>
                            <span className="shrink-0 tabular-nums text-white">−{(o.savingMs / 1000).toFixed(1)} s</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-xs text-ash">
                    Tested {when[`${run.path}|${run.strategy}|${run.at}`] ?? "just now"}
                    {run.previousPerformance !== null && ` · previous performance ${run.previousPerformance}`}
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-sm text-mist">Not tested on {device} yet.</p>
              )}
            </section>
          );
        })}
      </div>
      {!all && pages.length > shown.length && (
        <button type="button" onClick={() => setAll(true)} className="adm-btn adm-btn-ghost adm-btn-sm mt-4">
          Show all {pages.length} pages
        </button>
      )}
    </>
  );
}
