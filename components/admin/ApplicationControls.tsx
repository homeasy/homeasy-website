"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { removeApplication, saveApplicationNotes, setApplicationStatus } from "@/app/(admin)/admin/applications/actions";
import { APPLICATION_STATUSES } from "@/lib/applications/schema";
import { useConfirm } from "./confirm";
import { useToast } from "./toast";

/** Status, notes and delete for one job application. */
export function ApplicationControls({ applicationRef, name, status, notes }: { applicationRef: string; name: string; status: string; notes: string }) {
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
        <select value={status} disabled={busy} onChange={(e) => run(() => setApplicationStatus(applicationRef, e.target.value), "Application updated.")} className="adm-control">
          {APPLICATION_STATUSES.map((s) => (
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
          className="adm-btn adm-btn-danger adm-btn-sm"
          aria-label={`Delete the application from ${name}`}
          onClick={async () => {
            if (await confirm({ title: "Delete application", message: `Permanently delete the application from ${name}? This cannot be undone.`, confirmLabel: "Delete", danger: true })) {
              run(() => removeApplication(applicationRef), "Application deleted.");
            }
          }}
        >
          <Trash2 size={14} aria-hidden="true" /> Delete
        </button>
        <button type="button" disabled={busy || text === notes} className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => run(() => saveApplicationNotes(applicationRef, text), "Notes saved.")}>
          Save notes
        </button>
      </div>
    </div>
  );
}
