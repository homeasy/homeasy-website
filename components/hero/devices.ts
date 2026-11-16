/** Devices shared by the 3D scene, the 2D room and the app panel. */
export type DeviceId = "light" | "fan" | "lamp" | "tv" | "ac";
export type Devices = Record<DeviceId, boolean>;

export const DEVICE_LIST: { id: DeviceId; name: string; via: string }[] = [
  { id: "light", name: "Tube light", via: "Switch 4 · Homeasy module" },
  { id: "fan", name: "Ceiling fan", via: "Switch 1 · Homeasy module" },
  { id: "lamp", name: "Table lamp", via: "Switch 2 · Homeasy module" },
  { id: "tv", name: "TV", via: "Switch 3 · Homeasy module" },
  { id: "ac", name: "AC", via: "Homeasy IR remote" },
];

export const ALL_OFF: Devices = { light: false, fan: false, lamp: false, tv: false, ac: false };

export const SCENES: { id: string; name: string; devices: Devices }[] = [
  { id: "welcome", name: "Welcome home", devices: { light: true, fan: true, lamp: true, tv: false, ac: false } },
  { id: "movie", name: "Movie time", devices: { light: false, fan: true, lamp: true, tv: true, ac: true } },
  { id: "night", name: "Good night", devices: { light: false, fan: true, lamp: false, tv: false, ac: true } },
];

export const DEVICE_NAMES: Record<DeviceId, string> = {
  light: "Tube light",
  fan: "Ceiling fan",
  lamp: "Table lamp",
  tv: "TV",
  ac: "AC (IR remote)",
};
