"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { Pencil } from "lucide-react";
import { saveProductTable, type ProductRowChange } from "@/app/(admin)/admin/products/actions";
import { PRODUCT_ICON_MAP } from "@/components/catalog/product-icons";
import { useToast } from "./toast";

export type ProductRow = {
  id: string;
  name: string;
  headline: string;
  icon: string;
  image_url: string | null;
  price: number | null;
  mrp: number | null;
  status: string;
  active: boolean;
  featured: boolean;
};
type Edit = { price: string; mrp: string; status: string; active: boolean; featured: boolean };

const asEdit = (p: ProductRow): Edit => ({ price: p.price ? String(p.price) : "", mrp: p.mrp ? String(p.mrp) : "", status: p.status, active: p.active, featured: p.featured });
const same = (a: Edit, b: Edit) => a.price === b.price && a.mrp === b.mrp && a.status === b.status && a.active === b.active && a.featured === b.featured;
const digits = (v: string) => v.replace(/[^\d]/g, "").slice(0, 7);

/**
 * "Products & prices": prices, availability, On sale and Bestseller are edited right in the table,
 * then saved together. Saving makes a draft; the website changes only after Publish.
 */
export function ProductsTable({ products, editable }: { products: ProductRow[]; editable: boolean }) {
  const toast = useToast();
  const [edits, setEdits] = useState<Record<string, Edit>>({});
  const [busy, start] = useTransition();

  const value = (p: ProductRow) => edits[p.id] ?? asEdit(p);
  const changed = products.filter((p) => edits[p.id] && !same(edits[p.id], asEdit(p)));
  const set = (p: ProductRow, patch: Partial<Edit>) => setEdits((e) => ({ ...e, [p.id]: { ...value(p), ...patch } }));

  // warn before leaving the page with unsaved prices
  useEffect(() => {
    if (!changed.length) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [changed.length]);

  function save() {
    const rows: ProductRowChange[] = changed.map((p) => ({ id: p.id, ...edits[p.id] }));
    start(async () => {
      const r = await saveProductTable(rows);
      if (r.ok) {
        setEdits({});
        toast("success", "Saved as a draft. Press “Publish changes” to make it live.");
      } else toast("error", r.error ?? "Could not save.");
    });
  }

  const num = "adm-control w-28 text-right tabular-nums";
  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-sm">
          <thead className="border-b border-navy-700 text-left text-xs uppercase tracking-wider text-mist">
            <tr>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-3 py-3 font-medium">Price (₹)</th>
              <th className="px-3 py-3 font-medium">List price (₹)</th>
              <th className="px-3 py-3 font-medium">Availability</th>
              <th className="px-3 py-3 text-center font-medium">On sale</th>
              <th className="px-3 py-3 text-center font-medium">Bestseller</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-navy-700">
            {products.map((p) => {
              const v = value(p);
              const Icon = PRODUCT_ICON_MAP[p.icon] ?? PRODUCT_ICON_MAP.relay;
              const dirty = changed.includes(p);
              return (
                <tr key={p.id} className={dirty ? "bg-amber/5" : ""}>
                  <td className="px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      {p.image_url ? (
                        <Image src={p.image_url} alt="" width={40} height={40} unoptimized className="size-10 shrink-0 rounded-lg border border-navy-700 object-cover" />
                      ) : (
                        <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-mist">
                          <Icon size={20} aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="truncate font-medium text-white">{p.name}</p>
                        <p className="truncate text-xs text-mist">{p.headline || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <input inputMode="numeric" disabled={!editable} value={v.price} onChange={(e) => set(p, { price: digits(e.target.value) })} placeholder="On request" aria-label={`Price of ${p.name}`} className={num} />
                  </td>
                  <td className="px-3 py-3">
                    <input inputMode="numeric" disabled={!editable} value={v.mrp} onChange={(e) => set(p, { mrp: digits(e.target.value) })} placeholder="—" aria-label={`List price of ${p.name}`} className={num} />
                  </td>
                  <td className="px-3 py-3">
                    <select disabled={!editable} value={v.status} onChange={(e) => set(p, { status: e.target.value })} aria-label={`Availability of ${p.name}`} className="adm-control w-36">
                      <option value="available">Available</option>
                      <option value="coming-soon">Coming soon</option>
                      <option value="planned">Planned</option>
                    </select>
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input type="checkbox" disabled={!editable} checked={v.active} onChange={(e) => set(p, { active: e.target.checked })} aria-label={`${p.name} is on the website`} className="size-4 accent-[var(--brand-amber)]" />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <input type="checkbox" disabled={!editable} checked={v.featured} onChange={(e) => set(p, { featured: e.target.checked })} aria-label={`${p.name} is a bestseller`} className="size-4 accent-[var(--brand-amber)]" />
                  </td>
                  <td className="px-4 py-3 text-right">
                    {editable && (
                      <Link href={`/admin/products/${p.id}`} className="adm-btn adm-btn-ghost adm-btn-sm">
                        <Pencil size={14} aria-hidden="true" /> Edit details
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {changed.length > 0 && (
        <div className="sticky bottom-0 flex flex-wrap items-center justify-between gap-3 border-t border-amber/40 bg-navy-800 px-4 py-3">
          <p className="text-sm text-white">
            {changed.length} unsaved change{changed.length === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <button type="button" disabled={busy} onClick={() => setEdits({})} className="adm-btn adm-btn-ghost">
              Discard
            </button>
            <button type="button" disabled={busy} onClick={save} className="adm-btn adm-btn-primary">
              {busy ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
