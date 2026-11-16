"use client";

import Link from "next/link";
import { useState } from "react";
import { track } from "@/lib/analytics";
import { Camera } from "lucide-react";

type Props = {
  brands: string[];
  result: string;
  note: string;
  photoHref: string;
};

/** "Which switches do you have?" (PRD §8.1 S7A). Brand names as text only, never logos (R14). */
export function SwitchSelector({ brands, result, note, photoHref }: Props) {
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div>
      <div role="group" aria-label="Which switches do you have?" className="flex flex-wrap gap-2">
        {brands.map((b) => (
          <button
            key={b}
            type="button"
            aria-pressed={picked === b}
            onClick={() => {
              setPicked(b);
              track("switch_brand_select", { brand: b });
            }}
            className={`min-h-11 rounded-full border px-4 text-[15px] font-semibold transition-colors ${
              picked === b ? "border-amber bg-amber text-navy" : "border-line bg-white text-ink hover:bg-cloud"
            }`}
          >
            {b}
          </button>
        ))}
      </div>
      <div aria-live="polite" className="mt-5">
        {picked && (
          <div className="rounded-card border border-line bg-white p-5">
            <p className="text-body">{result}</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <Link href="/book-survey" className="btn btn-primary">
                Book a free home survey
              </Link>
              <a href={photoHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <Camera size={18} aria-hidden="true" />
                Send a switchboard photo
              </a>
            </div>
          </div>
        )}
      </div>
      <p className="mt-4 text-sm text-slate">{note}</p>
    </div>
  );
}
