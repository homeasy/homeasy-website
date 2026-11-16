import type { ReactNode } from "react";
import { Rocket } from "lucide-react";
import { publishNow } from "@/app/(admin)/admin/products/actions";
import { productPublishState } from "@/lib/store/products";
import { contentPending } from "@/lib/content/store";
import { settingsPending } from "@/lib/store/settings";
import { AdminFrame } from "./AdminFrame";
import { fmtDateTime } from "./ui";

/**
 * "N changes waiting to go live" + Publish, in the sidebar footer (like the Kynyx admin).
 * Nothing edited in the admin is public until this is pressed.
 */
async function PublishBox() {
  let pending = 0;
  let publishedAt: string | null = null;
  let ready = false;
  try {
    const [products, settings, content] = await Promise.all([productPublishState(), settingsPending(), contentPending()]);
    pending = products.pending + (settings ? 1 : 0) + content.length;
    publishedAt = products.publishedAt;
    ready = true;
  } catch {
    return null;
  }
  if (!ready) return null;
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-800 p-3">
      <p className="text-xs text-mist">
        {pending === 0 ? "No unpublished changes." : `${pending} change${pending === 1 ? "" : "s"} waiting to go live`}
      </p>
      {publishedAt && pending === 0 && <p className="mt-0.5 text-[11px] text-ash">Last published {fmtDateTime(publishedAt)}</p>}
      {pending > 0 && (
        <form action={publishNow}>
          <button type="submit" className="adm-btn adm-btn-primary adm-btn-sm mt-2 w-full">
            <Rocket size={14} aria-hidden="true" /> Publish changes
          </button>
        </form>
      )}
    </div>
  );
}

/** Page frame for every signed-in admin page: sidebar, publish box, and a storage notice when not on Supabase. */
export function AdminShell({ children, mode }: { children: ReactNode; mode: "supabase" | "local" | "none"; active?: string }) {
  const banner =
    mode === "supabase" ? null : (
      <p className="border-b border-amber/30 bg-amber/10 px-4 py-2 text-center text-[13px] text-amber">
        {mode === "local"
          ? "Test mode: data is saved in local files on this computer, not Supabase."
          : "No storage is connected. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY, then redeploy."}
      </p>
    );
  return (
    <AdminFrame email={process.env.ADMIN_EMAIL ?? "admin"} publishBox={<PublishBox />} banner={banner}>
      {children}
    </AdminFrame>
  );
}
