import siteJson from "@/data/site.json";

/**
 * Company facts from data/site.json. The public address can be overridden with NEXT_PUBLIC_SITE_URL,
 * e.g. https://beta.homeasy.io while the new site is on a test address.
 */
export const site = { ...siteJson, url: (process.env.NEXT_PUBLIC_SITE_URL || siteJson.url).replace(/\/$/, "") };

/** true on any address other than the real one (beta, previews): such sites must not be indexed by search engines. */
export const isTestSite = site.url !== siteJson.url || process.env.SITE_NOINDEX === "true";
