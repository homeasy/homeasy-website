"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { addKeyword, deleteKeyword, keywordIdeas, updateKeyword } from "@/app/(admin)/admin/seo/actions";
import { KEYWORD_STATUSES, type Coverage, type Keyword } from "@/lib/seo/keywords";
import { useToast } from "./toast";
import { Pill } from "./ui";

const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const COVER: Record<Coverage, { label: string; tone: "green" | "amber" | "red" | "grey" }> = {
  strong: { label: "Well covered", tone: "green" },
  partial: { label: "Partly covered", tone: "amber" },
  missing: { label: "Not on the page", tone: "red" },
  unassigned: { label: "No page chosen", tone: "grey" },
};

export function KeywordsBoard({ keywords, coverage, pages }: { keywords: Keyword[]; coverage: Record<string, Coverage>; pages: { path: string; label: string }[] }) {
  const toast = useToast();
  const [busy, start] = useTransition();
  const [term, setTerm] = useState("");
  const [kind, setKind] = useState("target");
  const [page, setPage] = useState("");
  const [filter, setFilter] = useState("");
  const [cover, setCover] = useState("");
  const [seed, setSeed] = useState("");
  const [ideas, setIdeas] = useState<{ group: string; ideas: string[] }[] | null>(null);
  const [loadingIdeas, setLoadingIdeas] = useState(false);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, done?: string, after?: () => void) =>
    start(async () => {
      const r = await fn();
      if (!r.ok) toast("error", r.error ?? "That did not work.");
      else {
        if (done) toast("success", done);
        after?.();
      }
    });

  const tracked = new Set(keywords.map((k) => k.term));
  const rows = keywords.filter((k) => (!filter || k.term.includes(filter.toLowerCase())) && (!cover || coverage[k.id] === cover));

  async function findIdeas() {
    setLoadingIdeas(true);
    const r = await keywordIdeas(seed);
    setLoadingIdeas(false);
    if (r.ok) setIdeas(r.groups ?? []);
    else toast("error", r.error ?? "No ideas found.");
  }

  return (
    <div className="space-y-6">
      <section className="min-w-0 rounded-xl border border-navy-700 bg-navy">
        <form
          className="flex flex-wrap items-center gap-2 border-b border-navy-700 p-4"
          onSubmit={(e) => {
            e.preventDefault();
            run(() => addKeyword(term, kind, page), "Keyword added.", () => setTerm(""));
          }}
        >
          <input value={term} onChange={(e) => setTerm(e.target.value)} placeholder="Add a keyword, e.g. smart switch for old house" aria-label="New keyword" maxLength={120} className="adm-control w-full sm:w-80" />
          <select value={kind} onChange={(e) => setKind(e.target.value)} aria-label="Type" className="adm-control w-auto">
            <option value="target">Target</option>
            <option value="trending">Trending</option>
          </select>
          <select value={page} onChange={(e) => setPage(e.target.value)} aria-label="Page" className="adm-control w-auto sm:w-48">
            <option value="">No page yet</option>
            {pages.map((p) => (
              <option key={p.path} value={p.path}>
                {p.label}
              </option>
            ))}
          </select>
          <button type="submit" disabled={busy || term.trim().length < 2} className="adm-btn adm-btn-primary">
            <Plus size={16} aria-hidden="true" /> Add keyword
          </button>
        </form>
        <div className="flex flex-wrap items-center gap-2 border-b border-navy-700 px-4 py-3">
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search keywords" aria-label="Search keywords" className="adm-control w-full sm:w-56" />
          <select value={cover} onChange={(e) => setCover(e.target.value)} aria-label="Coverage" className="adm-control w-auto">
            <option value="">All coverage</option>
            {Object.entries(COVER).map(([k, c]) => (
              <option key={k} value={k}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        {rows.length === 0 ? (
          <p className="px-6 py-14 text-center text-sm text-mist">{keywords.length ? "No keywords match this filter." : "No keywords yet. Add the searches you want Homeasy to appear for."}</p>
        ) : (
          <div className={`overflow-x-auto ${busy ? "opacity-60" : ""}`}>
            <table className="w-full min-w-[820px] text-sm">
              <thead className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-mist">
                <tr>
                  <th className="px-4 py-3 font-medium">Keyword</th>
                  <th className="px-3 py-3 font-medium">Page</th>
                  <th className="px-3 py-3 font-medium">Coverage</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium" title="Google position, typed in from Search Console">
                    Pos.
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-navy-700">
                {rows.map((k) => {
                  const c = COVER[coverage[k.id] ?? "unassigned"];
                  return (
                    <tr key={k.id}>
                      <td className="max-w-[260px] px-4 py-3">
                        <p className="truncate text-white">{k.term}</p>
                        <p className="text-xs text-ash">{cap(k.kind)}</p>
                      </td>
                      <td className="px-3 py-3">
                        <select value={k.page} onChange={(e) => run(() => updateKeyword(k.id, { page: e.target.value }))} aria-label={`Page for ${k.term}`} className="adm-control w-44">
                          <option value="">No page yet</option>
                          {pages.map((p) => (
                            <option key={p.path} value={p.path}>
                              {p.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <Pill tone={c.tone}>{c.label}</Pill>
                        {k.page && coverage[k.id] !== "strong" && (
                          <Link href={`/admin/seo/pages?path=${encodeURIComponent(k.page)}`} className="ml-2 text-xs text-mist hover:text-amber">
                            Fix
                          </Link>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <select value={k.status} onChange={(e) => run(() => updateKeyword(k.id, { status: e.target.value }))} aria-label={`Status of ${k.term}`} className="adm-control w-32">
                          {KEYWORD_STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {cap(s)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <input
                          key={`${k.id}-${k.position}`}
                          defaultValue={k.position ?? ""}
                          inputMode="numeric"
                          placeholder="–"
                          aria-label={`Google position of ${k.term}`}
                          onBlur={(e) => {
                            const n = e.target.value.trim() === "" ? null : Number(e.target.value);
                            if (n !== k.position) run(() => updateKeyword(k.id, { position: n }));
                          }}
                          className="adm-control w-16 text-right tabular-nums"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button type="button" aria-label={`Delete ${k.term}`} onClick={() => run(() => deleteKeyword(k.id))} className="adm-btn adm-btn-ghost adm-btn-sm hover:!text-red-300">
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="min-w-0 rounded-xl border border-navy-700 bg-navy">
        <header className="border-b border-navy-700 px-5 py-3.5">
          <h2 className="text-sm font-semibold text-white">Keyword ideas</h2>
          <p className="mt-0.5 text-xs text-mist">What people in India type into Google, from Google&rsquo;s autocomplete. It shows demand, not search volume.</p>
        </header>
        <div className="p-5">
          <form
            className="flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void findIdeas();
            }}
          >
            <input value={seed} onChange={(e) => setSeed(e.target.value)} placeholder="Start from a word, e.g. smart switch" aria-label="Starting word" className="adm-control w-full sm:w-80" />
            <button type="submit" disabled={loadingIdeas || seed.trim().length < 2} className="adm-btn adm-btn-secondary">
              <Search size={16} aria-hidden="true" /> {loadingIdeas ? "Looking…" : "Find ideas"}
            </button>
          </form>
          {ideas && (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              {ideas.map((g) => (
                <div key={g.group} className="min-w-0">
                  <p className="mb-2 text-xs uppercase tracking-wider text-ash">{g.group}</p>
                  <ul className="space-y-1">
                    {g.ideas.map((idea) => (
                      <li key={idea} className="flex items-center justify-between gap-2 text-sm">
                        <span className="truncate text-mist">{idea}</span>
                        {tracked.has(idea) ? (
                          <span className="shrink-0 text-xs text-ash">Tracked</span>
                        ) : (
                          <button type="button" disabled={busy} onClick={() => run(() => addKeyword(idea, "trending", ""), "Keyword added.")} className="adm-btn adm-btn-ghost adm-btn-sm shrink-0">
                            + Track
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
