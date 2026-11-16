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

/**
 * Founder decision 16 Nov 2026: the public launch is planned for January 2027. Until LAUNCHED=true the site is in
 * "early access" mode: the core modules and the app read "Launching January 2027", online buying is off, and the
 * announcement bar invites people to the early-access list. Set LAUNCHED=true on launch day; the three flags below
 * that default to it can still be set one by one.
 */
const launched = bool(env.LAUNCHED, false);

export const flags = {
  LAUNCHED: launched,
  SHOW_PRICES: bool(env.SHOW_PRICES, false),
  // Online buying (cart, checkout). On from launch; before that the site shows survey → quote → install only.
  SHOW_CART: bool(env.SHOW_CART, launched),
  // "Delivery across Bihar" wording and delivery of online orders: on from launch.
  DELIVERY_ENABLED: bool(env.DELIVERY_ENABLED, launched),
  SHOW_INSTALLS: bool(env.SHOW_INSTALLS, false),
  // The app goes live with the launch.
  APP_LIVE: bool(env.APP_LIVE, launched),
  // The early-access bar shows until launch.
  SHOW_ANNOUNCEMENT: bool(env.SHOW_ANNOUNCEMENT, !launched),
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
