"use client";

import { useRouter } from "next/navigation";

export function RangeSelect({ days, options }: { days: number; options: number[] }) {
  const router = useRouter();
  return (
    <select value={days} onChange={(e) => router.replace(`/admin?days=${e.target.value}`, { scroll: false })} aria-label="Date range" className="adm-control w-40">
      {options.map((d) => (
        <option key={d} value={d}>
          Last {d} days
        </option>
      ))}
    </select>
  );
}
