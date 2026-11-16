-- Homeasy enquiries (run once in the Supabase SQL editor, after 03-content.sql).
-- Messages from the contact, partner (designer, builder, electrician), government and demo forms.
-- Written only by the website server with the service-role key; RLS on with no public policies.
create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,                 -- number shown to the sender, e.g. HQ-7K2QF
  kind text not null,                       -- contact | designer | builder | electrician | government | demo
  name text not null,
  mobile text not null,
  email text,
  organisation text,
  city text,
  message text,
  extra jsonb not null default '{}'::jsonb, -- form-specific answers: question → answer
  page text,
  status text not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
alter table public.enquiries enable row level security;
