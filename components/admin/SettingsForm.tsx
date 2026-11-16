"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
import { saveStoreSettings } from "@/app/(admin)/admin/settings/actions";
import type { StoreSettings } from "@/lib/store/pricing";

const field = "adm-control";
const label = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist";
const hint = "mt-1 text-xs text-ash";

export function SettingsForm({ settings: s }: { settings: StoreSettings }) {
  const [state, action, pending] = useActionState(saveStoreSettings, undefined);
  const router = useRouter();
  useEffect(() => {
    if (state?.ok) router.refresh(); // update the "waiting to go live" bar
  }, [state, router]);
  return (
    <form action={action} className="max-w-[640px] space-y-6">
      <fieldset className="space-y-5 rounded-xl border border-navy-700 bg-navy p-5">
        <legend className="px-1 text-sm font-semibold text-white">Tax</legend>
        <div>
          <label htmlFor="gst_rate" className={label}>
            GST rate (%)
          </label>
          <input id="gst_rate" name="gst_rate" inputMode="numeric" defaultValue={s.gst_rate} className={field} />
        </div>
        <label className="flex min-h-10 cursor-pointer items-start gap-3 text-sm text-white">
          <input type="checkbox" name="prices_include_gst" defaultChecked={s.prices_include_gst} className="mt-0.5 size-5 accent-[var(--brand-amber)]" />
          <span>
            Product prices already include GST
            <span className={`block ${hint}`}>Untick this if GST should be added on top of the prices at checkout.</span>
          </span>
        </label>
      </fieldset>

      <fieldset className="space-y-5 rounded-xl border border-navy-700 bg-navy p-5">
        <legend className="px-1 text-sm font-semibold text-white">Delivery</legend>
        <div>
          <label htmlFor="delivery_fee" className={label}>
            Delivery fee per order (₹)
          </label>
          <input id="delivery_fee" name="delivery_fee" inputMode="numeric" defaultValue={s.delivery_fee} className={field} />
          <p className={hint}>Enter 0 for free delivery on every order.</p>
        </div>
        <div>
          <label htmlFor="free_delivery_above" className={label}>
            Free delivery for orders above (₹)
          </label>
          <input id="free_delivery_above" name="free_delivery_above" inputMode="numeric" defaultValue={s.free_delivery_above} className={field} />
          <p className={hint}>Enter 0 if there is no free-delivery threshold.</p>
        </div>
      </fieldset>

      <fieldset className="space-y-5 rounded-xl border border-navy-700 bg-navy p-5">
        <legend className="px-1 text-sm font-semibold text-white">Booking amount</legend>
        <label className="flex min-h-10 cursor-pointer items-start gap-3 text-sm text-white">
          <input type="checkbox" name="booking_enabled" defaultChecked={s.booking_enabled} className="mt-0.5 size-5 accent-[var(--brand-amber)]" />
          <span>
            Let customers pay a booking amount now and the balance later
            <span className={`block ${hint}`}>When off, customers always pay in full.</span>
          </span>
        </label>
        <div>
          <label htmlFor="booking_amount" className={label}>
            Booking amount per order (₹)
          </label>
          <input id="booking_amount" name="booking_amount" inputMode="numeric" defaultValue={s.booking_amount} className={field} />
        </div>
      </fieldset>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={pending} className="adm-btn adm-btn-primary">
          {pending ? "Saving…" : "Save settings"}
        </button>
        <p aria-live="polite" className="text-sm">
          {state?.ok && <span className="text-emerald-300">Saved as a draft. Press “Publish changes” in the sidebar to make it live.</span>}
          {state?.error && <span className="text-red-300">{state.error}</span>}
        </p>
      </div>
    </form>
  );
}
