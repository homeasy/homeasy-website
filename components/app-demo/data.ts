/**
 * Example home for the app preview on /app. Only things Homeasy controls: switched loads through
 * modules (lights, fans, geyser) and the AC and TV through the IR remote. No energy figures, no voice.
 */
export type RoomId = "living" | "bedroom" | "kitchen";
export type Kind = "light" | "lamp" | "fan" | "ac" | "tv" | "geyser";

export type Device = {
  id: string;
  room: RoomId;
  kind: Kind;
  name: string;
  /** Shown under the name for devices that go through the IR remote. */
  via?: string;
  /** Adjustable setting: fan speed 1 to 5, AC temperature in °C. */
  level?: { min: number; max: number; initial: number };
};

export type DeviceState = { on: boolean; level?: number };
export type HomeState = Record<string, DeviceState>;

export const ROOMS: { id: RoomId; name: string }[] = [
  { id: "living", name: "Living room" },
  { id: "bedroom", name: "Bedroom" },
  { id: "kitchen", name: "Kitchen and bath" },
];

const FAN = { min: 1, max: 5, initial: 3 };
const AC = { min: 18, max: 30, initial: 24 };

export const DEVICES: Device[] = [
  { id: "living-light", room: "living", kind: "light", name: "Tube light" },
  { id: "living-lamp", room: "living", kind: "lamp", name: "Table lamp" },
  { id: "living-fan", room: "living", kind: "fan", name: "Ceiling fan", level: FAN },
  { id: "living-ac", room: "living", kind: "ac", name: "AC", via: "IR remote", level: AC },
  { id: "living-tv", room: "living", kind: "tv", name: "TV", via: "IR remote" },
  { id: "bedroom-light", room: "bedroom", kind: "light", name: "Light" },
  { id: "bedroom-fan", room: "bedroom", kind: "fan", name: "Ceiling fan", level: FAN },
  { id: "bedroom-ac", room: "bedroom", kind: "ac", name: "AC", via: "IR remote", level: AC },
  { id: "kitchen-light", room: "kitchen", kind: "light", name: "Kitchen light" },
  { id: "bath-light", room: "kitchen", kind: "light", name: "Bathroom light" },
  { id: "geyser", room: "kitchen", kind: "geyser", name: "Geyser" },
];

export const ROOM_NAME: Record<RoomId, string> = { living: "Living room", bedroom: "Bedroom", kitchen: "Kitchen and bath" };

/** A scene lists what it switches on (with a setting where there is one). Everything else goes off. */
export type Scene = { id: string; name: string; note: string; on: Record<string, number | true> };

export const SCENES: Scene[] = [
  {
    id: "welcome",
    name: "Welcome home",
    note: "Lights and fan on in the living room.",
    on: { "living-light": true, "living-lamp": true, "living-fan": 3, "kitchen-light": true },
  },
  {
    id: "movie",
    name: "Movie time",
    note: "Main light off, lamp and TV on.",
    on: { "living-lamp": true, "living-tv": true, "living-fan": 2, "living-ac": 24 },
  },
  {
    id: "night",
    name: "Good night",
    note: "Only the bedroom fan and AC stay on.",
    on: { "bedroom-fan": 2, "bedroom-ac": 25 },
  },
  { id: "away", name: "Away", note: "Everything off before you leave.", on: {} },
];

function build(on: Record<string, number | true>): HomeState {
  const state: HomeState = {};
  for (const d of DEVICES) {
    const v = on[d.id];
    state[d.id] = { on: v !== undefined, level: d.level ? (typeof v === "number" ? v : d.level.initial) : undefined };
  }
  return state;
}

export const sceneState = (scene: Scene): HomeState => build(scene.on);

/** What the preview shows first: an ordinary evening. */
export const INITIAL_STATE: HomeState = build({ "living-light": true, "living-fan": 3 });

export function levelText(device: Device, level: number | undefined): string {
  if (level === undefined) return "";
  return device.kind === "ac" ? `${level}°C` : `Speed ${level}`;
}

export function statusText(device: Device, s: DeviceState): string {
  if (!s.on) return "Off";
  return device.level ? levelText(device, s.level) : "On";
}

export const countOn = (state: HomeState, room?: RoomId): number =>
  DEVICES.filter((d) => (!room || d.room === room) && state[d.id]?.on).length;

export const devicesLabel = (n: number): string =>
  n === 0 ? "Everything off" : n === 1 ? "1 device on" : `${n} devices on`;

/* ---------- Example day for the Schedules view ---------- */

/** Minutes from midnight. The slider moves in 5-minute steps and stops at 11:55 pm. */
export const DAY_END = 1435;
export const DAY_MINUTES = 1440;
/** Fixed start time (never read the clock while rendering). */
export const START_TIME = 6 * 60 + 15;

export type ScheduleRow = { id: string; kind: Kind; name: string; room: string; start: number; end: number };

export const SCHEDULE: ScheduleRow[] = [
  { id: "geyser", kind: "geyser", name: "Geyser", room: "Bathroom", start: 6 * 60, end: 6 * 60 + 45 },
  { id: "kitchen", kind: "light", name: "Kitchen light", room: "Kitchen", start: 6 * 60, end: 7 * 60 + 30 },
  { id: "evening", kind: "lamp", name: "Evening lights", room: "Living room", start: 18 * 60, end: 23 * 60 },
  { id: "bedroom-ac", kind: "ac", name: "Bedroom AC", room: "IR remote", start: 21 * 60 + 30, end: 23 * 60 },
];

export const isActive = (row: ScheduleRow, time: number): boolean => time >= row.start && time < row.end;

export function formatTime(minutes: number): string {
  const h = Math.floor(minutes / 60) % 24;
  const m = minutes % 60;
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}:${String(m).padStart(2, "0")} ${h < 12 ? "am" : "pm"}`;
}
