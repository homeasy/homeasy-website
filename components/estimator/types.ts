/** Shape of data/estimator.json (PRD §8.18). Plain data: safe to pass from the server page to the client estimator. */
export type EstimatorModuleRule = {
  /** Product slug in data/products.json. */
  slug: string;
  unit: string;
  unitPlural: string;
  /** How many points one module handles. null = not confirmed yet: the UI shows points to cover, not a module count. */
  pointsPerModule: number | null;
  /** true = one module covers every mapped appliance in the same room (IR Remote). */
  perRoom: boolean;
  /** "From" price per module in rupees. null until final (honesty rule: no invented prices). */
  price: number | null;
};

export type EstimatorAppliance = {
  id: string;
  /** Must match a value of APPLIANCES in lib/leads/schema.ts (survey form pre-fill). */
  label: string;
  question: string;
  hint?: string;
  kind: "count" | "toggle";
  max: number;
  /** Slug of the module this appliance needs. */
  module: string;
};

export type EstimatorRoomType = {
  id: string;
  label: string;
  appliances: string[];
  defaults: Record<string, number>;
};

export type EstimatorData = {
  homeTypes: string[];
  maxRooms: number;
  modules: EstimatorModuleRule[];
  appliances: EstimatorAppliance[];
  rooms: EstimatorRoomType[];
  copy: Record<
    | "homeTitle"
    | "homeHint"
    | "roomsTitle"
    | "roomsHint"
    | "controlTitle"
    | "controlHint"
    | "controlEmpty"
    | "resultTitle"
    | "resultEmpty"
    | "resultIndicative"
    | "relayPending"
    | "noPrice"
    | "priceOffNote"
    | "priceOnNote"
    | "ctaPrimary"
    | "ctaWhatsapp"
    | "reset",
    string
  > & { steps: string[] };
  note: string;
};

/** Module names and status, read from data/products.json by the server page. */
export type EstimatorProduct = { slug: string; name: string; headline: string; status: string };

export type RoomState = { uid: number; type: string; counts: Record<string, number> };

export type ModuleLine = {
  slug: string;
  name: string;
  headline: string;
  status: string;
  /** Points to cover (light points, fans, rooms…). */
  points: number;
  /** Modules needed, or null when pointsPerModule is not confirmed. */
  modules: number | null;
  unit: string;
  unitPlural: string;
  price: number | null;
};
