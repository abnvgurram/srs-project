import { useEffect, useState } from 'react'
import App from './App.jsx'
import AdminPage from './admin/AdminPage.jsx'

const ADMIN_PATH = '/admin'

function normalizePath(pathname) {
  const cleanPath = pathname.replace(/\/+$/, '') || '/'

  if (cleanPath === ADMIN_PATH) return ADMIN_PATH
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

  return <App />
}

export default RootRouter
