"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";

type Region = { prefix: string; name: string; tier: string };
type Result =
  | { kind: "invalid" }
  | { kind: "covered"; name: string; patna: boolean }
  | { kind: "outside" }
  | null;

/** Service-area check by the first 3 digits of the pincode (data/service-areas.json). */
export function PincodeChecker({ regions, visitPromiseLive }: { regions: Region[]; visitPromiseLive: boolean }) {
  const id = useId();
  const [pincode, setPincode] = useState("");
  const [result, setResult] = useState<Result>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!/^[1-9]\d{5}$/.test(pincode)) {
      setResult({ kind: "invalid" });
      return;
    }
    const region = regions.find((r) => pincode.startsWith(r.prefix));
    setResult(region ? { kind: "covered", name: region.name, patna: region.tier === "patna" } : { kind: "outside" });
  }

  return (
    <div className="rounded-card border border-line bg-white p-5 sm:p-6">
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <label htmlFor={id} className="block text-[15px] font-semibold">
            Your pincode
          </label>
          <input
            id={id}
            name="pincode"
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={6}
            placeholder="800001"
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            aria-describedby={`${id}-result`}
            aria-invalid={result?.kind === "invalid"}
            className="mt-2 block min-h-12 w-full rounded-input border border-line bg-white px-4 text-base text-ink placeholder:text-slate"
          />
        </div>
        <button type="submit" className="btn btn-primary min-h-12 px-6">
          Check
        </button>
      </form>

      <div id={`${id}-result`} role="status" aria-live="polite" className="mt-4 empty:mt-0">
        {result?.kind === "invalid" && <p className="text-error">Enter a 6-digit pincode.</p>}
        {result?.kind === "covered" && (
          <div className="text-body">
            <p className="font-semibold text-ink">Good news. We survey homes in {result.name}.</p>
            {visitPromiseLive && (
              <p className="mt-1">
                {result.patna
                  ? "Our 24-hour technician visit promise applies here."
                  : "Our 24-hour technician visit promise applies in Patna only."}
              </p>
            )}
            <p className="mt-3">
              <Link href="/book-survey" className="link">
                Book a free home survey
              </Link>
            </p>
          </div>
        )}
        {result?.kind === "outside" && (
          <div className="text-body">
            <p className="font-semibold text-ink">We don&apos;t cover this pincode yet.</p>
            <p className="mt-1">
              Leave your details and we&apos;ll tell you when we arrive.{" "}
              <Link href="/contact" className="link">
                Contact us
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
