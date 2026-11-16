-- Homeasy: job applications, WhatsApp inbox and product detail fields.
-- Run once in the Supabase SQL editor, after 05-chat.sql. Safe to run again.
-- Everything here is written only by the website server with the service-role key; RLS on, no public policies.

-- Job applications from the form on /careers.
create table if not exists public.job_applications (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,                 -- e.g. HJ-7K2QF
  role text not null,                       -- the opening applied for (as shown at the time)
  name text not null,
  mobile text not null,
  email text not null,
  city text,
  qualification text,
  experience text,
  link text,                                -- LinkedIn or portfolio
  message text,
  resume_path text,                         -- file name inside the private "resumes" bucket
  resume_name text,                         -- the applicant's own file name
  status text not null default 'new',
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists job_applications_created_at_idx on public.job_applications (created_at desc);
alter table public.job_applications enable row level security;

-- PRIVATE bucket for resumes: files are not reachable by link, only through the admin.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('resumes', 'resumes', false, 4194304,
  array['application/pdf','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document'])
on conflict (id) do nothing;

-- WhatsApp messages from customers to the business number (Cloud API), and the team's replies from the admin.
create table if not exists public.wa_messages (
  id text primary key,                      -- WhatsApp's message id
  phone text not null,                      -- the customer's number, digits with country code
  name text,                                -- their WhatsApp profile name, when given
  direction text not null,                  -- in | out
  body text not null,
  at timestamptz not null default now()
);
create index if not exists wa_messages_phone_at_idx on public.wa_messages (phone, at desc);
alter table public.wa_messages enable row level security;

-- Product detail page: specifications, what is in the box, where it is used (one entry per line in the admin).
alter table public.products add column if not exists specs text[] not null default '{}';
alter table public.products add column if not exists in_box text[] not null default '{}';
alter table public.products add column if not exists used_for text[] not null default '{}';
