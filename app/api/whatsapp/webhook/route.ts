import { getChat, listChats, updateChat } from "@/lib/chat/store";
import { sendToTeam, teamNumbers, validSignature, verifyToken } from "@/lib/chat/whatsapp";

type Incoming = { from?: string; id?: string; type?: string; text?: { body?: string }; context?: { id?: string } };
type Payload = { entry?: { changes?: { value?: { messages?: Incoming[] } }[] }[] };

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
 * Messages sent to the business number. Only replies from the team's own numbers are accepted: each is added
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
  const messages = (payload.entry ?? []).flatMap((e) => e.changes ?? []).flatMap((c) => c.value?.messages ?? []);
  for (const m of messages) {
    if (!m.from || !team.includes(m.from.replace(/\D/g, ""))) continue; // not from the team: ignored
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
