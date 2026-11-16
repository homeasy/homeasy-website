"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import map from "@/data/bihar-districts.json";

const fmtDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

/**
 * Leads across Bihar: each district is shaded by how many survey requests came from its pincodes.
 * The slider (or Play) moves through the chosen period day by day, so you can watch where interest grew.
 * The ranked list beside the map carries the same numbers for keyboard and screen-reader users.
 */
export function BiharMap({
  points,
  dates,
  offMap,
}: {
  /** one entry per lead in the period: d = district id, t = index into `dates` */
  points: { d: number; t: number }[];
  dates: string[];
  /** leads in the period whose pincode is not in the Bihar directory */
  offMap: number;
}) {
  const last = dates.length - 1;
  const [cursor, setCursor] = useState(last);
  const [playing, setPlaying] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!playing) return;
    const stepMs = Math.max(60, Math.min(260, 9000 / dates.length));
    timer.current = setInterval(() => {
      setCursor((c) => {
        if (c >= last) {
          setPlaying(false);
          return last;
        }
        return c + 1;
      });
    }, stepMs);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, [playing, last, dates.length]);

  const counts = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of points) if (p.t <= cursor) m.set(p.d, (m.get(p.d) ?? 0) + 1);
    return m;
  }, [points, cursor]);
  // shading is measured against the busiest district of the whole period, so colours do not jump while playing
  const peak = useMemo(() => {
    const m = new Map<number, number>();
    for (const p of points) m.set(p.d, (m.get(p.d) ?? 0) + 1);
    return Math.max(1, ...m.values());
  }, [points]);
  const total = [...counts.values()].reduce((a, b) => a + b, 0);
  const ranked = map.districts.map((d) => ({ ...d, count: counts.get(d.id) ?? 0 })).filter((d) => d.count > 0).sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  const shown = active === null ? null : (map.districts.find((d) => d.id === active) ?? null);

  const toggle = () => {
    if (!playing && cursor >= last) setCursor(0);
    setPlaying((p) => !p);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
      <div className="min-w-0">
        <div className="relative">
          <svg viewBox={`-4 -4 ${map.width + 8} ${map.height + 8}`} className="h-auto w-full" role="img" aria-label={`Map of Bihar: ${total} leads up to ${fmtDay(dates[cursor])}, shaded by district`} onMouseLeave={() => setActive(null)}>
            {map.districts.map((d) => {
              const n = counts.get(d.id) ?? 0;
              return (
                <path
                  key={d.id}
                  d={d.d}
                  onMouseEnter={() => setActive(d.id)}
                  className={`adm-map-area stroke-deep ${n ? "fill-amber" : "fill-navy-800"} ${active === d.id ? "stroke-white" : ""}`}
                  fillOpacity={n ? 0.22 + 0.78 * Math.sqrt(n / peak) : 1}
                  strokeWidth={active === d.id ? 1.6 : 1}
                  strokeLinejoin="round"
                />
              );
            })}
            {shown && (
              <circle cx={shown.cx} cy={shown.cy} r={3} className="pointer-events-none fill-white" />
            )}
          </svg>
          <p className="pointer-events-none absolute left-0 top-0 rounded-md border border-navy-700 bg-navy-800 px-2.5 py-1.5 text-xs" aria-hidden="true">
            <span className="block text-mist">{shown ? shown.name : "All of Bihar"}</span>
            <span className="block font-medium tabular-nums text-white">
              {shown ? (counts.get(shown.id) ?? 0) : total} lead{(shown ? (counts.get(shown.id) ?? 0) : total) === 1 ? "" : "s"}
            </span>
          </p>

        </div>

        <p className="mt-2 flex items-center gap-2 text-[11px] text-ash" aria-hidden="true">
            Fewer
            <span className="flex h-2 w-24 overflow-hidden rounded-full">
              {[0.22, 0.45, 0.65, 0.85, 1].map((o) => (
                <span key={o} className="h-full flex-1 bg-amber" style={{ opacity: o }} />
              ))}
            </span>
            More
          </p>

        <div className="mt-4 flex items-center gap-3">
          <button type="button" onClick={toggle} aria-label={playing ? "Pause" : "Play through the period"} className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber/15 text-amber hover:bg-amber/25">
            {playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
          </button>
          <label className="min-w-0 flex-1">
            <span className="sr-only">Show leads received up to this day</span>
            <input
              type="range"
              min={0}
              max={last}
              value={cursor}
              onChange={(e) => (setPlaying(false), setCursor(Number(e.target.value)))}
              aria-valuetext={fmtDay(dates[cursor])}
              className="block w-full accent-[#F9B445]"
            />
            <span className="mt-1 flex justify-between text-[11px] tabular-nums text-ash" aria-hidden="true">
              <span>{fmtDay(dates[0])}</span>
              <span className="text-mist">Up to {fmtDay(dates[cursor])}</span>
              <span>{fmtDay(dates[last])}</span>
            </span>
          </label>
        </div>
      </div>

      <div className="min-w-0">
        <h3 className="text-xs font-medium uppercase tracking-wider text-mist">Districts with leads</h3>
        {ranked.length === 0 ? (
          <p className="py-8 text-sm text-mist">{points.length ? "No leads yet at this point in the period." : "No leads from Bihar pincodes in this period yet."}</p>
        ) : (
          <ol className="mt-3 max-h-[340px] space-y-1 overflow-y-auto pr-1">
            {ranked.map((d) => (
              <li key={d.id}>
                <Link
                  href={`/admin/leads?district=${encodeURIComponent(d.name)}`}
                  onMouseEnter={() => setActive(d.id)}
                  onFocus={() => setActive(d.id)}
                  onBlur={() => setActive(null)}
                  className={`block rounded-lg px-2.5 py-2 no-underline ${active === d.id ? "bg-white/5" : "hover:bg-white/5"}`}
                >
                  <span className="flex items-baseline justify-between gap-3 text-sm">
                    <span className="truncate text-white">{d.name}</span>
                    <span className="shrink-0 tabular-nums text-white">
                      {d.count}
                      <span className="ml-1.5 text-xs text-ash">{Math.round((d.count / Math.max(1, total)) * 100)}%</span>
                    </span>
                  </span>
                  <span className="mt-1.5 block h-1 rounded-full bg-white/5">
                    <span className="block h-1 rounded-full bg-amber transition-[width] duration-300" style={{ width: `${Math.max(3, (d.count / ranked[0].count) * 100)}%` }} />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        )}
        {offMap > 0 && (
          <p className="mt-3 text-xs text-ash">
            {offMap} more lead{offMap === 1 ? "" : "s"} in this period {offMap === 1 ? "has" : "have"} a pincode that is not in the Bihar directory (outside Bihar, or a new pincode).
          </p>
        )}
        <p className="mt-3 text-[11px] text-ash">{map.credit}</p>
      </div>
    </div>
  );
}
