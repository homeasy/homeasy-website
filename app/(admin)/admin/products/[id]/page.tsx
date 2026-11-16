import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
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
    <AdminShell mode={dbMode()} active="products">
      <Link href="/admin/products" className="link inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold">
        <ArrowLeft size={16} aria-hidden="true" /> All products
      </Link>
      <div className="mb-6 mt-2 flex flex-wrap items-center gap-4">
        <h1 className="text-h4">{p.name}</h1>
        {p.active && (
          <a href={`/products/${p.slug}`} target="_blank" rel="noopener noreferrer" className="link inline-flex items-center gap-1.5 text-[14px] font-semibold">
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
    <Suspense fallback={<p className="p-8 text-body">Loading product…</p>}>
      <EditProduct params={params} />
    </Suspense>
  );
}
