"use client";

import { useState, useTransition } from "react";
import { saveSeoPage } from "@/app/(admin)/admin/seo/actions";
import type { SeoPage } from "@/lib/content/docs";
import { useToast } from "./toast";

const LABEL = "mb-1.5 flex items-baseline justify-between text-xs font-medium uppercase tracking-wider text-mist";
const count = (n: number, best: number) => <span className={`normal-case tracking-normal ${n > best ? "text-amber" : "text-ash"}`}>({n}/{best})</span>;

/** Search title, description and keywords for one page, with a preview of the Google result. */
export function SeoPanel({ path, address, saved, live }: { path: string; address: string; saved: SeoPage; live: { title: string; description: string; keyword: string } }) {
  const toast = useToast();
  const [busy, start] = useTransition();
  const [v, setV] = useState({ ...saved, keywords: saved.keywords.join(", ") });
  const dirty = JSON.stringify(v) !== JSON.stringify({ ...saved, keywords: saved.keywords.join(", ") });
  const set = (patch: Partial<typeof v>) => setV((old) => ({ ...old, ...patch }));
  const save = (next: typeof v, done: string) =>
    start(async () => {
      const r = await saveSeoPage(path, { ...next, keywords: next.keywords.split(",") });
      toast(r.ok ? "success" : "error", r.ok ? done : (r.error ?? "Could not save."));
    });
  const empty = { title: "", description: "", focusKeyword: "", keywords: "", noindex: false };

  return (
    <div className="space-y-4">
      <label className="block">
        <span className={LABEL}>Search title {count(v.title.length, 60)}</span>
        <input value={v.title} maxLength={120} placeholder={live.title} onChange={(e) => set({ title: e.target.value })} className="adm-control" />
      </label>
      <label className="block">
        <span className={LABEL}>Search description {count(v.description.length, 158)}</span>
        <textarea value={v.description} maxLength={320} rows={3} placeholder={live.description} onChange={(e) => set({ description: e.target.value })} className="adm-control" />
        <span className="mt-1 block text-xs text-ash">Leave a box empty to keep the page&rsquo;s built-in text (shown in grey).</span>
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className={LABEL}>Focus keyword</span>
          <input value={v.focusKeyword} maxLength={80} placeholder={live.keyword} onChange={(e) => set({ focusKeyword: e.target.value })} className="adm-control" />
        </label>
        <label className="block">
          <span className={LABEL}>Other keywords</span>
          <input value={v.keywords} placeholder="separate with commas" onChange={(e) => set({ keywords: e.target.value })} className="adm-control" />
        </label>
      </div>
      <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white">
        <input type="checkbox" checked={v.noindex} onChange={(e) => set({ noindex: e.target.checked })} className="size-4 accent-[var(--brand-amber)]" />
        Hide this page from search engines
      </label>

      <div className="rounded-lg border border-navy-700 bg-navy-800/40 p-4">
        <p className="text-xs uppercase tracking-wider text-ash">Google preview</p>
        <p className="mt-2 truncate text-xs text-mist">{address}</p>
        <p className="mt-0.5 break-words text-base text-blue-300">{(v.title || live.title).slice(0, 62) || "No title"}</p>
        <p className="mt-0.5 break-words text-sm text-mist">{(v.description || live.description).slice(0, 160) || "No description"}</p>
      </div>

      <div className="flex flex-wrap justify-end gap-2">
        <button type="button" disabled={busy} className="adm-btn adm-btn-ghost" onClick={() => (setV(empty), save(empty, "Reset to the page's built-in text (draft)."))}>
          Reset to defaults
        </button>
        <button type="button" disabled={busy || !dirty} className="adm-btn adm-btn-primary" onClick={() => save(v, "Saved as a draft. Press “Publish changes” to make it live.")}>
          {busy ? "Saving…" : dirty ? "Save changes" : "Saved"}
        </button>
      </div>
    </div>
  );
}
