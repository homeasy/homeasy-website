"use server";

import { requireAdmin } from "@/lib/admin/session";
import { ORDER_STATUSES, patchOrder } from "@/lib/store/orders";

export async function saveOrderChanges(_prev: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  await requireAdmin();
  const ref = String(formData.get("ref") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!ref || !ORDER_STATUSES.some((s) => s.id === status)) return { error: "Invalid request." };
  const paid = Math.max(0, Math.round(Number(String(formData.get("amount_paid") ?? "").replace(/[₹,\s]/g, "")) || 0));
  const ok = await patchOrder(ref, {
    status,
    amount_paid: paid,
    admin_notes: String(formData.get("admin_notes") ?? "").trim().slice(0, 4000) || null,
  });
  return ok ? { ok: true } : { error: "Could not save. Please try again." };
}
