create table if not exists public.property_listings (
  id text primary key,
  type text not null check (type in ('buy', 'rent', 'sold')),
  is_published boolean not null default true,
  price text not null,
  address text not null default '',
  street_address text not null default '',
  city text not null default '',
  state text not null default '',
  zip_code text not null default '',
  description text not null default '',
  beds text not null,
  baths text not null,
  size text not null,
  image_urls jsonb not null default '[]'::jsonb,
  cover_image integer not null default 0,
  display_order integer not null default 0,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.property_listings
  add column if not exists is_published boolean not null default true,
  add column if not exists address text not null default '',
  add column if not exists street_address text not null default '',
  add column if not exists city text not null default '',
  add column if not exists state text not null default '',
  add column if not exists zip_code text not null default '',
  add column if not exists description text not null default '',
  add column if not exists image_urls jsonb not null default '[]'::jsonb,
  add column if not exists cover_image integer not null default 0,
  add column if not exists display_order integer not null default 0,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

insert into public.property_listings (
  id,
  type,
  is_published,
  price,
  address,
  street_address,
  city,
  state,
  zip_code,
  description,
  beds,
  baths,
  size,
  image_urls,
  cover_image,
  display_order
)
values
  (
    'wyndham-dr',
    'buy',
    true,
    '$485,000',
    '2847 Wyndham Dr, Glen Allen, VA 23060',
    '2847 Wyndham Dr',
    'Glen Allen',
    'VA',
    '23060',
    'Elegant family home in the Glen Allen market.',
    '4 Beds',
    '3 Baths',
    '2,340 sqft',
    '[]'::jsonb,
    0,
    1
  ),
  (
    'broad-oak-ct',
    'buy',
    true,
    '$629,000',
    '1124 Broad Oak Ct, Richmond, VA 23229',
    '1124 Broad Oak Ct',
    'Richmond',
    'VA',
    '23229',
    'Large Richmond property with spacious living areas.',
    '5 Beds',
    '4 Baths',
    '3,100 sqft',
    '[]'::jsonb,
    0,
    2
  ),
  (
    'henrico-blvd',
    'rent',
    true,
    '$2,200/mo',
    '5543 Henrico Blvd, Henrico, VA 23228',
    '5543 Henrico Blvd',
    'Henrico',
    'VA',
    '23228',
    'Well-located rental with quick access to the metro area.',
    '3 Beds',
    '2 Baths',
    '1,680 sqft',
    '[]'::jsonb,
    0,
    3
  ),
  (
    'short-pump-pkwy',
    'sold',
    true,
    '$514,700',
    '3312 Short Pump Pkwy, Glen Allen, VA 23233',
    '3312 Short Pump Pkwy',
    'Glen Allen',
    'VA',
    '23233',
    'Recently sold listing in the Short Pump corridor.',
    '4 Beds',
    '3 Baths',
    '2,580 sqft',
    '[]'::jsonb,
    0,
    4
  ),
  (
    'skipwith-rd',
    'buy',
    true,
    '$379,000',
    '780 Skipwith Rd, Henrico, VA 23226',
    '780 Skipwith Rd',
    'Henrico',
    'VA',
    '23226',
    'Move-in-ready home in a central Henrico location.',
    '3 Beds',
    '2 Baths',
    '1,920 sqft',
    '[]'::jsonb,
    0,
    5
  ),
  (
    'brook-rd',
    'rent',
    true,
    '$1,750/mo',
    '412 Brook Rd, Richmond, VA 23220',
    '412 Brook Rd',
    'Richmond',
    'VA',
    '23220',
    'Convenient Richmond rental with easy downtown access.',
    '2 Beds',
    '2 Baths',
    '1,100 sqft',
    '[]'::jsonb,
    0,
    6
  )
on conflict (id) do update
set
  type = excluded.type,
  is_published = excluded.is_published,
  price = excluded.price,
  address = excluded.address,
  street_address = excluded.street_address,
  city = excluded.city,
  state = excluded.state,
  zip_code = excluded.zip_code,
  description = excluded.description,
  beds = excluded.beds,
  baths = excluded.baths,
  size = excluded.size,
  image_urls = excluded.image_urls,
  cover_image = excluded.cover_image,
  display_order = excluded.display_order,
  updated_at = timezone('utc', now());

alter table public.property_listings enable row level security;

drop policy if exists "Public read property listings" on public.property_listings;
create policy "Public read property listings"
on public.property_listings
for select
to anon, authenticated
using (true);

drop policy if exists "Temporary public insert property listings" on public.property_listings;
create policy "Temporary public insert property listings"
on public.property_listings
for insert
to anon, authenticated
with check (true);

drop policy if exists "Temporary public update property listings" on public.property_listings;
create policy "Temporary public update property listings"
on public.property_listings
for update
to anon, authenticated
using (true)
with check (true);

drop policy if exists "Temporary public delete property listings" on public.property_listings;
create policy "Temporary public delete property listings"
on public.property_listings
for delete
to anon, authenticated
using (true);
