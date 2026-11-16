"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { HOME_TYPES, LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/schema";

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

/** One row of filters above the leads table. Every change goes into the page address, so a filtered list can be bookmarked. */
export function LeadsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page");
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  }

  // typing in the search box updates the list after a short pause
  useEffect(() => {
    const t = setTimeout(() => {
      if ((params.get("q") ?? "") !== search) setParam("q", search);
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const hasFilters = ["status", "priority", "home", "q", "from", "to"].some((k) => params.get(k));

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      <div className="relative w-full sm:w-64">
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ash" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name, mobile, area, request no." aria-label="Search leads" className="adm-control !pl-9" />
      </div>
      <select value={params.get("status") ?? ""} onChange={(e) => setParam("status", e.target.value)} aria-label="Status" className="adm-control w-auto sm:w-40">
        <option value="">All statuses</option>
        {LEAD_STATUSES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
      <select value={params.get("priority") ?? ""} onChange={(e) => setParam("priority", e.target.value)} aria-label="Priority" className="adm-control w-auto sm:w-36">
        <option value="">All priorities</option>
        {LEAD_PRIORITIES.map((p) => (
          <option key={p} value={p}>
            {cap(p)}
          </option>
        ))}
      </select>
      <select value={params.get("home") ?? ""} onChange={(e) => setParam("home", e.target.value)} aria-label="Home type" className="adm-control w-auto sm:w-44">
        <option value="">All home types</option>
        {HOME_TYPES.map((h) => (
          <option key={h} value={h}>
            {h}
          </option>
        ))}
      </select>
      <input type="date" value={params.get("from") ?? ""} onChange={(e) => setParam("from", e.target.value)} aria-label="From date" className="adm-control w-auto sm:w-40" />
      <input type="date" value={params.get("to") ?? ""} onChange={(e) => setParam("to", e.target.value)} aria-label="To date" className="adm-control w-auto sm:w-40" />
      <select value={params.get("sort") ?? "newest"} onChange={(e) => setParam("sort", e.target.value === "newest" ? "" : e.target.value)} aria-label="Sort" className="adm-control w-auto sm:w-40">
        <option value="newest">Newest first</option>
        <option value="oldest">Oldest first</option>
        <option value="updated">Recently updated</option>
        <option value="name">Name A–Z</option>
      </select>
      {hasFilters && (
        <button
          type="button"
          className="adm-btn adm-btn-ghost adm-btn-sm"
          onClick={() => {
            setSearch("");
            router.replace(pathname, { scroll: false });
          }}
        >
          <X size={14} aria-hidden="true" /> Clear
        </button>
      )}
    </div>
  );
}
