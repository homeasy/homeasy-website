"use client";

import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { GA_ID, getConsent, onConsentChange, setConsent } from "@/lib/analytics";

const OPEN_EVENT = "he-cookie-settings";
/** Opens the cookie choices again (used by the "Cookie settings" link in the footer). */
export function openCookieSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

/**
 * Cookie choice (PRD §9, §15): Accept, Reject, or Preferences. Shown only when analytics is configured
 * (NEXT_PUBLIC_GA_ID), because without it the site sets no optional cookies and there is nothing to ask.
 * Nothing optional loads until "Accept".
 */
export function CookieBanner() {
  const consent = useSyncExternalStore(onConsentChange, getConsent, () => "denied" as const);
  const [reopened, setReopened] = useState(false);
  const [prefs, setPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(false);

  useEffect(() => {
    const open = () => {
      setAnalytics(getConsent() === "granted");
      setPrefs(true);
      setReopened(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  if (!GA_ID || (consent !== null && !reopened)) return null;
  const choose = (choice: "granted" | "denied") => {
    setConsent(choice);
    setReopened(false);
    setPrefs(false);
  };

  const small = "inline-flex min-h-9 items-center rounded-button px-3.5 text-[14px] font-semibold";
  return (
    <section
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-16 z-50 border-t border-line bg-white px-4 py-3 lg:inset-x-auto lg:bottom-6 lg:left-6 lg:w-[380px] lg:rounded-card lg:border"
    >
      {prefs ? (
        <>
          <h2 className="text-[15px] font-semibold text-ink">Cookie preferences</h2>
          <ul className="mt-2 space-y-2 text-[14px] text-body">
            <li className="flex items-start gap-2.5">
              <input type="checkbox" checked disabled aria-label="Necessary cookies, always on" className="mt-0.5 size-4" />
              <span>
                <strong className="font-semibold text-ink">Necessary</strong>: your cart, chat and this choice. Always on.
              </span>
            </li>
            <li>
              <label className="flex cursor-pointer items-start gap-2.5">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-0.5 size-4 accent-[var(--brand-navy)]" />
                <span>
                  <strong className="font-semibold text-ink">Analytics</strong>: Google Analytics, to see which pages are used. No ads.
                </span>
              </label>
            </li>
          </ul>
          <button type="button" className={`${small} mt-3 bg-blue text-navy`} onClick={() => choose(analytics ? "granted" : "denied")}>
            Save my choice
          </button>
        </>
      ) : (
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start">
          <p className="text-[14px] leading-snug text-body">
            <span className="sr-only">Cookies: </span>May we use Google Analytics to see which pages are useful?{" "}
            <Link href="/cookie-policy" className="link">
              Cookie policy
            </Link>
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button type="button" className={`${small} bg-blue text-navy`} onClick={() => choose("granted")}>
              Accept
            </button>
            <button type="button" className={`${small} border border-line text-ink`} onClick={() => choose("denied")}>
              Reject
            </button>
            <button type="button" className="min-h-9 px-1 text-[14px] font-semibold text-link underline underline-offset-2" onClick={() => setPrefs(true)}>
              Preferences
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

/** Footer link that reopens the choices. Hidden when analytics is not configured. */
export function CookieSettingsLink({ className = "" }: { className?: string }) {
  if (!GA_ID) return null;
  return (
    <button type="button" onClick={openCookieSettings} className={className}>
      Cookie settings
    </button>
  );
}
