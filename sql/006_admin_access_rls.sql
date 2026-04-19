create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  username text not null unique,
  login_email text not null unique,
  full_name text not null default '',
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.admin_users
  add column if not exists username text,
  add column if not exists login_email text,
  add column if not exists full_name text not null default '',
  add column if not exists is_active boolean not null default true,
  add column if not exists created_at timestamptz not null default timezone('utc', now()),
  add column if not exists updated_at timestamptz not null default timezone('utc', now());

update public.admin_users as admin_user
set login_email = auth_user.email
from auth.users as auth_user
where admin_user.user_id = auth_user.id
  and (admin_user.login_email is null or btrim(admin_user.login_email) = '');

update public.admin_users
set username = concat('admin-', left(user_id::text, 8))
where username is null or btrim(username) = '';

alter table public.admin_users
  alter column username set not null,
  alter column login_email set not null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'admin_users_username_key'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users
      add constraint admin_users_username_key unique (username);
  end if;

  if not exists (
    select 1
    from pg_constraint
    where conname = 'admin_users_login_email_key'
      and conrelid = 'public.admin_users'::regclass
  ) then
    alter table public.admin_users
      add constraint admin_users_login_email_key unique (login_email);
  end if;
end;
$$;

create or replace function public.is_admin_user(check_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = check_user_id
      and is_active = true
  );
$$;

revoke all on function public.is_admin_user(uuid) from public;
grant execute on function public.is_admin_user(uuid) to authenticated;

create or replace function public.resolve_admin_login_email(login_identifier text)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select admin_users.login_email
  from public.admin_users
  where admin_users.is_active = true
    and (
      lower(admin_users.username) = lower(login_identifier)
      or lower(admin_users.login_email) = lower(login_identifier)
    )
  limit 1;
$$;

revoke all on function public.resolve_admin_login_email(text) from public;
grant execute on function public.resolve_admin_login_email(text) to anon, authenticated;

alter table public.admin_users enable row level security;

drop policy if exists "Admin users read own record" on public.admin_users;
create policy "Admin users read own record"
on public.admin_users
for select
to authenticated
using (user_id = auth.uid());

drop policy if exists "Temporary public update site settings" on public.site_settings;
create policy "Admin update site settings"
on public.site_settings
for update
to authenticated
using (id = 1 and public.is_admin_user(auth.uid()))
with check (id = 1 and public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public insert site section visibility" on public.site_section_visibility;
create policy "Admin insert site section visibility"
on public.site_section_visibility
for insert
to authenticated
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public update site section visibility" on public.site_section_visibility;
create policy "Admin update site section visibility"
on public.site_section_visibility
for update
to authenticated
using (public.is_admin_user(auth.uid()))
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public delete site section visibility" on public.site_section_visibility;
create policy "Admin delete site section visibility"
on public.site_section_visibility
for delete
to authenticated
using (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public insert property listings" on public.property_listings;
create policy "Admin insert property listings"
on public.property_listings
for insert
to authenticated
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public update property listings" on public.property_listings;
create policy "Admin update property listings"
on public.property_listings
for update
to authenticated
using (public.is_admin_user(auth.uid()))
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public delete property listings" on public.property_listings;
create policy "Admin delete property listings"
on public.property_listings
for delete
to authenticated
using (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public insert testimonials" on public.testimonials;
create policy "Admin insert testimonials"
on public.testimonials
for insert
to authenticated
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public update testimonials" on public.testimonials;
create policy "Admin update testimonials"
on public.testimonials
for update
to authenticated
using (public.is_admin_user(auth.uid()))
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public delete testimonials" on public.testimonials;
create policy "Admin delete testimonials"
on public.testimonials
for delete
to authenticated
using (public.is_admin_user(auth.uid()));

drop policy if exists "Public read review integrations" on public.review_integrations;
create policy "Admin read review integrations"
on public.review_integrations
for select
to authenticated
using (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public insert review integrations" on public.review_integrations;
create policy "Admin insert review integrations"
on public.review_integrations
for insert
to authenticated
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public update review integrations" on public.review_integrations;
create policy "Admin update review integrations"
on public.review_integrations
for update
to authenticated
using (public.is_admin_user(auth.uid()))
with check (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public delete review integrations" on public.review_integrations;
create policy "Admin delete review integrations"
on public.review_integrations
for delete
to authenticated
using (public.is_admin_user(auth.uid()));

drop policy if exists "Temporary public upload property images" on storage.objects;
create policy "Admin upload property images"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'property-images'
  and public.is_admin_user(auth.uid())
);

drop policy if exists "Temporary public update property images" on storage.objects;
create policy "Admin update property images"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'property-images'
  and public.is_admin_user(auth.uid())
)
with check (
  bucket_id = 'property-images'
  and public.is_admin_user(auth.uid())
);

drop policy if exists "Temporary public delete property images" on storage.objects;
create policy "Admin delete property images"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'property-images'
  and public.is_admin_user(auth.uid())
);

-- After creating an admin user in Supabase Authentication > Users,
-- create or confirm this auth user first:
--   email: srg-admin@sirisrealtygroup.com
--   password: b$uRMoO89
--
-- Then authorize that account for the admin portal with:
--
-- insert into public.admin_users (user_id, username, login_email, full_name)
-- select id, 'srg-admin', 'srg-admin@sirisrealtygroup.com', 'Site Admin'
-- from auth.users
-- where email = 'srg-admin@sirisrealtygroup.com'
-- on conflict (user_id) do update
-- set
--   username = excluded.username,
--   login_email = excluded.login_email,
--   full_name = excluded.full_name,
--   is_active = true,
--   updated_at = timezone('utc', now());
