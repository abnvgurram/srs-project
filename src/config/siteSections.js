export const siteSections = [
  { key: 'header', label: 'Header' },
  { key: 'hero', label: 'Hero' },
  { key: 'agent', label: 'Agent Section' },
  { key: 'services', label: 'Services' },
  { key: 'properties', label: 'Featured Properties' },
  { key: 'why', label: 'Why Us' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'blog', label: 'Blog / Resources' },
  { key: 'cta', label: 'CTA' },
  { key: 'inquiry', label: 'Inquiry Form' },
  { key: 'footer', label: 'Footer' },
]

export const defaultSectionVisibility = Object.freeze(
  Object.fromEntries(siteSections.map((section) => [section.key, true])),
)

export function normalizeSectionVisibility(input) {
  if (!input || typeof input !== 'object') {
    return { ...defaultSectionVisibility }
  }

  return siteSections.reduce((visibility, section) => {
    visibility[section.key] =
      typeof input[section.key] === 'boolean'
        ? input[section.key]
        : defaultSectionVisibility[section.key]

    return visibility
  }, {})
}
