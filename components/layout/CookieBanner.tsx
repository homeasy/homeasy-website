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

  return (
    <section
      aria-label="Cookie choices"
      className="fixed inset-x-0 bottom-16 z-50 border-t border-line bg-white p-4 lg:bottom-0 lg:left-auto lg:right-6 lg:bottom-6 lg:w-[420px] lg:rounded-card lg:border"
    >
      <h2 className="text-[1.0625rem] font-semibold text-ink">Cookies</h2>
      {prefs ? (
        <>
          <ul className="mt-3 space-y-3 text-[15px] text-body">
            <li className="flex items-start gap-3">
              <input type="checkbox" checked disabled aria-label="Necessary cookies, always on" className="mt-1 size-5" />
              <span>
                <strong className="font-semibold text-ink">Necessary</strong>: your cart and this choice. Always on.
              </span>
            </li>
            <li>
              <label className="flex cursor-pointer items-start gap-3">
                <input type="checkbox" checked={analytics} onChange={(e) => setAnalytics(e.target.checked)} className="mt-1 size-5 accent-[var(--brand-navy)]" />
                <span>
                  <strong className="font-semibold text-ink">Analytics</strong>: Google Analytics, to see which pages are used. No ads.
                </span>
              </label>
            </li>
          </ul>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary min-h-11 px-5" onClick={() => choose(analytics ? "granted" : "denied")}>
              Save my choice
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="mt-2 text-[15px] text-body">
            We would like to use Google Analytics to see which pages are useful. It is off unless you accept. See our{" "}
            <Link href="/cookie-policy" className="link">
              Cookie policy
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary min-h-11 px-5" onClick={() => choose("granted")}>
              Accept
            </button>
            <button type="button" className="btn btn-outline min-h-11 px-5" onClick={() => choose("denied")}>
              Reject
            </button>
            <button type="button" className="btn btn-outline min-h-11 px-5" onClick={() => setPrefs(true)}>
              Preferences
            </button>
          </div>
        </>
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
