import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { ErrorBanner, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { dbErrorHint, dbMode } from "@/lib/db";
import { getDraftSettings } from "@/lib/store/settings";

async function Settings() {
  await requireAdmin();
  let settings: Awaited<ReturnType<typeof getDraftSettings>>["settings"] | null = null;
  let loadError = "";
  try {
    settings = (await getDraftSettings()).settings;
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="Store settings" description="These control the totals customers see in the cart. Prices are set on each product." />
      {settings ? <SettingsForm settings={settings} /> : <ErrorBanner title="Could not load settings.">{loadError}</ErrorBanner>}
    </AdminShell>
  );
}

export default function AdminSettingsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading settings…</p>}>
      <Settings />
    </Suspense>
  );
}
