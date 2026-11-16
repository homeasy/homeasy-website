import type { EstimatorData, EstimatorProduct, ModuleLine, RoomState } from "./types";

/** Buckets used by the survey form (ROOM_OPTIONS in lib/leads/schema.ts). Keep the en dashes. */
export function roomsBucket(count: number): string | null {
  if (count <= 0) return null;
  if (count === 1) return "1";
  if (count <= 3) return "2–3";
  if (count <= 5) return "4–5";
  return "Whole home";
}

/** Module list for the chosen rooms. Pure: the same input always gives the same list. */
export function estimate(data: EstimatorData, products: EstimatorProduct[], rooms: RoomState[]): ModuleLine[] {
  const applianceById = new Map(data.appliances.map((a) => [a.id, a]));
  const lines: ModuleLine[] = [];

  for (const rule of data.modules) {
    const product = products.find((p) => p.slug === rule.slug);
    if (!product) continue;

    let points = 0;
    for (const room of rooms) {
      let inRoom = 0;
      for (const [id, n] of Object.entries(room.counts)) {
        if (n > 0 && applianceById.get(id)?.module === rule.slug) inRoom += n;
      }
      points += rule.perRoom ? Math.min(inRoom, 1) : inRoom;
    }
    if (points === 0) continue;

    lines.push({
      slug: rule.slug,
      name: product.name,
      headline: product.headline,
      status: product.status,
      points,
      modules: rule.pointsPerModule ? Math.ceil(points / rule.pointsPerModule) : null,
      unit: rule.unit,
      unitPlural: rule.unitPlural,
      price: rule.price,
    });
  }
  return lines;
}

/** Appliance labels in use, in the JSON order (matches the survey form's order). */
export function applianceLabels(data: EstimatorData, rooms: RoomState[]): string[] {
  return data.appliances
    .filter((a) => rooms.some((r) => (r.counts[a.id] ?? 0) > 0))
    .map((a) => a.label)
    .filter((label, i, all) => all.indexOf(label) === i);
}

/** "5 light points", "1 fan". */
export function pointsLabel(line: ModuleLine): string {
  return `${line.points} ${line.points === 1 ? line.unit : line.unitPlural}`;
}
