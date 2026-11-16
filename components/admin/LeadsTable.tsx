"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { bulkLeads } from "@/app/(admin)/admin/actions";
import { LEAD_STATUSES, statusLabel } from "@/lib/leads/schema";
import { useConfirm } from "./confirm";
import { useToast } from "./toast";
import { LeadStatusBadge, PriorityBadge } from "./ui";

export type LeadRow = { partial?: boolean; ref: string; name: string; mobile: string; area: string; wants: string; home: string; priority: string; status: string; ago: string; when: string };

export function LeadsTable({ rows }: { rows: LeadRow[] }) {
  const router = useRouter();
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busy, start] = useTransition();
  const allChecked = rows.length > 0 && rows.every((r) => selected.has(r.ref));

  const toggle = (ref: string) =>
    setSelected((s) => {
      const n = new Set(s);
      if (n.has(ref)) n.delete(ref);
      else n.add(ref);
      return n;
    });

  function run(action: "status" | "delete", status?: string) {
    start(async () => {
      const r = await bulkLeads([...selected], action, status);
      if (r.ok) {
        toast("success", action === "delete" ? `${r.affected} leads deleted.` : `${r.affected} leads marked ${statusLabel(status!)}.`);
        setSelected(new Set());
      } else toast("error", r.error ?? "That did not work.");
    });
  }

  async function bulkDelete() {
    const ok = await confirm({ title: "Delete leads", message: `Permanently delete ${selected.size} leads? This cannot be undone.`, confirmLabel: "Delete", danger: true });
    if (ok) run("delete");
  }

  return (
    <>
      {confirmNode}
      {selected.size > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-amber/30 bg-amber/5 px-4 py-2 text-sm">
          <span className="mr-2 text-white">{selected.size} selected</span>
          <select value="" disabled={busy} onChange={(e) => e.target.value && run("status", e.target.value)} aria-label="Set status" className="adm-control !min-h-8 w-44 !py-1 text-xs">
            <option value="">Set status…</option>
            {LEAD_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
          <button type="button" disabled={busy} onClick={bulkDelete} className="adm-btn adm-btn-danger adm-btn-sm">
            <Trash2 size={14} aria-hidden="true" /> Delete
          </button>
        </div>
      )}
      <div className={`overflow-x-auto ${busy ? "opacity-60" : ""}`}>
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-mist">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={() => setSelected(allChecked ? new Set() : new Set(rows.map((r) => r.ref)))}
                  aria-label="Select all"
                  className="accent-[var(--brand-amber)]"
                />
              </th>
              <th className="px-3 py-3 font-medium">Contact</th>
              <th className="px-3 py-3 font-medium">Area</th>
              <th className="px-3 py-3 font-medium">Wants to control</th>
              <th className="px-3 py-3 font-medium">Priority</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="px-3 py-3 text-right font-medium">Received</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {rows.map((r) => (
              <tr key={r.ref} onClick={() => router.push(`/admin/leads/${r.ref}`)} className="cursor-pointer hover:bg-white/[0.03]">
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <input type="checkbox" checked={selected.has(r.ref)} onChange={() => toggle(r.ref)} aria-label={`Select ${r.name}`} className="accent-[var(--brand-amber)]" />
                </td>
                <td className="max-w-[220px] px-3 py-3">
                  <Link href={`/admin/leads/${r.ref}`} onClick={(e) => e.stopPropagation()} className="block truncate font-medium text-white no-underline hover:text-amber">
                    {r.name}
                  </Link>
                  {r.partial && <span className="mr-1.5 rounded-full bg-white/5 px-2 py-0.5 text-[11px] text-mist ring-1 ring-inset ring-white/10">Step 1 only</span>}
                  <p className="truncate text-xs text-mist">
                    +91 {r.mobile} · {r.ref}
                  </p>
                </td>
                <td className="max-w-[200px] px-3 py-3">
                  <p className="truncate text-mist">{r.area}</p>
                  <p className="truncate text-xs text-ash">{r.home}</p>
                </td>
                <td className="max-w-[220px] px-3 py-3">
                  <p className="truncate text-mist" title={r.wants}>
                    {r.wants || "—"}
                  </p>
                </td>
                <td className="px-3 py-3">
                  <PriorityBadge priority={r.priority} />
                </td>
                <td className="px-3 py-3">
                  <LeadStatusBadge status={r.status} />
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right text-xs text-mist" title={r.when}>
                  {r.ago}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
