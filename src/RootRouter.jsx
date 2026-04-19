import { useEffect, useState } from 'react'
import App from './App.jsx'
import AdminPage from './admin/AdminPage.jsx'
import { getServicePageByPath } from './data/servicePages.js'
import BuyAHome from './pages/services/buyAHome/BuyAHome.jsx'
import PropertyManagement from './pages/services/propertyManagement/PropertyManagement.jsx'
import SellYourHome from './pages/services/sellYourHome/SellYourHome.jsx'
import Services from './pages/services/services/Services.jsx'

const ADMIN_PATH = '/admin'

function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'

  if (cleanPath === ADMIN_PATH) return ADMIN_PATH
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

  const servicePage = getServicePageByPath(pathname)

  if (servicePage?.key === 'services') {
    return <Services currentPath={pathname} />
  }

  if (servicePage?.key === 'buy-a-home') {
    return <BuyAHome currentPath={pathname} />
  }

  if (servicePage?.key === 'sell-your-home') {
    return <SellYourHome currentPath={pathname} />
  }

  if (servicePage?.key === 'property-management') {
    return <PropertyManagement currentPath={pathname} />
  }

  return <App currentPath={pathname} />
}

export default RootRouter
