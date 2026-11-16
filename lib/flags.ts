/**
 * Feature flags (PRD §16.3). Read on the server at build time from environment variables,
 * e.g. SHOW_PRICES=true in .env.local. Defaults keep every unproven claim hidden.
 * Pass the values you need down to client components as props.
 */
function bool(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") return fallback;
  return value === "true" || value === "1";
}

const env = process.env;

export const flags = {
  SHOW_PRICES: bool(env.SHOW_PRICES, false),
  // Online buying (cart, checkout). Founder decision 16 Nov 2026: on. Set SHOW_CART=false to show survey → quote → install only.
  SHOW_CART: bool(env.SHOW_CART, true),
  // "Delivery across Bihar" wording and delivery of online orders.
  DELIVERY_ENABLED: bool(env.DELIVERY_ENABLED, true),
  SHOW_INSTALLS: bool(env.SHOW_INSTALLS, false),
  // Founder decision (16 Nov 2026): the app launches together with the website, so this is on by default.
  // Set APP_LIVE=false if the site ever has to go live before the app.
  APP_LIVE: bool(env.APP_LIVE, true),
  SHOW_ANNOUNCEMENT: bool(env.SHOW_ANNOUNCEMENT, false),
  SHOW_INVESTORS_PAGE: bool(env.SHOW_INVESTORS_PAGE, true),
  SHOW_BLOG: bool(env.SHOW_BLOG, false),
  SHOW_CERTIFICATIONS: bool(env.SHOW_CERTIFICATIONS, false),
  SHOW_DEMO: bool(env.SHOW_DEMO, false),
} as const;

/**
 * USP flags (PRD §5.7, F27). A promise shows on the site only when operations can deliver it
 * every time. U2 = 30-min WhatsApp reply, U3 = "Same look" guarantee, U5 = 24-h visit, etc.
 * All default to false until the pilot proves them.
 */
export type UspId = "U1" | "U2" | "U3" | "U4" | "U5" | "U6" | "U7" | "U8" | "U9" | "U10" | "U11" | "U12";

export function usp(id: UspId): boolean {
  return bool(env[`USP_${id}`], false);
}
