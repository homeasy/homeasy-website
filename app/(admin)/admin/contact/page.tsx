import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { ErrorBanner, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { SEEDS } from "@/lib/content/docs";
import { schemaOf, type Schema } from "@/lib/content/shape";
import { getDraft } from "@/lib/content/store";
import { dbErrorHint, dbMode } from "@/lib/db";

async function Contact() {
  await requireAdmin();
  let draft: Awaited<ReturnType<typeof getDraft<"contact">>> | null = null;
  let loadError = "";
  try {
    draft = await getDraft("contact");
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader
        title="Contact & socials"
        description="Phone, WhatsApp, email, working hours, address and social links shown in the header, footer, contact page and buttons across the site."
      />
      {draft && !draft.saved && (
        <p className="mb-6 rounded-lg border border-navy-700 bg-navy px-4 py-3 text-sm text-mist">These are the built-in details. They stay in use until you save and publish a change.</p>
      )}
      <p className="mb-6 text-xs text-ash">The company name, CIN and founding year are legal facts and are not edited here.</p>
      {draft ? (
        <ContentEditor docKey="contact" schema={schemaOf(SEEDS.contact) as Extract<Schema, { t: "object" }>} initial={draft.data} canReset={draft.saved} />
      ) : (
        <ErrorBanner title="Could not load the contact details.">{loadError}</ErrorBanner>
      )}
    </AdminShell>
  );
}

export default function ContactSettingsPage() {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <Contact />
    </Suspense>
  );
}
