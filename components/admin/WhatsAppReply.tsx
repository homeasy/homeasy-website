"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Send } from "lucide-react";
import { replyOnWhatsApp } from "@/app/(admin)/admin/whatsapp/actions";

/** Reply box for a WhatsApp conversation. While it is on screen the page refreshes every few seconds. */
export function WhatsAppReply({ phone }: { phone: string }) {
  const router = useRouter();
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, start] = useTransition();

  useEffect(() => {
    const timer = setInterval(() => router.refresh(), 8000);
    return () => clearInterval(timer);
  }, [router]);

  return (
    <form
      className="border-t border-navy-700 p-4"
      onSubmit={(e) => {
        e.preventDefault();
        if (!text.trim()) return;
        setError("");
        start(async () => {
          const r = await replyOnWhatsApp(phone, text);
          if (r.ok) setText("");
          else setError(r.error ?? "Could not send.");
        });
      }}
    >
      {error && (
        <p role="alert" className="mb-3 rounded-lg border border-red-400/30 bg-red-400/10 px-3 py-2 text-sm text-red-200">
          {error}
        </p>
      )}
      <div className="flex items-end gap-2">
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} maxLength={3500} placeholder="Reply on WhatsApp" aria-label="Reply on WhatsApp" className="adm-control" />
        <button type="submit" disabled={busy || !text.trim()} className="adm-btn adm-btn-primary">
          <Send size={16} aria-hidden="true" /> {busy ? "Sending…" : "Send"}
        </button>
      </div>
      <p className="mt-2 text-xs text-ash">WhatsApp allows a free reply only within 24 hours of the customer&rsquo;s last message.</p>
    </form>
  );
}
