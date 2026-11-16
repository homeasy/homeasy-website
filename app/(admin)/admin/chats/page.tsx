import { Suspense } from "react";
import { ChevronDown, Mail, Phone } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ChatReply } from "@/components/admin/ChatReply";
import { Card, EmptyState, ErrorBanner, fmtDateTime, PageHeader, Pill, timeAgo } from "@/components/admin/ui";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { requestTime, requireAdmin } from "@/lib/admin/session";
import { listChats, type ChatSession } from "@/lib/chat/store";
import { dbErrorHint, dbMode } from "@/lib/db";

const MODE = { whatsapp: "WhatsApp", call: "Call", email: "Email" } as const;

async function Chats({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  await requireAdmin();
  const { open = "" } = await searchParams;
  const now = await requestTime();
  let chats: ChatSession[] = [];
  let loadError = "";
  try {
    chats = await listChats();
  } catch (e) {
    console.error(e);
    loadError = dbErrorHint(e);
  }
  const waiting = chats.filter((c) => c.handoff && c.messages.at(-1)?.role !== "agent").length;
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader
        title="Chats"
        description={`Conversations from the "Ask Homeasy" assistant on the website. ${waiting ? `${waiting} asked for a person and are waiting for a reply.` : "Reply here and the visitor sees it in their chat window."}`}
      />
      {!process.env.ANTHROPIC_API_KEY && (
        <p className="mb-6 rounded-lg border border-amber/30 bg-amber/10 px-4 py-3 text-sm text-amber">
          The assistant is switched off: add ANTHROPIC_API_KEY in the hosting settings and redeploy. Until then the website shows the WhatsApp button.
        </p>
      )}
      {loadError && <ErrorBanner title="Could not load chats.">{loadError}</ErrorBanner>}
      <Card bodyClassName="p-0">
        {chats.length === 0 ? (
          <EmptyState title="No chats yet" text="When a visitor starts a chat with the assistant, it appears here." />
        ) : (
          <ul className="divide-y divide-navy-700">
            {chats.map((c) => {
              const last = c.messages.at(-1);
              const needsReply = c.handoff && last?.role !== "agent";
              return (
                <li key={c.id}>
                  <details className="group" open={c.id === open}>
                    <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3 hover:bg-white/[0.03] sm:px-5">
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-white">
                          {c.name} <span className="font-normal text-mist">· +91 {c.mobile}</span>
                        </span>
                        <span className="block truncate text-xs text-mist">{last ? last.text : "No messages yet"}</span>
                      </span>
                      <span className="hidden sm:block">
                        <Pill>Prefers {MODE[c.mode] ?? c.mode}</Pill>
                      </span>
                      {c.handoff && <Pill tone={needsReply ? "amber" : "green"}>{needsReply ? "Wants a person" : "Replied"}</Pill>}
                      <span className="hidden w-16 shrink-0 text-right text-xs text-ash sm:block" title={fmtDateTime(c.updated_at)}>
                        {timeAgo(c.updated_at, now)}
                      </span>
                      <ChevronDown size={16} aria-hidden="true" className="shrink-0 -rotate-90 text-mist transition-transform group-open:rotate-0" />
                    </summary>
                    <div className="border-t border-navy-700 bg-navy-800/40 p-4 sm:p-5">
                      <div className="mb-4 flex flex-wrap gap-2">
                        <a href={`https://wa.me/91${c.mobile}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-primary adm-btn-sm">
                          <WhatsAppIcon size={14} /> WhatsApp
                        </a>
                        <a href={`tel:+91${c.mobile}`} className="adm-btn adm-btn-secondary adm-btn-sm">
                          <Phone size={14} aria-hidden="true" /> Call
                        </a>
                        {c.email && (
                          <a href={`mailto:${c.email}`} className="adm-btn adm-btn-secondary adm-btn-sm">
                            <Mail size={14} aria-hidden="true" /> {c.email}
                          </a>
                        )}
                        <span className="self-center text-xs text-ash">
                          Started {fmtDateTime(c.created_at)}
                          {c.page ? ` on ${c.page}` : ""}
                        </span>
                      </div>
                      <ol className="mb-4 max-h-96 space-y-2 overflow-y-auto">
                        {c.messages.map((m, i) => (
                          <li key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                            <p className={`max-w-[80%] whitespace-pre-wrap break-words rounded-lg px-3 py-2 text-sm ${m.role === "user" ? "bg-white/5 text-white" : m.role === "agent" ? "bg-amber/15 text-white" : "bg-blue/15 text-mist"}`}>
                              <span className="mb-0.5 block text-[11px] uppercase tracking-wider text-ash">{m.role === "user" ? c.name : m.role === "agent" ? "Team" : "AI assistant"}</span>
                              {m.text}
                            </p>
                          </li>
                        ))}
                      </ol>
                      <ChatReply chatId={c.id} name={c.name} />
                    </div>
                  </details>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </AdminShell>
  );
}

export default function AdminChatsPage({ searchParams }: { searchParams: Promise<{ open?: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading chats…</p>}>
      <Chats searchParams={searchParams} />
    </Suspense>
  );
}
