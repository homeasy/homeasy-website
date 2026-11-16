"use server";

import Anthropic from "@anthropic-ai/sdk";
import { randomBytes } from "node:crypto";
import { headers } from "next/headers";
import { z } from "zod";
import { dbMode } from "@/lib/db";
import { notify } from "@/lib/notify";
import { allow } from "@/lib/rate-limit";
import { site } from "@/lib/site";
import { buildSystemPrompt } from "./knowledge";
import { allowChatMessage, MAX_MESSAGE_CHARS, MAX_USER_MESSAGES_PER_CHAT } from "./limits";
import { getChat, insertChat, updateChat, type ChatMessage, type ChatSession } from "./store";
import { sendToTeam } from "./whatsapp";

/** The assistant is on only when an Anthropic API key is set (ANTHROPIC_API_KEY). */
const MODEL = process.env.CHAT_MODEL || "claude-haiku-5-5";
const HANDOFF = "[[HANDOFF]]";
const FALLBACK = "Sorry, I could not answer that just now. Our team can help you directly.";
const ID = /^CH-[A-Z2-9]{20}$/;
const ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
const newId = () => `CH-${Array.from(randomBytes(20), (b) => ALPHABET[b % ALPHABET.length]).join("")}`;
const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const ip = async () => ((await headers()).get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";

const startSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.preprocess((v) => (v === "" || v == null ? undefined : v), z.email().optional()),
  mobile: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""))
    .pipe(z.string().regex(/^[6-9]\d{9}$/)),
  mode: z.enum(["whatsapp", "call", "email"]),
  page: z.string().max(200).optional(),
});

export type StartResult = { ok: true; id: string } | { ok: false; error: string };

/** Saves who the visitor is (after they agreed) and opens a chat. */
export async function startChat(input: { name: string; email?: string; mobile: string; mode: string; page?: string; website?: string }): Promise<StartResult> {
  if (input.website) return { ok: true, id: "CH-00000000000000000000" }; // honeypot: bots get a chat that goes nowhere
  if (!process.env.ANTHROPIC_API_KEY || dbMode() === "none") return { ok: false, error: "The assistant is not available right now. Please WhatsApp us instead." };
  if (!allow(`chat-start:${await ip()}`)) return { ok: false, error: "Too many chats started. Please try again in a few minutes, or WhatsApp us." };
  const parsed = startSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: "Please check your name, mobile number and email." };
  const now = new Date().toISOString();
  const session: ChatSession = {
    id: newId(),
    name: parsed.data.name,
    email: parsed.data.email ?? null,
    mobile: parsed.data.mobile,
    mode: parsed.data.mode,
    messages: [],
    handoff: false,
    live_until: null,
    page: parsed.data.page ?? null,
    created_at: now,
    updated_at: now,
  };
  if (!(await insertChat(session))) return { ok: false, error: "We could not start the chat just now. Please WhatsApp us instead." };
  return { ok: true, id: session.id };
}

export type SendResult =
  | { ok: true; reply: string | null; handoff: boolean; live: boolean }
  | { ok: false; error: string };

/** One visitor message: stored, answered by the AI from the website's content (unless a team member is replying). */
export async function sendChat(id: string, text: string): Promise<SendResult> {
  const message = text.trim().slice(0, MAX_MESSAGE_CHARS);
  if (!ID.test(id) || !message) return { ok: false, error: "Please type a message." };
  const session = await getChat(id);
  if (!session) return { ok: false, error: "This chat has ended. Please start a new one." };
  if (session.messages.filter((m) => m.role === "user").length >= MAX_USER_MESSAGES_PER_CHAT) {
    return { ok: false, error: "This chat has reached its limit. Please talk to our team on WhatsApp." };
  }
  const gate = allowChatMessage(await ip());
  if (gate !== "ok") {
    return { ok: false, error: gate === "slow_down" ? "You are sending messages very quickly. Please wait a minute." : "The assistant is resting for today. Please talk to our team on WhatsApp." };
  }

  const now = new Date().toISOString();
  const history: ChatMessage[] = [...session.messages, { role: "user", text: message, at: now }];

  // once a person has been asked for, every visitor message also goes to the team's WhatsApp (if the bridge is set up)
  const forwarded = session.handoff ? await sendToTeam(`${session.name}: ${message}`, session.name) : [];
  const wa_ids = [...(session.wa_ids ?? []), ...forwarded].slice(-60);

  // a team member replied recently: keep the AI quiet so two voices do not answer at once
  if (session.live_until && session.live_until > now) {
    await updateChat(id, { messages: history, wa_ids });
    return { ok: true, reply: null, handoff: true, live: true };
  }

  let reply = FALLBACK;
  let handoff = session.handoff;
  try {
    const client = new Anthropic();
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      // short, grounded answers: no extended reasoning needed, and it keeps the reply fast and cheap
      thinking: { type: "disabled" },
      output_config: { effort: "low" },
      // the same text for every visitor, so it is cached and re-read at a fraction of the price
      system: [{ type: "text", text: await buildSystemPrompt(), cache_control: { type: "ephemeral" } }],
      messages: [
        { role: "user", content: `(The visitor's name is ${session.name}.)` },
        { role: "assistant", content: `Hi ${session.name.split(" ")[0]}! How can I help you with Homeasy?` },
        ...history.slice(-24).map((m) => ({
          role: m.role === "user" ? ("user" as const) : ("assistant" as const),
          content: m.role === "agent" ? `(Reply from the Homeasy team) ${m.text}` : m.text,
        })),
      ],
    });
    if (response.stop_reason === "refusal") {
      handoff = true;
    } else {
      const out = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("")
        .trim();
      if (out.includes(HANDOFF)) handoff = true;
      reply = out.replaceAll(HANDOFF, "").trim() || FALLBACK;
    }
  } catch (error) {
    if (error instanceof Anthropic.RateLimitError) console.error("[chat] Anthropic rate limit");
    else if (error instanceof Anthropic.AuthenticationError) console.error("[chat] ANTHROPIC_API_KEY was rejected");
    else if (error instanceof Anthropic.APIError) console.error(`[chat] Anthropic error ${error.status}: ${error.message}`);
    else console.error("[chat] request failed", error);
    handoff = true;
  }

  history.push({ role: "assistant", text: reply, at: new Date().toISOString() });
  await updateChat(id, { messages: history, handoff, wa_ids });
  return { ok: true, reply, handoff, live: false };
}

/** The visitor asked for a person: flag the chat and alert the team with the contact details and the conversation. */
export async function requestHuman(id: string): Promise<{ ok: boolean }> {
  if (!ID.test(id)) return { ok: false };
  const session = await getChat(id);
  if (!session) return { ok: false };
  const first = !session.handoff || !session.messages.some((m) => m.text === "(Asked to talk to a person)");
  await updateChat(id, { handoff: true, messages: [...session.messages, { role: "user", text: "(Asked to talk to a person)", at: new Date().toISOString() }] });
  if (first) {
    const recent = session.messages.slice(-6).map((m) => `${m.role === "user" ? session.name : m.role === "agent" ? "Team" : "Assistant"}: ${m.text}`);
    const sent = await sendToTeam(
      `New website chat: ${session.name} wants to talk to a person.\nMobile: +91 ${session.mobile}${session.email ? `\nEmail: ${session.email}` : ""}\nPrefers: ${session.mode}\n\n${recent.join("\n")}\n\nSwipe-reply to this message to answer in their chat window.`,
      session.name,
    );
    if (sent.length) await updateChat(id, { wa_ids: [...(session.wa_ids ?? []), ...sent].slice(-60) });
    const lines = session.messages.slice(-12).map((m) => `<p><b>${m.role === "user" ? esc(session.name) : m.role === "agent" ? "Team" : "Assistant"}:</b> ${esc(m.text)}</p>`);
    await notify({
      subject: `Chat: ${session.name} wants to talk to a person (${session.mode})`,
      html: `<h2>${esc(session.name)} asked for a person</h2><p>Mobile: +91 ${esc(session.mobile)}<br>Email: ${esc(session.email ?? "not given")}<br>Prefers: ${esc(session.mode)}</p>${lines.join("")}<p><a href="${site.url}/admin/chats?open=${session.id}">Open the chat in the admin</a> to reply there, or <a href="https://wa.me/91${session.mobile}">message them on WhatsApp</a>.</p>`,
      replyTo: session.email ?? undefined,
    });
  }
  return { ok: true };
}

/** Team replies typed in the admin since `after` (an ISO time; "" for all), for the visitor's open chat window. */
export async function pollChat(id: string, after: string): Promise<{ ok: boolean; messages: ChatMessage[]; live: boolean }> {
  if (!ID.test(id)) return { ok: false, messages: [], live: false };
  const session = await getChat(id);
  if (!session) return { ok: false, messages: [], live: false };
  return {
    ok: true,
    messages: session.messages.filter((m) => m.role === "agent" && m.at > after),
    live: !!session.live_until && session.live_until > new Date().toISOString(),
  };
}
