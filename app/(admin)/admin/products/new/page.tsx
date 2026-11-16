import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { BACK_LINK } from "@/components/admin/ui";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/admin/session";
import { dbMode } from "@/lib/db";

async function NewProduct() {
  await requireAdmin();
  return (
    <AdminShell mode={dbMode()}>
      <Link href="/admin/products" className={BACK_LINK}>
        <ArrowLeft size={16} aria-hidden="true" /> All products
      </Link>
      <h1 className="mb-6 text-2xl font-semibold tracking-tight text-white">Add product</h1>
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
    <Suspense fallback={<p className="p-8 text-mist">Loading…</p>}>
      <NewProduct />
    </Suspense>
  );
}
