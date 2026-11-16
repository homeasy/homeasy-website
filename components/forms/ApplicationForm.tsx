"use client";

import Link from "next/link";
import { startTransition, useActionState, useEffect, useState } from "react";
import { CircleCheck } from "lucide-react";
import { track } from "@/lib/analytics";
import { submitApplication } from "@/lib/applications/actions";
import { EXPERIENCE_OPTIONS, GENERAL_ROLE } from "@/lib/applications/schema";

const FIELD = "h-12 w-full rounded-input border border-line bg-white px-4 text-ink";
const LABEL = "mb-1.5 block text-[15px] font-semibold text-ink";
const OPTIONAL = <span className="font-normal text-slate">(optional)</span>;

/**
 * Job application form on /careers. The role list is the current openings (from Admin → Job postings), so it
 * changes by itself when a role is added or removed. "Apply now" on a role card preselects that role.
 */
export function ApplicationForm({ roles }: { roles: string[] }) {
  const [role, setRole] = useState("");
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof submitApplication>>, data: FormData) => {
    const result = await submitApplication(prev, data);
    if (result?.ok) track("job_apply_submit", { role: String(data.get("role") ?? "") });
    return result;
  }, undefined);

  // "Apply now" buttons on the role cards carry data-apply-role
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const picked = (e.target as Element | null)?.closest<HTMLElement>("[data-apply-role]")?.dataset.applyRole;
      if (picked) setRole(picked);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const errors = state && !state.ok ? (state.errors ?? {}) : {};
  const err = (name: string) =>
    errors[name] ? (
      <p id={`apply-${name}-error`} className="mt-1 text-sm text-error">
        {errors[name]}
      </p>
    ) : null;
  const aria = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `apply-${name}-error` } : {});

  if (state?.ok) {
    return (
      <div role="status" className="rounded-card border border-line bg-white p-6">
        <CircleCheck aria-hidden="true" className="size-8 text-success" />
        <h3 className="mt-3 text-h4">Thank you. We have your application.</h3>
        <p className="mt-2 text-body">We read every application. If your profile fits the role, our team will contact you by phone or email.</p>
        <p className="mt-3 text-[15px] text-slate">Your application number: {state.ref}</p>
      </div>
    );
  }

  return (
    <form
      // sent by hand instead of through `action`, so a validation error does not wipe what the person typed
      onSubmit={(e) => {
        e.preventDefault();
        const data = new FormData(e.currentTarget);
        startTransition(() => action(data));
      }}
      noValidate className="space-y-5 rounded-card border border-line bg-white p-5 sm:p-6">
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor="apply-role" className={LABEL}>
          Role you are applying for
        </label>
        <select id="apply-role" name="role" value={role} onChange={(e) => setRole(e.target.value)} required className={FIELD} {...aria("role")}>
          <option value="">Choose a role…</option>
          {roles.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
          <option value={GENERAL_ROLE}>{GENERAL_ROLE}</option>
        </select>
        {err("role")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="apply-name" className={LABEL}>
            Full name
          </label>
          <input id="apply-name" name="name" autoComplete="name" required className={FIELD} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor="apply-mobile" className={LABEL}>
            Mobile number
          </label>
          <input id="apply-mobile" name="mobile" type="tel" inputMode="numeric" autoComplete="tel" required className={FIELD} {...aria("mobile")} />
          {err("mobile")}
        </div>
        <div>
          <label htmlFor="apply-email" className={LABEL}>
            Email
          </label>
          <input id="apply-email" name="email" type="email" autoComplete="email" required className={FIELD} {...aria("email")} />
          {err("email")}
        </div>
        <div>
          <label htmlFor="apply-city" className={LABEL}>
            Current city {OPTIONAL}
          </label>
          <input id="apply-city" name="city" autoComplete="address-level2" className={FIELD} {...aria("city")} />
          {err("city")}
        </div>
        <div>
          <label htmlFor="apply-qualification" className={LABEL}>
            Highest qualification and college {OPTIONAL}
          </label>
          <input id="apply-qualification" name="qualification" placeholder="For example: B.Tech, NIT Patna" className={FIELD} {...aria("qualification")} />
          {err("qualification")}
        </div>
        <div>
          <label htmlFor="apply-experience" className={LABEL}>
            Experience {OPTIONAL}
          </label>
          <select id="apply-experience" name="experience" defaultValue="" className={FIELD} {...aria("experience")}>
            <option value="">Choose…</option>
            {EXPERIENCE_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
          {err("experience")}
        </div>
      </div>

      <div>
        <label htmlFor="apply-link" className={LABEL}>
          LinkedIn or portfolio link {OPTIONAL}
        </label>
        <input id="apply-link" name="link" type="url" placeholder="https://" className={FIELD} {...aria("link")} />
        {err("link")}
      </div>

      <div>
        <label htmlFor="apply-resume" className={LABEL}>
          Resume
        </label>
        <input
          id="apply-resume"
          name="resume"
          type="file"
          required
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="block w-full rounded-input border border-line bg-white p-3 text-[15px] text-body file:mr-3 file:rounded-button file:border-0 file:bg-cloud file:px-4 file:py-2 file:font-semibold file:text-ink"
          aria-describedby={errors.resume ? "apply-resume-error" : "apply-resume-hint"}
          aria-invalid={errors.resume ? true : undefined}
        />
        <p id="apply-resume-hint" className="mt-1 text-[14px] text-slate">
          PDF or Word, up to 3 MB.
        </p>
        {err("resume")}
      </div>

      <div>
        <label htmlFor="apply-message" className={LABEL}>
          Why this role? {OPTIONAL}
        </label>
        <textarea id="apply-message" name="message" rows={4} maxLength={2000} className={`${FIELD} h-auto py-3`} {...aria("message")} />
        {err("message")}
      </div>

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-body">
          <input type="checkbox" name="consent" className="mt-1 size-5 accent-[var(--brand-navy)]" {...aria("consent")} />
          <span>
            I agree that Homeasy may store my details and resume and contact me about this application. See our{" "}
            <Link href="/privacy-policy" className="link">
              Privacy Policy
            </Link>
            .
          </span>
        </label>
        {err("consent")}
      </div>

      {state && !state.ok && state.message && (
        <p role="alert" className="rounded-card bg-tint p-4 text-[15px] text-ink">
          {state.message}
        </p>
      )}
      <button type="submit" disabled={pending} className="btn btn-primary min-h-12 w-full px-6 disabled:opacity-60 sm:w-auto">
        {pending ? "Sending…" : "Send application"}
      </button>
    </form>
  );
}
