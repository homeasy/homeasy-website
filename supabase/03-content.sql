-- Homeasy editable content (run once in the Supabase SQL editor, after 02-store.sql).
-- Working copies of what the admin edits: homepage text, FAQ, packages, contact details, SEO settings,
-- plus admin-only lists (keywords, page-speed history; keys starting with "admin:").
-- The public website never reads this table: it reads published_content, which changes only on Publish.
create table if not exists public.site_content (
  key text primary key,
  data jsonb not null,
  updated_at timestamptz not null default now()
);
alter table public.site_content enable row level security;
