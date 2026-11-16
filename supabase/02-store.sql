-- Homeasy store: products (run once in the Supabase SQL editor, after schema.sql).
-- Written only by the website server with the service-role key; RLS on with no public policies.

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  headline text not null default '',
  line text not null default '',
  description text not null default '',
  controls text[] not null default '{}',
  highlights text[] not null default '{}',
  icon text not null default 'relay',
  image_url text,
  price integer check (price is null or price > 0),   -- rupees; null = price on request
  mrp integer check (mrp is null or mrp > 0),
  status text not null default 'available' check (status in ('available','coming-soon','planned')),
  active boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists products_sort_idx on public.products (sort_order);
alter table public.products enable row level security;

-- Public bucket for product photos (files are world-readable by URL; uploads need the service-role key).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('product-images', 'product-images', true, 4194304, array['image/webp','image/jpeg','image/png'])
on conflict (id) do nothing;

-- Published snapshots: the public website reads these, not the working tables.
-- A row is replaced only when the admin presses "Publish now".
create table if not exists public.published_content (
  key text primary key,            -- e.g. 'products'
  data jsonb not null,
  published_at timestamptz not null default now()
);
alter table public.published_content enable row level security;
