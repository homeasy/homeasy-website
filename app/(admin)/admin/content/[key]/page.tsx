import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ContentEditor } from "@/components/admin/ContentEditor";
import { ErrorBanner, fmtDateTime, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { EDITABLE, SEEDS } from "@/lib/content/docs";
import { schemaOf, type Schema } from "@/lib/content/shape";
import { getDraft } from "@/lib/content/store";
import { dbErrorHint, dbMode } from "@/lib/db";

async function Editor({ params }: { params: Promise<{ key: string }> }) {
  await requireAdmin();
  const { key } = await params;
  if (!(key in EDITABLE)) notFound();
  const k = key as keyof typeof EDITABLE;
  const doc = EDITABLE[k];
  let draft: Awaited<ReturnType<typeof getDraft>> | null = null;
  let loadError = "";
  try {
    draft = await getDraft(k);
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader
        title={doc.label}
        description={`${doc.description}${draft?.updatedAt ? ` Last saved ${fmtDateTime(draft.updatedAt)}.` : " Showing the text built into the website."}`}
        actions={
          <a href={doc.view} target="_blank" rel="noreferrer" className="adm-btn adm-btn-secondary">
            View page <ExternalLink size={14} aria-hidden="true" />
          </a>
        }
      />
      <p className="mb-6 rounded-lg border border-navy-700 bg-navy px-4 py-3 text-sm text-mist">
        Write only what is true today: no prices, certifications, install counts or promises that are not final. Changes are saved as a draft and go live when you
        press <strong className="text-white">Publish changes</strong>.
      </p>
      {draft ? (
        <ContentEditor key={k} docKey={k} schema={schemaOf(SEEDS[k]) as Extract<Schema, { t: "object" }>} initial={draft.data} canReset={draft.saved} />
      ) : (
        <ErrorBanner title="Could not load this content.">{loadError}</ErrorBanner>
      )}
    </AdminShell>
  );
}

export default function ContentPage({ params }: { params: Promise<{ key: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <Editor params={params} />
    </Suspense>
  );
}
