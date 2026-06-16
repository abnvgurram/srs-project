create table if not exists public.site_metrics (
  id text primary key,
  label text not null,
  value_text text not null,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.site_metrics
  add column if not exists label text not null default '',
  add column if not exists value_text text not null default '',
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

insert into public.site_metrics (
  id,
  label,
  value_text,
  display_order
)
values
  (
    'sales-last-12-months',
    'Sales in Last 12 Months',
    '18',
    1
  ),
  (
    'total-sales',
    'Total Sales',
    '209',
    2
  ),
  (
    'price-range',
    'Price Range',
    '$330K - $1.5M',
    3
  ),
  (
    'average-price',
    'Average Price',
    '$619K',
    4
  )
on conflict (id) do update
set
  label = excluded.label,
  value_text = excluded.value_text,
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

alter table public.site_metrics enable row level security;

drop policy if exists "Public read site metrics" on public.site_metrics;
create policy "Public read site metrics"
on public.site_metrics
for select
to anon, authenticated
using (true);

drop policy if exists "Temporary public insert site metrics" on public.site_metrics;
create policy "Temporary public insert site metrics"
on public.site_metrics
for insert
to anon, authenticated
with check (true);

drop policy if exists "Temporary public update site metrics" on public.site_metrics;
create policy "Temporary public update site metrics"
on public.site_metrics
for update
to anon, authenticated
using (true)
with check (true);
