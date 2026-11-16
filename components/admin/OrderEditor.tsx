"use client";

import { useActionState } from "react";
import { saveOrderChanges } from "@/app/(admin)/admin/orders/actions";
import { ORDER_STATUSES } from "@/lib/store/order-statuses";

export function OrderEditor({ orderRef, status, amountPaid, notes }: { orderRef: string; status: string; amountPaid: number; notes: string }) {
  const [state, action, pending] = useActionState(saveOrderChanges, undefined);
  const field = "adm-control";
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="ref" value={orderRef} />
      <div>
        <label htmlFor="status" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className={field}>
          {ORDER_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="amount_paid" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
          Amount received so far (₹)
        </label>
        <input id="amount_paid" name="amount_paid" inputMode="numeric" defaultValue={amountPaid} className={field} />
        <p className="mt-1 text-xs text-ash">Online payments fill this in automatically. Change it when you collect the balance.</p>
      </div>
      <div>
        <label htmlFor="admin_notes" className="mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist">
          Internal notes
        </label>
        <textarea id="admin_notes" name="admin_notes" defaultValue={notes} rows={5} className={field} />
      </div>
      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="adm-btn adm-btn-primary">
          {pending ? "Saving…" : "Save"}
        </button>
        <p aria-live="polite" className="text-sm">
          {state?.ok && <span className="text-emerald-300">Saved.</span>}
          {state?.error && <span className="text-red-300">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
