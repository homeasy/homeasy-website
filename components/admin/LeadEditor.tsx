"use client";

import { useActionState } from "react";
import { saveLeadChanges } from "@/app/(admin)/admin/actions";
import { LEAD_STATUSES } from "@/lib/leads/schema";

type Props = { leadRef: string; status: string; assignedTo: string; notes: string };

export function LeadEditor({ leadRef, status, assignedTo, notes }: Props) {
  const [state, action, pending] = useActionState(saveLeadChanges, undefined);
  const field = "w-full rounded-input border border-line bg-white px-4";
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="ref" value={leadRef} />
      <div>
        <label htmlFor="status" className="mb-1.5 block text-[15px] font-semibold">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className={`${field} h-12`}>
          {LEAD_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="assigned_to" className="mb-1.5 block text-[15px] font-semibold">
          Assigned to
        </label>
        <input id="assigned_to" name="assigned_to" defaultValue={assignedTo} placeholder="Name" className={`${field} h-12`} />
      </div>
      <div>
        <label htmlFor="notes" className="mb-1.5 block text-[15px] font-semibold">
          Notes
        </label>
        <textarea id="notes" name="notes" defaultValue={notes} rows={6} className={`${field} py-3`} />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="btn btn-primary min-h-12 px-6 disabled:opacity-60">
          {pending ? "Saving…" : "Save"}
        </button>
        <p aria-live="polite" className="text-[14px]">
          {state?.ok && <span className="font-semibold text-success">Saved.</span>}
          {state?.error && <span className="text-error">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
