"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Mail, MessageCircle, Phone, Send, X } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons/brand-icons";
import { track } from "@/lib/analytics";
import { pollChat, requestHuman, sendChat, startChat } from "@/lib/chat/actions";

type Mode = "whatsapp" | "call" | "email";
type Bubble = { from: "bot" | "me" | "team" | "note"; text: string };
type Step = "name" | "email" | "mobile" | "mode" | "chat";
type Saved = { id: string; name: string; email: string; mobile: string; mode: Mode; bubbles: Bubble[]; handoff: boolean; lastTeamAt: string };

const KEY = "he_chat";
const load = (): Saved | null => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) ?? "null") as Saved | null;
  } catch {
    return null;
  }
};
const store = (s: Saved) => {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(s));
  } catch {
    /* private mode: the chat lasts until the page is closed */
  }
};
const mobileOk = (v: string) => /^[6-9]\d{9}$/.test(v.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, ""));
const emailOk = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/**
 * "Ask Homeasy": the AI assistant in the bottom-right corner. It first asks, one at a time, for the visitor's
 * full name, email (can be skipped), mobile / WhatsApp number and how they want to be contacted; then answers
 * from the website's content. A person is always one tap away: "Talk to a person" opens WhatsApp, a call or
 * email, and replies the team types in the admin appear here.
 */
export function ChatWidget({ whatsappNumber, telHref, mailHref, hours }: { whatsappNumber: string; telHref: string; mailHref: string; hours: string }) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("name");
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [who, setWho] = useState({ name: "", email: "", mobile: "", mode: "whatsapp" as Mode });
  const [id, setId] = useState("");
  const [handoff, setHandoff] = useState(false);
  const [lastTeamAt, setLastTeamAt] = useState("");
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const say = (list: Bubble[], ...more: Bubble[]) => [...list, ...more];

  function openPanel() {
    const saved = load();
    if (saved) {
      setId(saved.id);
      setWho({ name: saved.name, email: saved.email, mobile: saved.mobile, mode: saved.mode });
      setBubbles(saved.bubbles);
      setHandoff(saved.handoff);
      setLastTeamAt(saved.lastTeamAt);
      setStep("chat");
    } else if (!bubbles.length) {
      setBubbles([{ from: "bot", text: "Hi! I am the Homeasy assistant. Before we start, may I have your full name?" }]);
    }
    setOpen(true);
    track("chat_open");
  }

  // keep the newest message in view, and the cursor in the box
  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight });
    inputRef.current?.focus();
  }, [open, bubbles, step]);

  // remember the chat while the browser tab stays open
  useEffect(() => {
    if (id) store({ id, ...who, bubbles, handoff, lastTeamAt });
  }, [id, who, bubbles, handoff, lastTeamAt]);

  // once a person has been asked for, look for their replies every few seconds while the window is open
  useEffect(() => {
    if (!open || !id || !handoff) return;
    const timer = setInterval(async () => {
      const r = await pollChat(id, lastTeamAt).catch(() => null);
      if (r?.ok && r.messages.length) {
        setBubbles((b) => say(b, ...r.messages.map((m) => ({ from: "team" as const, text: m.text }))));
        setLastTeamAt(r.messages[r.messages.length - 1].at);
      }
    }, 6000);
    return () => clearInterval(timer);
  }, [open, id, handoff, lastTeamAt]);

  const firstName = who.name.trim().split(" ")[0];
  const waHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi Homeasy, I am ${who.name}. I was chatting on your website${id ? ` (chat ${id.slice(0, 9)})` : ""} and would like to talk to your team.`)}`;

  async function begin(mode: Mode) {
    setBusy(true);
    setError("");
    const next = { ...who, mode };
    setWho(next);
    const r = await startChat({ ...next, page: window.location.pathname }).catch(() => null);
    setBusy(false);
    if (!r || !r.ok) {
      setError(r && !r.ok ? r.error : "We could not start the chat. Please WhatsApp us instead.");
      return;
    }
    setId(r.id);
    setStep("chat");
    setBubbles((b) => say(b, { from: "me", text: mode === "whatsapp" ? "WhatsApp" : mode === "call" ? "Call" : "Email" }, { from: "bot", text: `Thank you, ${next.name.trim().split(" ")[0]}. Ask me anything about Homeasy: how it works, products, early access or booking a free survey.` }));
    track("chat_start", { mode });
  }

  async function askForPerson() {
    setHandoff(true);
    setBubbles((b) =>
      say(b, {
        from: "note",
        text:
          who.mode === "call"
            ? `Our team will call you on +91 ${who.mobile} during working hours (${hours}). You can also reach us right away:`
            : who.mode === "email" && who.email
              ? `Our team will email you at ${who.email}. You can also reach us right away:`
              : "Tap WhatsApp below to continue with our team. They also see this chat and can reply here.",
      }),
    );
    track("chat_handoff", { mode: who.mode });
    if (id) await requestHuman(id).catch(() => null);
  }

  async function submit() {
    const text = draft.trim();
    setError("");
    if (step === "name") {
      if (text.length < 2) return setError("Please type your full name.");
      setWho((w) => ({ ...w, name: text }));
      setBubbles((b) => say(b, { from: "me", text }, { from: "bot", text: `Nice to meet you, ${text.split(" ")[0]}. What is your email address? You can skip this.` }));
      setStep("email");
    } else if (step === "email") {
      if (!emailOk(text)) return setError("That email does not look right. You can also tap Skip.");
      setWho((w) => ({ ...w, email: text }));
      setBubbles((b) => say(b, { from: "me", text }, { from: "bot", text: "Thanks. What is your mobile or WhatsApp number?" }));
      setStep("mobile");
    } else if (step === "mobile") {
      if (!mobileOk(text)) return setError("Please enter a 10-digit mobile number.");
      setWho((w) => ({ ...w, mobile: text.replace(/[\s-]/g, "").replace(/^(\+91|91|0)(?=\d{10}$)/, "") }));
      setBubbles((b) => say(b, { from: "me", text }, { from: "bot", text: "How would you like our team to contact you?" }));
      setStep("mode");
    } else if (step === "chat") {
      if (!text || busy) return;
      setDraft("");
      const asked = bubbles.filter((b) => b.from === "me").length; // includes the answers given before the chat
      setBubbles((b) => say(b, { from: "me", text }));
      setBusy(true);
      const r = await sendChat(id, text).catch(() => null);
      setBusy(false);
      if (!r || !r.ok) {
        setError(r && !r.ok ? r.error : "That did not send. Please try again.");
        return;
      }
      const more: Bubble[] = [];
      if (r.reply) more.push({ from: "bot", text: r.reply });
      if (r.live) more.push({ from: "note", text: "Our team has your message and will reply here." });
      if (r.handoff && !handoff) {
        setHandoff(true);
        more.push({ from: "note", text: "Our team can take it from here. Tap a button below to reach them, or keep chatting and they will reply here." });
        void requestHuman(id).catch(() => null);
      } else if (!handoff && (asked - 2) % 4 === 0) {
        // every few questions, offer a person (first after the third question)
        more.push({ from: "note", text: "Would you like to talk to someone from our team? Tap “Talk to a person” below, or just keep asking." });
      }
      setBubbles((b) => say(b, ...more));
      return;
    }
    setDraft("");
  }

  const placeholder = step === "name" ? "Your full name" : step === "email" ? "you@example.com" : step === "mobile" ? "10-digit mobile number" : "Type your question";
  const pill = "inline-flex min-h-10 items-center gap-2 rounded-full border border-line bg-white px-4 text-[14px] font-semibold text-ink no-underline hover:bg-cloud";

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={openPanel}
          className="on-dark fixed bottom-20 right-4 z-40 inline-flex items-center gap-2 rounded-full bg-navy py-3 pl-4 pr-5 text-[15px] font-semibold text-white hover:bg-navy-700 lg:bottom-6 lg:right-6"
        >
          <MessageCircle size={22} aria-hidden="true" /> Ask Homeasy
        </button>
      )}
      {open && (
        <section
          aria-label="Homeasy assistant"
          className="fixed inset-0 z-[60] flex flex-col bg-white lg:inset-auto lg:bottom-6 lg:right-6 lg:h-[min(640px,calc(100dvh-3rem))] lg:w-[400px] lg:overflow-hidden lg:rounded-card lg:border lg:border-line"
        >
          <header className="on-dark flex items-center justify-between gap-3 bg-navy px-4 py-3 text-white">
            <div className="min-w-0">
              <h2 className="text-[1.0625rem] font-semibold text-white">Ask Homeasy</h2>
              <p className="text-[13px] text-mist">AI assistant. It can make mistakes.</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="inline-flex size-11 shrink-0 items-center justify-center rounded-button hover:bg-navy-700">
              <X size={22} aria-hidden="true" />
            </button>
          </header>

          <div ref={listRef} role="log" aria-live="polite" className="flex-1 space-y-3 overflow-y-auto bg-cloud p-4">
            {bubbles.map((b, i) =>
              b.from === "note" ? (
                <p key={i} className="rounded-card bg-tint p-3 text-[14px] text-ink">
                  {b.text}
                </p>
              ) : (
                <div key={i} className={`flex ${b.from === "me" ? "justify-end" : "justify-start"}`}>
                  <p className={`max-w-[85%] whitespace-pre-wrap break-words rounded-card px-3.5 py-2.5 text-[15px] ${b.from === "me" ? "bg-navy text-white" : "border border-line bg-white text-ink"}`}>
                    {b.from === "team" && <span className="mb-0.5 block text-[12px] font-semibold text-link">Homeasy team</span>}
                    {b.text}
                  </p>
                </div>
              ),
            )}
            {busy && <p className="text-[14px] text-slate">{step === "chat" ? "Typing…" : "Starting…"}</p>}
            {step === "mode" && !busy && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={() => begin("whatsapp")} className={pill}>
                  <WhatsAppIcon size={18} /> WhatsApp
                </button>
                <button type="button" onClick={() => begin("call")} className={pill}>
                  <Phone size={16} aria-hidden="true" /> Call
                </button>
                <button type="button" onClick={() => begin("email")} className={pill}>
                  <Mail size={16} aria-hidden="true" /> Email
                </button>
              </div>
            )}
            {handoff && (
              <div className="flex flex-wrap gap-2">
                <a href={waHref} target="_blank" rel="noopener noreferrer" className={pill}>
                  <WhatsAppIcon size={18} /> WhatsApp our team
                </a>
                <a href={telHref} className={pill}>
                  <Phone size={16} aria-hidden="true" /> Call
                </a>
                <a href={mailHref} className={pill}>
                  <Mail size={16} aria-hidden="true" /> Email
                </a>
              </div>
            )}
          </div>

          <div className="border-t border-line bg-white p-3">
            {error && (
              <p role="alert" className="mb-2 text-sm text-error">
                {error}
              </p>
            )}
            {step !== "mode" && (
              <form
                noValidate
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void submit();
                }}
              >
                <label htmlFor="chat-input" className="sr-only">
                  {placeholder}
                </label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder={placeholder}
                  maxLength={step === "chat" ? 600 : 120}
                  type={step === "email" ? "email" : step === "mobile" ? "tel" : "text"}
                  inputMode={step === "mobile" ? "numeric" : undefined}
                  autoComplete={step === "name" ? "name" : step === "email" ? "email" : step === "mobile" ? "tel" : "off"}
                  className="h-12 min-w-0 flex-1 rounded-input border border-line bg-white px-4 text-ink"
                />
                {step === "email" && (
                  <button
                    type="button"
                    className="btn btn-outline min-h-12 px-4"
                    onClick={() => {
                      setError("");
                      setDraft("");
                      setBubbles((b) => say(b, { from: "me", text: "Skip" }, { from: "bot", text: "No problem. What is your mobile or WhatsApp number?" }));
                      setStep("mobile");
                    }}
                  >
                    Skip
                  </button>
                )}
                <button type="submit" disabled={busy} aria-label="Send" className="btn btn-primary min-h-12 px-4 disabled:opacity-60">
                  <Send size={18} aria-hidden="true" />
                </button>
              </form>
            )}
            <div className="mt-2 flex flex-wrap items-center justify-between gap-x-3 gap-y-1 text-[12px] text-slate">
              {step === "chat" ? (
                <button type="button" onClick={askForPerson} disabled={handoff} className="font-semibold text-link underline underline-offset-2 disabled:no-underline disabled:opacity-60">
                  {handoff ? `Our team has been told, ${firstName}` : "Talk to a person"}
                </button>
              ) : (
                <span>
                  We save this chat so our team can help you. See our{" "}
                  <Link href="/privacy-policy" className="link">
                    Privacy Policy
                  </Link>
                  .
                </span>
              )}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
