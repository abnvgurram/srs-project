update public.site_settings
set
  sections_visibility =
    (
      case
        when sections_visibility ? 'why'
          then jsonb_set(
            sections_visibility - 'why',
            '{about-us}',
            sections_visibility -> 'why',
            true
          )
        else sections_visibility
      end
    ),
  updated_at = timezone('utc', now())
where id = 1;

update public.site_section_visibility
set
  section = 'about-us',
  updated_at = timezone('utc', now())
where section = 'why'
  and not exists (
    select 1
    from public.site_section_visibility existing_section
    where existing_section.section = 'about-us'
  );

delete from public.site_section_visibility
where section = 'why';
