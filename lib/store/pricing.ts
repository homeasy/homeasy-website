/** Order maths, shared by the browser (cart preview) and the server (the real charge). No server imports here. */

export type StoreSettings = {
  gst_rate: number; // percent, e.g. 18
  prices_include_gst: boolean;
  delivery_fee: number; // rupees per order
  free_delivery_above: number; // rupees; 0 = no free-delivery threshold
  booking_enabled: boolean;
  booking_amount: number; // rupees paid now when the customer chooses "booking amount"
};

export const DEFAULT_SETTINGS: StoreSettings = {
  gst_rate: 18,
  prices_include_gst: true,
  delivery_fee: 0,
  free_delivery_above: 0,
  booking_enabled: false,
  booking_amount: 0,
};

export type PricedLine = { price: number; qty: number };
export type Totals = {
  items: number; // sum of price × qty as entered in the admin
  gst: number; // GST portion (already inside `items` when prices include GST)
  delivery: number;
  total: number; // what the customer owes in all
  payNow: number; // what is charged online now
  balance: number; // due later (booking mode)
};

export function computeTotals(lines: PricedLine[], s: StoreSettings, mode: "full" | "booking"): Totals {
  const items = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const rate = Math.max(0, s.gst_rate) / 100;
  const gst = s.prices_include_gst ? Math.round(items - items / (1 + rate)) : Math.round(items * rate);
  const beforeDelivery = s.prices_include_gst ? items : items + gst;
  const free = s.free_delivery_above > 0 && beforeDelivery >= s.free_delivery_above;
  const delivery = items > 0 && !free ? Math.max(0, s.delivery_fee) : 0;
  const total = beforeDelivery + delivery;
  const booking = mode === "booking" && s.booking_enabled && s.booking_amount > 0;
  const payNow = booking ? Math.min(s.booking_amount, total) : total;
  return { items, gst, delivery, total, payNow, balance: total - payNow };
}

export const inr = (n: number) => `₹${Math.round(n).toLocaleString("en-IN")}`;
export const MAX_QTY = 20;
