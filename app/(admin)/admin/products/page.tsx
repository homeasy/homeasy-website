import Link from "next/link";
import { Suspense } from "react";
import { Plus } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductsTable } from "@/components/admin/ProductsTable";
import { Card, ErrorBanner, PageHeader } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/admin/session";
import { dbErrorHint, dbMode } from "@/lib/db";
import { inr } from "@/lib/store/pricing";
import { listAllProducts } from "@/lib/store/products";
import { getDraftSettings } from "@/lib/store/settings";
import { importStarters } from "./actions";

async function Products({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  await requireAdmin();
  const { saved } = await searchParams;
  let data: Awaited<ReturnType<typeof listAllProducts>>;
  let store: Awaited<ReturnType<typeof getDraftSettings>>["settings"];
  try {
    [data, store] = await Promise.all([listAllProducts(), getDraftSettings().then((s) => s.settings)]);
  } catch (e) {
    console.error(e);
    return (
      <AdminShell mode={dbMode()}>
        <PageHeader title="Products & prices" />
        <ErrorBanner title="Could not load products.">{dbErrorHint(e)}</ErrorBanner>
      </AdminShell>
    );
  }
  const { products, seeded } = data;
  const storeFacts = [
    ["GST", `${store.gst_rate}% ${store.prices_include_gst ? "included in prices" : "added at checkout"}`],
    ["Delivery fee", store.delivery_fee ? inr(store.delivery_fee) : "Free"],
    ["Free delivery above", store.free_delivery_above ? inr(store.free_delivery_above) : "No threshold"],
    ["Booking amount", store.booking_enabled ? inr(store.booking_amount) : "Off (pay in full)"],
  ];
  return (
    <AdminShell mode={dbMode()}>
      <PageHeader
        title="Products & prices"
        description={`${products.length} products · ${products.filter((p) => p.price).length} with a price · ${products.filter((p) => p.active).length} on the website. A product can be bought online when it has a price and is “Available”.`}
        actions={
          seeded && (
            <Link href="/admin/products/new" className="adm-btn adm-btn-primary">
              <Plus size={16} aria-hidden="true" /> Add product
            </Link>
          )
        }
      />

      {saved && (
        <p role="status" className="mb-6 rounded-lg border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
          Saved as a draft. Press “Publish changes” in the sidebar to make it live on the website.
        </p>
      )}

      {!seeded && (
        <Card title="Set up your products" className="mb-6">
          <p className="text-sm text-mist">The website is showing the six starter modules below. Import them to start editing names, prices and photos.</p>
          <form action={importStarters} className="mt-4">
            <button type="submit" className="adm-btn adm-btn-primary">
              Import starter products
            </button>
          </form>
        </Card>
      )}

      <div className="space-y-6">
        <Card bodyClassName="p-0">
          <ProductsTable
            editable={seeded}
            products={products.map((p) => ({
              id: p.id,
              name: p.name,
              headline: p.headline,
              icon: p.icon,
              image_url: p.image_url,
              price: p.price,
              mrp: p.mrp,
              status: p.status,
              active: p.active,
              featured: p.featured,
            }))}
          />
        </Card>

        <Card
          title="Store-wide settings"
          action={
            <Link href="/admin/settings" className="text-xs text-mist no-underline hover:text-amber">
              Change
            </Link>
          }
        >
          <dl className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {storeFacts.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs uppercase tracking-wider text-ash">{k}</dt>
                <dd className="mt-1 text-sm text-white">{v}</dd>
              </div>
            ))}
          </dl>
        </Card>
      </div>
    </AdminShell>
  );
}

export default function AdminProductsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading products…</p>}>
      <Products searchParams={searchParams} />
    </Suspense>
  );
}
