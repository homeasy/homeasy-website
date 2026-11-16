import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";
import { razorpayConfigured } from "@/lib/store/razorpay";
import { getDraftSettings } from "@/lib/store/settings";

async function Settings() {
  await requireAdmin();
  const { settings } = await getDraftSettings();
  const checks = [
    { label: "Database (Supabase)", ok: dbMode() === "supabase" },
    { label: "Online payments (Razorpay)", ok: razorpayConfigured() },
    { label: "Payment webhook secret", ok: !!process.env.RAZORPAY_WEBHOOK_SECRET },
    { label: "Email alerts (Resend)", ok: !!process.env.RESEND_API_KEY },
  ];
  return (
    <AdminShell mode={dbMode()} active="settings">
      <h1 className="text-h4">Store settings</h1>
      <p className="mb-6 mt-1 text-[14px] text-body">These control the totals customers see in the cart. Prices are set on each product.</p>
      <SettingsForm settings={settings} />
      <div className="mt-8 max-w-[640px] rounded-card border border-line bg-white p-5">
        <h2 className="text-[1.1875rem]">Connections</h2>
        <ul className="mt-3 divide-y divide-line">
          {checks.map((c) => (
            <li key={c.label} className="flex items-center justify-between gap-4 py-3 text-[15px]">
              {c.label}
              <span className={`rounded-full px-2.5 py-1 text-[12px] font-semibold ${c.ok ? "bg-[var(--badge-available-bg)] text-[var(--badge-available-text)]" : "bg-amber-100 text-amber-800"}`}>
                {c.ok ? "Connected" : "Not connected"}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-slate">Keys are set in the hosting environment, not here. Without Razorpay, orders are saved and you arrange payment by phone.</p>
      </div>
    </AdminShell>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-body">Loading settings…</p>}>
      <Settings />
    </Suspense>
  );
}
