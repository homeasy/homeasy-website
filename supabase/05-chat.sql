-- Homeasy website chat (run once in the Supabase SQL editor, after 04-enquiries.sql).
-- One row per chat started in the "Ask Homeasy" assistant: who the visitor is, how they want to be contacted,
-- and the messages (visitor, AI assistant, and team replies sent from the admin).
-- Written only by the website server with the service-role key; RLS on with no public policies.
create table if not exists public.chat_sessions (
  id text primary key,                        -- private chat key held by the visitor's browser, e.g. CH-…
  name text not null,
  email text,
  mobile text not null,
  mode text not null default 'whatsapp',      -- preferred contact: whatsapp | call | email
  messages jsonb not null default '[]'::jsonb, -- [{role: user|assistant|agent, text, at}]
  handoff boolean not null default false,     -- the visitor asked for a person (or the assistant suggested it)
  live_until timestamptz,                     -- while in the future, a team member is replying and the AI stays quiet
  page text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
-- WhatsApp bridge: IDs of the messages forwarded to the team, so a reply there finds its chat. Safe to run again.
alter table public.chat_sessions add column if not exists wa_ids jsonb not null default '[]'::jsonb;
create index if not exists chat_sessions_updated_at_idx on public.chat_sessions (updated_at desc);
alter table public.chat_sessions enable row level security;
