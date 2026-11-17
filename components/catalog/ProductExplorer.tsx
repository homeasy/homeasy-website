"use client";

import { useMemo, useState, type ReactNode } from "react";
import { AirVent, Droplets, Fan, Lightbulb, PlugZap, Plug, ShowerHead, Tv, Unplug, type LucideIcon } from "lucide-react";

type Item = { slug: string; controls: string[]; card: ReactNode };

/** What a visitor may want to control, how to spot the matching modules, and one plain line of advice. */
const WANTS: { id: string; label: string; icon: LucideIcon; match: RegExp; note: string }[] = [
  { id: "lights", label: "Lights", icon: Lightbulb, match: /\blight/i, note: "Lights are switched by a small relay module behind the switch. Your wall switch keeps working by hand." },
  { id: "fans", label: "Fans", icon: Fan, match: /\bfan/i, note: "A fan needs a controller that handles speed, not a light relay. We confirm the fit with your regulator at the survey." },
  { id: "geyser", label: "Geyser", icon: ShowerHead, match: /geyser/i, note: "A geyser is a heavy load, so it needs the module built for heavy loads. You can put it on a schedule so it is not left on." },
  { id: "ac", label: "AC", icon: AirVent, match: /\bac\b/i, note: "Two modules can help. The IR Remote sets the AC the way its handset does, and the Power Module controls the heavy switch on the wall. Many homes need only the IR Remote." },
  { id: "tv", label: "TV", icon: Tv, match: /\btv\b/i, note: "The IR Remote sends the same signals as your TV handset. It needs a clear view of the TV, in the same room." },
  { id: "motor", label: "Water motor", icon: Droplets, match: /motor/i, note: "A water motor is a heavy load and uses the module built for heavy loads. We check the motor point at the survey." },
  { id: "small", label: "Small appliances", icon: Plug, match: /small appliance/i, note: "Small appliances on a normal switch use the same relay module as lights." },
  { id: "plug", label: "Plug-in appliances", icon: PlugZap, match: /plug-in/i, note: "A smart plug for appliances that plug into a socket is planned. It is not available yet." },
  { id: "neutral", label: "No neutral wire", icon: Unplug, match: /neutral/i, note: "Some switchboxes have no neutral wire. A module for them is planned and not available yet. Our survey checks every box." },
];

/**
 * "What do you want to control?" Pick an appliance and the list narrows to the modules that control it, with one
 * line of advice. The cards themselves are drawn on the server and passed in, so prices and badges stay as published.
 */
export function ProductExplorer({ items }: { items: Item[] }) {
  const [want, setWant] = useState<string | null>(null);
  const wants = useMemo(() => WANTS.filter((w) => items.some((it) => it.controls.some((c) => w.match.test(c)))), [items]);
  const active = wants.find((w) => w.id === want) ?? null;
  const shown = active ? items.filter((it) => it.controls.some((c) => active.match.test(c))) : items;
  const chip = (on: boolean) =>
    `inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-[15px] font-semibold transition-colors ${
      on ? "border-navy bg-navy text-white" : "border-line bg-white text-ink hover:border-navy"
    }`;

  return (
    <div>
      <div role="group" aria-label="What do you want to control?" className="flex flex-wrap gap-2">
        <button type="button" aria-pressed={!active} onClick={() => setWant(null)} className={chip(!active)}>
          All modules
        </button>
        {wants.map(({ id, label, icon: Icon }) => (
          <button key={id} type="button" aria-pressed={want === id} onClick={() => setWant(want === id ? null : id)} className={chip(want === id)}>
            <Icon size={18} aria-hidden="true" className={want === id ? "text-amber" : "text-link"} /> {label}
          </button>
        ))}
      </div>

      <div aria-live="polite" className="mt-5 min-h-[3.5rem]">
        {active ? (
          <p key={active.id} className="appdemo-in max-w-[760px] rounded-card border border-line bg-cloud p-4 text-body">
            <span className="font-semibold text-ink">
              {active.label}: {shown.length} {shown.length === 1 ? "module" : "modules"}.
            </span>{" "}
            {active.note}
          </p>
        ) : (
          <p className="text-body">Pick what you want to control and we will show the module for it.</p>
        )}
      </div>

      <ul className="mt-6 grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {shown.map((it, i) => (
          // the key changes with the filter, so the cards that stay or arrive animate in again in order
          <li key={`${want ?? "all"}-${it.slug}`} id={it.slug} style={{ "--i": Math.min(i, 6) } as React.CSSProperties} className="appdemo-in min-w-0 scroll-mt-28">
            {it.card}
          </li>
        ))}
      </ul>
    </div>
  );
}
