import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Download, LogOut } from "lucide-react";
import { logout } from "@/app/(admin)/admin/actions";
import { publishNow } from "@/app/(admin)/admin/products/actions";
import { productPublishState } from "@/lib/store/products";
import { settingsPending } from "@/lib/store/settings";

const NAV = [
  { id: "leads", label: "Leads", href: "/admin" },
  { id: "orders", label: "Orders", href: "/admin/orders" },
  { id: "products", label: "Products", href: "/admin/products" },
  { id: "settings", label: "Settings", href: "/admin/settings" },
] as const;

export function AdminShell({
  children,
  mode,
  active = "leads",
}: {
  children: ReactNode;
  mode: "supabase" | "local" | "none";
  active?: (typeof NAV)[number]["id"];
}) {
  return (
    <>
      <header className="border-b border-line bg-white">
        <div className="container-page flex h-14 items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-1 sm:gap-3">
            <Link href="/admin" aria-label="Admin home" className="mr-1 shrink-0">
              <Image src="/logo/homeasy-icon.svg" alt="" width={28} height={28} />
            </Link>
            <nav aria-label="Admin" className="flex items-center overflow-x-auto">
              {NAV.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  aria-current={active === n.id ? "page" : undefined}
                  className={`inline-flex min-h-11 items-center rounded-button px-3 text-[15px] font-semibold no-underline ${
                    active === n.id ? "bg-tint text-ink" : "text-body hover:bg-cloud"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-2">
            {active === "leads" && (
              <a href="/admin/export" className="btn btn-outline min-h-10 px-3 text-[14px]">
                <Download size={16} aria-hidden="true" /> <span className="hidden sm:inline">Export CSV</span>
              </a>
            )}
            <form action={logout}>
              <button type="submit" className="btn btn-secondary min-h-10 px-3 text-[14px]">
                <LogOut size={16} aria-hidden="true" /> <span className="hidden sm:inline">Log out</span>
              </button>
            </form>
          </div>
        </div>
      </header>
      {mode !== "supabase" && (
        <p className="bg-amber-100 px-4 py-2 text-center text-[14px] text-amber-800">
          {mode === "local"
            ? "Test mode: data is saved in local files on this computer, not Supabase."
            : "No storage is connected. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY."}
        </p>
      )}
      <PublishBar />
      <main className="container-page py-8">{children}</main>
    </>
  );
}

/** "N changes waiting to go live" + Publish now. Nothing edited in the admin is public until this is pressed. */
async function PublishBar() {
  let state: Awaited<ReturnType<typeof productPublishState>>;
  try {
    const [products, settings] = await Promise.all([productPublishState(), settingsPending()]);
    state = { ...products, pending: products.pending + (settings ? 1 : 0), ready: products.ready || settings };
  } catch {
    return null;
  }
  if (!state.ready) return null;
  return (
    <div className={state.pending ? "bg-navy text-white" : "border-b border-line bg-white text-body"}>
      <div className="container-page flex min-h-12 flex-wrap items-center justify-between gap-x-4 gap-y-2 py-2 text-[14px]">
        <p>
          {state.pending ? (
            <strong>
              {state.pending} {state.pending === 1 ? "change is" : "changes are"} waiting to go live
            </strong>
          ) : (
            "Everything is published."
          )}{" "}
          <span className={state.pending ? "text-mist" : "text-slate"}>
            {state.publishedAt ? `Last published ${formatWhen(state.publishedAt)}.` : "Nothing has been published yet."}
          </span>
        </p>
        {state.pending > 0 && (
          <form action={publishNow}>
            <button type="submit" className="btn min-h-10 bg-amber px-4 text-[14px] text-navy hover:bg-amber-300">
              Publish now
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

const TONE: Record<string, string> = {
  new: "bg-amber text-navy",
  contacted: "bg-tint text-ink",
  survey_scheduled: "bg-tint text-ink",
  surveyed: "bg-tint text-ink",
  quoted: "bg-blue-100 text-blue-800",
  won: "bg-[var(--badge-available-bg)] text-[var(--badge-available-text)]",
  installed: "bg-[var(--badge-available-bg)] text-[var(--badge-available-text)]",
  lost: "bg-line text-body",
  out_of_area: "bg-line text-body",
};

export function StatusChip({ status, label }: { status: string; label: string }) {
  return (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[12px] font-semibold ${TONE[status] ?? "bg-line text-body"}`}>
      {label}
    </span>
  );
}

/** Dates are shown in India time regardless of where the server runs. */
export function formatWhen(iso: string) {
  return new Intl.DateTimeFormat("en-IN", { timeZone: "Asia/Kolkata", day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(
    new Date(iso),
  );
}
