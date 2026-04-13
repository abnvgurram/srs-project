create table if not exists public.review_integrations (
  provider text primary key check (provider in ('google', 'zillow')),
  account_id text not null default '',
  location_id text not null default '',
  profile_id text not null default '',
  connection_status text not null default 'disconnected'
    check (connection_status in ('disconnected', 'connected', 'error')),
  connected_identity text not null default '',
  last_synced_at timestamptz,
  last_error text not null default '',
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.review_integrations
  add column if not exists account_id text not null default '',
  add column if not exists location_id text not null default '',
  add column if not exists profile_id text not null default '',
  add column if not exists connection_status text not null default 'disconnected',
  add column if not exists connected_identity text not null default '',
  add column if not exists last_synced_at timestamptz,
  add column if not exists last_error text not null default '',
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

insert into public.review_integrations (provider)
values ('google'), ('zillow')
on conflict (provider) do nothing;

create table if not exists public.review_integration_tokens (
  provider text primary key references public.review_integrations(provider) on delete cascade,
  access_token text not null default '',
  refresh_token text not null default '',
  scope text not null default '',
  expires_at timestamptz,
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.review_integration_tokens
  add column if not exists access_token text not null default '',
  add column if not exists refresh_token text not null default '',
  add column if not exists scope text not null default '',
  add column if not exists expires_at timestamptz,
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

alter table public.review_integrations enable row level security;
alter table public.review_integration_tokens enable row level security;

drop policy if exists "Public read review integrations" on public.review_integrations;
create policy "Public read review integrations"
on public.review_integrations
for select
to anon, authenticated
using (true);

drop policy if exists "Temporary public insert review integrations" on public.review_integrations;
create policy "Temporary public insert review integrations"
on public.review_integrations
for insert
to anon, authenticated
with check (true);

drop policy if exists "Temporary public update review integrations" on public.review_integrations;
create policy "Temporary public update review integrations"
on public.review_integrations
for update
to anon, authenticated
using (true)
with check (true);
