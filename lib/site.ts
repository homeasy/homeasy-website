import siteJson from "@/data/site.json";

/**
 * The address this build is served on. Order: NEXT_PUBLIC_SITE_URL if set; on Vercel, the project's
 * production domain (beta.homeasy.io today, homeasy.io once that domain is added and the site is redeployed);
 * otherwise the address in data/site.json. Canonical links, the sitemap and share images all use it.
 */
const vercelDomain = process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "";
const url = (process.env.NEXT_PUBLIC_SITE_URL || vercelDomain || siteJson.url).replace(/\/$/, "");

/** Company facts from data/site.json. Contact details shown to visitors come from lib/site-live.ts (editable in the admin). */
export const site = {
  ...siteJson,
  url,
  /** Where surveys are offered, in words (config: data/site.json or NEXT_PUBLIC_SERVICE_AREA_LABEL). */
  serviceAreaLabel: process.env.NEXT_PUBLIC_SERVICE_AREA_LABEL || siteJson.serviceAreaLabel,
};

/** The real, public addresses. Every other host (beta, previews, localhost) is kept out of search engines by proxy.ts. */
export const PRODUCTION_HOSTS = ["homeasy.io", "www.homeasy.io"];
export const isProductionHost = (host: string) => PRODUCTION_HOSTS.includes(host.split(":")[0].toLowerCase());
