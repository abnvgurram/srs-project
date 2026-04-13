create table if not exists public.testimonials (
  id text primary key,
  name text not null,
  subtitle text not null default '',
  review text not null,
  rating integer not null default 5 check (rating between 1 and 5),
  source text not null default 'zillow',
  source_label text not null default 'Verified Zillow Review',
  is_published boolean not null default true,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.testimonials
  add column if not exists subtitle text not null default '',
  add column if not exists rating integer not null default 5,
  add column if not exists source text not null default 'zillow',
  add column if not exists source_label text not null default 'Verified Zillow Review',
  add column if not exists is_published boolean not null default true,
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

insert into public.testimonials (
  id,
  name,
  subtitle,
  review,
  rating,
  source,
  source_label,
  is_published,
  display_order
)
values
  (
    'fanta-meleza',
    'Dr. Fanta Meleza',
    'Bought in Wyndham, Glen Allen • April 2024',
    'From the moment we met, Vijay impressed us with his professionalism, knowledge, and dedication to helping us find our dream home in the highly rated Wyndham school district. His expertise in the local market was evident throughout every step.',
    5,
    'zillow',
    'Verified Zillow Review',
    true,
    1
  ),
  (
    'abhiram-b',
    'Abhiram B.',
    'Bought a Home • February 2024',
    'Vijay was very good in educating us on all steps related to house buying. He gave us a wide variety of options and stayed involved from search to closing. His assurance to guide us even after the purchase stood out.',
    5,
    'zillow',
    'Verified Zillow Review',
    true,
    2
  ),
  (
    'mahalakshmi-boddupally',
    'Mahalakshmi Boddupally',
    'Sold in Glen Allen • December 2022',
    'Vijay did an outstanding job helping with our house sale. He has great local knowledge and excellent negotiation skills. He stayed on top of all the work that needed to be done for the house. Highly recommended.',
    5,
    'zillow',
    'Verified Zillow Review',
    true,
    3
  )
on conflict (id) do update
set
  name = excluded.name,
  subtitle = excluded.subtitle,
  review = excluded.review,
  rating = excluded.rating,
  source = excluded.source,
  source_label = excluded.source_label,
  is_published = excluded.is_published,
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

alter table public.testimonials enable row level security;

drop policy if exists "Public read testimonials" on public.testimonials;
create policy "Public read testimonials"
on public.testimonials
for select
to anon, authenticated
using (true);

drop policy if exists "Temporary public insert testimonials" on public.testimonials;
create policy "Temporary public insert testimonials"
on public.testimonials
for insert
to anon, authenticated
with check (true);

drop policy if exists "Temporary public update testimonials" on public.testimonials;
create policy "Temporary public update testimonials"
on public.testimonials
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Temporary public delete testimonials" on public.testimonials;
create policy "Temporary public delete testimonials"
on public.testimonials
for delete
to anon, authenticated
using (true);
