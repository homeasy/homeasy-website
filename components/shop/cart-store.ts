"use client";

import { useSyncExternalStore } from "react";
import { MAX_QTY } from "@/lib/store/pricing";

/** Cart kept in this browser (localStorage), in sync across tabs. Only ids and quantities: prices come from the server. */
export type CartLine = { id: string; qty: number };

const KEY = "homeasy-cart";
const EVENT = "homeasy-cart-change";
const EMPTY = "[]";

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return EMPTY;
  }
}
function parse(raw: string): CartLine[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((l) => l && typeof l.id === "string" && l.qty > 0).map((l) => ({ id: l.id, qty: Math.min(MAX_QTY, Math.round(l.qty)) })) : [];
  } catch {
    return [];
  }
}
function write(lines: CartLine[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(lines));
  } catch {
    /* storage blocked: the cart just won't persist */
  }
  window.dispatchEvent(new Event(EVENT));
}
function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

let cachedRaw = EMPTY;
let cachedLines: CartLine[] = [];
function snapshot(): CartLine[] {
  const raw = read();
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedLines = parse(raw);
  }
  return cachedLines;
}
const serverSnapshot: CartLine[] = [];

export function useCart(): CartLine[] {
  return useSyncExternalStore(subscribe, snapshot, () => serverSnapshot);
}

export const cart = {
  add(id: string, qty = 1) {
    const lines = parse(read());
    const line = lines.find((l) => l.id === id);
    if (line) line.qty = Math.min(MAX_QTY, line.qty + qty);
    else lines.push({ id, qty: Math.min(MAX_QTY, qty) });
    write(lines);
  },
  setQty(id: string, qty: number) {
    write(parse(read()).flatMap((l) => (l.id !== id ? [l] : qty > 0 ? [{ id, qty: Math.min(MAX_QTY, qty) }] : [])));
  },
  remove(id: string) {
    write(parse(read()).filter((l) => l.id !== id));
  },
  clear() {
    write([]);
  },
};
