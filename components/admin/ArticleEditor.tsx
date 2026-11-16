"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDeferredValue, useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import { removeArticle, saveArticle, uploadArticleImage, type ArticleForm } from "@/app/(admin)/admin/blog/actions";
import { scoreArticle } from "@/lib/blog/score";
import { searchDescription, searchTitle, slugify } from "@/lib/blog/shared";
import { useConfirm } from "./confirm";
import { shrinkPhoto } from "./shrink-photo";
import { useToast } from "./toast";
import { CheckList, ScoreBadge } from "./ui";

// the editor is only needed here, and only in the browser
const RichText = dynamic(() => import("./RichText"), {
  ssr: false,
  loading: () => <div className="min-h-[480px] rounded-lg border border-navy-700 bg-navy p-5 text-sm text-mist">Loading the editor…</div>,
});

const LABEL = "mb-1.5 flex items-baseline justify-between gap-2 text-xs font-medium uppercase tracking-wider text-mist";
const HINT = "mt-1 block text-xs text-ash";
const BOX = "min-w-0 rounded-xl border border-navy-700 bg-navy p-5";
const count = (n: number, best: number) => <span className={`normal-case tracking-normal ${n > best ? "text-amber" : "text-ash"}`}>({n}/{best})</span>;
const VERDICT = (score: number) => (score >= 80 ? "Good" : score >= 55 ? "Needs work" : "Poor");

/** Write or edit one blog article. The SEO score on the right is worked out again as you type. */
export function ArticleEditor({ initial, siteHost, live }: { initial: ArticleForm; siteHost: string; live: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();
  const [busy, start] = useTransition();
  const [v, setV] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [slugTouched, setSlugTouched] = useState(!!initial.id);
  const [coverBusy, setCoverBusy] = useState(false);
  const dirty = JSON.stringify(v) !== JSON.stringify(saved);
  const set = (patch: Partial<ArticleForm>) => setV((old) => ({ ...old, ...patch }));

  // scoring follows the typing, one step behind, so the editor never feels slow
  const forScore = useDeferredValue(v);
  const result = useMemo(() => scoreArticle({ ...forScore, cover_url: forScore.cover_url || null }), [forScore]);

  const latest = useRef({ v, dirty, busy });
  useEffect(() => {
    latest.current = { v, dirty, busy };
  });

  function save() {
    const draft = latest.current.v;
    start(async () => {
      const r = await saveArticle(draft);
      if (!r.ok) {
        setErrors(r.fields ?? {});
        toast("error", r.error);
        return;
      }
      setErrors({});
      const stored = { ...draft, id: r.id, slug: r.slug, published_on: r.published_on };
      setSaved(stored);
      // keep anything typed while the save was running
      setV((now) => ({ ...now, id: r.id, slug: now.slug === draft.slug ? r.slug : now.slug, published_on: now.published_on || r.published_on }));
      setSlugTouched(true);
      toast("success", "Saved as a draft. Press “Publish changes” to put it on the website.");
      if (!draft.id) router.replace(`/admin/blog/${r.id}`);
    });
  }

  // warn before leaving with unsaved work, and save with Ctrl/Cmd + S
  useEffect(() => {
    const leave = (e: BeforeUnloadEvent) => {
      if (latest.current.dirty) e.preventDefault();
    };
    const key = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
        e.preventDefault();
        if (latest.current.dirty && !latest.current.busy) save();
      }
    };
    window.addEventListener("beforeunload", leave);
    window.addEventListener("keydown", key);
    return () => {
      window.removeEventListener("beforeunload", leave);
      window.removeEventListener("keydown", key);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- save reads the latest values through a ref
  }, []);

  async function uploadCover(file: File | undefined) {
    if (!file) return;
    setCoverBusy(true);
    try {
      const data = new FormData();
      data.set("photo", await shrinkPhoto(file));
      const r = await uploadArticleImage(data);
      if (r.url) set({ cover_url: r.url });
      else toast("error", r.error ?? "The photo could not be uploaded.");
    } catch {
      toast("error", "The photo could not be uploaded.");
    }
    setCoverBusy(false);
  }

  async function remove() {
    if (!(await confirm({ title: "Delete this article?", message: "It is removed from the admin now, and from the website the next time you publish.", confirmLabel: "Delete", danger: true }))) return;
    start(async () => {
      const r = await removeArticle(v.id);
      if (!r.ok) return toast("error", "Could not delete the article.");
      setSaved(v); // nothing left to save
      latest.current.dirty = false;
      router.push("/admin/blog");
    });
  }

  const err = (k: string) => (errors[k] ? <span className="mt-1 block text-xs text-red-300">{errors[k]}</span> : null);
  const title = searchTitle(v);
  const description = searchDescription(v);

  return (
    <div>
      {confirmNode}
      {/* top bar: stays in view while writing */}
      <div className="sticky top-14 z-20 -mx-4 mb-6 flex flex-wrap items-center gap-3 border-b border-navy-700 bg-deep px-4 py-3 sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-8 lg:px-8">
        <Link href="/admin/blog" className="inline-flex items-center gap-1.5 text-sm text-mist no-underline hover:text-white">
          <ArrowLeft size={16} aria-hidden="true" /> All articles
        </Link>
        <span className="ml-auto flex items-center gap-2 text-sm text-mist" title={`SEO score ${result.score} out of 100`}>
          <ScoreBadge score={result.score} size="sm" />
          <span className="hidden sm:inline">SEO score: {VERDICT(result.score)}</span>
        </span>
        {live && (
          <a href={`/blog/${saved.slug}`} target="_blank" rel="noopener noreferrer" className="adm-btn adm-btn-ghost">
            View <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
        <button type="button" className="adm-btn adm-btn-primary" disabled={busy || !dirty} onClick={save}>
          {busy ? "Saving…" : dirty ? "Save draft" : "Saved"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
        {/* ---------- writing ---------- */}
        <div className="min-w-0 space-y-5">
          <label className="block">
            <span className={LABEL}>Article title {count(v.title.length, 70)}</span>
            <input
              value={v.title}
              maxLength={140}
              placeholder="For example: How to make an old switchboard smart without rewiring"
              onChange={(e) => set({ title: e.target.value, ...(slugTouched ? {} : { slug: slugify(e.target.value) }) })}
              className="adm-control text-lg font-semibold"
              aria-invalid={errors.title ? true : undefined}
            />
            {err("title")}
          </label>

          <label className="block">
            <span className={LABEL}>Short summary {count(v.excerpt.length, 160)}</span>
            <textarea value={v.excerpt} maxLength={300} rows={2} onChange={(e) => set({ excerpt: e.target.value })} className="adm-control" placeholder="One or two sentences. Shown on the blog list and in Google when no search description is written." />
          </label>

          <div>
            <span className={LABEL}>Article</span>
            <RichText value={initial.body_html} onChange={(html) => set({ body_html: html })} />
            <span className={HINT}>
              Write only what is true today: no prices, certifications, savings figures or “works with Alexa / Google” until they are real.
            </span>
          </div>
        </div>

        {/* ---------- SEO and settings ---------- */}
        <div className="min-w-0 space-y-5 xl:sticky xl:top-20 xl:max-h-[calc(100vh-6rem)] xl:self-start xl:overflow-y-auto xl:pr-1">
          <section className={BOX} aria-label="SEO score">
            <div className="flex items-center gap-4">
              <ScoreBadge score={result.score} size="lg" />
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">SEO score: {VERDICT(result.score)}</h2>
                <p className="text-xs text-mist">Updates as you write. Fix the red and amber points first; aim for 80 or more.</p>
              </div>
            </div>
            <div className="mt-4" aria-live="off">
              <CheckList checks={result.checks} />
            </div>
          </section>

          <section className={`${BOX} space-y-4`} aria-label="Search settings">
            <h2 className="text-sm font-semibold text-white">Search settings</h2>
            <label className="block">
              <span className={LABEL}>Focus keyword</span>
              <input value={v.focus_keyword} maxLength={80} onChange={(e) => set({ focus_keyword: e.target.value })} className="adm-control" placeholder="for example: smart switch for old house" />
              <span className={HINT}>The one phrase people would type in Google to find this article.</span>
            </label>
            <label className="block">
              <span className={LABEL}>Search title {count(title.length, 60)}</span>
              <input value={v.seo_title} maxLength={120} placeholder={v.title || "Uses the article title"} onChange={(e) => set({ seo_title: e.target.value })} className="adm-control" />
            </label>
            <label className="block">
              <span className={LABEL}>Search description {count(description.length, 158)}</span>
              <textarea value={v.seo_description} maxLength={320} rows={3} placeholder={v.excerpt || "Uses the short summary"} onChange={(e) => set({ seo_description: e.target.value })} className="adm-control" />
            </label>
            <label className="block">
              <span className={LABEL}>Link name</span>
              <input
                value={v.slug}
                maxLength={90}
                onChange={(e) => (setSlugTouched(true), set({ slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-") }))}
                onBlur={() => set({ slug: slugify(v.slug) })}
                className="adm-control"
                aria-invalid={errors.slug ? true : undefined}
              />
              <span className={HINT}>{live ? "This article is already on the website: changing the link name breaks links people have saved." : "The last part of the article's address."}</span>
              {err("slug")}
            </label>
            <div className="rounded-lg border border-navy-700 bg-navy-800/40 p-4">
              <p className="text-xs uppercase tracking-wider text-ash">Google preview</p>
              <p className="mt-2 truncate text-xs text-mist">
                {siteHost} › blog › {v.slug || "…"}
              </p>
              <p className="mt-0.5 break-words text-base text-blue-300">{title.slice(0, 62) || "Article title"}</p>
              <p className="mt-0.5 break-words text-sm text-mist">{description.slice(0, 160) || "The short summary appears here."}</p>
            </div>
            <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white">
              <input type="checkbox" checked={v.noindex} onChange={(e) => set({ noindex: e.target.checked })} className="size-4 accent-[var(--brand-amber)]" />
              Hide this article from search engines
            </label>
          </section>

          <section className={`${BOX} space-y-4`} aria-label="Cover photo">
            <h2 className="text-sm font-semibold text-white">Cover photo</h2>
            {v.cover_url ? (
              // eslint-disable-next-line @next/next/no-img-element -- admin preview of an uploaded file
              <img src={v.cover_url} alt="" className="aspect-[16/9] w-full rounded-lg border border-navy-700 object-cover" />
            ) : (
              <p className="rounded-lg bg-white/5 p-5 text-center text-sm text-mist">No cover photo yet.</p>
            )}
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => uploadCover(e.target.files?.[0])} className="block w-full text-sm text-mist" aria-label="Upload a cover photo" />
            <span className={HINT}>{coverBusy ? "Uploading…" : "A wide photo (16:9) looks best. Large photos are shrunk automatically."}</span>
            {err("cover_url")}
            {v.cover_url && (
              <>
                <label className="block">
                  <span className={LABEL}>Photo description</span>
                  <input value={v.cover_alt} maxLength={160} onChange={(e) => set({ cover_alt: e.target.value })} className="adm-control" placeholder="What the photo shows" />
                </label>
                <button type="button" className="adm-btn adm-btn-sm adm-btn-ghost" onClick={() => set({ cover_url: "", cover_alt: "" })}>
                  Remove the photo
                </button>
              </>
            )}
          </section>

          <section className={`${BOX} space-y-4`} aria-label="Article details">
            <h2 className="text-sm font-semibold text-white">Details</h2>
            <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white">
              <input type="checkbox" checked={v.active} onChange={(e) => set({ active: e.target.checked })} className="size-4 accent-[var(--brand-amber)]" />
              Show on the website
            </label>
            <span className={HINT}>Tick this when the article is ready, save, then press “Publish changes”. Unticked articles stay private.</span>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <label className="block">
                <span className={LABEL}>Written by</span>
                <input value={v.author} maxLength={80} onChange={(e) => set({ author: e.target.value })} className="adm-control" />
              </label>
              <label className="block">
                <span className={LABEL}>Topic</span>
                <input value={v.category} maxLength={40} onChange={(e) => set({ category: e.target.value })} className="adm-control" placeholder="for example: Guides" />
              </label>
              <label className="block">
                <span className={LABEL}>Date shown</span>
                <input type="date" value={v.published_on} onChange={(e) => set({ published_on: e.target.value })} className="adm-control" aria-invalid={errors.published_on ? true : undefined} />
                <span className={HINT}>Left empty, it is set to the day the article is first shown.</span>
                {err("published_on")}
              </label>
            </div>
            {v.id && (
              <button type="button" className="adm-btn adm-btn-sm adm-btn-danger" disabled={busy} onClick={remove}>
                <Trash2 size={14} aria-hidden="true" /> Delete article
              </button>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
