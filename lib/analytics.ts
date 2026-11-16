/**
 * Analytics, consent-gated (PRD §14). Nothing is sent, and no analytics script is loaded, until the visitor
 * accepts analytics cookies. Call track("event_name", { … }) from client code; it is a no-op without consent
 * or when no measurement ID is configured. Event names: PRD §14.1.
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

export function track(event: string, params: Record<string, string | number | boolean> = {}): void {
  if (typeof window === "undefined" || !GA_ID || getConsent() !== "granted" || !window.gtag) return;
  window.gtag("event", event, params);
}
