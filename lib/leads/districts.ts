/** Which Bihar district a lead's pincode is in (India Post directory; see scripts/geo/build-bihar-map.py). Server-side helper. */
import table from "@/data/bihar-pincodes.json";
import map from "@/data/bihar-districts.json";

const PINS = table.pins as Record<string, number>;
const NAMES = new Map(map.districts.map((d) => [d.id, d.name]));

/** District id for a pincode, or null when the pincode is not in the Bihar directory. */
export const districtId = (pincode: string | null | undefined): number | null => (pincode && pincode in PINS ? PINS[pincode] : null);
export const districtName = (pincode: string | null | undefined): string => {
  const id = districtId(pincode);
  return id === null ? "" : (NAMES.get(id) ?? "");
};
export const DISTRICT_NAMES = [...NAMES.values()].sort();
