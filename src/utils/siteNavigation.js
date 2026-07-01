const homeSectionPathMap = {
  '/about-us': 'about-us',
  '/properties': 'properties',
  '/blog': 'blog',
  '/contact': 'inquiry',
  '/testimonials': 'testimonials',
}

const hashSectionPathMap = {
  '#why': '/about-us',
  '#about-us': '/about-us',
  '#properties': '/properties',
  '#blog': '/blog',
  '#inquiry': '/contact',
  '#contact': '/contact',
  '#testimonials': '/testimonials',
  '#services': '/services',
}

export function resolveSiteHref(href) {
  const normalizedHref = String(href ?? '').trim()

  if (!normalizedHref) return '/'
  if (/^(?:tel:|mailto:|https?:)/i.test(normalizedHref)) return normalizedHref
  if (normalizedHref.startsWith('#')) {
    return hashSectionPathMap[normalizedHref] ?? '/'
  }

  return normalizedHref
}

export function getHomeSectionIdFromPath(pathname) {
  const normalizedPath = String(pathname ?? '').replace(/\/+$/, '') || '/'

  return homeSectionPathMap[normalizedPath] ?? ''
}

export function isHomeSectionPath(pathname) {
  return Boolean(getHomeSectionIdFromPath(pathname))
}

export function navigateToPath(pathname) {
  const nextPath = String(pathname ?? '').trim()

  if (!nextPath) return

  window.history.pushState(window.history.state, '', nextPath)
  window.dispatchEvent(new PopStateEvent('popstate'))
}
