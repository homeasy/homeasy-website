"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AirVent, ArrowRight, Fan, Lightbulb, ShowerHead, type LucideIcon } from "lucide-react";

export type PlayItem = { key: "light" | "fan" | "geyser" | "ac"; slug: string; name: string; image: string };

const PARTS: Record<PlayItem["key"], { label: string; icon: LucideIcon; behind: string }> = {
  light: { label: "Light", icon: Lightbulb, behind: "Behind the light switch" },
  fan: { label: "Fan", icon: Fan, behind: "Behind the fan switch" },
  geyser: { label: "Geyser", icon: ShowerHead, behind: "Behind the geyser switch" },
  ac: { label: "AC", icon: AirVent, behind: "For the AC, beside its remote" },
};

/**
 * Products hero: a switchboard you can play with. Flip a switch and its appliance comes on, and the module that
 * sits behind that switch slides into view. It flips through the switches by itself until you touch one
 * (never under reduced motion). The switches are real `role="switch"` buttons.
 */
export function SwitchboardPlay({ items }: { items: PlayItem[] }) {
  const [on, setOn] = useState<Record<string, boolean>>({});
  const [active, setActive] = useState(items[0]?.key ?? "light");
  const touched = useRef(false);

  // the demo: one switch after another, until the visitor takes over
  useEffect(() => {
    if (!items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    const tick = () => {
      if (touched.current) return;
      const key = items[i % items.length].key;
      setOn({ [key]: true });
      setActive(key);
      i++;
    };
    const first = setTimeout(tick, 900);
    const timer = setInterval(tick, 2600);
    return () => {
      clearTimeout(first);
      clearInterval(timer);
    };
  }, [items]);

  if (!items.length) return null;
  const flip = (key: string) => {
    touched.current = true;
    setOn((s) => {
      const next = { ...s, [key]: !s[key] };
      if (next[key]) setActive(key as PlayItem["key"]);
      return next;
    });
  };
  const shown = items.find((it) => it.key === active) ?? items[0];
  const lit = !!on[shown.key];

  return (
    <div className="mx-auto w-full max-w-[440px]">
      {/* the room: appliances that come on, and the module behind the switch */}
      <div className="rounded-section border border-line bg-white p-4 sm:p-5">
        <ul className="grid grid-cols-4 gap-2">
          {items.map((it) => {
            const { label, icon: Icon } = PARTS[it.key];
            const isOn = !!on[it.key];
            return (
              <li key={it.key} className={`flex flex-col items-center gap-1.5 rounded-xl py-3 transition-colors duration-300 ${isOn ? "bg-amber text-navy" : "bg-cloud text-slate"}`}>
                <Icon aria-hidden="true" size={26} strokeWidth={1.75} className={isOn && it.key === "fan" ? "animate-spin [animation-duration:1.6s]" : ""} />
                <span className="text-[12px] font-semibold">{label}</span>
              </li>
            );
          })}
        </ul>

        <div className="mt-4 flex items-center gap-4" aria-live="polite">
          <span key={`${shown.key}-${lit}`} className={`appdemo-in relative block size-28 shrink-0 overflow-hidden rounded-card border sm:size-36 lg:size-40 ${lit ? "border-amber" : "border-line"}`}>
            <Image src={shown.image} alt={shown.name} fill unoptimized priority sizes="160px" className={`object-cover transition-[filter,opacity] duration-300 ${lit ? "" : "opacity-60 grayscale"}`} />
          </span>
          <span className="min-w-0">
            <span className="block text-[12px] font-semibold uppercase tracking-[0.08em] text-slate">{PARTS[shown.key].behind}</span>
            <span className="mt-1 block text-[1.125rem] font-semibold leading-snug text-ink">{shown.name}</span>
            <Link href={`/products/${shown.slug}`} className="link mt-2 inline-flex min-h-9 items-center gap-1 text-[14px] font-semibold">
              See this module <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </span>
        </div>
      </div>

      {/* the switchboard */}
      <div className="relative mx-auto -mt-3 w-[92%] rounded-2xl border border-line bg-[#EEF1F5] p-3 sm:p-4">
        <p className="mb-2 text-center text-[12px] font-semibold text-body">Flip a switch</p>
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {items.map((it) => {
            const isOn = !!on[it.key];
            return (
              <button
                key={it.key}
                type="button"
                role="switch"
                aria-checked={isOn}
                aria-label={`${PARTS[it.key].label} switch`}
                onClick={() => flip(it.key)}
                className="group relative flex h-[76px] flex-col overflow-hidden rounded-lg border border-[#D5DBE3] bg-white transition-transform active:scale-[0.97] sm:h-[84px]"
              >
                {/* a rocker: the pressed half is the darker one */}
                <span className={`flex-1 transition-colors duration-200 ${isOn ? "bg-[#DDE3EA]" : "bg-white"}`} />
                <span className={`flex-1 border-t border-[#D5DBE3] transition-colors duration-200 ${isOn ? "bg-white" : "bg-[#DDE3EA]"}`} />
                <span aria-hidden="true" className={`absolute left-1/2 top-2 size-2 -translate-x-1/2 rounded-full transition-colors duration-200 ${isOn ? "bg-amber" : "bg-[#C3CAD4]"}`} />
                <span aria-hidden="true" className="absolute inset-x-0 bottom-1.5 text-center text-[11px] font-semibold text-body">
                  {PARTS[it.key].label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
