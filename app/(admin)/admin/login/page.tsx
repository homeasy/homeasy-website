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
    <p className="mt-6 rounded-card bg-tint p-4 text-[15px]">
      The admin is switched off. Set <code>ADMIN_EMAIL</code> and <code>ADMIN_PASSWORD</code> in the environment settings, then redeploy.
    </p>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center p-4">
      <div className="w-full max-w-[400px] rounded-card border border-line bg-white p-6 sm:p-8">
        <Image src="/logo/homeasy-logo-light.svg" alt="Homeasy" width={146} height={32} className="h-8 w-auto" />
        <h1 className="mt-6 text-h4">Admin login</h1>
        <Suspense fallback={<p className="mt-6 text-body">Loading…</p>}>
          <LoginCard />
        </Suspense>
      </div>
    </div>
  );
}
