"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeEnquiry, saveEnquiryNotes, setEnquiryStatus } from "@/app/(admin)/admin/enquiries/actions";
import { ENQUIRY_STATUSES } from "@/lib/enquiries/schema";
import { useConfirm } from "./confirm";
import { useToast } from "./toast";

/** Status, notes and delete for one enquiry (inside its opened row). */
export function EnquiryControls({ enquiryRef, name, status, notes }: { enquiryRef: string; name: string; status: string; notes: string }) {
  const toast = useToast();
  const [confirm, node] = useConfirm();
  const [busy, start] = useTransition();
  const [text, setText] = useState(notes);
  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, done: string) =>
    start(async () => {
      const r = await fn();
      toast(r.ok ? "success" : "error", r.ok ? done : (r.error ?? "That did not work."));
    });
  return (
    <div className="space-y-3">
      {node}
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">Status</span>
        <select value={status} disabled={busy} onChange={(e) => run(() => setEnquiryStatus(enquiryRef, e.target.value), "Enquiry updated.")} className="adm-control">
          {ENQUIRY_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">Internal notes</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={4000} className="adm-control" />
      </label>
      <div className="flex justify-between gap-2">
        <button
          type="button"
          disabled={busy}
          aria-label={`Delete the enquiry from ${name}`}
          className="adm-btn adm-btn-danger adm-btn-sm"
          onClick={async () => {
            if (await confirm({ title: "Delete enquiry", message: `Permanently delete the enquiry from ${name}? This cannot be undone.`, confirmLabel: "Delete", danger: true })) {
              run(() => removeEnquiry(enquiryRef), "Enquiry deleted.");
            }
          }}
        >
          <Trash2 size={14} aria-hidden="true" /> Delete
        </button>
        <button type="button" disabled={busy || text === notes} className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => run(() => saveEnquiryNotes(enquiryRef, text), "Notes saved.")}>
          Save notes
        </button>
      </div>
    </div>
  );
}
