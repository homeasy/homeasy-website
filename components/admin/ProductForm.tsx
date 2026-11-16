"use client";

import Link from "next/link";
import { useActionState, useRef, useState } from "react";
import { removeProduct, saveProduct } from "@/app/(admin)/admin/products/actions";
import { PRODUCT_ICON_LABELS } from "@/components/catalog/product-icons";

export type ProductFormValues = {
  id: string;
  name: string;
  slug: string;
  headline: string;
  line: string;
  description: string;
  controls: string;
  highlights: string;
  specs: string;
  in_box: string;
  used_for: string;
  icon: string;
  image_url: string;
  price: string;
  mrp: string;
  status: string;
  active: boolean;
  featured: boolean;
  sort_order: string;
};

const field = "adm-control";
const label = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist";
const hint = "mt-1 text-xs text-ash";

/** Shrinks a photo in the browser to at most 1600 px and re-saves it as WebP, so uploads stay small. */
async function shrink(file: File): Promise<File> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/webp", 0.85));
  return blob ? new File([blob], file.name.replace(/\.\w+$/, ".webp"), { type: "image/webp" }) : file;
}

export function ProductForm({ values }: { values: ProductFormValues }) {
  const [state, action, pending] = useActionState(saveProduct, undefined);
  const [preview, setPreview] = useState(values.image_url);
  const fileRef = useRef<HTMLInputElement>(null);
  const e = state?.fields ?? {};
  const err = (k: string) => (e[k] ? <p className="mt-1 text-xs text-red-300">{e[k]}</p> : null);

  async function onPhoto(ev: React.ChangeEvent<HTMLInputElement>) {
    const f = ev.target.files?.[0];
    if (!f) return;
    try {
      const small = await shrink(f);
      const dt = new DataTransfer();
      dt.items.add(small);
      ev.target.files = dt.files;
      setPreview(URL.createObjectURL(small));
    } catch {
      setPreview(URL.createObjectURL(f));
    }
  }

  return (
    <>
      <form action={action} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <input type="hidden" name="id" value={values.id} />
        <input type="hidden" name="image_url" value={values.image_url} />

        <div className="space-y-5 rounded-xl border border-navy-700 bg-navy p-5">
          <div>
            <label htmlFor="name" className={label}>
              Product name
            </label>
            <input id="name" name="name" defaultValue={values.name} required className={field} />
            {err("name")}
          </div>
          <div>
            <label htmlFor="slug" className={label}>
              Link name
            </label>
            <input id="slug" name="slug" defaultValue={values.slug} placeholder="filled from the name if left empty" className={field} />
            <p className={hint}>The page address will be homeasy.io/products/link-name. Changing it breaks old links.</p>
            {err("slug")}
          </div>
          <div>
            <label htmlFor="headline" className={label}>
              Category line
            </label>
            <input id="headline" name="headline" defaultValue={values.headline} placeholder="e.g. Fans, with speed control" className={field} />
          </div>
          <div>
            <label htmlFor="line" className={label}>
              One-line summary
            </label>
            <textarea id="line" name="line" defaultValue={values.line} rows={2} className={field} />
            <p className={hint}>Shown on the product card and at the top of the product page.</p>
          </div>
          <div>
            <label htmlFor="description" className={label}>
              Full description
            </label>
            <textarea id="description" name="description" defaultValue={values.description} rows={6} className={field} />
            <p className={hint}>Leave a blank line between paragraphs. Only write what is true of the product today.</p>
          </div>
          <div>
            <label htmlFor="highlights" className={label}>
              Key points
            </label>
            <textarea id="highlights" name="highlights" defaultValue={values.highlights} rows={4} className={field} />
            <p className={hint}>One per line. Shown as a tick list.</p>
          </div>
          <div>
            <label htmlFor="specs" className={label}>
              Specifications
            </label>
            <textarea id="specs" name="specs" defaultValue={values.specs} rows={5} placeholder={"Rated load: …\nDimensions: …"} className={field} />
            <p className={hint}>
              One per line, as &ldquo;Label: value&rdquo;. Only tested, final figures. Left empty, the page says specifications will be published after testing.
            </p>
          </div>
          <div>
            <label htmlFor="used_for" className={label}>
              Where it is used
            </label>
            <textarea id="used_for" name="used_for" defaultValue={values.used_for} rows={3} className={field} />
            <p className={hint}>One per line, for example &ldquo;Bedroom lights&rdquo;. Left empty, &ldquo;What it controls&rdquo; is shown.</p>
          </div>
          <div>
            <label htmlFor="in_box" className={label}>
              In the box
            </label>
            <textarea id="in_box" name="in_box" defaultValue={values.in_box} rows={3} className={field} />
            <p className={hint}>One per line. Left empty, this section is hidden.</p>
          </div>
          <div>
            <label htmlFor="controls" className={label}>
              What it controls
            </label>
            <input id="controls" name="controls" defaultValue={values.controls} placeholder="Lights, Small appliances" className={field} />
            <p className={hint}>Separate with commas.</p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-5 rounded-xl border border-navy-700 bg-navy p-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="price" className={label}>
                  Price (₹)
                </label>
                <input id="price" name="price" inputMode="numeric" defaultValue={values.price} className={field} />
              </div>
              <div>
                <label htmlFor="mrp" className={label}>
                  List price (₹)
                </label>
                <input id="mrp" name="mrp" inputMode="numeric" defaultValue={values.mrp} className={field} />
              </div>
            </div>
            <p className={hint}>
              Leave the price empty to show &ldquo;Price after free survey&rdquo;. The list price is optional and is shown struck through.
            </p>
            {err("mrp")}
            <div>
              <label htmlFor="status" className={label}>
                Availability label
              </label>
              <select id="status" name="status" defaultValue={values.status} className={field}>
                <option value="available">Available</option>
                <option value="coming-soon">Coming soon</option>
                <option value="planned">Planned</option>
              </select>
            </div>
            <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white">
              <input type="checkbox" name="active" defaultChecked={values.active} className="size-5 accent-[var(--brand-amber)]" />
              Show on the website
            </label>
            <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white">
              <input type="checkbox" name="featured" defaultChecked={values.featured} className="size-5 accent-[var(--brand-amber)]" />
              Mark as featured
            </label>
            <div>
              <label htmlFor="sort_order" className={label}>
                Position
              </label>
              <input id="sort_order" name="sort_order" inputMode="numeric" defaultValue={values.sort_order} className={field} />
              <p className={hint}>Lower numbers appear first.</p>
            </div>
          </div>

          <div className="space-y-4 rounded-xl border border-navy-700 bg-navy p-5">
            <p className={label}>Photo</p>
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element -- local preview of a just-chosen file
              <img src={preview} alt="" className="aspect-square w-full rounded-lg border border-navy-700 object-cover" />
            ) : (
              <p className="rounded-lg bg-white/5 p-6 text-center text-sm text-mist">No photo yet. The icon below is shown instead.</p>
            )}
            <input ref={fileRef} type="file" name="photo" accept="image/jpeg,image/png,image/webp" onChange={onPhoto} className="block w-full text-sm text-mist" />
            <p className={hint}>Square photos look best. Large photos are shrunk automatically.</p>
            {values.image_url && (
              <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white">
                <input type="checkbox" name="remove_image" className="size-5 accent-[var(--brand-amber)]" onChange={(ev) => setPreview(ev.target.checked ? "" : values.image_url)} />
                Remove the current photo
              </label>
            )}
            <div>
              <label htmlFor="icon" className={label}>
                Icon when there is no photo
              </label>
              <select id="icon" name="icon" defaultValue={values.icon} className={field}>
                {Object.entries(PRODUCT_ICON_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {state?.error && (
            <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">
              {state.error}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <button type="submit" disabled={pending} className="adm-btn adm-btn-primary">
              {pending ? "Saving…" : "Save product"}
            </button>
            <Link href="/admin/products" className="adm-btn adm-btn-secondary">
              Cancel
            </Link>
          </div>
        </div>
      </form>

      {values.id && (
        <form
          action={removeProduct}
          className="mt-8 border-t border-navy-700 pt-6"
          onSubmit={(ev) => {
            if (!window.confirm(`Delete "${values.name}"? This cannot be undone.`)) ev.preventDefault();
          }}
        >
          <input type="hidden" name="id" value={values.id} />
          <button type="submit" className="adm-btn adm-btn-danger">
            Delete this product
          </button>
        </form>
      )}
    </>
  );
}
