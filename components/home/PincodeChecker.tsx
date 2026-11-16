"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { checkPincode, type ServiceAreaResult } from "@/lib/service-area";

/** Pincode service-area checker (PRD §9, F2). Reads data/service-areas.json through lib/service-area. */
export function PincodeChecker({ whatsappHref }: { whatsappHref: string }) {
  const [value, setValue] = useState("");
  const [result, setResult] = useState<ServiceAreaResult | null>(null);
  const id = useId();

  return (
    <div className="max-w-[520px]">
      <form
        className="flex gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          setResult(checkPincode(value));
        }}
        noValidate
      >
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="sr-only">
            Your 6-digit pincode
          </label>
          <input
            id={id}
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="Enter your pincode"
            value={value}
            onChange={(e) => {
              setValue(e.target.value.replace(/\D/g, ""));
              setResult(null);
            }}
            aria-describedby={`${id}-result`}
            className="h-12 w-full rounded-input border border-line bg-white px-4 text-ink placeholder:text-slate"
          />
        </div>
        <button type="submit" className="btn btn-secondary min-h-12 px-6">
          Check
        </button>
      </form>

      <div id={`${id}-result`} aria-live="polite" className="mt-4 min-h-6">
        {result?.status === "invalid" && <p className="text-error">Enter a valid 6-digit pincode.</p>}
        {result?.status === "served" && (
          <div className="rounded-card border border-line bg-white p-5">
            <p className="font-semibold text-success">Yes, we serve your area ({result.region}).</p>
            <Link href="/book-survey" className="btn btn-primary mt-4">
              Book a free home survey
            </Link>
          </div>
        )}
        {result?.status === "out_of_area" && (
          <div className="rounded-card border border-line bg-white p-5">
            <p className="font-semibold">We&apos;re not in your area yet.</p>
            <p className="mt-1 text-body">Send us a WhatsApp message and we&apos;ll tell you when we arrive.</p>
            <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-outline mt-4">
              Message us on WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
