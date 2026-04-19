export function resolveSiteHref(href, currentPath = '/') {
  const normalizedHref = String(href ?? '').trim()

  if (!normalizedHref) return '/'
  if (/^(?:tel:|mailto:|https?:)/i.test(normalizedHref)) return normalizedHref
  if (normalizedHref.startsWith('#')) {
    return currentPath === '/' ? normalizedHref : `/${normalizedHref}`
  }

  return normalizedHref
}
