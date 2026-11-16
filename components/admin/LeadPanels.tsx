"use client";

import { useState, useTransition } from "react";
import { Copy, Trash2, X } from "lucide-react";
import { addLeadNote, removeLead, removeLeadNote, updateLeadPipeline, type ActionResult } from "@/app/(admin)/admin/actions";
import { LEAD_PRIORITIES, LEAD_STATUSES } from "@/lib/leads/schema";
import { useConfirm } from "./confirm";
import { useToast } from "./toast";

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist";

/** Runs a server action and shows the result as a toast. */
function useAction() {
  const toast = useToast();
  const [busy, start] = useTransition();
  const run = (fn: () => Promise<ActionResult>, done?: string, after?: () => void) =>
    start(async () => {
      const r = await fn();
      if (r?.ok === false) toast("error", r.error ?? "That did not work.");
      else {
        if (done) toast("success", done);
        after?.();
      }
    });
  return [busy, run] as const;
}

export function LeadPipeline({ leadRef, status, priority, assignedTo }: { leadRef: string; status: string; priority: string; assignedTo: string }) {
  const [busy, run] = useAction();
  const [who, setWho] = useState(assignedTo);
  return (
    <div className="space-y-4">
      <label className="block">
        <span className={LABEL}>Status</span>
        <select value={status} disabled={busy} onChange={(e) => run(() => updateLeadPipeline(leadRef, { status: e.target.value }), "Lead updated.")} className="adm-control">
          {LEAD_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className={LABEL}>Priority</span>
        <select value={priority} disabled={busy} onChange={(e) => run(() => updateLeadPipeline(leadRef, { priority: e.target.value }), "Lead updated.")} className="adm-control">
          {LEAD_PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {cap(p)}
            </option>
          ))}
        </select>
      </label>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(() => updateLeadPipeline(leadRef, { assigned_to: who }), "Lead updated.");
        }}
      >
        <label className="block">
          <span className={LABEL}>Assigned to</span>
          <span className="flex gap-2">
            <input value={who} onChange={(e) => setWho(e.target.value)} placeholder="Name" maxLength={80} className="adm-control" />
            <button type="submit" disabled={busy || who.trim() === assignedTo} className="adm-btn adm-btn-secondary">
              Save
            </button>
          </span>
        </label>
      </form>
    </div>
  );
}

export type NoteView = { id: string; text: string; author: string; ago: string; when: string; system: boolean };

export function LeadNotes({ leadRef, notes }: { leadRef: string; notes: NoteView[] }) {
  const [busy, run] = useAction();
  const [text, setText] = useState("");
  return (
    <>
      <form
        className="mb-5"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) run(() => addLeadNote(leadRef, text), undefined, () => setText(""));
        }}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          maxLength={4000}
          placeholder="Add an internal note: call summary, next steps, quote sent…"
          aria-label="New note"
          className="adm-control"
        />
        <div className="mt-2 flex justify-end">
          <button type="submit" disabled={busy || !text.trim()} className="adm-btn adm-btn-primary adm-btn-sm">
            {busy ? "Saving…" : "Add note"}
          </button>
        </div>
      </form>
      {notes.length === 0 ? (
        <p className="text-sm text-mist">No activity yet.</p>
      ) : (
        <ol className="relative space-y-4 border-l border-navy-700 pl-5">
          {notes.map((n) => (
            <li key={n.id} className="group relative">
              <span aria-hidden="true" className={`absolute -left-[25px] top-1.5 size-2 rounded-full ring-4 ring-navy ${n.system ? "bg-ash" : "bg-amber"}`} />
              <p className={`whitespace-pre-wrap text-sm ${n.system ? "text-mist" : "text-white"}`}>{n.text}</p>
              <p className="mt-0.5 text-xs text-ash">
                {n.author} · <span title={n.when}>{n.ago}</span>
                {!n.system && n.id !== "legacy" && (
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(() => removeLeadNote(leadRef, n.id))}
                    aria-label="Delete note"
                    className="ml-2 text-ash opacity-0 hover:text-red-300 focus:opacity-100 group-hover:opacity-100"
                  >
                    <X size={12} className="inline" />
                  </button>
                )}
              </p>
            </li>
          ))}
        </ol>
      )}
    </>
  );
}

export function CopyRef({ value }: { value: string }) {
  const toast = useToast();
  return (
    <button
      type="button"
      title="Copy request number"
      onClick={() => {
        void navigator.clipboard?.writeText(value);
        toast("success", "Request number copied.");
      }}
      className="ml-2 inline-flex items-center gap-1 font-mono text-xs text-mist hover:text-amber"
    >
      {value} <Copy size={12} aria-hidden="true" />
    </button>
  );
}

export function DeleteLead({ leadRef, name }: { leadRef: string; name: string }) {
  const [busy, run] = useAction();
  const [confirm, node] = useConfirm();
  return (
    <>
      {node}
      <button
        type="button"
        disabled={busy}
        aria-label="Delete lead"
        className="adm-btn adm-btn-danger"
        onClick={async () => {
          if (await confirm({ title: "Delete lead", message: `Permanently delete the request from ${name}? This cannot be undone.`, confirmLabel: "Delete", danger: true })) {
            run(() => removeLead(leadRef));
          }
        }}
      >
        <Trash2 size={16} aria-hidden="true" />
      </button>
    </>
  );
}
