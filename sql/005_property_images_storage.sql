insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'property-images',
  'property-images',
  true,
  10485760,
  array[
    'image/jpeg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/gif'
  ]
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public read property images" on storage.objects;
create policy "Public read property images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'property-images');

drop policy if exists "Temporary public upload property images" on storage.objects;
create policy "Temporary public upload property images"
on storage.objects
for insert
to anon, authenticated
with check (bucket_id = 'property-images');

drop policy if exists "Temporary public update property images" on storage.objects;
create policy "Temporary public update property images"
on storage.objects
for update
to anon, authenticated
using (bucket_id = 'property-images')
with check (bucket_id = 'property-images');

drop policy if exists "Temporary public delete property images" on storage.objects;
create policy "Temporary public delete property images"
on storage.objects
for delete
to anon, authenticated
using (bucket_id = 'property-images');
