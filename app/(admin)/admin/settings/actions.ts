"use server";

import { requireAdmin } from "@/lib/admin/session";
import { saveDraftSettings } from "@/lib/store/settings";

const num = (v: FormDataEntryValue | null, max: number) => Math.max(0, Math.min(max, Math.round(Number(String(v ?? "").replace(/[₹,%\s]/g, "")) || 0)));

export async function saveStoreSettings(_prev: { ok?: boolean; error?: string } | undefined, formData: FormData) {
  await requireAdmin();
  const booking_amount = num(formData.get("booking_amount"), 1000000);
  const ok = await saveDraftSettings({
    gst_rate: num(formData.get("gst_rate"), 28),
    prices_include_gst: formData.get("prices_include_gst") === "on",
    delivery_fee: num(formData.get("delivery_fee"), 100000),
    free_delivery_above: num(formData.get("free_delivery_above"), 10000000),
    booking_enabled: formData.get("booking_enabled") === "on" && booking_amount > 0,
    booking_amount,
  });
  return ok ? { ok: true } : { error: "Could not save. Check that storage is connected." };
}
