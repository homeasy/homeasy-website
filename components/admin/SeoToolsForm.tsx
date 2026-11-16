"use client";

import { useState, useTransition } from "react";
import { saveSeoSettings } from "@/app/(admin)/admin/seo/actions";
import type { SeoDoc } from "@/lib/content/docs";
import { useToast } from "./toast";

type Value = Pick<SeoDoc, "verification" | "aiCrawlers" | "llmsSummary">;
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist";
const CARD = "min-w-0 rounded-xl border border-navy-700 bg-navy";
const HEAD = "border-b border-navy-700 px-5 py-3.5 text-sm font-semibold text-white";

export function SeoToolsForm({ initial }: { initial: Value }) {
  const toast = useToast();
  const [busy, start] = useTransition();
  const [saved, setSaved] = useState(initial);
  const [v, setV] = useState(initial);
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);
  const toggle = (key: "search" | "training", label: string, hint: string) => (
    <label className="flex cursor-pointer items-start gap-3 text-sm text-white">
      <input type="checkbox" checked={v.aiCrawlers[key]} onChange={(e) => setV({ ...v, aiCrawlers: { ...v.aiCrawlers, [key]: e.target.checked } })} className="mt-0.5 size-4 accent-[var(--brand-amber)]" />
      <span>
        {label}
        <span className="mt-0.5 block text-xs text-mist">{hint}</span>
      </span>
    </label>
  );
  return (
    <div className="space-y-6">
      <section className={CARD}>
        <h2 className={HEAD}>AI search & answer engines</h2>
        <div className="space-y-4 p-5">
          {toggle("search", "Let AI assistants read the site to answer questions", "ChatGPT search, Claude, Perplexity. This is how Homeasy gets mentioned and linked in AI answers.")}
          {toggle("training", "Let AI companies use the site to train their models", "GPTBot, ClaudeBot, Google-Extended, Common Crawl, Meta and others.")}
        </div>
      </section>
      <section className={CARD}>
        <h2 className={HEAD}>Search engine verification</h2>
        <div className="grid gap-4 p-5 sm:grid-cols-3">
          {(
            [
              ["google", "Google Search Console"],
              ["bing", "Bing Webmaster Tools"],
              ["yandex", "Yandex"],
            ] as const
          ).map(([key, label]) => (
            <label key={key} className="block">
              <span className={LABEL}>{label}</span>
              <input value={v.verification[key]} maxLength={200} placeholder="verification code" onChange={(e) => setV({ ...v, verification: { ...v.verification, [key]: e.target.value } })} className="adm-control font-mono text-xs" />
            </label>
          ))}
          <p className="text-xs text-ash sm:col-span-3">Paste only the code from the &ldquo;HTML tag&rdquo; method (the part inside content=&quot;…&quot;), then save, publish, and press Verify there.</p>
        </div>
      </section>
      <section className={CARD}>
        <h2 className={HEAD}>Summary for AI assistants (llms.txt)</h2>
        <div className="p-5">
          <textarea value={v.llmsSummary} rows={4} maxLength={4000} placeholder="Two or three plain sentences on what Homeasy does and where. Left empty, the site's main description is used." onChange={(e) => setV({ ...v, llmsSummary: e.target.value })} aria-label="Summary for AI assistants" className="adm-control" />
          <p className="mt-1 text-xs text-ash">Write only what is true today: no prices, certifications or install counts that are not final.</p>
        </div>
      </section>
      <div className="flex justify-end">
        <button
          type="button"
          disabled={busy || !dirty}
          className="adm-btn adm-btn-primary"
          onClick={() =>
            start(async () => {
              const r = await saveSeoSettings(v);
              if (r.ok) setSaved(v);
              toast(r.ok ? "success" : "error", r.ok ? "Saved as a draft. Press “Publish changes” to make it live." : (r.error ?? "Could not save."));
            })
          }
        >
          {busy ? "Saving…" : dirty ? "Save settings" : "Saved"}
        </button>
      </div>
    </div>
  );
}
