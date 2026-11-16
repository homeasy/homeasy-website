/** Orders (server only). Created at checkout, managed in /admin/orders. Live data: not part of publishing. */
import "server-only";
import { dbInsert, dbList, dbUpdate, type Row } from "@/lib/db";

export { ORDER_STATUSES, orderStatusLabel } from "./order-statuses";

export type OrderItem = { product_id: string; slug: string; name: string; price: number; qty: number };
export type OrderContact = {
  name: string;
  mobile: string;
  email: string | null;
  address: string;
  locality: string;
  pincode: string;
  gstin: string | null;
  notes: string | null;
};
export type Order = {
  ref: string; // e.g. HO-7K2QF
  items: OrderItem[];
  items_total: number;
  gst: number;
  gst_rate: number;
  prices_include_gst: boolean;
  delivery_fee: number;
  total: number;
  pay_mode: "full" | "booking";
  amount_due_now: number;
  amount_paid: number;
  status: string;
  contact: OrderContact;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

const TABLE = "orders";

export async function insertOrder(o: Order): Promise<boolean> {
  return dbInsert(TABLE, o as unknown as Row);
}
export async function listOrders(): Promise<Order[]> {
  return ((await dbList<Order & Row>(TABLE, "created_at.desc")) ?? []) as Order[];
}
export async function getOrder(ref: string): Promise<Order | null> {
  return (await listOrders()).find((o) => o.ref === ref) ?? null;
}
export async function getOrderByRazorpayId(id: string): Promise<Order | null> {
  return (await listOrders()).find((o) => o.razorpay_order_id === id) ?? null;
}
export async function patchOrder(ref: string, patch: Partial<Order>): Promise<boolean> {
  return dbUpdate(TABLE, "ref", ref, { ...patch, updated_at: new Date().toISOString() } as Row);
}

/** Marks an order paid after a verified payment. Safe to call twice (browser callback + webhook). */
export async function markPaid(order: Order, paymentId: string): Promise<boolean> {
  if (order.razorpay_payment_id === paymentId && order.amount_paid > 0) return true;
  return patchOrder(order.ref, {
    amount_paid: order.amount_due_now,
    razorpay_payment_id: paymentId,
    status: order.pay_mode === "booking" && order.amount_due_now < order.total ? "booking_paid" : "paid",
  });
}
