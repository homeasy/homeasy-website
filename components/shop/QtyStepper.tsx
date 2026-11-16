"use client";

import { Minus, Plus } from "lucide-react";
import { MAX_QTY } from "@/lib/store/pricing";

export function QtyStepper({ value, onChange, label, min = 1 }: { value: number; onChange: (n: number) => void; label: string; min?: number }) {
  const btn = "inline-flex size-11 items-center justify-center text-ink hover:bg-cloud disabled:opacity-40";
  return (
    <div className="inline-flex items-center rounded-button border border-line bg-white" role="group" aria-label={label}>
      <button type="button" className={`${btn} rounded-l-[9px]`} onClick={() => onChange(value - 1)} disabled={value <= min} aria-label="Decrease quantity">
        <Minus size={16} aria-hidden="true" />
      </button>
      <span aria-live="polite" className="min-w-9 text-center text-[15px] font-semibold">
        {value}
      </span>
      <button type="button" className={`${btn} rounded-r-[9px]`} onClick={() => onChange(value + 1)} disabled={value >= MAX_QTY} aria-label="Increase quantity">
        <Plus size={16} aria-hidden="true" />
      </button>
    </div>
  );
}
