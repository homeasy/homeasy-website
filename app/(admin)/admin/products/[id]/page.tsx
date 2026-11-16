import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BACK_LINK } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";
import { listAllProducts } from "@/lib/store/products";

async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const p = (await listAllProducts()).products.find((x) => x.id === id);
  if (!p) notFound();
  return (
    <AdminShell mode={dbMode()}>
      <Link href="/admin/products" className={BACK_LINK}>
        <ArrowLeft size={16} aria-hidden="true" /> All products
      </Link>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <h1 className="text-2xl font-semibold tracking-tight text-white">{p.name}</h1>
        {p.active && (
          <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-sm text-mist no-underline hover:text-amber">
            View on website <ExternalLink size={14} aria-hidden="true" />
          </a>
        )}
      </div>
      <ProductForm
        values={{
          id: p.id,
          name: p.name,
          slug: p.slug,
          headline: p.headline,
          line: p.line,
          description: p.description,
          controls: p.controls.join(", "),
          highlights: p.highlights.join("\n"),
          specs: (p.specs ?? []).join("\n"),
          in_box: (p.in_box ?? []).join("\n"),
          used_for: (p.used_for ?? []).join("\n"),
          icon: p.icon,
          image_url: p.image_url ?? "",
          price: p.price ? String(p.price) : "",
          mrp: p.mrp ? String(p.mrp) : "",
          status: p.status,
          active: p.active,
          featured: p.featured,
          sort_order: String(p.sort_order),
        }}
      />
    </AdminShell>
  );
}

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={<p className="p-8 text-mist">Loading product…</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}
