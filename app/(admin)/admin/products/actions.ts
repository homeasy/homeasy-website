"use server";

import { refresh, updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { saveImage } from "@/lib/db";
import {
  createProduct,
  deleteProduct,
  importStarterProducts,
  publishProducts,
  PRODUCT_ICONS,
  PRODUCT_STATUSES,
  updateProduct,
  type ProductInput,
} from "@/lib/store/products";
import { publishContent } from "@/lib/content/store";
import { publishSettings } from "@/lib/store/settings";

export type ProductFormState = { error?: string; fields?: Record<string, string> } | undefined;

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
const lines = (v: FormDataEntryValue | null, sep: RegExp) =>
  String(v ?? "").split(sep).map((x) => x.trim()).filter(Boolean).slice(0, 12);
const money = (v: FormDataEntryValue | string | null) => {
  const n = Math.round(Number(String(v ?? "").replace(/[₹,\s]/g, "")));
  return Number.isFinite(n) && n > 0 ? n : null;
};

export async function saveProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim().slice(0, 80);
  const slug = slugify(String(formData.get("slug") ?? "") || name);
  const fields: Record<string, string> = {};
  if (name.length < 2) fields.name = "Enter the product name.";
  if (!slug) fields.slug = "Enter a link name using letters and numbers.";
  const price = money(formData.get("price"));
  const mrp = money(formData.get("mrp"));
  if (price && mrp && mrp <= price) fields.mrp = "The list price must be higher than the selling price.";
  const status = String(formData.get("status") ?? "available") as ProductInput["status"];
  const icon = String(formData.get("icon") ?? "relay");
  if (!PRODUCT_STATUSES.includes(status)) fields.status = "Choose a status.";
  if (Object.keys(fields).length) return { error: "Please fix the highlighted fields.", fields };

  let image_url = String(formData.get("image_url") ?? "") || null;
  if (formData.get("remove_image") === "on") image_url = null;
  const photo = formData.get("photo");
  if (photo instanceof File && photo.size > 0) {
    if (!["image/webp", "image/jpeg", "image/png"].includes(photo.type)) return { error: "The photo must be a JPG, PNG or WebP image." };
    if (photo.size > 3.5 * 1024 * 1024) return { error: "The photo is too large. Please use one under 3.5 MB." };
    const ext = photo.type === "image/webp" ? "webp" : photo.type === "image/png" ? "png" : "jpg";
    const url = await saveImage("products", `${slug}-${Date.now()}.${ext}`, Buffer.from(await photo.arrayBuffer()), photo.type);
    if (!url) return { error: "The photo could not be uploaded. Check that storage is connected." };
    image_url = url;
  }

  const input: ProductInput = {
    slug,
    name,
    headline: String(formData.get("headline") ?? "").trim().slice(0, 80),
    line: String(formData.get("line") ?? "").trim().slice(0, 240),
    description: String(formData.get("description") ?? "").trim().slice(0, 4000),
    controls: lines(formData.get("controls"), /,|\n/),
    highlights: lines(formData.get("highlights"), /\n/),
    icon: (PRODUCT_ICONS as readonly string[]).includes(icon) ? icon : "relay",
    image_url,
    price,
    mrp: price ? mrp : null,
    status,
    active: formData.get("active") === "on",
    featured: formData.get("featured") === "on",
    sort_order: Math.max(0, Math.min(9999, Math.round(Number(formData.get("sort_order")) || 100))),
  };

  const ok = id ? await updateProduct(id, input) : !!(await createProduct(input));
  if (!ok) return { error: "Could not save. The link name may already be used by another product." };
  redirect("/admin/products?saved=1"); // saved as a draft: it goes live on Publish
}

export async function removeProduct(formData: FormData) {
  await requireAdmin();
  await deleteProduct(String(formData.get("id") ?? ""));
  redirect("/admin/products");
}

export type ProductRowChange = { id: string; price: string; mrp: string; status: string; active: boolean; featured: boolean };

/** Saves the rows edited in the "Products & prices" table. Drafts only: live after Publish. */
export async function saveProductTable(rows: ProductRowChange[]): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin();
  const list = rows.slice(0, 200);
  for (const r of list) {
    const price = money(r.price);
    const mrp = money(r.mrp);
    if (!(PRODUCT_STATUSES as readonly string[]).includes(r.status)) return { ok: false, error: "Choose an availability for every product." };
    if (price && mrp && mrp <= price) return { ok: false, error: "A list price must be higher than the selling price." };
  }
  for (const r of list) {
    const price = money(r.price);
    const saved = await updateProduct(String(r.id), {
      price,
      mrp: price ? money(r.mrp) : null,
      status: r.status as ProductInput["status"],
      active: !!r.active,
      featured: !!r.featured,
    });
    if (!saved) return { ok: false, error: "Could not save every row. Check that storage is connected, then try again." };
  }
  refresh();
  return { ok: true };
}

export async function importStarters() {
  await requireAdmin();
  await importStarterProducts();
  redirect("/admin/products");
}

/** Makes every saved draft live on the website. */
export async function publishNow() {
  await requireAdmin();
  if (await publishProducts()) updateTag("products");
  if (await publishSettings()) updateTag("store");
  if (await publishContent()) updateTag("content");
  refresh();
}
