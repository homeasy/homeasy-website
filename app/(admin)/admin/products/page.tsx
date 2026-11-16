import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { PRODUCT_ICON_MAP } from "@/components/catalog/product-icons";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";
import { formatINR, listAllProducts } from "@/lib/store/products";
import { importStarters, setProductActive } from "./actions";

const STATUS: Record<string, string> = { available: "Available", "coming-soon": "Coming soon", planned: "Planned" };

async function Products({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  const { products, seeded } = await listAllProducts();
  const priced = products.filter((p) => p.price).length;
  return (
    <AdminShell mode={dbMode()} active="products">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-h4">Products</h1>
          <p className="mt-1 text-[14px] text-body">
            {products.length} products · {priced} with a price · {products.filter((p) => p.active).length} on the website
          </p>
        </div>
        {seeded && (
          <Link href="/admin/products/new" className="btn btn-primary min-h-11 px-4">
            <Plus size={18} aria-hidden="true" /> Add product
          </Link>
        )}
      </div>

      {saved && (
        <p role="status" className="mt-4 rounded-card bg-[var(--badge-available-bg)] p-3 text-[15px] font-semibold text-[var(--badge-available-text)]">
          Saved as a draft. Press “Publish now” to make it live on the website.
        </p>
      )}

      {!seeded && (
        <div className="mt-6 rounded-card border border-line bg-white p-6">
          <h2 className="text-[1.1875rem]">Set up your products</h2>
          <p className="mt-2 text-body">
            The website is showing the six starter modules below. Import them to start editing names, prices and photos.
          </p>
          <form action={importStarters} className="mt-4">
            <button type="submit" className="btn btn-primary min-h-11 px-5">
              Import starter products
            </button>
          </form>
        </div>
      )}

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-card border border-line bg-white">
        {products.map((p) => {
          const Icon = PRODUCT_ICON_MAP[p.icon] ?? PRODUCT_ICON_MAP.relay;
          return (
            <li key={p.id} className="grid gap-3 p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto_auto] sm:items-center sm:gap-5">
              <div className="flex min-w-0 items-center gap-3">
                {p.image_url ? (
                  <Image src={p.image_url} alt="" width={48} height={48} unoptimized className="size-12 shrink-0 rounded-lg border border-line object-cover" />
                ) : (
                  <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-lg bg-tint text-blue-800">
                    <Icon size={22} aria-hidden="true" />
                  </span>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold">{p.name}</p>
                  <p className="truncate text-[14px] text-body">
                    {p.headline || "—"} · {STATUS[p.status]}
                    {p.featured ? " · Bestseller" : ""}
                  </p>
                </div>
              </div>
              <p className="text-[15px] font-semibold sm:text-right">{p.price ? formatINR(p.price) : <span className="font-normal text-slate">On request</span>}</p>
              {seeded ? (
                <form action={setProductActive}>
                  <input type="hidden" name="id" value={p.id} />
                  <input type="hidden" name="active" value={String(!p.active)} />
                  <button
                    type="submit"
                    aria-pressed={p.active}
                    className={`min-h-10 rounded-full px-3 text-[13px] font-semibold ${p.active ? "bg-[var(--badge-available-bg)] text-[var(--badge-available-text)]" : "bg-line text-body"}`}
                  >
                    {p.active ? "On website" : "Hidden"}
                  </button>
                </form>
              ) : (
                <span className="text-[13px] text-slate">Starter</span>
              )}
              {seeded ? (
                <Link href={`/admin/products/${p.id}`} className="btn btn-outline min-h-10 px-4 text-[14px]">
                  Edit
                </Link>
              ) : (
                <span />
              )}
            </li>
          );
        })}
      </ul>
    </AdminShell>
  );
}

export default function AdminProductsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-body">Loading products…</p>}>
      <Products searchParams={searchParams} />
    </Suspense>
  );
}
