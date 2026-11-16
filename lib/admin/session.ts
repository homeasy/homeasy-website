/**
 * Admin login (server only). One shared password in ADMIN_PASSWORD; the session is a signed, HttpOnly cookie.
 * ADMIN_SESSION_SECRET signs the cookie (falls back to a key derived from the password, so changing the
 * password logs everyone out). If ADMIN_PASSWORD is not set, the admin is switched off.
 */
import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const COOKIE = "he_admin";
const MAX_AGE = 60 * 60 * 12; // 12 hours

export const adminConfigured = () => !!process.env.ADMIN_PASSWORD;

function secret() {
  return process.env.ADMIN_SESSION_SECRET || `he-admin:${process.env.ADMIN_PASSWORD}`;
}
function sign(value: string) {
  return createHmac("sha256", secret()).update(value).digest("hex");
}
function safeEqual(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export function passwordMatches(input: string) {
  const pw = process.env.ADMIN_PASSWORD;
  return !!pw && safeEqual(sign(input), sign(pw));
}

export async function startSession() {
  const exp = String(Math.floor(Date.now() / 1000) + MAX_AGE);
  (await cookies()).set(COOKIE, `${exp}.${sign(exp)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function endSession() {
  (await cookies()).set(COOKIE, "", { path: "/admin", maxAge: 0 });
}

export async function isAdmin(): Promise<boolean> {
  // Read the request first, always: this keeps every admin page rendered per request,
  // never baked at build time (when ADMIN_PASSWORD may not be set yet).
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!adminConfigured() || !raw) return false;
  const [exp, sig] = raw.split(".");
  if (!exp || !sig || !safeEqual(sig, sign(exp))) return false;
  return Number(exp) > Date.now() / 1000;
}

/** Call at the top of every admin page, action and route. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}
