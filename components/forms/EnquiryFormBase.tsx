"use client";

import Link from "next/link";
import { useActionState } from "react";
import { CircleCheck } from "lucide-react";
import { submitEnquiry } from "@/lib/enquiries/actions";
import type { EnquiryKind, ExtraField } from "@/lib/enquiries/schema";
import { track } from "@/lib/analytics";

const FIELD = "h-12 w-full rounded-input border border-line bg-white px-4 text-ink";
const LABEL = "mb-1.5 block text-[15px] font-semibold text-ink";

type Props = {
  kind: EnquiryKind;
  /** which of the standard optional fields to show */
  show?: { email?: boolean; organisation?: boolean; city?: boolean; message?: boolean };
  organisationLabel?: string;
  messageLabel?: string;
  /** extra questions for this form */
  extraFields?: ExtraField[];
  submitLabel?: string;
  /** shown after sending; the request number is added below it */
  successTitle?: string;
  successText?: string;
  /** page the form is on, saved with the enquiry */
  page: string;
};

/**
 * The one enquiry form (PRD §10.2–10.4): name and mobile always; other fields as the page asks.
 * Validated again on the server (Zod), with a hidden honeypot, rate limiting and a consent tick (DPDP Act).
 */
export function EnquiryFormBase({
  kind,
  show = { email: true, organisation: true, city: true, message: true },
  organisationLabel = "Company or organisation",
  messageLabel = "How can we help?",
  extraFields = [],
  submitLabel = "Send enquiry",
  successTitle = "Thank you. We have your enquiry.",
  successText = "Our team will call or WhatsApp you during working hours.",
  page,
}: Props) {
  const [state, action, pending] = useActionState(async (prev: Awaited<ReturnType<typeof submitEnquiry>>, data: FormData) => {
    const result = await submitEnquiry(prev, data);
    if (result?.ok) track("enquiry_submit", { kind });
    return result;
  }, undefined);
  const errors = state && !state.ok ? (state.errors ?? {}) : {};
  const err = (name: string) =>
    errors[name] ? (
      <p id={`${kind}-${name}-error`} className="mt-1 text-sm text-error">
        {errors[name]}
      </p>
    ) : null;
  const aria = (name: string) => (errors[name] ? { "aria-invalid": true, "aria-describedby": `${kind}-${name}-error` } : {});
  const id = (name: string) => `${kind}-${name}`;

  if (state?.ok) {
    return (
      <div role="status" className="rounded-card border border-line bg-white p-6">
        <CircleCheck aria-hidden="true" className="size-8 text-success" />
        <h3 className="mt-3 text-h4">{successTitle}</h3>
        <p className="mt-2 text-body">{successText}</p>
        <p className="mt-3 text-[15px] text-slate">Your request number: {state.ref}</p>
      </div>
    );
  }

  return (
    <form action={action} noValidate className="space-y-5 rounded-card border border-line bg-white p-5 sm:p-6">
      <input type="hidden" name="kind" value={kind} />
      <input type="hidden" name="page" value={page} />
      <input type="hidden" name="required_extras" value={extraFields.filter((f) => f.required).map((f) => f.name).join(",")} />
      {/* honeypot: hidden from people and screen readers; bots fill it in */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor={id("name")} className={LABEL}>
            Your name
          </label>
          <input id={id("name")} name="name" autoComplete="name" required className={FIELD} {...aria("name")} />
          {err("name")}
        </div>
        <div>
          <label htmlFor={id("mobile")} className={LABEL}>
            Mobile number
          </label>
          <input id={id("mobile")} name="mobile" type="tel" inputMode="numeric" autoComplete="tel" required className={FIELD} {...aria("mobile")} />
          {err("mobile")}
        </div>
        {show.email && (
          <div>
            <label htmlFor={id("email")} className={LABEL}>
              Email <span className="font-normal text-slate">(optional)</span>
            </label>
            <input id={id("email")} name="email" type="email" autoComplete="email" className={FIELD} {...aria("email")} />
            {err("email")}
          </div>
        )}
        {show.organisation && (
          <div>
            <label htmlFor={id("organisation")} className={LABEL}>
              {organisationLabel} <span className="font-normal text-slate">(optional)</span>
            </label>
            <input id={id("organisation")} name="organisation" autoComplete="organization" className={FIELD} {...aria("organisation")} />
            {err("organisation")}
          </div>
        )}
        {show.city && (
          <div>
            <label htmlFor={id("city")} className={LABEL}>
              City or district <span className="font-normal text-slate">(optional)</span>
            </label>
            <input id={id("city")} name="city" autoComplete="address-level2" className={FIELD} {...aria("city")} />
            {err("city")}
          </div>
        )}
        {extraFields.map((f) => {
          const name = `extra_${f.name}`;
          return (
            <div key={f.name} className={f.type === "textarea" ? "sm:col-span-2" : ""}>
              <label htmlFor={id(name)} className={LABEL}>
                {f.label} {!f.required && <span className="font-normal text-slate">(optional)</span>}
              </label>
              <input type="hidden" name={`label_${f.name}`} value={f.label} />
              {f.type === "select" ? (
                <select id={id(name)} name={name} defaultValue="" required={f.required} className={FIELD} {...aria(name)}>
                  <option value="">Choose…</option>
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              ) : f.type === "textarea" ? (
                <textarea id={id(name)} name={name} rows={3} required={f.required} placeholder={f.placeholder} className={`${FIELD} h-auto py-3`} {...aria(name)} />
              ) : (
                <input id={id(name)} name={name} type="text" inputMode={f.type === "number" ? "numeric" : undefined} required={f.required} placeholder={f.placeholder} className={FIELD} {...aria(name)} />
              )}
              {err(name)}
            </div>
          );
        })}
      </div>

      {show.message && (
        <div>
          <label htmlFor={id("message")} className={LABEL}>
            {messageLabel} <span className="font-normal text-slate">(optional)</span>
          </label>
          <textarea id={id("message")} name="message" rows={4} maxLength={2000} className={`${FIELD} h-auto py-3`} {...aria("message")} />
          {err("message")}
        </div>
      )}

      <div>
        <label className="flex cursor-pointer items-start gap-3 text-[15px] text-body">
          <input type="checkbox" name="consent" className="mt-1 size-5 accent-[var(--brand-navy)]" {...aria("consent")} />
          <span>
            I agree that Homeasy may contact me about this enquiry by phone, WhatsApp or email. See our{" "}
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
        {pending ? "Sending…" : submitLabel}
      </button>
    </form>
  );
}
