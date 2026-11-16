import { AirVent, Cable, Fan, Plug, ToggleRight, Zap, type LucideIcon } from "lucide-react";

/** Icon shown for a product that has no photo yet. Keys match PRODUCT_ICONS in lib/store/products.ts. */
export const PRODUCT_ICON_MAP: Record<string, LucideIcon> = {
  relay: ToggleRight,
  fan: Fan,
  power: Zap,
  ir: AirVent,
  "no-neutral": Cable,
  plug: Plug,
};
export const PRODUCT_ICON_LABELS: Record<string, string> = {
  relay: "Switch / relay",
  fan: "Fan",
  power: "Heavy load",
  ir: "AC / remote",
  "no-neutral": "Wiring",
  plug: "Plug",
};
