"use client";

import type { CSSProperties } from "react";
import { AirVent, Fan, Lamp, Lightbulb, Minus, Plus, ShowerHead, Tv, type LucideIcon } from "lucide-react";
import {
  DEVICES,
  ROOMS,
  countOn,
  devicesLabel,
  levelText,
  statusText,
  type Device,
  type DeviceState,
  type HomeState,
  type Kind,
  type RoomId,
} from "./data";

export const KIND_ICON: Record<Kind, LucideIcon> = {
  light: Lightbulb,
  lamp: Lamp,
  fan: Fan,
  ac: AirVent,
  tv: Tv,
  geyser: ShowerHead,
};

/** Fan speed 1 (slow) to 5 (fast) as seconds per turn. */
const spinSeconds = (speed: number) => 2.4 - speed * 0.4;

function Tile({
  device,
  state,
  index,
  onToggle,
  onLevel,
}: {
  device: Device;
  state: DeviceState;
  index: number;
  onToggle: () => void;
  onLevel: (level: number) => void;
}) {
  const Icon = KIND_ICON[device.kind];
  const { on } = state;
  const level = state.level ?? device.level?.initial ?? 0;
  const spinning = device.kind === "fan" && on;
  const what = device.kind === "ac" ? "temperature" : "speed";
  const stepBtn = `inline-flex size-11 shrink-0 items-center justify-center rounded-xl transition-colors disabled:opacity-40 ${
    on
      ? "bg-navy text-white hover:bg-navy-800 focus-visible:outline-navy"
      : "bg-navy-700 text-white hover:bg-navy focus-visible:outline-white"
  }`;

  return (
    <li
      className={`appdemo-in rounded-2xl border transition-colors duration-200 ${
        on ? "border-amber bg-amber text-navy" : "border-navy-700 bg-navy-800 text-white"
      }`}
      style={{ "--i": index } as CSSProperties}
    >
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={device.via ? `${device.name}, through the ${device.via}` : device.name}
        onClick={onToggle}
        className="flex min-h-[68px] w-full items-center gap-3 rounded-2xl p-3 text-left focus-visible:outline-white"
      >
        <span
          className={`inline-flex size-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-200 ${
            on ? "bg-navy text-amber" : "bg-navy-700 text-mist"
          }`}
        >
          <Icon
            size={20}
            aria-hidden="true"
            className={spinning ? "animate-spin" : undefined}
            style={spinning ? { animationDuration: `${spinSeconds(level)}s` } : undefined}
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[15px] font-semibold leading-tight">{device.name}</span>
          <span className={`mt-0.5 block truncate text-[13px] font-normal leading-tight ${on ? "text-navy" : "text-mist"}`}>
            {device.via ? `${device.via} · ` : ""}
            {statusText(device, state)}
          </span>
        </span>
        <span
          aria-hidden="true"
          className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${on ? "bg-navy" : "bg-navy-700"}`}
        >
          <span
            className={`absolute top-1 size-4 rounded-full transition-transform duration-200 ${
              on ? "translate-x-6 bg-amber" : "translate-x-1 bg-mist"
            }`}
          />
        </span>
      </button>

      {device.level && (
        <div role="group" aria-label={`${device.name} ${what}`} className="flex items-center gap-2 px-3 pb-3">
          <button
            type="button"
            aria-label={`Lower ${what}`}
            disabled={on && level <= device.level.min}
            onClick={() => onLevel(level - 1)}
            className={stepBtn}
          >
            <Minus size={18} aria-hidden="true" />
          </button>
          <span className="min-w-0 flex-1 text-center text-[15px] font-semibold tabular-nums">
            {levelText(device, level)}
          </span>
          <button
            type="button"
            aria-label={`Raise ${what}`}
            disabled={on && level >= device.level.max}
            onClick={() => onLevel(level + 1)}
            className={stepBtn}
          >
            <Plus size={18} aria-hidden="true" />
          </button>
        </div>
      )}
    </li>
  );
}

export function RoomsView({
  state,
  room,
  onRoom,
  onToggle,
  onLevel,
}: {
  state: HomeState;
  room: RoomId;
  onRoom: (room: RoomId) => void;
  onToggle: (id: string) => void;
  onLevel: (device: Device, level: number) => void;
}) {
  const devices = DEVICES.filter((d) => d.room === room);
  return (
    <div>
      <div role="group" aria-label="Choose a room" className="-mx-1 flex gap-2 overflow-x-auto px-1 py-1">
        {ROOMS.map((r) => {
          const active = r.id === room;
          const n = countOn(state, r.id);
          return (
            <button
              key={r.id}
              type="button"
              aria-pressed={active}
              aria-label={`${r.name}, ${devicesLabel(n).toLowerCase()}`}
              onClick={() => onRoom(r.id)}
              className={`inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                active ? "bg-white text-navy" : "bg-navy-800 text-white hover:bg-navy-700"
              }`}
            >
              {r.name}
              <span
                aria-hidden="true"
                className={`inline-flex min-w-6 items-center justify-center rounded-full px-1.5 text-[12px] leading-6 tabular-nums transition-colors ${
                  n > 0 ? "bg-amber text-navy" : active ? "bg-cloud text-navy" : "bg-navy-700 text-mist"
                }`}
              >
                {n}
              </span>
            </button>
          );
        })}
      </div>

      {/* keyed by room so the tiles animate in again when the room changes */}
      <ul key={room} className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {devices.map((d, i) => (
          <Tile
            key={d.id}
            device={d}
            state={state[d.id]}
            index={i}
            onToggle={() => onToggle(d.id)}
            onLevel={(level) => onLevel(d, level)}
          />
        ))}
      </ul>
    </div>
  );
}
