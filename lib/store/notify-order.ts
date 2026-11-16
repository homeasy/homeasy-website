import "server-only";
import { sendEmail } from "@/lib/leads/notify";
import { getSite } from "@/lib/site-live";
import type { Order } from "./orders";
import { inr } from "./pricing";

const esc = (v: unknown) =>
  String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string);

/** Emails the team (and the customer, when a verified sender is set) about an order. Never throws. */
export async function notifyOrder(order: Order, event: "placed" | "paid") {
  if (!process.env.RESEND_API_KEY) return;
  const site = await getSite();
  const to = (process.env.LEAD_NOTIFY_TO || site.contact.email).split(",").map((s) => s.trim()).filter(Boolean);
  const lines = order.items.map((i) => `<tr><td style="padding:4px 12px 4px 0">${esc(i.name)} × ${i.qty}</td><td style="text-align:right">${inr(i.price * i.qty)}</td></tr>`).join("");
  const c = order.contact;
  const summary = `<table style="border-collapse:collapse">${lines}<tr><td style="padding:4px 12px 4px 0;color:#667085">Delivery</td><td style="text-align:right">${order.delivery_fee ? inr(order.delivery_fee) : "Free"}</td></tr><tr><td style="padding:6px 12px 6px 0"><strong>Total</strong></td><td style="text-align:right"><strong>${inr(order.total)}</strong></td></tr><tr><td style="padding:4px 12px 4px 0;color:#667085">Paid online</td><td style="text-align:right">${inr(order.amount_paid)}</td></tr><tr><td style="padding:4px 12px 4px 0;color:#667085">Balance due</td><td style="text-align:right">${inr(order.total - order.amount_paid)}</td></tr></table>`;
  const title = event === "paid" ? `Order ${order.ref} paid` : `New order ${order.ref} (payment to arrange)`;
  const tasks = [
    sendEmail(
      to,
      `${title}: ${c.name}, ${c.locality}`,
      `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0B1220"><h2 style="margin:0 0 12px">${esc(title)}</h2>${summary}<p style="margin-top:16px"><strong>${esc(c.name)}</strong> · +91 ${esc(c.mobile)}${c.email ? ` · ${esc(c.email)}` : ""}<br>${esc(c.address)}, ${esc(c.locality)} ${esc(c.pincode)}${c.gstin ? `<br>GSTIN ${esc(c.gstin)}` : ""}${c.notes ? `<br>Note: ${esc(c.notes)}` : ""}</p><p><a href="${site.url}/admin/orders/${order.ref}">Open in admin</a></p></div>`,
      c.email ?? undefined,
    ),
  ];
  if (c.email && process.env.LEAD_NOTIFY_FROM) {
    tasks.push(
      sendEmail(
        [c.email],
        `Your Homeasy order ${order.ref}`,
        `<div style="font-family:Arial,sans-serif;font-size:15px;color:#0B1220"><p>Hi ${esc(c.name.split(" ")[0])},</p><p>Thank you for your order. Your order number is <strong>${esc(order.ref)}</strong>.</p>${summary}<p>We will call or WhatsApp you to confirm delivery. Questions? Reach us on ${esc(site.contact.phoneDisplay)}.</p><p>Team Homeasy</p></div>`,
        site.contact.email,
      ),
    );
  }
  await Promise.all(tasks);
}
