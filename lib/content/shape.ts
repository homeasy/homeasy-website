/**
 * Shape of an editable content document, worked out from its built-in (seed) version.
 * The admin editor draws its form from this, and the server uses it to clean whatever is saved,
 * so an edit can change words, lists and switches but never the structure the pages rely on.
 */
export type Schema =
  | { t: "string" }
  | { t: "number" }
  | { t: "boolean" }
  | { t: "any" } // text, a number, or empty (e.g. a price that may not be set)
  | { t: "object"; fields: Record<string, { s: Schema; optional: boolean }> }
  | { t: "array"; item: Schema | null };

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);

function union(a: Schema | null, b: Schema): Schema {
  if (!a) return b;
  if (a.t === "object" && b.t === "object") {
    const fields: Record<string, { s: Schema; optional: boolean }> = {};
    for (const k of new Set([...Object.keys(a.fields), ...Object.keys(b.fields)])) {
      const x = a.fields[k];
      const y = b.fields[k];
      fields[k] = x && y ? { s: union(x.s, y.s), optional: x.optional || y.optional } : { s: (x ?? y).s, optional: true };
    }
    return { t: "object", fields };
  }
  if (a.t === "array" && b.t === "array") return { t: "array", item: a.item && b.item ? union(a.item, b.item) : (a.item ?? b.item) };
  return a.t === b.t ? a : { t: "any" };
}

export function schemaOf(v: unknown): Schema {
  if (typeof v === "string") return { t: "string" };
  if (typeof v === "number") return { t: "number" };
  if (typeof v === "boolean") return { t: "boolean" };
  if (Array.isArray(v)) return { t: "array", item: v.map(schemaOf).reduce<Schema | null>(union, null) };
  if (isObj(v)) {
    const fields: Record<string, { s: Schema; optional: boolean }> = {};
    for (const [k, x] of Object.entries(v)) if (!k.startsWith("_")) fields[k] = { s: schemaOf(x), optional: false };
    return { t: "object", fields };
  }
  return { t: "any" };
}

export function isEmpty(v: unknown): boolean {
  if (v === undefined || v === null || v === "") return true;
  if (Array.isArray(v)) return v.length === 0;
  if (isObj(v)) return Object.values(v).every(isEmpty);
  return false;
}

/** An empty value of the right shape, for "Add item". */
export function blank(s: Schema): unknown {
  if (s.t === "string") return "";
  if (s.t === "number") return 0;
  if (s.t === "boolean") return false;
  if (s.t === "array") return [];
  if (s.t === "object") return Object.fromEntries(Object.entries(s.fields).filter(([, f]) => !f.optional).map(([k, f]) => [k, blank(f.s)]));
  return null;
}

const slugify = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 50);

/** Forces a value into the schema: wrong types are replaced, unknown keys dropped, empty optional parts removed. */
export function conform(s: Schema, v: unknown, key = ""): unknown {
  switch (s.t) {
    case "string":
      return typeof v === "string" ? v.slice(0, 60_000) : "";
    case "number":
      return Number.isFinite(Number(v)) ? Number(v) : 0;
    case "boolean":
      return v === true;
    case "any": {
      if (v === null || v === undefined || v === "") return null;
      if (typeof v === "number") return Number.isFinite(v) ? v : null;
      const text = String(v).trim().slice(0, 400);
      return /price|amount/i.test(key) && /^\d{1,9}$/.test(text.replace(/[₹,\s]/g, "")) ? Number(text.replace(/[₹,\s]/g, "")) : text || null;
    }
    case "object": {
      const src = isObj(v) ? v : {};
      const out: Record<string, unknown> = {};
      for (const [k, f] of Object.entries(s.fields)) {
        if (f.optional && isEmpty(src[k])) continue;
        out[k] = conform(f.s, src[k], k);
      }
      return out;
    }
    case "array": {
      if (!s.item) return [];
      const item = s.item;
      const rows = (Array.isArray(v) ? v : []).slice(0, 80).map((x) => conform(item, x, key)).filter((x) => !isEmpty(x));
      if (item.t === "object") {
        // ids and link names must exist and be unique: pages use them for anchors and keys
        for (const idKey of ["id", "slug"]) {
          if (!item.fields[idKey]) continue;
          const seen = new Set<string>();
          for (const row of rows as Record<string, unknown>[]) {
            const base = slugify(String(row[idKey] || row.title || row.name || row.q || "item")) || "item";
            let id = base;
            for (let n = 2; seen.has(id); n++) id = `${base}-${n}`;
            seen.add(id);
            row[idKey] = id;
          }
        }
      }
      return rows;
    }
  }
}

/** Lays saved data over the built-in version, so text added to the code later still has a value. */
export function mergeDefaults<T>(seed: T, data: unknown): T {
  if (isObj(seed)) {
    if (!isObj(data)) return seed;
    const out: Record<string, unknown> = { ...data };
    for (const [k, x] of Object.entries(seed)) out[k] = k in data ? mergeDefaults(x, data[k]) : x;
    return out as T;
  }
  if (Array.isArray(seed)) return (Array.isArray(data) ? data : seed) as T;
  if (seed === null) return (data ?? null) as T;
  return (typeof data === typeof seed ? data : seed) as T;
}
