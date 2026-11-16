"use client";

import { useEffect, useState, useTransition, type ReactNode } from "react";
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react";
import { resetContent, saveContent } from "@/app/(admin)/admin/content/actions";
import { blank, type Schema } from "@/lib/content/shape";
import { useConfirm } from "./confirm";
import { useToast } from "./toast";

type Path = (string | number)[];
type Obj = Record<string, unknown>;

const LABELS: Record<string, string> = {
  q: "Question", a: "Answer", parts: "Answer (one or more parts, joined together)", text: "Text", body: "Text", sub: "Sub-heading",
  cta: "Button text", href: "Link", usp: "Show only when this switch is ON", whenOn: "Show only when this switch is ON",
  whenOff: "Show only when this switch is OFF", status: "Badge", statusWhenOff: "Badge shown while a switch is OFF", flag: "Switch",
  link: "Link under the answer (optional)", priceType: "Price type", price: "Price (₹)", everyPackage: "In every package",
  addOns: "Add-ons", includes: "What it includes", good: "This is the good option (Homeasy)", icon: "Icon name", id: "Short id (used in links)",
  slug: "Short id (used in links)", whatsappMessages: "Pre-filled WhatsApp messages", general: "General message", photo: "Switchboard photo message",
  early: "Early access band (shown until launch)", problem: "The problem", how: "How it works", promise: "What you get with Homeasy", switches: "Switch brands", parents: "For parents", indian: "Indian homes",
  app: "App", business: "Businesses and government", area: "Service area", founder: "Founder note", faq: "Short FAQ", process: "Survey to support",
  draft: "Draft: show the “under legal review” notice", dates: "Dates line (empty = “Last updated” with the site date)", intro: "Line under the title",
  roles: "Open roles", pay: "Pay or stipend (leave empty to hide)", duration: "Duration (leave empty to hide)", location: "Location", summary: "What the role does",
  google: "Google Business Profile link",
  phone: "Phone (10 digits)", whatsapp: "WhatsApp number (10 digits)", hours: "Working hours", social: "Social links", sections: "Show or hide sections",
};
const SWITCHES = ["U1", "U2", "U3", "U4", "U5", "U6", "U7", "U8", "U9", "U10", "U11", "U12", "APP_LIVE", "SHOW_PRICES"];
const SWITCH_KEYS = ["usp", "whenOn", "whenOff", "flag"];
const LONG_KEYS = ["summary", "intro", "body", "text", "a", "line", "note", "quote", "sub", "benefit", "description", "result", "general", "photo", "tagline"];
const TECH_KEYS = ["icon", "id", "slug", "href"];

const human = (k: string) => LABELS[k] ?? k.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]/g, " ").replace(/^./, (c) => c.toUpperCase());
const LABEL = "mb-1.5 block text-xs font-medium uppercase tracking-wider text-mist";

function setAt(root: unknown, path: Path, value: unknown): unknown {
  if (!path.length) return value;
  const [head, ...rest] = path;
  if (Array.isArray(root)) {
    const copy = [...root];
    copy[head as number] = setAt(copy[head as number], rest, value);
    return copy;
  }
  const obj = { ...((root as Obj) ?? {}) };
  obj[head as string] = setAt(obj[head as string], rest, value);
  return obj;
}

/** The words shown on a collapsed list item. */
function summaryOf(v: unknown): string {
  if (typeof v === "string") return v;
  const o = (v ?? {}) as Obj;
  for (const k of ["q", "title", "name", "label", "text"]) if (typeof o[k] === "string" && o[k]) return o[k] as string;
  return "";
}

function Field({ name, schema, value, onChange }: { name: string; schema: Schema; value: unknown; onChange: (v: unknown) => void }) {
  if (schema.t === "boolean") {
    return (
      <label className="flex min-h-10 cursor-pointer items-center gap-3 text-sm text-white">
        <input type="checkbox" checked={value === true} onChange={(e) => onChange(e.target.checked)} className="size-4 accent-[var(--brand-amber)]" />
        {human(name)}
      </label>
    );
  }
  if (schema.t === "object") return <Group label={human(name)} schema={schema} value={value} onChange={onChange} />;
  if (schema.t === "array") return <List name={name} schema={schema} value={value} onChange={onChange} />;

  const text = value === null || value === undefined ? "" : String(value);
  let control: ReactNode;
  if (SWITCH_KEYS.includes(name)) {
    control = (
      <select value={text} onChange={(e) => onChange(e.target.value)} className="adm-control">
        <option value="">Always shown</option>
        {SWITCHES.map((f) => (
          <option key={f} value={f}>
            {f.startsWith("U") ? `Promise ${f} (USP_${f})` : f}
          </option>
        ))}
      </select>
    );
  } else if (name === "status") {
    control = (
      <select value={text} onChange={(e) => onChange(e.target.value || null)} className="adm-control">
        <option value="">No badge</option>
        <option value="available">Available</option>
        <option value="coming-soon">Coming soon</option>
        <option value="planned">Planned</option>
      </select>
    );
  } else if (name === "type") {
    control = (
      <select value={text} onChange={(e) => onChange(e.target.value)} className="adm-control">
        {["Full-time", "Part-time", "Internship", "Contract"].map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  } else if (name === "priceType") {
    control = (
      <select value={text} onChange={(e) => onChange(e.target.value)} className="adm-control">
        <option value="from">From ₹…</option>
        <option value="custom">Custom quote</option>
      </select>
    );
  } else if (schema.t === "number") {
    control = <input type="number" value={text} onChange={(e) => onChange(Number(e.target.value))} className="adm-control" />;
  } else if (LONG_KEYS.includes(name) || text.length > 70) {
    control = <textarea value={text} rows={Math.min(28, Math.max(2, Math.ceil(text.length / 80)))} onChange={(e) => onChange(e.target.value)} className="adm-control" />;
  } else {
    control = (
      <input
        value={text}
        inputMode={name === "price" ? "numeric" : undefined}
        placeholder={schema.t === "any" ? "Not set" : undefined}
        onChange={(e) => onChange(e.target.value)}
        className={`adm-control ${TECH_KEYS.includes(name) ? "font-mono text-xs" : ""}`}
      />
    );
  }
  return (
    <label className="block">
      <span className={LABEL}>{human(name)}</span>
      {control}
      {name === "icon" && <span className="mt-1 block text-xs text-ash">Leave as it is: icons are built into the site.</span>}
    </label>
  );
}

function Fields({ schema, value, onChange }: { schema: Extract<Schema, { t: "object" }>; value: unknown; onChange: (v: unknown) => void }) {
  const obj = (value ?? {}) as Obj;
  return (
    <div className="space-y-4">
      {Object.entries(schema.fields).map(([k, f]) => (
        <Field key={k} name={k} schema={f.s} value={obj[k]} onChange={(v) => onChange({ ...obj, [k]: v })} />
      ))}
    </div>
  );
}

function Group({ label, schema, value, onChange }: { label: string; schema: Extract<Schema, { t: "object" }>; value: unknown; onChange: (v: unknown) => void }) {
  return (
    <fieldset className="rounded-lg border border-navy-700 p-4">
      <legend className="px-1 text-xs font-medium uppercase tracking-wider text-mist">{label}</legend>
      <Fields schema={schema} value={value} onChange={onChange} />
    </fieldset>
  );
}

function List({ name, schema, value, onChange }: { name: string; schema: Extract<Schema, { t: "array" }>; value: unknown; onChange: (v: unknown) => void }) {
  const items = Array.isArray(value) ? value : [];
  const [openNew, setOpenNew] = useState(-1);
  const item = schema.item;
  if (!item) return null;
  const move = (i: number, by: number) => {
    const next = [...items];
    [next[i], next[i + by]] = [next[i + by], next[i]];
    onChange(next);
  };
  const tools = (i: number) => (
    <span className="flex shrink-0 items-center">
      <button type="button" disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" className="adm-btn adm-btn-ghost adm-btn-sm !px-1.5">
        <ArrowUp size={14} />
      </button>
      <button type="button" disabled={i === items.length - 1} onClick={() => move(i, 1)} aria-label="Move down" className="adm-btn adm-btn-ghost adm-btn-sm !px-1.5">
        <ArrowDown size={14} />
      </button>
      <button type="button" onClick={() => onChange(items.filter((_, j) => j !== i))} aria-label="Remove" className="adm-btn adm-btn-ghost adm-btn-sm !px-1.5 hover:!text-red-300">
        <Trash2 size={14} />
      </button>
    </span>
  );
  return (
    <div>
      <p className={LABEL}>
        {human(name)} <span className="normal-case tracking-normal text-ash">({items.length})</span>
      </p>
      <ul className="space-y-2">
        {items.map((v, i) =>
          item.t === "object" ? (
            <li key={i}>
              <details open={i === openNew} className="group rounded-lg border border-navy-700 bg-navy-800/40">
                <summary className="flex cursor-pointer list-none items-center gap-2 px-3 py-2 text-sm text-white">
                  <ChevronDown size={16} aria-hidden="true" className="shrink-0 -rotate-90 text-mist transition-transform group-open:rotate-0" />
                  <span className="min-w-0 flex-1 truncate">{summaryOf(v) || <span className="text-ash">New item</span>}</span>
                  {tools(i)}
                </summary>
                <div className="border-t border-navy-700 p-4">
                  <Fields schema={item} value={v} onChange={(x) => onChange(items.map((old, j) => (j === i ? x : old)))} />
                </div>
              </details>
            </li>
          ) : (
            <li key={i} className="flex items-center gap-2">
              <input value={String(v ?? "")} onChange={(e) => onChange(items.map((old, j) => (j === i ? e.target.value : old)))} aria-label={`${human(name)} ${i + 1}`} className="adm-control" />
              {tools(i)}
            </li>
          ),
        )}
      </ul>
      <button
        type="button"
        className="adm-btn adm-btn-secondary adm-btn-sm mt-2"
        onClick={() => {
          setOpenNew(items.length);
          onChange([...items, blank(item)]);
        }}
      >
        <Plus size={14} aria-hidden="true" /> Add
      </button>
    </div>
  );
}

/**
 * General editor for a website content document. The form is drawn from the document's shape, so words,
 * lists and switches can change but the structure cannot. Saving makes a draft; Publish makes it live.
 */
export function ContentEditor({ docKey, schema, initial, canReset }: { docKey: string; schema: Extract<Schema, { t: "object" }>; initial: unknown; canReset: boolean }) {
  const toast = useToast();
  const [confirm, confirmNode] = useConfirm();
  const [saved, setSaved] = useState(initial);
  const [value, setValue] = useState(initial);
  const [busy, start] = useTransition();
  const dirty = JSON.stringify(value) !== JSON.stringify(saved);

  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const obj = (value ?? {}) as Obj;
  const hidden = (obj.sections ?? {}) as Record<string, boolean>;
  const entries = Object.entries(schema.fields);
  const simple = entries.filter(([, f]) => f.s.t !== "object" && f.s.t !== "array");
  const blocks = entries.filter(([, f]) => f.s.t === "object" || f.s.t === "array");
  const cardCls = "group rounded-xl border border-navy-700 bg-navy";
  const headCls = "flex cursor-pointer list-none items-center gap-2 px-5 py-3.5 text-sm font-semibold text-white";

  function save() {
    start(async () => {
      const r = await saveContent(docKey, value);
      if (r.ok) {
        setSaved(r.data);
        setValue(r.data);
        toast("success", "Saved as a draft. Press “Publish changes” to make it live.");
      } else toast("error", r.error ?? "Could not save.");
    });
  }
  async function reset() {
    if (!(await confirm({ title: "Reset to the built-in text", message: "This replaces your draft with the text that came with the website. It goes live only after you publish.", confirmLabel: "Reset", danger: true }))) return;
    start(async () => {
      const r = await resetContent(docKey);
      if (r.ok) {
        setSaved(r.data);
        setValue(r.data);
        toast("success", "Draft reset to the built-in text.");
      } else toast("error", r.error ?? "Could not reset.");
    });
  }

  return (
    <>
      {confirmNode}
      <div className="space-y-4 pb-20">
        {simple.length > 0 && (
          <section className="rounded-xl border border-navy-700 bg-navy p-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {simple.map(([k, f]) => (
                <Field key={k} name={k} schema={f.s} value={obj[k]} onChange={(v) => setValue(setAt(value, [k], v))} />
              ))}
            </div>
          </section>
        )}
        {blocks.map(([k, f]) => (
          <details key={k} open={blocks.length <= 3} className={cardCls}>
            <summary className={headCls}>
              <ChevronDown size={16} aria-hidden="true" className="-rotate-90 text-mist transition-transform group-open:rotate-0" />
              {human(k)}
              {k in hidden && !hidden[k] && <span className="rounded-full bg-white/5 px-2 py-0.5 text-xs font-normal text-mist">Hidden on the site</span>}
            </summary>
            <div className="border-t border-navy-700 p-5">
              {f.s.t === "object" ? (
                k === "sections" ? (
                  <div className="grid gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
                    <Fields schema={f.s} value={obj[k]} onChange={(v) => setValue(setAt(value, [k], v))} />
                  </div>
                ) : (
                  <Fields schema={f.s} value={obj[k]} onChange={(v) => setValue(setAt(value, [k], v))} />
                )
              ) : (
                <List name={k} schema={f.s as Extract<Schema, { t: "array" }>} value={obj[k]} onChange={(v) => setValue(setAt(value, [k], v))} />
              )}
            </div>
          </details>
        ))}
        {canReset && (
          <button type="button" disabled={busy} onClick={reset} className="adm-btn adm-btn-ghost adm-btn-sm">
            Reset to the built-in text
          </button>
        )}
      </div>
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-20 border-t border-amber/40 bg-navy-800 lg:left-64">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
            <p className="text-sm text-white">Unsaved changes</p>
            <div className="flex gap-2">
              <button type="button" disabled={busy} onClick={() => setValue(saved)} className="adm-btn adm-btn-ghost">
                Discard
              </button>
              <button type="button" disabled={busy} onClick={save} className="adm-btn adm-btn-primary">
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
