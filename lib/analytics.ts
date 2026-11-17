/**
 * Analytics (PRD §14). The Google tag is on every public page (founder, 17 Nov 2026: Google could not see the tag
 * while it waited for the cookie choice). It starts in Google's "consent mode" with every kind of storage DENIED,
 * so no analytics cookie is set until the visitor presses Accept; until then Google receives cookieless page pings only.
 * Our own events go through track("event_name", { … }) and are sent only after Accept. Event names: PRD §14.1.
 */
export type ConsentChoice = "granted" | "denied";
const KEY = "he_consent";
const EVENT = "he-consent-change";

type Gtag = (...args: unknown[]) => void;
declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

import siteJson from "@/data/site.json";

/**
 * GA4 measurement ID (public, not a secret): NEXT_PUBLIC_GA_ID if set, otherwise the one in data/site.json.
 * Set NEXT_PUBLIC_GA_ID=off to switch analytics and the cookie banner off completely.
 */
const configured = process.env.NEXT_PUBLIC_GA_ID || siteJson.analytics.ga4;
export const GA_ID = configured === "off" ? "" : configured;

/**
 * The Google tag to load. GTM-P7JT2BRK and G-CDVCNJQLVJ are two IDs of the SAME Google tag (the first sends to every
 * destination of the tag, the second is the Analytics property), so only one is loaded: loading both would count twice.
 */
export const TAG_ID = !GA_ID ? "" : process.env.NEXT_PUBLIC_GA_ID ? GA_ID : siteJson.analytics.tag || GA_ID;

/**
 * The tag as one small inline script for the page's HTML. It sets the consent defaults FIRST and only then adds
 * Google's script, so the tag can never run before it knows the visitor's choice. It runs on homeasy.io only:
 * test addresses (localhost, previews) stay out of the reports unless localStorage "he_ga_test" is "1".
 */
export function tagSnippet(): string {
  return `(function(){try{var h=location.hostname;if(h!=="homeasy.io"&&h!=="www.homeasy.io"&&localStorage.getItem("he_ga_test")!=="1")return;}catch(e){return}
window.dataLayer=window.dataLayer||[];window.gtag=function(){dataLayer.push(arguments)};
var ok=false;try{ok=localStorage.getItem(${JSON.stringify(KEY)})==="granted"}catch(e){}
gtag("consent","default",{ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied",analytics_storage:ok?"granted":"denied"});
gtag("js",new Date());
var s=document.createElement("script");s.async=true;s.src="https://www.googletagmanager.com/gtm.js?id=${TAG_ID}";document.head.appendChild(s);})();`;
}

export function getConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* private mode: the choice lasts for this page only */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: choice }));
}

/** Lets the cookie banner and the analytics loader react when the choice changes. Returns an unsubscribe function. */
export function onConsentChange(callback: () => void): () => void {
  window.addEventListener(EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Tells the Google tag the visitor's choice (called when Accept or Reject is pressed, or changed later). */
export function sendConsent(choice: ConsentChoice): void {
  window.gtag?.("consent", "update", { analytics_storage: choice });
}

export function track(event: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined" || !GA_ID || getConsent() !== "granted" || !window.gtag) return;
  window.gtag("event", event, params);
}
