export const siteSections = [
  { key: 'properties', label: 'Properties' },
  { key: 'header', label: 'Header' },
  { key: 'hero', label: 'Hero' },
  { key: 'agent', label: 'Agent Section' },
  { key: 'services', label: 'Services' },
  { key: 'about-us', label: 'About Us' },
  { key: 'testimonials', label: 'Testimonials' },
  { key: 'blog', label: 'Blog / Resources' },
  { key: 'cta', label: 'CTA' },
  { key: 'inquiry', label: 'Inquiry Form' },
  { key: 'footer', label: 'Footer' },
]

export const editableSiteSectionKeys = Object.freeze(['properties'])

export function isSiteSectionEditable(sectionKey) {
  return editableSiteSectionKeys.includes(sectionKey)
}

export const defaultSectionVisibility = Object.freeze(
  Object.fromEntries(siteSections.map((section) => [section.key, true])),
)

export function normalizeSectionVisibility(input) {
  if (!input || typeof input !== 'object') {
    return { ...defaultSectionVisibility }
  }

  return siteSections.reduce((visibility, section) => {
    const legacyKey = section.key === 'about-us' ? 'why' : section.key
    const inputValue =
      typeof input[section.key] === 'boolean'
        ? input[section.key]
        : input[legacyKey]

    visibility[section.key] =
      typeof inputValue === 'boolean'
        ? inputValue
        : defaultSectionVisibility[section.key]

    return visibility
  }, {})
}
