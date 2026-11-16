"use client";

import type { CSSProperties } from "react";
import { DoorOpen, Film, Home, Moon, type LucideIcon } from "lucide-react";
import { DEVICES, ROOM_NAME, SCENES, levelText } from "./data";
import { KIND_ICON } from "./RoomsView";

const SCENE_ICON: Record<string, LucideIcon> = { welcome: Home, movie: Film, night: Moon, away: DoorOpen };

export function ScenesView({ active, onScene }: { active: string | null; onScene: (id: string) => void }) {
  const scene = SCENES.find((s) => s.id === active);
  const set = scene ? DEVICES.filter((d) => scene.on[d.id] !== undefined) : [];

  return (
    <div>
      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {SCENES.map((s, i) => {
          const Icon = SCENE_ICON[s.id] ?? Home;
          const on = s.id === active;
          return (
            <li key={s.id} className="appdemo-in" style={{ "--i": i } as CSSProperties}>
              <button
                type="button"
                aria-pressed={on}
                onClick={() => onScene(s.id)}
                className={`flex min-h-[76px] w-full items-center gap-3 rounded-2xl border p-3 text-left transition-colors duration-200 focus-visible:outline-white ${
                  on
                    ? "border-amber bg-amber text-navy"
                    : "border-navy-700 bg-navy-800 text-white hover:bg-navy-700"
                }`}
              >
                <span
                  className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
                    on ? "bg-navy text-amber" : "bg-navy-700 text-mist"
                  }`}
                >
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[15px] font-semibold leading-tight">{s.name}</span>
                  <span className={`mt-1 block text-[13px] font-normal leading-snug ${on ? "text-navy" : "text-mist"}`}>
                    {s.note}
                  </span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-2xl border border-navy-700 p-4">
        {!scene ? (
          <p className="text-[14px] text-mist">Press a scene. One tap sets many switches across your rooms.</p>
        ) : (
          // keyed by scene so the rows animate in again, one after another
          <div key={scene.id}>
            <h4 className="text-[14px] font-semibold">What {scene.name} set</h4>
            <ul className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {set.map((d, i) => {
                const Icon = KIND_ICON[d.kind];
                const v = scene.on[d.id];
                return (
                  <li
                    key={d.id}
                    className="appdemo-in flex items-center gap-2.5 rounded-xl bg-navy-800 px-3 py-2"
                    style={{ "--i": i } as CSSProperties}
                  >
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber text-navy">
                      <Icon size={16} aria-hidden="true" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14px] font-semibold leading-tight">{d.name}</span>
                      <span className="block truncate text-[12px] leading-tight text-mist">{ROOM_NAME[d.room]}</span>
                    </span>
                    <span className="shrink-0 text-[13px] font-semibold text-amber">
                      {typeof v === "number" ? levelText(d, v) : "On"}
                    </span>
                  </li>
                );
              })}
              <li
                className="appdemo-in flex min-h-12 items-center rounded-xl bg-navy-800 px-3 py-2 text-[14px] text-mist"
                style={{ "--i": set.length } as CSSProperties}
              >
                {set.length === 0 ? "Every device off, in every room." : "Everything else off."}
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
