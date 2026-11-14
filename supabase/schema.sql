-- Run once in Supabase → SQL Editor.
create table if not exists products  (id text primary key, data jsonb not null, created_at timestamptz not null default now());
create table if not exists inquiries (id text primary key, data jsonb not null, created_at timestamptz not null default now());
create table if not exists messages  (id text primary key, data jsonb not null, created_at timestamptz not null default now());

-- Lock tables down: the website talks to Supabase only from the server with the service-role key.
-- With RLS enabled and no policies, the public anon key can read/write nothing.
alter table products  enable row level security;
alter table inquiries enable row level security;
alter table messages  enable row level security;

-- Storage buckets. products = public (product photos); references = private (customer uploads).
insert into storage.buckets (id, name, public) values ('products', 'products', true) on conflict do nothing;
insert into storage.buckets (id, name, public) values ('references', 'references', false) on conflict do nothing;
