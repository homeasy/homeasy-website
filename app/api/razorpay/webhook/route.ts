import { notifyOrder } from "@/lib/store/notify-order";
import { getOrderByRazorpayId, markPaid } from "@/lib/store/orders";
import { verifyWebhookSignature } from "@/lib/store/razorpay";

/**
 * Razorpay webhook (events: payment.captured, order.paid). A safety net for when the customer closes
 * the browser before the page can confirm the payment. Add this URL in Razorpay → Settings → Webhooks
 * with the same secret as RAZORPAY_WEBHOOK_SECRET.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  if (!verifyWebhookSignature(raw, req.headers.get("x-razorpay-signature") ?? "")) return new Response("bad signature", { status: 400 });
  let event: { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; status?: string } } } };
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const pay = event.payload?.payment?.entity;
  if ((event.event === "payment.captured" || event.event === "order.paid") && pay?.order_id && pay.id) {
    const order = await getOrderByRazorpayId(pay.order_id);
    if (order && order.amount_paid === 0) {
      if (await markPaid(order, pay.id)) await notifyOrder({ ...order, amount_paid: order.amount_due_now }, "paid");
    }
  }
  return new Response("ok");
}
