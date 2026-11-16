-- Homeasy leads (PRD §10.5). Run this once in the Supabase SQL editor.
-- The website writes with the service-role key from the server only; RLS stays on with no public policies,
-- so the anon key can neither read nor write leads.

create table if not exists public.survey_requests (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,                 -- request number shown to the customer, e.g. HE-7K2QF
  full_name text not null,
  mobile text not null,
  whatsapp text,
  email text,
  pincode text not null,
  locality text not null,
  in_service_area boolean not null default false,
  home_type text not null,
  rooms text,
  appliances text[] not null default '{}',
  switch_brand text,
  preferred_date date,
  time_slot text,
  heard_from text,
  consent boolean not null,
  source_cta text,
  page text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  status text not null default 'new'
    check (status in ('new','contacted','survey_scheduled','surveyed','quoted','won','installed','lost','out_of_area')),
  assigned_to text,
  notes text,
  created_at timestamptz not null default now()
);

create index if not exists survey_requests_created_at_idx on public.survey_requests (created_at desc);
create index if not exists survey_requests_status_idx on public.survey_requests (status);

alter table public.survey_requests enable row level security;

-- Added for the admin dashboard: priority, notes history and "last updated".
-- Safe to run again on a table that already exists.
alter table public.survey_requests add column if not exists priority text not null default 'medium';
alter table public.survey_requests add column if not exists activity jsonb not null default '[]'::jsonb;
alter table public.survey_requests add column if not exists updated_at timestamptz not null default now();
