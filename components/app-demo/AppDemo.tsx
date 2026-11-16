"use client";

import { useEffect, useState } from "react";
import { CalendarClock, Clapperboard, LayoutGrid, Users, type LucideIcon } from "lucide-react";
import {
  DAY_END,
  INITIAL_STATE,
  ROOM_NAME,
  SCENES,
  SCHEDULE,
  START_TIME,
  countOn,
  devicesLabel,
  formatTime,
  isActive,
  sceneState,
  type Device,
  type HomeState,
  type RoomId,
} from "./data";
import { RoomsView } from "./RoomsView";
import { ScenesView } from "./ScenesView";
import { ScheduleView } from "./ScheduleView";

type View = "rooms" | "scenes" | "schedules";

const VIEWS: { id: View; name: string; icon: LucideIcon }[] = [
  { id: "rooms", name: "Rooms", icon: LayoutGrid },
  { id: "scenes", name: "Scenes", icon: Clapperboard },
  { id: "schedules", name: "Schedules", icon: CalendarClock },
];

/**
 * Interactive preview of the Homeasy app for /app: rooms, scenes and an example day of schedules.
 * It is a demo, not the real app, and says so. Nothing here talks to a server.
 * `launchNote` is shown while the app is not live (the page passes it when flags.APP_LIVE is false).
 */
export function AppDemo({ launchNote }: { launchNote?: string }) {
  const [view, setView] = useState<View>("rooms");
  const [room, setRoom] = useState<RoomId>("living");
  const [state, setState] = useState<HomeState>(INITIAL_STATE);
  const [scene, setScene] = useState<string | null>(null);
  const [time, setTime] = useState(START_TIME);
  const [wantPlay, setWantPlay] = useState(false);
  const playing = wantPlay && view === "schedules" && time < DAY_END;

  // Play moves through the example day; it only ever starts from the play button.
  useEffect(() => {
    if (!playing) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const step = reduce ? 30 : 5;
    const id = window.setInterval(() => setTime((t) => Math.min(DAY_END, t + step)), reduce ? 800 : 70);
    return () => window.clearInterval(id);
  }, [playing]);

  const changeView = (next: View) => {
    setWantPlay(false);
    setView(next);
  };

  const toggle = (id: string) => {
    setScene(null);
    setState((s) => ({ ...s, [id]: { ...s[id], on: !s[id].on } }));
  };

  /** Changing the speed or temperature also switches the device on. */
  const setLevel = (device: Device, level: number) => {
    if (!device.level) return;
    const clamped = Math.max(device.level.min, Math.min(device.level.max, level));
    setScene(null);
    setState((s) => ({ ...s, [device.id]: { on: true, level: s[device.id].on ? clamped : s[device.id].level } }));
  };

  const applyScene = (id: string) => {
    const target = SCENES.find((s) => s.id === id);
    if (!target) return;
    setScene(id);
    setState(sceneState(target));
  };

  const togglePlay = () => {
    if (playing) return setWantPlay(false);
    if (time >= DAY_END) setTime(0);
    setWantPlay(true);
  };

  const total = countOn(state);
  let summary: string;
  if (view === "schedules") {
    const n = SCHEDULE.filter((row) => isActive(row, time)).length;
    summary = `Example day · ${formatTime(time)} · ${devicesLabel(n)}`;
  } else if (view === "scenes") {
    const name = SCENES.find((s) => s.id === scene)?.name;
    summary = `${name ? `${name} · ` : ""}${devicesLabel(total)}`;
  } else {
    summary = `${devicesLabel(total)} · ${ROOM_NAME[room]}: ${countOn(state, room)} on`;
  }

  return (
    <div className="on-dark overflow-hidden rounded-[24px] bg-navy text-white lg:flex">
      <div
        role="group"
        aria-label="App screens"
        className="grid grid-cols-3 gap-1 border-b border-navy-700 p-2 lg:flex lg:w-[92px] lg:shrink-0 lg:flex-col lg:gap-2 lg:border-r lg:border-b-0 lg:p-3"
      >
        {VIEWS.map((v) => {
          const active = v.id === view;
          return (
            <button
              key={v.id}
              type="button"
              aria-pressed={active}
              onClick={() => changeView(v.id)}
              className={`flex min-h-12 items-center justify-center gap-2 rounded-xl px-2 text-[13px] font-semibold transition-colors duration-200 lg:min-h-[68px] lg:flex-col lg:gap-1.5 lg:text-[12px] ${
                active ? "bg-amber text-navy focus-visible:outline-white" : "text-mist hover:bg-navy-800 hover:text-white"
              }`}
            >
              <v.icon size={20} aria-hidden="true" />
              {v.name}
            </button>
          );
        })}
      </div>

      <div className="min-w-0 flex-1 p-4 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <p className="text-[15px] font-semibold">Homeasy app</p>
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[12px] font-semibold text-amber-800">
            Interactive preview
          </span>
          <p
            aria-live={playing ? "off" : "polite"}
            className="w-full text-[14px] text-mist tabular-nums sm:ml-auto sm:w-auto"
          >
            {summary}
          </p>
        </div>

        {/* keyed by view so each screen fades and slides in when it is opened */}
        <div key={view} className="appdemo-in mt-5 lg:min-h-[430px]">
          {view === "rooms" && (
            <RoomsView state={state} room={room} onRoom={setRoom} onToggle={toggle} onLevel={setLevel} />
          )}
          {view === "scenes" && <ScenesView active={scene} onScene={applyScene} />}
          {view === "schedules" && (
            <ScheduleView
              time={time}
              playing={playing}
              onTime={(t) => {
                setWantPlay(false);
                setTime(t);
              }}
              onPlayToggle={togglePlay}
            />
          )}
        </div>

        <p className="mt-5 flex items-start gap-2 border-t border-navy-700 pt-4 text-[13px] text-mist">
          <Users size={16} aria-hidden="true" className="mt-0.5 shrink-0" />
          <span>
            In the app, each family member gets their own access to the same rooms, scenes and schedules.
            {launchNote ? ` ${launchNote}` : ""}
          </span>
        </p>
      </div>
    </div>
  );
}
