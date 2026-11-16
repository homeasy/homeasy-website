"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { X } from "lucide-react";

const KEY = "homeasy-early-access-dismissed-until";
const EVENT = "homeasy-announcement-change";
const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

function readDismissedUntil(): number {
  try {
    return Number(localStorage.getItem(KEY) ?? 0);
  } catch {
    return 0; // storage blocked: show the bar
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

/** Top bar inviting people to early access, dismissible for 30 days (PRD §9). Shown until launch (SHOW_ANNOUNCEMENT). */
export function AnnouncementBar({ launch }: { launch: string }) {
  const visible = useSyncExternalStore(
    subscribe,
    () => Date.now() > readDismissedUntil(),
    () => false, // server/prerender: hidden, avoids a flash for people who dismissed it
  );

  if (!visible) return null;

  function dismiss() {
    try {
      localStorage.setItem(KEY, String(Date.now() + THIRTY_DAYS));
    } catch {
      /* ignore */
    }
    window.dispatchEvent(new Event(EVENT));
  }

  return (
    <div className="bg-tint text-ink">
      <div className="container-page flex min-h-10 items-center justify-between gap-3 py-1.5 text-sm">
        <p>
          Launching {launch}. Early access for pilot homes is open.{" "}
          <Link href="/early-access" className="link font-semibold">
            Join the list →
          </Link>
        </p>
        <button
          type="button"
          aria-label="Dismiss announcement"
          className="inline-flex size-9 shrink-0 items-center justify-center rounded-sm hover:bg-white/60"
          onClick={dismiss}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
