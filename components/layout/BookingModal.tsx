"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

// the form is only downloaded when someone opens the dialog
const SurveyForm = dynamic(() => import("@/components/forms/SurveyForm").then((m) => m.SurveyForm), {
  ssr: false,
  loading: () => <p className="p-6 text-body">Loading the form…</p>,
});

/**
 * Survey booking as a dialog (PRD §9): any "Book a free survey" link opens the form over the current page,
 * so people do not lose their place. It is an enhancement of ordinary links: without JavaScript, with a
 * modified click (new tab), on the /book-survey page itself, or for links that carry a prefilled list
 * (rooms, appliances), the link simply goes to /book-survey as before.
 */
export function BookingModal({ whatsappHref, telHref, leadResponse }: { whatsappHref: string; telHref: string; leadResponse: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [source, setSource] = useState<string | null>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as Element | null)?.closest('a[href^="/book-survey"]') as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || window.location.pathname === "/book-survey") return;
      const url = new URL(link.href);
      if ([...url.searchParams.keys()].some((k) => k !== "source")) return; // prefilled links use the full page
      e.preventDefault();
      setSource(url.searchParams.get("source") ?? "modal");
      dialog.current?.showModal();
    };
    // capture phase: this must run before Next's <Link> starts a page change (it then sees the click as handled)
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return (
    <dialog
      ref={dialog}
      aria-labelledby="booking-modal-title"
      onClose={() => setSource(null)}
      onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      className="m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-cloud p-0 text-ink backdrop:bg-navy/70 sm:m-auto sm:h-auto sm:max-h-[92dvh] sm:w-[min(680px,calc(100vw-2rem))] sm:rounded-card"
    >
      <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-line bg-white px-5 py-3">
        <h2 id="booking-modal-title" className="text-[1.1875rem] font-semibold">
          Book a free home survey
        </h2>
        <button type="button" onClick={() => dialog.current?.close()} aria-label="Close" className="inline-flex size-11 items-center justify-center rounded-button hover:bg-cloud">
          <X size={22} aria-hidden="true" />
        </button>
      </div>
      <div className="p-4 sm:p-5">{source && <SurveyForm key={source} whatsappHref={whatsappHref} telHref={telHref} leadResponse={leadResponse} sourceCta={source} />}</div>
    </dialog>
  );
}
