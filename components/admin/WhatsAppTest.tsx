"use client";

import { useState, useTransition } from "react";
import { testWhatsApp } from "@/app/(admin)/admin/settings/system/actions";
import type { WhatsAppTest as Result } from "@/lib/chat/whatsapp";

const Dot = ({ ok }: { ok: boolean }) => <span aria-hidden="true" className={`mt-1.5 size-2 shrink-0 rounded-full ${ok ? "bg-emerald-400" : "bg-red-400"}`} />;

/** "Send WhatsApp test": shows which settings are present and exactly what Meta answers. */
export function WhatsAppTest() {
  const [result, setResult] = useState<Result | null>(null);
  const [busy, start] = useTransition();
  return (
    <div>
      <p className="text-sm text-mist">Checks the settings with Meta and sends a test message to the team numbers. It shows Meta&rsquo;s own answer, so you can see what to fix.</p>
      <button type="button" disabled={busy} onClick={() => start(async () => setResult(await testWhatsApp()))} className="adm-btn adm-btn-secondary mt-4">
        {busy ? "Testing…" : "Send WhatsApp test"}
      </button>
      {result && (
        <div className="mt-5 space-y-4 text-sm" role="status">
          <ul className="space-y-1.5">
            {result.settings.map((s) => (
              <li key={s.label} className="flex gap-2.5">
                <Dot ok={s.ok} />
                <span className="text-white">
                  {s.label} <span className="text-mist">{s.ok ? "is set" : "is missing or looks wrong"}</span>
                </span>
              </li>
            ))}
          </ul>
          <p className="flex gap-2.5">
            <Dot ok={result.number.ok} />
            <span className="min-w-0 break-words text-white">{result.number.detail}</span>
          </p>
          {result.sends.map((s) => (
            <p key={s.to} className="flex gap-2.5">
              <Dot ok={s.ok} />
              <span className="min-w-0 break-words text-white">
                To {s.to}: {s.detail}
              </span>
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
