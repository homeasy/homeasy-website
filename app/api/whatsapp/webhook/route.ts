import { getChat, listChats, updateChat } from "@/lib/chat/store";
import { insertWaMessage, listWaMessages } from "@/lib/chat/wa-inbox";
import { notify } from "@/lib/notify";
import { site } from "@/lib/site";
import { sendToTeam, teamNumbers, validSignature, verifyToken } from "@/lib/chat/whatsapp";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

type Incoming = { from?: string; id?: string; type?: string; text?: { body?: string }; context?: { id?: string } };
type Value = { messages?: Incoming[]; contacts?: { wa_id?: string; profile?: { name?: string } }[] };
type Payload = { entry?: { changes?: { value?: Value }[] }[] };

/**
 * Meta checks the address once when the webhook is saved: it sends the phrase from WHATSAPP_VERIFY_TOKEN and
 * expects its "challenge" value back.
 */
export async function GET(request: Request) {
  const q = new URL(request.url).searchParams;
  const ok = q.get("hub.mode") === "subscribe" && !!verifyToken() && q.get("hub.verify_token") === verifyToken();
  return ok ? new Response(q.get("hub.challenge") ?? "", { status: 200 }) : new Response("forbidden", { status: 403 });
}

/**
 * Messages sent to the business number. A message from anyone else is a customer: it is stored for
 * Admin → WhatsApp inbox and the team is emailed. Replies from the team's own numbers are chat replies: each is added
 * to the website chat it answers (matched by the message it swipe-replies to, otherwise the most recent chat
 * that asked for a person), where the visitor sees it. The AI then stays quiet in that chat for 15 minutes.
 */
export async function POST(request: Request) {
  const raw = await request.text();
  if (!validSignature(raw, request.headers.get("x-hub-signature-256"))) {
    console.error(
      !process.env.WHATSAPP_APP_SECRET
        ? "[whatsapp] webhook refused: WHATSAPP_APP_SECRET is not set"
        : request.headers.get("x-hub-signature-256")
          ? "[whatsapp] webhook refused: signature does not match WHATSAPP_APP_SECRET (use the App secret from Meta: App settings > Basic)"
          : "[whatsapp] webhook refused: call without a signature (not from Meta)",
    );
    return new Response("bad signature", { status: 401 });
  }
  let payload: Payload;
  try {
    payload = JSON.parse(raw) as Payload;
  } catch {
    return new Response("bad json", { status: 400 });
  }
  const team = teamNumbers();
  const values = (payload.entry ?? []).flatMap((e) => e.changes ?? []).map((c) => c.value ?? {});
  const names = new Map(values.flatMap((v) => v.contacts ?? []).map((c) => [c.wa_id ?? "", c.profile?.name ?? ""]));
  const messages = values.flatMap((v) => v.messages ?? []);
  for (const m of messages) {
    if (!m.from || !m.id) continue;
    if (!team.includes(m.from.replace(/\D/g, ""))) {
      // a customer wrote to the business number: keep it for Admin → WhatsApp inbox, and tell the team
      const phone = m.from.replace(/\D/g, "");
      const body = m.type === "text" ? (m.text?.body ?? "").slice(0, 3500) : `[${m.type ?? "message"}: open WhatsApp on the business phone to see it]`;
      const earlier = (await listWaMessages()).filter((x) => x.phone === phone && x.direction === "in");
      if (earlier.some((x) => x.id === m.id)) continue; // Meta sometimes delivers the same message twice
      await insertWaMessage({ id: m.id, phone, name: names.get(m.from) || null, direction: "in", body, at: new Date().toISOString() });
      const quiet = !earlier.length || Date.parse(earlier[0].at) < Date.now() - 30 * 60 * 1000;
      if (quiet) {
        await notify({
          subject: `WhatsApp message from ${names.get(m.from) || `+${phone}`}`,
          html: `<p><b>${esc(names.get(m.from) || "Customer")}</b> (+${esc(phone)}) wrote on WhatsApp:</p><p>${esc(body)}</p><p><a href="${site.url}/admin/whatsapp?phone=${phone}">Reply from the admin</a></p>`,
        });
      }
      continue;
    }
    const text = m.type === "text" ? (m.text?.body ?? "").trim() : "";
    if (!text) {
      await sendToTeam("Only text replies can be passed on to the website chat.");
      continue;
    }
    const chats = await listChats();
    const quoted = m.context?.id;
    const target =
      (quoted && chats.find((c) => (c.wa_ids ?? []).includes(quoted))) ||
      // no swipe-reply: use the latest chat that asked for a person in the last 24 hours
      chats.find((c) => c.handoff && Date.parse(c.updated_at) > Date.now() - 24 * 3600 * 1000);
    const chat = target ? await getChat(target.id) : null;
    if (!chat) {
      await sendToTeam("No open website chat to send this reply to.");
      continue;
    }
    const now = Date.now();
    await updateChat(chat.id, {
      handoff: true,
      live_until: new Date(now + 15 * 60 * 1000).toISOString(),
      messages: [...chat.messages, { role: "agent", text: text.slice(0, 1500), at: new Date(now).toISOString() }],
    });
  }
  return new Response("ok"); // always 200 for a valid call, or Meta keeps retrying
}
