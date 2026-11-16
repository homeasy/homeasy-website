"use server";

import { refresh } from "next/cache";
import starter from "@/data/blog-starter.json";
import { requireAdmin } from "@/lib/admin/session";
import { cleanArticleHtml } from "@/lib/blog/sanitize";
import { DEFAULT_AUTHOR, slugify, type ArticleInput } from "@/lib/blog/shared";
import { createArticle, deleteArticle, listArticles, updateArticle } from "@/lib/blog/store";
import { dbErrorHint, saveImage } from "@/lib/db";

export type ArticleForm = Omit<ArticleInput, "cover_url" | "published_on"> & { id: string; cover_url: string; published_on: string };
export type SaveResult = { ok: true; id: string; slug: string; published_on: string; body_html: string } | { ok: false; error: string; fields?: Record<string, string> };

const text = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
const okImageUrl = (u: string) => /^https:\/\/[^\s"<>]+$/i.test(u) || /^\/[^\s"<>]*$/.test(u);
/** Today's date in India, YYYY-MM-DD. */
const todayIST = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());

/** Saves an article as a draft (it reaches the website on Publish). */
export async function saveArticle(form: ArticleForm): Promise<SaveResult> {
  await requireAdmin();
  const title = text(form.title, 140);
  const slug = slugify(text(form.slug, 90) || title);
  const fields: Record<string, string> = {};
  if (title.length < 3) fields.title = "Write the article title.";
  if (!slug) fields.slug = "Enter a link name using letters and numbers.";
  const cover = text(form.cover_url, 500);
  if (cover && !okImageUrl(cover)) fields.cover_url = "The cover photo address must start with https:// (or upload a photo).";
  const day = text(form.published_on, 10);
  if (day && !/^\d{4}-\d{2}-\d{2}$/.test(day)) fields.published_on = "Choose a date.";
  if (Object.keys(fields).length) return { ok: false, error: "Please fix the highlighted fields.", fields };

  try {
    if ((await listArticles()).some((a) => a.slug === slug && a.id !== form.id)) {
      return { ok: false, error: "Another article already uses this link name.", fields: { slug: "Already used by another article." } };
    }
    const active = !!form.active;
    const input: ArticleInput = {
      slug,
      title,
      excerpt: text(form.excerpt, 300),
      body_html: cleanArticleHtml(String(form.body_html ?? "").slice(0, 200_000)),
      cover_url: cover || null,
      cover_alt: text(form.cover_alt, 160),
      author: text(form.author, 80) || DEFAULT_AUTHOR,
      category: text(form.category, 40),
      focus_keyword: text(form.focus_keyword, 80).toLowerCase(),
      seo_title: text(form.seo_title, 120),
      seo_description: text(form.seo_description, 320),
      noindex: !!form.noindex,
      active,
      published_on: day || (active ? todayIST() : null), // the date is fixed the first time the article is shown
    };
    const id = form.id ? ((await updateArticle(form.id, input)) ? form.id : null) : await createArticle(input);
    if (!id) return { ok: false, error: "Could not save. If this is the first article, run supabase/07-blog.sql in Supabase once, then save again." };
    refresh();
    return { ok: true, id, slug, published_on: input.published_on ?? "", body_html: input.body_html };
  } catch (e) {
    console.error(e);
    return { ok: false, error: `Could not save. ${dbErrorHint(e)} If this is the first article, run supabase/07-blog.sql in Supabase once.` };
  }
}

/**
 * Adds the ten starter articles (data/blog-starter.json) as drafts marked "Show on the website", skipping any whose
 * link name already exists. Nothing reaches the website until Publish is pressed.
 */
export async function importStarterArticles(): Promise<{ ok: boolean; message: string }> {
  await requireAdmin();
  try {
    const have = new Set((await listArticles()).map((a) => a.slug));
    const missing = starter.articles.filter((a) => !have.has(a.slug));
    let added = 0;
    for (const a of missing) {
      const id = await createArticle({
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        body_html: cleanArticleHtml(a.body_html),
        cover_url: null,
        cover_alt: a.cover_alt,
        author: DEFAULT_AUTHOR,
        category: a.category,
        focus_keyword: a.focus_keyword,
        seo_title: "",
        seo_description: "",
        noindex: false,
        active: true,
        published_on: todayIST(),
      });
      if (id) added++;
    }
    refresh();
    if (!missing.length) return { ok: true, message: "All the starter articles are already here." };
    if (added < missing.length) return { ok: false, message: `Added ${added} of ${missing.length}. If the blog has not been set up, run supabase/07-blog.sql in Supabase once, then try again.` };
    return { ok: true, message: `Added ${added} articles. Add a cover photo to each, then press “Publish changes”.` };
  } catch (e) {
    console.error(e);
    return { ok: false, message: `Could not add the articles. ${dbErrorHint(e)} If the blog has not been set up, run supabase/07-blog.sql in Supabase once.` };
  }
}

export async function removeArticle(id: string): Promise<{ ok: boolean }> {
  await requireAdmin();
  const ok = await deleteArticle(String(id));
  refresh();
  return { ok };
}

/** Uploads a photo for an article (cover or inside the text). The browser shrinks it to WebP first. */
export async function uploadArticleImage(formData: FormData): Promise<{ url?: string; error?: string }> {
  await requireAdmin();
  const photo = formData.get("photo");
  if (!(photo instanceof File) || photo.size === 0) return { error: "Choose a photo." };
  if (!["image/webp", "image/jpeg", "image/png"].includes(photo.type)) return { error: "The photo must be a JPG, PNG or WebP image." };
  if (photo.size > 3.5 * 1024 * 1024) return { error: "The photo is too large. Please use one under 3.5 MB." };
  const ext = photo.type === "image/webp" ? "webp" : photo.type === "image/png" ? "png" : "jpg";
  const base = slugify(photo.name.replace(/\.\w+$/, "")).slice(0, 40) || "photo";
  const url = await saveImage("blog", `${base}-${Date.now()}.${ext}`, Buffer.from(await photo.arrayBuffer()), photo.type);
  return url ? { url } : { error: "The photo could not be uploaded. Check that storage is connected." };
}
