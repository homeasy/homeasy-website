import Link from "next/link";
import { Suspense } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { WhatsAppReply } from "@/components/admin/WhatsAppReply";
import { Card, EmptyState, ErrorBanner, fmtDateTime, PageHeader, timeAgo } from "@/components/admin/ui";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { listWaMessages, type WaMessage } from "@/lib/chat/wa-inbox";
import { whatsappConfigured } from "@/lib/chat/whatsapp";
import { dbErrorHint, dbMode } from "@/lib/db";

async function Inbox({ searchParams }: { searchParams: Promise<{ phone?: string }> }) {
  await requireAdmin();
  const now = await requestTime();
  let all: WaMessage[] = [];
  let loadError = "";
  try {
    all = await listWaMessages();
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  // one row per customer, newest conversation first
  const latest = new Map<string, WaMessage>();
  const names = new Map<string, string>();
  for (const m of all) {
    if (!latest.has(m.phone)) latest.set(m.phone, m);
    if (m.name && !names.has(m.phone)) names.set(m.phone, m.name);
  }
  const people = [...latest.values()];
  const open = ((await searchParams).phone ?? people[0]?.phone ?? "").replace(/\D/g, "");
  const thread = all.filter((m) => m.phone === open).reverse();
  const title = (phone: string) => names.get(phone) || `+${phone}`;

  return (
    <AdminShell mode={dbMode()}>
      <PageHeader title="WhatsApp inbox" description="Messages customers send to the business WhatsApp number through Meta's Cloud API, and your replies. Website chats are under Chats." />
      {!whatsappConfigured() && (
        <p className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">The WhatsApp connection is not set up, so nothing arrives here yet. See Settings → System.</p>
      )}
      {loadError && <ErrorBanner title="Could not load messages.">{loadError}</ErrorBanner>}
      {people.length === 0 ? (
        <Card bodyClassName="p-0">
          <EmptyState title="No messages yet" text="When a customer writes to the business number, the message appears here and you get an email." />
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[300px_minmax(0,1fr)]">
          <Card bodyClassName="p-2" className="self-start">
            <ul className="max-h-[70vh] overflow-y-auto">
              {people.map((m) => (
                <li key={m.phone}>
                  <Link
                    href={`/admin/whatsapp?phone=${m.phone}`}
                    aria-current={m.phone === open ? "page" : undefined}
                    className={`block rounded-lg px-3 py-2 no-underline ${m.phone === open ? "bg-amber/10" : "hover:bg-white/5"}`}
                  >
                    <span className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-sm font-medium text-white">{title(m.phone)}</span>
                      <span className="shrink-0 text-xs text-ash">{timeAgo(m.at, now)}</span>
                    </span>
                    <span className="block truncate text-xs text-mist">
                      {m.direction === "out" ? "You: " : ""}
                      {m.body}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
          <Card title={`${title(open)} · +${open}`} bodyClassName="p-0">
            <ol className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
              {thread.map((m) => (
                <li key={m.id} className={`flex ${m.direction === "in" ? "justify-start" : "justify-end"}`}>
                  <p className={`max-w-[80%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm ${m.direction === "in" ? "bg-white/5 text-white" : "bg-amber/15 text-white"}`}>
                    {m.body}
                    <span className="mt-1 block text-[11px] text-ash">{fmtDateTime(m.at)}</span>
                  </p>
                </li>
              ))}
            </ol>
            <WhatsAppReply key={open} phone={open} />
          </Card>
        </div>
      )}
    </AdminShell>
  );
}

export default function WhatsAppInboxPage({ searchParams }: { searchParams: Promise<{ phone?: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading messages…</p>}>
      <Inbox searchParams={searchParams} />
    </Suspense>
  );
}
