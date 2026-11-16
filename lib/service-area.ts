import areas from "@/data/service-areas.json";

export type ServiceAreaResult =
  | { status: "invalid" }
  | { status: "out_of_area" }
  | { status: "served"; region: string; tier: "patna" | "bihar" };

/** Checks a 6-digit Indian pincode against data/service-areas.json (PRD §9, F2). */
export function checkPincode(input: string): ServiceAreaResult {
  const pincode = input.replace(/\s/g, "");
  if (!/^[1-9]\d{5}$/.test(pincode)) return { status: "invalid" };
  const match = areas.regions.find((r) => pincode.startsWith(r.prefix));
  if (!match) return { status: "out_of_area" };
  return { status: "served", region: match.name, tier: match.tier as "patna" | "bihar" };
}
