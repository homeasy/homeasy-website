import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";

async function NewProduct() {
  await requireAdmin();
  return (
    <AdminShell mode={dbMode()} active="products">
      <Link href="/admin/products" className="link inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold">
        <ArrowLeft size={16} aria-hidden="true" /> All products
      </Link>
      <h1 className="mb-6 mt-2 text-h4">Add product</h1>
      <ProductForm
        values={{
          id: "", name: "", slug: "", headline: "", line: "", description: "", controls: "", highlights: "", icon: "relay",
          image_url: "", price: "", mrp: "", status: "available", active: true, featured: false, sort_order: "100",
        }}
      />
    </AdminShell>
  );
}

export default function NewProductPage() {
  return (
    <Suspense fallback={<p className="p-8 text-body">Loading…</p>}>
      <NewProduct />
    </Suspense>
  );
}
