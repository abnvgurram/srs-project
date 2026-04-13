create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  sections_visibility jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default timezone('utc', now())
);

insert into public.site_settings (id, sections_visibility)
values (
  1,
  '{
    "header": true,
    "hero": true,
    "agent": true,
    "services": true,
    "properties": true,
    "why": true,
    "testimonials": true,
    "blog": true,
    "cta": true,
    "inquiry": true,
    "footer": true
  }'::jsonb
)
on conflict (id) do update
set
  sections_visibility = excluded.sections_visibility,
  updated_at = timezone('utc', now());

alter table public.site_settings enable row level security;

drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings"
on public.site_settings
for select
to anon, authenticated
using (true);

drop policy if exists "Temporary public update site settings" on public.site_settings;
create policy "Temporary public update site settings"
on public.site_settings
for update
to anon, authenticated
using (id = 1)
with check (id = 1);
