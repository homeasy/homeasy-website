import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { Card, InfoRow, PageHeader, Pill } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";
import { onTestAddress } from "@/lib/seo/audit";
import { site } from "@/lib/site";
import { whatsappConfigured } from "@/lib/chat/whatsapp";
import { razorpayConfigured } from "@/lib/store/razorpay";

async function System() {
  await requireAdmin();
  const isTestSite = await onTestAddress();
  const checks = [
    { label: "Database (Supabase)", ok: dbMode() === "supabase", help: "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY" },
    { label: "Email alerts (Resend)", ok: !!process.env.RESEND_API_KEY, help: "RESEND_API_KEY, LEAD_NOTIFY_TO, LEAD_NOTIFY_FROM" },
    { label: "Online payments (Razorpay)", ok: razorpayConfigured(), help: "RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET" },
    { label: "Payment webhook", ok: !!process.env.RAZORPAY_WEBHOOK_SECRET, help: "RAZORPAY_WEBHOOK_SECRET" },
    { label: "Page speed tests (Google)", ok: !!process.env.PAGESPEED_API_KEY, help: "PAGESPEED_API_KEY (optional: without it Google's shared quota is used)" },
    { label: "AI assistant (Anthropic)", ok: !!process.env.ANTHROPIC_API_KEY, help: "ANTHROPIC_API_KEY (the website chat; without it the WhatsApp button shows)" },
    { label: "WhatsApp bridge for chats (Meta)", ok: whatsappConfigured() && !!process.env.WHATSAPP_APP_SECRET, help: "WHATSAPP_TOKEN, WHATSAPP_PHONE_NUMBER_ID, WHATSAPP_TEAM_NUMBERS, WHATSAPP_APP_SECRET, WHATSAPP_VERIFY_TOKEN" },
    { label: "Sign-in secret", ok: !!process.env.ADMIN_SESSION_SECRET, help: "ADMIN_SESSION_SECRET (optional: without it the password signs the session)" },
  ];
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="System" description="What this website is connected to. Keys are set in the hosting environment, never here." />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Connections">
          <ul className="-my-3 divide-y divide-navy-700">
            {checks.map((c) => (
              <li key={c.label} className="flex items-center justify-between gap-4 py-3">
                <span className="min-w-0">
                  <span className="block text-sm text-white">{c.label}</span>
                  <span className="block truncate text-xs text-ash">{c.help}</span>
                </span>
                <Pill tone={c.ok ? "green" : "amber"}>{c.ok ? "Connected" : "Not connected"}</Pill>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-ash">Without Razorpay, orders are still saved and you arrange payment by phone.</p>
        </Card>
        <Card title="Website">
          <dl className="-my-2.5 divide-y divide-navy-700">
            <InfoRow label="Address">{site.url}</InfoRow>
            <InfoRow label="Search engines">{isTestSite ? "Blocked (test address)" : "Allowed"}</InfoRow>
            <InfoRow label="Admin account">{process.env.ADMIN_EMAIL}</InfoRow>
            <InfoRow label="Sign-in lasts">12 hours</InfoRow>
          </dl>
        </Card>
      </div>
    </AdminShell>
  );
}

export default function AdminSystemPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <System />
    </Suspense>
  );
}
