import "server-only";

/**
 * Spending guards for the AI assistant. In memory, so they are per server instance and reset on redeploy:
 * a brake against a runaway bill, not exact accounting. The hard limits are per chat (stored with the chat).
 */
export const MAX_USER_MESSAGES_PER_CHAT = 40;
export const MAX_MESSAGE_CHARS = 600;
const WINDOW_MS = 10 * 60 * 1000;
const PER_IP = 40; // messages per IP per 10 minutes
const DAILY_CAP = Number(process.env.CHAT_DAILY_CAP) || 2000; // AI replies per day, all visitors

const hits = new Map<string, number[]>();
let day = "";
let today = 0;

export function allowChatMessage(ip: string): "ok" | "slow_down" | "closed_for_today" {
  const now = Date.now();
  const stamp = new Date(now).toISOString().slice(0, 10);
  if (stamp !== day) {
    day = stamp;
    today = 0;
  }
  if (today >= DAILY_CAP) return "closed_for_today";
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= PER_IP) return "slow_down";
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  today++;
  return "ok";
}
