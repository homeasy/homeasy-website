"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Send, Trash2 } from "lucide-react";
import { removeChat, replyToChat } from "@/app/(admin)/admin/chats/actions";
import { useConfirm } from "./confirm";
import { useToast } from "./toast";

/** Reply box under an open chat. While it is on screen the page refreshes every few seconds to show new messages. */
export function ChatReply({ chatId, name }: { chatId: string; name: string }) {
  const router = useRouter();
  const toast = useToast();
  const [confirm, node] = useConfirm();
  const [text, setText] = useState("");
  const [busy, start] = useTransition();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <div>
      {node}
      <form
        className="flex items-end gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          start(async () => {
            const r = await replyToChat(chatId, text);
            if (r.ok) setText("");
            else toast("error", r.error ?? "Could not send.");
          });
        }}
      >
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} maxLength={1500} placeholder={`Reply to ${name}. It appears in their chat window.`} aria-label={`Reply to ${name}`} className="adm-control" />
        <button type="submit" disabled={busy || !text.trim()} className="adm-btn adm-btn-primary">
          <Send size={16} aria-hidden="true" /> Send
        </button>
      </form>
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs text-ash">After you reply, the AI stays quiet in this chat for 15 minutes.</p>
        <button
          type="button"
          disabled={busy}
          className="adm-btn adm-btn-ghost adm-btn-sm hover:!text-red-300"
          onClick={async () => {
            if (await confirm({ title: "Delete chat", message: `Permanently delete the chat with ${name}? This cannot be undone.`, confirmLabel: "Delete", danger: true })) {
              start(async () => {
                const r = await removeChat(chatId);
                toast(r.ok ? "success" : "error", r.ok ? "Chat deleted." : (r.error ?? "Could not delete."));
              });
            }
          }}
        >
          <Trash2 size={14} aria-hidden="true" /> Delete chat
        </button>
      </div>
    </div>
  );
}
