import type { ReactNode } from "react";
import { publishState } from "@/lib/store/publish-all";
import { AdminFrame } from "./AdminFrame";
import { PublishButton } from "./PublishButton";
import { fmtDateTime } from "./ui";

/**
 * "N changes waiting to go live" + Publish, in the sidebar footer (like the Kynyx admin).
 * Nothing edited in the admin is public until this is pressed.
 */
async function PublishBox() {
  let state: Awaited<ReturnType<typeof publishState>>;
  try {
    state = await publishState();
  } catch (e) {
    console.error(e);
    return <p className="rounded-lg border border-red-400/30 bg-red-400/10 p-3 text-xs text-red-200">Could not check for unpublished changes. Open Settings → System.</p>;
  }
  const { pending, publishedAt } = state;
  return (
    <div className="rounded-lg border border-navy-700 bg-navy-800 p-3">
      <p className="text-xs text-mist">
        {pending === 0 ? "No unpublished changes." : `${pending} change${pending === 1 ? "" : "s"} waiting to go live`}
      </p>
      {publishedAt && pending === 0 && <p className="mt-0.5 text-[11px] text-ash">Last published {fmtDateTime(publishedAt)}</p>}
      {pending > 0 && <PublishButton />}
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
