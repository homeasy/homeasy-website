"use client";

import { useActionState } from "react";
import { saveOrderChanges } from "@/app/(admin)/admin/orders/actions";
import { ORDER_STATUSES } from "@/lib/store/order-statuses";

export function OrderEditor({ orderRef, status, amountPaid, notes }: { orderRef: string; status: string; amountPaid: number; notes: string }) {
  const [state, action, pending] = useActionState(saveOrderChanges, undefined);
  const field = "w-full rounded-input border border-line bg-white px-4";
  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="ref" value={orderRef} />
      <div>
        <label htmlFor="status" className="mb-1.5 block text-[15px] font-semibold">
          Status
        </label>
        <select id="status" name="status" defaultValue={status} className={`${field} h-12`}>
          {ORDER_STATUSES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="amount_paid" className="mb-1.5 block text-[15px] font-semibold">
          Amount received so far (₹)
        </label>
        <input id="amount_paid" name="amount_paid" inputMode="numeric" defaultValue={amountPaid} className={`${field} h-12`} />
        <p className="mt-1 text-[13px] text-slate">Online payments fill this in automatically. Change it when you collect the balance.</p>
      </div>
      <div>
        <label htmlFor="admin_notes" className="mb-1.5 block text-[15px] font-semibold">
          Internal notes
        </label>
        <textarea id="admin_notes" name="admin_notes" defaultValue={notes} rows={5} className={`${field} py-3`} />
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
