import Image from "next/image";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { LoginForm } from "@/components/admin/LoginForm";
import { adminConfigured, isAdmin } from "@/lib/admin/session";

async function LoginCard() {
  if (await isAdmin()) redirect("/admin");
  return adminConfigured() ? (
    <LoginForm />
  ) : (
    <p className="mt-6 rounded-lg border border-amber/30 bg-amber/10 p-4 text-sm text-amber">
      The admin is switched off. Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in the environment settings, then redeploy.
    </p>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="on-dark flex min-h-dvh items-center justify-center p-4 [color-scheme:dark]">
      <div className="w-full max-w-[400px] rounded-xl border border-navy-700 bg-navy p-6 sm:p-8">
        <div className="flex items-center gap-3">
          <Image src="/logo/homeasy-icon.svg" alt="" width={40} height={40} />
          <span className="leading-tight">
            <span className="block text-lg font-bold tracking-[0.04em] text-white">homeasy</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-amber">Admin</span>
          </span>
        </div>
        <h1 className="mt-6 text-xl font-semibold tracking-tight text-white">Sign in</h1>
        <p className="mt-1 text-sm text-mist">Leads, orders, products and settings.</p>
        <Suspense fallback={<p className="mt-6 text-sm text-mist">Loading…</p>}>
          <LoginCard />
        </Suspense>
      </div>
    </div>
  );
}
