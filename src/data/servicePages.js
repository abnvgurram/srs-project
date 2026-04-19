export const serviceOverviewPage = {
  key: 'services',
  path: '/services',
  label: 'Services',
}

export const serviceChildPages = [
  {
    key: 'buy-a-home',
    path: '/services/buy-a-home',
    label: 'Buy A Home',
  },
  {
    key: 'sell-your-home',
    path: '/services/sell-your-home',
    label: 'Sell Your Home',
  },
  {
    key: 'property-management',
    path: '/services/property-management',
    label: 'Property Management',
  },
]

export const servicePages = [serviceOverviewPage, ...serviceChildPages]

export function getServicePageByPath(pathname) {
  return servicePages.find((page) => page.path === pathname) ?? null
}
