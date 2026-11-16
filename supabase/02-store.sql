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

-- Store settings: the admin's working copy (the live copy is the 'store' row in published_content).
create table if not exists public.store_settings (
  key text primary key,                       -- always 'store'
  gst_rate numeric not null default 18,
  prices_include_gst boolean not null default true,
  delivery_fee integer not null default 0,
  free_delivery_above integer not null default 0,
  booking_enabled boolean not null default false,
  booking_amount integer not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.store_settings enable row level security;

-- Orders placed on the website.
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  ref text not null unique,                   -- order number shown to the customer, e.g. HO-7K2QF
  items jsonb not null,                       -- [{product_id, slug, name, price, qty}] as charged
  items_total integer not null,
  gst integer not null,
  gst_rate numeric not null,
  prices_include_gst boolean not null,
  delivery_fee integer not null default 0,
  total integer not null,
  pay_mode text not null check (pay_mode in ('full','booking')),
  amount_due_now integer not null,
  amount_paid integer not null default 0,
  status text not null default 'awaiting_payment'
    check (status in ('awaiting_payment','new','booking_paid','paid','processing','delivered','installed','cancelled','refunded')),
  contact jsonb not null,                     -- {name, mobile, email, address, locality, pincode, gstin, notes}
  razorpay_order_id text unique,
  razorpay_payment_id text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_status_idx on public.orders (status);
alter table public.orders enable row level security;
