-- Homeasy blog: articles written in Admin → Blog articles (run once in the Supabase SQL editor; safe to run again).
-- Written only by the website server with the service-role key; RLS on with no public policies.
-- The public site never reads this table: it reads the published copy in published_content (key "articles").

create table if not exists public.articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null default '',
  excerpt text not null default '',
  body_html text not null default '',
  cover_url text,
  cover_alt text not null default '',
  author text not null default 'Homeasy team',
  category text not null default '',
  focus_keyword text not null default '',
  seo_title text not null default '',
  seo_description text not null default '',
  noindex boolean not null default false,
  active boolean not null default false,
  published_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists articles_updated_idx on public.articles (updated_at desc);
alter table public.articles enable row level security;

-- Article photos go to the existing public "product-images" bucket (folder "blog"); nothing to add for storage.
