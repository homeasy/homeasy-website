/** Products: database rows edited in /admin/products, shown on /products. Server only. */
import "server-only";
import { randomUUID } from "node:crypto";
import { cacheLife, cacheTag } from "next/cache";
import seed from "@/data/products.json";
import { dbDelete, dbInsert, dbList, dbMode, dbUpdate } from "@/lib/db";
import { getSnapshot } from "./publish";

export const PRODUCT_STATUSES = ["available", "coming-soon", "planned"] as const;
export const PRODUCT_ICONS = ["relay", "fan", "power", "ir", "no-neutral", "plug"] as const;

export type Product = {
  id: string;
  slug: string;
  name: string;
  headline: string; // short category line, e.g. "Fans, with speed control"
  line: string; // one-sentence summary
  description: string; // longer text, blank lines separate paragraphs
  controls: string[];
  highlights: string[];
  icon: string;
  image_url: string | null;
  price: number | null; // rupees; null = price on request
  mrp: number | null; // optional higher "list" price, shown struck through
  status: (typeof PRODUCT_STATUSES)[number];
  active: boolean; // shown on the website
  featured: boolean; // "Bestseller" badge
  sort_order: number;
  created_at: string;
  updated_at: string;
};

const TABLE = "products";

function seedRows(): Product[] {
  const now = new Date(0).toISOString();
  return seed.products.map((p, i) => ({
    id: `seed-${p.slug}`,
    slug: p.slug,
    name: p.name,
    headline: p.headline,
    line: p.line,
    description: "",
    controls: p.controls,
    highlights: [],
    icon: p.icon,
    image_url: null,
    price: null,
    mrp: null,
    status: p.status as Product["status"],
    active: true,
    featured: false,
    sort_order: (i + 1) * 10,
    created_at: now,
    updated_at: now,
  }));
}

/** Every product, for the admin. Falls back to the starter list when the table has never been filled. */
export async function listAllProducts(): Promise<{ products: Product[]; seeded: boolean }> {
  const rows = await dbList<Product>(TABLE, "sort_order.asc");
  if (rows === null || (rows.length === 0 && dbMode() !== "supabase")) return { products: seedRows(), seeded: false };
  return { products: rows, seeded: true };
}

/**
 * Products shown on the public site: the last PUBLISHED snapshot, never the admin's working copy.
 * Cached; publishing calls updateTag("products").
 */
export async function getPublicProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  let live: Product[] | null = null;
  try {
    live = (await getSnapshot<Product[]>("products"))?.data ?? null;
  } catch (e) {
    console.error(e);
  }
  // before the first publish (or with no storage) show the starter list, so the catalogue is never empty
  return (live ?? seedRows()).filter((p) => p.active).sort((a, b) => a.sort_order - b.sort_order);
}

export async function getPublicProduct(slug: string): Promise<Product | null> {
  return (await getPublicProducts()).find((p) => p.slug === slug) ?? null;
}

/** Copies the starter products into the database (first-time setup). */
export async function importStarterProducts(): Promise<boolean> {
  const now = new Date().toISOString();
  return dbInsert(TABLE, seedRows().map((p) => ({ ...p, id: randomUUID(), created_at: now, updated_at: now })));
}

export type ProductInput = Omit<Product, "id" | "created_at" | "updated_at">;

export async function createProduct(input: ProductInput): Promise<string | null> {
  const id = randomUUID();
  const now = new Date().toISOString();
  return (await dbInsert(TABLE, { ...input, id, created_at: now, updated_at: now })) ? id : null;
}

export async function updateProduct(id: string, patch: Partial<ProductInput>): Promise<boolean> {
  return dbUpdate(TABLE, "id", id, { ...patch, updated_at: new Date().toISOString() });
}

export async function deleteProduct(id: string): Promise<boolean> {
  return dbDelete(TABLE, "id", id);
}

export const formatINR = (n: number) => `₹${n.toLocaleString("en-IN")}`;
