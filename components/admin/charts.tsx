"use client";

import { useState } from "react";

/**
 * Single-series charts for the admin dashboard (same design as the Kynyx admin): one colour (amber),
 * a quiet grid, hover values, and a table view for the same numbers.
 */
const fmtDay = (iso: string) => new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

function niceTop(max: number) {
  for (let mag = 1; ; mag *= 10) for (const s of [1, 2, 5]) if (s * mag >= max) return s * mag;
}

export function DailyBars({ data, label = "Leads" }: { data: { date: string; count: number }[]; label?: string }) {
  const [hover, setHover] = useState<number | null>(null);
  const [showTable, setShowTable] = useState(false);
  const top = niceTop(Math.max(1, ...data.map((d) => d.count)));

  const W = 640;
  const H = 180;
  const padL = 28;
  const padB = 22;
  const plotW = W - padL;
  const plotH = H - padB - 8;
  const slot = plotW / data.length;
  const barW = Math.max(2, Math.min(18, slot - 2));
  const labelEvery = Math.ceil(data.length / 6);
  const hovered = hover === null ? null : data[hover];

  if (showTable) {
    return (
      <div>
        <div className="max-h-56 overflow-auto rounded-lg border border-navy-700">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-navy-800 text-left text-xs text-mist">
              <tr>
                <th className="px-3 py-2 font-medium">Date</th>
                <th className="px-3 py-2 text-right font-medium">{label}</th>
              </tr>
            </thead>
            <tbody>
              {[...data].reverse().map((d) => (
                <tr key={d.date} className="border-t border-navy-700">
                  <td className="px-3 py-1.5 text-mist">{fmtDay(d.date)}</td>
                  <td className="px-3 py-1.5 text-right tabular-nums text-white">{d.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button type="button" className="mt-2 text-xs text-mist hover:text-white" onClick={() => setShowTable(false)}>
          Show chart
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`${label} per day`} onMouseLeave={() => setHover(null)}>
        {[0, top / 2, top].map((t) => {
          const y = 8 + plotH - (t / top) * plotH;
          return (
            <g key={t}>
              <line x1={padL} x2={W} y1={y} y2={y} stroke="#fff" strokeOpacity={0.07} strokeWidth={1} />
              <text x={padL - 6} y={y + 3} textAnchor="end" fill="#7C8AA5" fontSize={10}>
                {t}
              </text>
            </g>
          );
        })}
        {data.map((d, i) => {
          const h = (d.count / top) * plotH;
          const x = padL + i * slot + (slot - barW) / 2;
          const y = 8 + plotH - h;
          const r = Math.min(4, barW / 2, h / 2);
          return (
            <g key={d.date} onMouseEnter={() => setHover(i)}>
              <rect x={padL + i * slot} y={8} width={slot} height={plotH} fill="transparent" />
              {h > 0 && (
                <path
                  d={`M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${y + h} Z`}
                  fill="#F9B445"
                  opacity={hover === null || hover === i ? 1 : 0.4}
                />
              )}
              {i % labelEvery === 0 && (
                <text x={padL + i * slot + slot / 2} y={H - 6} textAnchor="middle" fill="#7C8AA5" fontSize={10}>
                  {fmtDay(d.date)}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {hovered && hover !== null && (
        <div
          className="pointer-events-none absolute -top-2 z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-navy-700 bg-navy-800 px-2.5 py-1.5 text-xs"
          style={{ left: `${((padL + hover * slot + slot / 2) / W) * 100}%` }}
        >
          <div className="text-mist">{fmtDay(hovered.date)}</div>
          <div className="font-medium text-white">
            {hovered.count} {label.toLowerCase()}
          </div>
        </div>
      )}
      <button type="button" className="mt-1 text-xs text-mist hover:text-white" onClick={() => setShowTable(true)}>
        View as table
      </button>
    </div>
  );
}

export function HBarList({ data, empty = "No data yet" }: { data: { label: string; count: number }[]; empty?: string }) {
  const max = Math.max(1, ...data.map((d) => d.count));
  const total = data.reduce((s, d) => s + d.count, 0);
  if (!data.length || total === 0) return <p className="py-6 text-center text-sm text-mist">{empty}</p>;
  return (
    <ul className="space-y-3">
      {data.map((d) => (
        <li key={d.label}>
          <div className="mb-1 flex items-baseline justify-between gap-3 text-sm">
            <span className="truncate text-mist">{d.label}</span>
            <span className="shrink-0 tabular-nums text-white">
              {d.count}
              <span className="ml-1.5 text-xs text-ash">{Math.round((d.count / total) * 100)}%</span>
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-white/5">
            <div className="h-1.5 rounded-full bg-amber" style={{ width: `${Math.max(2, (d.count / max) * 100)}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
