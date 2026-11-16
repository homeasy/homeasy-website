"use client";

import { Pause, Play, RotateCcw } from "lucide-react";
import { DAY_END, DAY_MINUTES, SCHEDULE, formatTime, isActive } from "./data";
import { KIND_ICON } from "./RoomsView";

const pct = (minutes: number) => `${(minutes / DAY_MINUTES) * 100}%`;
const TICKS = ["12 am", "6 am", "12 pm", "6 pm", "12 am"];

export function ScheduleView({
  time,
  playing,
  onTime,
  onPlayToggle,
}: {
  time: number;
  playing: boolean;
  onTime: (minutes: number) => void;
  onPlayToggle: () => void;
}) {
  const atEnd = time >= DAY_END;
  const PlayIcon = playing ? Pause : atEnd ? RotateCcw : Play;
  const playLabel = playing ? "Pause" : atEnd ? "Play the day again" : "Play the day";

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          aria-label={playLabel}
          onClick={onPlayToggle}
          className="inline-flex size-12 shrink-0 items-center justify-center rounded-full bg-blue text-navy transition-colors hover:bg-blue-400 focus-visible:outline-white"
        >
          <PlayIcon size={20} aria-hidden="true" />
        </button>
        <div className="min-w-0">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-mist">Now</p>
          <p className="text-[1.5rem] font-semibold leading-tight tabular-nums">{formatTime(time)}</p>
        </div>
        <span className="ml-auto rounded-full bg-navy-800 px-3 py-1 text-[12px] font-semibold text-mist">Example day</span>
      </div>

      <ul className="mt-5 space-y-3">
        {SCHEDULE.map((row, i) => {
          const Icon = KIND_ICON[row.kind];
          const on = isActive(row, time);
          return (
            <li key={row.id} className="appdemo-in" style={{ ["--i" as string]: i }}>
              <div className="flex items-center gap-2.5">
                <span
                  className={`inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200 ${
                    on ? "bg-amber text-navy" : "bg-navy-700 text-mist"
                  }`}
                >
                  <Icon size={16} aria-hidden="true" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[14px] font-semibold leading-tight">{row.name}</span>
                  <span className="block truncate text-[12px] leading-tight text-mist">
                    {row.room} · {formatTime(row.start)} to {formatTime(row.end)}
                  </span>
                </span>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-[12px] font-semibold transition-colors duration-200 ${
                    on ? "bg-amber text-navy" : "bg-navy-800 text-mist"
                  }`}
                >
                  {on ? "On" : "Off"}
                </span>
              </div>
              {/* px-2 keeps the blocks roughly in line with the centre of the slider thumb below */}
              <div className="mt-2 px-2" aria-hidden="true">
                <div className="relative h-3 rounded-full bg-navy-800">
                  <span
                    className={`absolute inset-y-0 min-w-1.5 rounded-full transition-colors duration-200 ${
                      on ? "bg-amber" : "bg-blue"
                    }`}
                    style={{ left: pct(row.start), width: pct(row.end - row.start) }}
                  />
                  <span className="absolute -inset-y-1 w-0.5 -translate-x-1/2 bg-white" style={{ left: pct(time) }} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-3">
        <label htmlFor="appdemo-time" className="sr-only">
          Time of day
        </label>
        <input
          id="appdemo-time"
          type="range"
          min={0}
          max={DAY_END}
          step={5}
          value={time}
          aria-valuetext={formatTime(time)}
          onChange={(e) => onTime(Number(e.target.value))}
          className="block h-11 w-full cursor-pointer accent-amber focus-visible:outline-white"
        />
        <div aria-hidden="true" className="flex justify-between px-2 text-[12px] text-mist">
          {TICKS.map((t, i) => (
            <span key={i}>{t}</span>
          ))}
        </div>
      </div>

      <p className="mt-4 text-[13px] text-mist">
        An example day. Drag the slider or press play. Everything is off by 11:00 pm.
      </p>
    </div>
  );
}
