import { useEffect, useState } from 'react'
import App from './App.jsx'
import AdminPage from './admin/AdminPage.jsx'
import SupportFab from './components/SupportFab/SupportFab.jsx'
import { getServicePageByPath } from './data/servicePages.js'
import Pricing from './pages/pricing/Pricing.jsx'
import BuyAHome from './pages/services/buyAHome/BuyAHome.jsx'
import PropertyManagement from './pages/services/propertyManagement/PropertyManagement.jsx'
import SellYourHome from './pages/services/sellYourHome/SellYourHome.jsx'
import Services from './pages/services/services/Services.jsx'

const ADMIN_PATH = '/admin'
const PRICING_PATH = '/pricing'

function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'

  if (cleanPath === ADMIN_PATH) return ADMIN_PATH
  if (cleanPath === PRICING_PATH) return PRICING_PATH
  if (getServicePageByPath(cleanPath)) return cleanPath
  return '/'
}

function RootRouter() {
  const [pathname, setPathname] = useState(() =>
    normalizePath(window.location.pathname),
  )

  useEffect(() => {
    function syncPath() {
      const nextPath = normalizePath(window.location.pathname)

      if (window.location.pathname !== nextPath) {
        window.history.replaceState(window.history.state, '', nextPath)
      }

      setPathname(nextPath)
    }

    syncPath()
    window.addEventListener('popstate', syncPath)

    return () => {
      window.removeEventListener('popstate', syncPath)
    }
  }, [])

  if (pathname === ADMIN_PATH) {
    return <AdminPage />
  }

  let page = <App currentPath={pathname} />

  if (pathname === PRICING_PATH) {
    page = <Pricing currentPath={pathname} />
  }
  else {
    const servicePage = getServicePageByPath(pathname)

    if (servicePage?.key === 'services') {
      page = <Services currentPath={pathname} />
    } else if (servicePage?.key === 'buy-a-home') {
      page = <BuyAHome currentPath={pathname} />
    } else if (servicePage?.key === 'sell-your-home') {
      page = <SellYourHome currentPath={pathname} />
    } else if (servicePage?.key === 'property-management') {
      page = <PropertyManagement currentPath={pathname} />
    }
  }

  return (
    <>
      {page}
      <SupportFab />
    </>
  )
}

export default RootRouter
