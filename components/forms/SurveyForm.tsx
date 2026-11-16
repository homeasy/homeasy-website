"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, useSyncExternalStore, useTransition } from "react";
import { ArrowLeft, ArrowRight, CircleCheck } from "lucide-react";
import { saveSurveyStepOne, submitSurvey } from "@/app/(site)/book-survey/actions";
import { track } from "@/lib/analytics";
import {
  APPLIANCES,
  fieldErrors,
  HEARD_FROM,
  HOME_TYPES,
  parseSurveyPrefill,
  ROOM_OPTIONS,
  stepOneSchema,
  SWITCH_BRANDS,
  TIME_SLOTS,
  type FieldErrors,
  type PartialLeadResult,
  type SurveyPrefill,
  type SurveyResult,
} from "@/lib/leads/schema";
import { checkPincode } from "@/lib/service-area";

type Props = {
  whatsappHref: string;
  telHref: string;
  leadResponse: string;
  /** which button opened the form, for lead-source tracking */
  sourceCta?: string;
};

const input = "h-12 w-full rounded-input border border-line bg-white px-4 text-ink placeholder:text-slate";
const labelCls = "mb-1.5 block text-[15px] font-semibold text-ink";
const chip =
  "inline-flex min-h-11 cursor-pointer items-center rounded-full border border-line bg-white px-4 text-[15px] font-semibold text-ink transition-colors hover:bg-cloud has-[:checked]:border-amber has-[:checked]:bg-amber has-[:checked]:text-navy has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[var(--focus-ring)]";

function isoDate(offsetDays: number) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// The page is prerendered, so the query string is read in the browser only (empty on the server and while hydrating).
const noSubscribe = () => () => {};
const browserSearch = () => window.location.search;
const serverSearch = () => "";

const STEP_ONE_FIELDS = ["fullName", "mobile", "whatsapp", "pincode", "locality"] as const;

/** Hidden lead-source fields (PRD §10.1), added just before sending. */
function addTracking(fd: FormData, lead: { ref: string; token: string } | null) {
  const params = new URLSearchParams(window.location.search);
  fd.set("page", window.location.pathname);
  fd.set("utmSource", params.get("utm_source") ?? "");
  fd.set("utmMedium", params.get("utm_medium") ?? "");
  fd.set("utmCampaign", params.get("utm_campaign") ?? "");
  fd.set("leadRef", lead?.ref ?? "");
  fd.set("leadToken", lead?.token ?? "");
}

/**
 * Prefill from the link (estimator, switch selector…). The fields are uncontrolled, so they are set once in
 * the browser, and only where the person has not already chosen something.
 */
function applyPrefill(form: HTMLFormElement, prefill: SurveyPrefill) {
  const pinInput = form.querySelector<HTMLInputElement>('input[name="pincode"]');
  if (prefill.pincode && pinInput && !pinInput.value) pinInput.value = prefill.pincode;
  const brand = form.querySelector<HTMLSelectElement>('select[name="switchBrand"]');
  if (prefill.switchBrand && brand && !brand.value) brand.value = prefill.switchBrand;
  const tick = (name: string, values: readonly string[]) => {
    const all = Array.from(form.querySelectorAll<HTMLInputElement>(`input[name="${name}"]`));
    if (!values.length || all.some((box) => box.checked)) return;
    for (const box of all) if (values.includes(box.value)) box.checked = true;
  };
  tick("rooms", prefill.rooms ? [prefill.rooms] : []);
  tick("appliances", prefill.appliances);
}

/**
 * Two-step survey booking form (PRD §10.1, §25.11). Consent is taken in step 1, before anything is sent.
 * "Next" saves step 1 as a partial lead; "Book free survey" finishes that same lead.
 * Can be opened prefilled: /book-survey?rooms=2-3&appliances=Lights,Fans&pincode=800001&brand=Anchor&source=estimator
 */
export function SurveyForm({ whatsappHref, telHref, leadResponse, sourceCta = "book-survey-page" }: Props) {
  const formRef = useRef<HTMLFormElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [result, setResult] = useState<Extract<SurveyResult, { ok: true }> | null>(null);
  const [sameWhatsapp, setSameWhatsapp] = useState(true);
  /** what the person typed in the pincode box; null = untouched, so a prefilled pincode still counts */
  const [typedPin, setTypedPin] = useState<string | null>(null);
  const [dates, setDates] = useState<{ min: string; max: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const uid = useId();

  const search = useSyncExternalStore(noSubscribe, browserSearch, serverSearch);
  const prefill = useMemo(() => parseSurveyPrefill(search), [search]);
  const source = prefill.source ?? sourceCta;
  const pin = typedPin ?? prefill.pincode ?? "";
  const pinCheck = pin.length === 6 ? checkPincode(pin) : null;
  const pinState = !pinCheck || pinCheck.status === "invalid" ? "idle" : pinCheck.status === "served" ? "served" : "out";

  /** the partial lead saved after step 1, the step-1 values it was saved with, and the save in flight */
  const lead = useRef<{ ref: string; token: string } | null>(null);
  const savedStepOne = useRef("");
  const saving = useRef<Promise<void> | null>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (formRef.current) applyPrefill(formRef.current, prefill);
  }, [prefill]);

  function onFirstFocus() {
    if (opened.current) return;
    opened.current = true;
    track("survey_open", { source_cta: source, page: window.location.pathname });
  }

  /** Saves step 1 in the background (PRD §25.11). Never blocks the person: if it fails, step 2 saves everything. */
  function saveStepOne() {
    const fd = new FormData(formRef.current!);
    const signature = JSON.stringify(STEP_ONE_FIELDS.map((k) => fd.get(k) ?? ""));
    if (signature === savedStepOne.current) return;
    savedStepOne.current = signature;
    const run = async () => {
      await saving.current; // one save at a time, so an edit updates the lead the first save created
      addTracking(fd, lead.current);
      let res: PartialLeadResult;
      try {
        res = await saveSurveyStepOne(fd);
      } catch {
        res = { ok: false };
      }
      if (res.ok) lead.current = { ref: res.ref, token: res.token };
      else if (savedStepOne.current === signature) savedStepOne.current = ""; // try again on the next "Next"
    };
    saving.current = run();
  }
  const fid = (name: string) => `${uid}-${name}`;

  const err = (name: string) =>
    errors[name] ? (
      <p id={`${fid(name)}-err`} className="mt-1.5 text-sm text-error">
        {errors[name]}
      </p>
    ) : null;
  const aria = (name: string) => ({
    id: fid(name),
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${fid(name)}-err` : undefined,
  });

  function focusFirstError(e: FieldErrors) {
    const first = Object.keys(e)[0];
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  function next() {
    const data = Object.fromEntries(new FormData(formRef.current!));
    const parsed = stepOneSchema.safeParse(data);
    if (!parsed.success) {
      const e = fieldErrors(parsed.error);
      setErrors(e);
      focusFirstError(e);
      track("survey_error", { error_type: "validation" });
      return;
    }
    setErrors({});
    saveStepOne();
    setDates({ min: isoDate(1), max: isoDate(30) });
    setStep(2);
    topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (step === 1) return next();
    const fd = new FormData(e.currentTarget);
    setFormError(null);
    startTransition(async () => {
      let res: SurveyResult;
      try {
        await saving.current; // so this finishes the step-1 lead instead of creating a second one
        addTracking(fd, lead.current);
        res = await submitSurvey(fd);
      } catch {
        res = { ok: false, message: "We couldn't send your request. Please check your connection and try again." };
      }
      if (res.ok) {
        track("survey_submit", {
          source_cta: source,
          in_service_area: res.inServiceArea,
          home_type: String(fd.get("homeType") ?? ""),
          rooms: String(fd.get("rooms") ?? ""),
          appliances_count: fd.getAll("appliances").length,
        });
        // first 3 digits only (PRD §14.1): enough for expansion planning, not enough to locate a person
        if (!res.inServiceArea) track("survey_out_of_area", { pincode: String(fd.get("pincode") ?? "").trim().slice(0, 3) });
        setResult(res);
        topRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
        return;
      }
      track("survey_error", { error_type: res.reason ?? (res.errors ? "validation" : "network") });
      if (res.errors) {
        setErrors(res.errors);
        if (Object.keys(res.errors).some((k) => k in stepOneSchema.shape)) setStep(1);
        requestAnimationFrame(() => focusFirstError(res.errors!));
      }
      setFormError(res.message ?? (res.errors ? "Please check the highlighted fields." : null));
    });
  }

  if (result) {
    return (
      <div ref={topRef} role="status" className="scroll-mt-28 rounded-card border border-line bg-white p-6 sm:p-8">
        <CircleCheck size={40} aria-hidden="true" className="text-success" />
        <h2 className="mt-4 text-h3 leading-tight">
          {result.inServiceArea ? "Survey request received" : "Thanks. We're not in your area yet"}
        </h2>
        <p className="mt-3 text-body">
          {result.inServiceArea
            ? `We'll call or WhatsApp you ${leadResponse} to confirm a visit time.`
            : "We've saved your details and will tell you when we start serving your area."}
        </p>
        <p className="mt-3 text-body">
          Your request number is <strong className="text-ink">{result.ref}</strong>.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="btn btn-primary min-h-12 px-6">
            WhatsApp us now
          </a>
          <Link href="/" className="btn btn-outline min-h-12 px-6">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div ref={topRef} className="scroll-mt-28 rounded-card border border-line bg-white p-5 sm:p-8">
      <p className="text-sm font-semibold text-slate" aria-live="polite">
        Step {step} of 2 · {step === 1 ? "About you" : "Your home"}
      </p>
      <div aria-hidden="true" className="mt-3 grid grid-cols-2 gap-2">
        <span className="h-1.5 rounded-full bg-amber" />
        <span className={`h-1.5 rounded-full transition-colors ${step === 2 ? "bg-amber" : "bg-line"}`} />
      </div>

      <form
        ref={formRef}
        onSubmit={onSubmit}
        onFocusCapture={onFirstFocus}
        // clear a field's error as soon as the person edits it
        onChange={(e) => {
          const name = (e.target as unknown as { name?: string }).name;
          if (name && errors[name]) {
            setErrors((prev) => {
              const rest = { ...prev };
              delete rest[name];
              return rest;
            });
          }
        }}
        noValidate
        className="mt-6"
      >
        {/* honeypot: hidden from people, tempting for bots */}
        <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input name="company" tabIndex={-1} autoComplete="off" />
          </label>
        </div>
        <input type="hidden" name="sourceCta" value={source} />

        {/* ---------- step 1 ---------- */}
        <fieldset hidden={step !== 1} className="space-y-5">
          <legend className="sr-only">About you</legend>
          <div>
            <label htmlFor={fid("fullName")} className={labelCls}>
              Full name
            </label>
            <input {...aria("fullName")} autoComplete="name" className={input} />
            {err("fullName")}
          </div>
          <div>
            <label htmlFor={fid("mobile")} className={labelCls}>
              Mobile number
            </label>
            <div className="flex">
              <span className="inline-flex h-12 items-center rounded-l-[10px] border border-r-0 border-line bg-cloud px-3 text-body">
                +91
              </span>
              <input
                {...aria("mobile")}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                maxLength={14}
                className={`${input} rounded-l-none`}
              />
            </div>
            {err("mobile")}
            <label className="mt-3 flex min-h-11 cursor-pointer items-center gap-3 text-[15px] text-body">
              <input
                type="checkbox"
                checked={sameWhatsapp}
                onChange={(e) => setSameWhatsapp(e.target.checked)}
                className="size-5 accent-[var(--brand-navy)]"
              />
              This number is on WhatsApp
            </label>
          </div>
          {!sameWhatsapp && (
            <div>
              <label htmlFor={fid("whatsapp")} className={labelCls}>
                WhatsApp number
              </label>
              <input {...aria("whatsapp")} type="tel" inputMode="numeric" maxLength={14} className={input} />
              {err("whatsapp")}
            </div>
          )}
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={fid("pincode")} className={labelCls}>
                Pincode
              </label>
              <input
                {...aria("pincode")}
                inputMode="numeric"
                autoComplete="postal-code"
                maxLength={6}
                className={input}
                onChange={(e) => {
                  const v = e.target.value.trim();
                  setTypedPin(v);
                  const r = v.length === 6 ? checkPincode(v) : null;
                  if (r && r.status !== "invalid") track("pincode_check", { result: r.status });
                }}
              />
              {err("pincode")}
              <p aria-live="polite" className="mt-1.5 min-h-5 text-sm">
                {pinState === "served" && <span className="font-semibold text-success">Great, we serve your area.</span>}
                {pinState === "out" && (
                  <span className="text-body">We&apos;re not in your area yet. Finish booking and we&apos;ll tell you as soon as we arrive.</span>
                )}
              </p>
            </div>
            <div className="min-w-0">
              <label htmlFor={fid("locality")} className={labelCls}>
                Area or locality
              </label>
              <input {...aria("locality")} autoComplete="address-level2" className={input} />
              {err("locality")}
            </div>
          </div>
          <div>
            <label className="flex cursor-pointer items-start gap-3 text-[15px] text-body">
              <input {...aria("consent")} type="checkbox" className="mt-0.5 size-5 shrink-0 accent-[var(--brand-navy)]" />
              <span>
                I agree to be contacted by phone or WhatsApp about my survey and accept the{" "}
                <Link href="/privacy-policy" className="link" target="_blank">
                  Privacy Policy
                </Link>
                .
              </span>
            </label>
            {err("consent")}
          </div>
          <button type="button" onClick={next} className="btn btn-primary min-h-12 w-full px-6 sm:w-auto">
            Next <ArrowRight size={18} aria-hidden="true" />
          </button>
          <p className="text-sm text-body">We save these details when you tap Next, so we can call you back if you don&apos;t finish.</p>
        </fieldset>

        {/* ---------- step 2 ---------- */}
        <fieldset hidden={step !== 2} className="space-y-6">
          <legend className="sr-only">Your home</legend>
          <div role="radiogroup" aria-labelledby={fid("homeType-l")}>
            <p id={fid("homeType-l")} className={labelCls}>
              Home type
            </p>
            <div className="flex flex-wrap gap-2">
              {HOME_TYPES.map((v) => (
                <label key={v} className={chip}>
                  <input type="radio" name="homeType" value={v} className="sr-only" />
                  {v}
                </label>
              ))}
            </div>
            {err("homeType")}
          </div>
          <div role="radiogroup" aria-labelledby={fid("rooms-l")}>
            <p id={fid("rooms-l")} className={labelCls}>
              Rooms to make smart <span className="font-normal text-slate">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {ROOM_OPTIONS.map((v) => (
                <label key={v} className={chip}>
                  <input type="radio" name="rooms" value={v} className="sr-only" />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <div role="group" aria-labelledby={fid("appliances-l")}>
            <p id={fid("appliances-l")} className={labelCls}>
              What do you want to control? <span className="font-normal text-slate">(optional)</span>
            </p>
            <div className="flex flex-wrap gap-2">
              {APPLIANCES.map((v) => (
                <label key={v} className={chip}>
                  <input type="checkbox" name="appliances" value={v} className="sr-only" />
                  {v}
                </label>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="min-w-0">
              <label htmlFor={fid("switchBrand")} className={labelCls}>
                Switch brand <span className="font-normal text-slate">(if known)</span>
              </label>
              <select {...aria("switchBrand")} defaultValue="" className={input}>
                <option value="">Select</option>
                {SWITCH_BRANDS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor={fid("heardFrom")} className={labelCls}>
                How did you hear about us? <span className="font-normal text-slate">(optional)</span>
              </label>
              <select {...aria("heardFrom")} defaultValue="" className={input}>
                <option value="">Select</option>
                {HEARD_FROM.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
            <div className="min-w-0">
              <label htmlFor={fid("preferredDate")} className={labelCls}>
                Preferred survey date <span className="font-normal text-slate">(optional)</span>
              </label>
              <input {...aria("preferredDate")} type="date" min={dates?.min} max={dates?.max} className={input} />
              {err("preferredDate")}
            </div>
            <div className="min-w-0">
              <label htmlFor={fid("timeSlot")} className={labelCls}>
                Preferred time <span className="font-normal text-slate">(optional)</span>
              </label>
              <select {...aria("timeSlot")} defaultValue="" className={input}>
                <option value="">Any time</option>
                {TIME_SLOTS.map((v) => (
                  <option key={v}>{v}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor={fid("email")} className={labelCls}>
              Email <span className="font-normal text-slate">(optional)</span>
            </label>
            <input {...aria("email")} type="email" autoComplete="email" className={input} />
            {err("email")}
          </div>

          {formError && (
            <div role="alert" className="rounded-card bg-tint p-4 text-[15px] text-ink">
              <p>{formError}</p>
              <p className="mt-2">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className="link font-semibold">
                  WhatsApp us
                </a>{" "}
                or{" "}
                <a href={telHref} className="link font-semibold">
                  call us
                </a>
                .
              </p>
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" onClick={() => setStep(1)} className="btn btn-outline min-h-12 px-6">
              <ArrowLeft size={18} aria-hidden="true" /> Back
            </button>
            <button type="submit" disabled={pending} className="btn btn-primary min-h-12 px-6 disabled:opacity-60">
              {pending ? "Sending…" : "Book free survey"}
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
}
