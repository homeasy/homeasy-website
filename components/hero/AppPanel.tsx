"use client";

import { AirVent, Fan, Lamp, Lightbulb, Tv, type LucideIcon } from "lucide-react";
import { DEVICE_LIST, SCENES, type DeviceId, type Devices } from "./devices";

const ICONS: Record<DeviceId, LucideIcon> = {
  light: Lightbulb,
  fan: Fan,
  lamp: Lamp,
  tv: Tv,
  ac: AirVent,
};

type Props = {
  devices: Devices;
  onToggle: (id: DeviceId) => void;
  onScene: (devices: Devices) => void;
  className?: string;
  /** "card" = stacked list (mobile), "bar" = slim strip along the bottom of the room (desktop) */
  variant?: "card" | "bar";
};

function sceneActive(target: Devices, current: Devices) {
  return (Object.keys(target) as DeviceId[]).every((k) => target[k] === current[k]);
}

function AppBar({ devices, onToggle, onScene, className = "" }: Props) {
  return (
    <div className={`on-dark rounded-[18px] border border-navy-700 bg-navy/95 p-2.5 text-white ${className}`}>
      <div className="flex items-center gap-2 px-1">
        <p className="hidden whitespace-nowrap text-[13px] font-semibold xl:block">Homeasy app</p>
        <span
          className="whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800"
        >
          Try it
        </span>
        <div className="ml-auto flex gap-1">
          {SCENES.map((s) => {
            const active = sceneActive(s.devices, devices);
            return (
              <button
                key={s.id}
                type="button"
                aria-pressed={active}
                onClick={() => onScene(s.devices)}
                className={`min-h-8 whitespace-nowrap rounded-full px-2.5 text-[12px] font-semibold transition-colors ${
                  active ? "bg-amber text-navy" : "bg-navy-800 text-white hover:bg-navy-700"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>
      </div>
      <ul className="mt-2 grid grid-cols-5 gap-1.5">
        {DEVICE_LIST.map(({ id, name }) => {
          const Icon = ICONS[id];
          const on = devices[id];
          return (
            <li key={id}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => onToggle(id)}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 rounded-xl px-1 py-1.5 text-[12px] font-semibold transition-colors ${
                  on ? "bg-amber text-navy" : "bg-navy-800 text-white hover:bg-navy-700"
                }`}
              >
                <Icon size={18} aria-hidden="true" />
                <span className="whitespace-nowrap leading-none">{name}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Phone-style Homeasy app panel that drives the room (3D or 2D).
 * An interactive demo of the app (labelled "Try it"); the real app launches with the website.
 */
export function AppPanel(props: Props) {
  if (props.variant === "bar") return <AppBar {...props} />;
  const { devices, onToggle, onScene, className = "" } = props;
  const onCount = Object.values(devices).filter(Boolean).length;
  return (
    <div className={`on-dark rounded-[22px] border border-navy-700 bg-navy p-3 text-white ${className}`}>
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold leading-tight">Homeasy app · Living room</p>
          <p className="text-[11px] leading-tight text-mist">
            {onCount === 0 ? "Everything off" : `${onCount} on`}
          </p>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-semibold text-amber-800">
          Try it
        </span>
      </div>

      <div className="mt-2.5 flex gap-1.5 overflow-x-auto pb-0.5">
        {SCENES.map((s) => {
          const active = sceneActive(s.devices, devices);
          return (
            <button
              key={s.id}
              type="button"
              aria-pressed={active}
              onClick={() => onScene(s.devices)}
              className={`min-h-9 shrink-0 rounded-full px-3 text-[12px] font-semibold transition-colors ${
                active ? "bg-amber text-navy" : "bg-navy-800 text-white hover:bg-navy-700"
              }`}
            >
              {s.name}
            </button>
          );
        })}
      </div>

      <ul className="mt-2 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-1">
        {DEVICE_LIST.map(({ id, name, via }) => {
          const Icon = ICONS[id];
          const on = devices[id];
          return (
            <li key={id}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => onToggle(id)}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-xl bg-navy-800 px-2.5 py-1.5 text-left hover:bg-navy-700"
              >
                <span
                  className={`inline-flex size-7 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    on ? "bg-amber text-navy" : "bg-navy-700 text-mist"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[13px] font-semibold leading-tight">{name}</span>
                  <span className="block truncate text-[11px] leading-tight text-mist">{via}</span>
                </span>
                <span
                  aria-hidden="true"
                  className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${on ? "bg-amber" : "bg-navy-700"}`}
                >
                  <span
                    className={`absolute top-0.5 size-4 rounded-full bg-white transition-transform ${
                      on ? "translate-x-[18px]" : "translate-x-0.5"
                    }`}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
