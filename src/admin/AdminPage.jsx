import { useEffect, useState } from 'react'
import './AdminPage.scss'
import ConfirmationModal from './common/confirmationModal/ConfirmationModal.jsx'
import Agent from './agent/Agent.jsx'
import Blog from './blog/Blog.jsx'
import Cta from './cta/Cta.jsx'
import Dashboard from './dashboard/Dashboard.jsx'
import Footer from './footer/Footer.jsx'
import Header from './header/Header.jsx'
import Hero from './hero/Hero.jsx'
import Inquiry from './inquiry/Inquiry.jsx'
import Properties from './properties/Properties.jsx'
import Services from './services/Services.jsx'
import Testimonials from './testimonials/Testimonials.jsx'
import Why from './why/Why.jsx'
import {
  Bot,
  BriefcaseBusiness,
  Building2,
  ContactRound,
  Eye,
  EyeOff,
  LayoutDashboard,
  LayoutPanelTop,
  LogOut,
  Menu,
  MessageSquareQuote,
  Newspaper,
  PanelsTopLeft,
  Sparkles,
  X,
} from 'lucide-react'
import { hasSupabaseConfig, supabase } from '../lib/supabase.js'

const WEBSITE_TITLE =
  'Siris Realty Group - Real Estate With Common Sense | Glen Allen, Richmond, Henrico VA'
const ADMIN_USERS_TABLE = 'admin_users'
const enabledSidebarSectionIds = new Set(['dashboard', 'properties'])

const adminSections = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    Component: Dashboard,
  },
  {
    id: 'properties',
    label: 'Properties',
    icon: Building2,
    Component: Properties,
  },
  {
    id: 'header',
    label: 'Header',
    icon: LayoutPanelTop,
    Component: Header,
  },
  {
    id: 'hero',
    label: 'Hero',
    icon: PanelsTopLeft,
    Component: Hero,
  },
  {
    id: 'agent',
    label: 'Agent Section',
    icon: Bot,
    Component: Agent,
  },
  {
    id: 'services',
    label: 'Services',
    icon: BriefcaseBusiness,
    Component: Services,
  },
  {
    id: 'why',
    label: 'Why Us',
    icon: Sparkles,
    Component: Why,
  },
  {
    id: 'testimonials',
    label: 'Testimonials',
    icon: MessageSquareQuote,
    Component: Testimonials,
  },
  {
    id: 'blog',
    label: 'Blog / Resources',
    icon: Newspaper,
    Component: Blog,
  },
  {
    id: 'cta',
    label: 'CTA',
    icon: Sparkles,
    Component: Cta,
  },
  {
    id: 'inquiry',
    label: 'Inquiry Form',
    icon: ContactRound,
    Component: Inquiry,
  },
  {
    id: 'footer',
    label: 'Footer',
    icon: LayoutPanelTop,
    Component: Footer,
  },
]

function AdminPage() {
  const [authStatus, setAuthStatus] = useState(() =>
    hasSupabaseConfig ? 'checking' : 'no-config',
  )
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [activeSectionId, setActiveSectionId] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)
  const [loginIdentifier, setLoginIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [authMessage, setAuthMessage] = useState(() =>
    hasSupabaseConfig
      ? ''
      : 'Supabase is not configured in this environment. Add the VITE Supabase variables first.',
  )
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [isLogoutConfirmationOpen, setIsLogoutConfirmationOpen] = useState(false)
  const [logoutCountdown, setLogoutCountdown] = useState(10)

  const activeSection =
    adminSections.find((section) => section.id === activeSectionId) ??
    adminSections[0]
  const ActiveSectionComponent = activeSection.Component

  useEffect(() => {
    const previousTitle = document.title
    document.title = isAuthenticated
      ? 'Siris Realty Group Admin'
      : 'Siris Realty Admin Login'

    return () => {
      document.title = previousTitle || WEBSITE_TITLE
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!isLogoutConfirmationOpen || isAuthenticating) return undefined

    const timeoutId = window.setTimeout(() => {
      if (logoutCountdown <= 1) {
        setIsLogoutConfirmationOpen(false)
        setLogoutCountdown(10)
        return
      }

      setLogoutCountdown((currentCountdown) => currentCountdown - 1)
    }, 1000)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [isAuthenticating, isLogoutConfirmationOpen, logoutCountdown])

  useEffect(() => {
    if (!hasSupabaseConfig || !supabase) return undefined

    let isCancelled = false

    async function verifyAdminAccess(user) {
      const { data, error } = await supabase
        .from(ADMIN_USERS_TABLE)
        .select('user_id, username, full_name, is_active')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .maybeSingle()

      if (error) {
        if (!isCancelled) {
          setIsAuthenticated(false)
          setAuthStatus('unauthenticated')
          setAuthMessage(
            'Admin access could not be verified. Run the admin access SQL file in Supabase first.',
          )
        }

        return false
      }

      if (!data) {
        if (!isCancelled) {
          setIsAuthenticated(false)
          setAuthStatus('unauthenticated')
          setAuthMessage('This account does not have admin access.')
        }

        return false
      }

      if (!isCancelled) {
        setIsAuthenticated(true)
        setAuthStatus('authenticated')
        setAuthMessage('')
        setMenuOpen(false)
        window.history.replaceState({ admin: true }, '', '/admin')
      }

      return true
    }

    async function syncAdminSession() {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (isCancelled) return

      if (error) {
        setIsAuthenticated(false)
        setAuthStatus('unauthenticated')
        setAuthMessage('Admin session could not be checked. Try again.')
        return
      }

      if (!session?.user) {
        setIsAuthenticated(false)
        setAuthStatus('unauthenticated')
        setMenuOpen(false)
        return
      }

      const isAdmin = await verifyAdminAccess(session.user)

      if (!isAdmin) {
        await supabase.auth.signOut()
        if (!isCancelled) {
          window.history.replaceState({ admin: false }, '', '/admin')
        }
      }
    }

    void syncAdminSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      window.setTimeout(async () => {
        if (isCancelled) return

        if (!session?.user) {
          setIsAuthenticated(false)
          setAuthStatus('unauthenticated')
          setActiveSectionId('dashboard')
          setMenuOpen(false)
          window.history.replaceState({ admin: false }, '', '/admin')
          window.scrollTo({ top: 0, behavior: 'auto' })
          return
        }

        const isAdmin = await verifyAdminAccess(session.user)

        if (!isAdmin) {
          await supabase.auth.signOut()
        } else if (!isCancelled) {
          window.scrollTo({ top: 0, behavior: 'auto' })
        }
      }, 0)
    })

    return () => {
      isCancelled = true
      subscription.unsubscribe()
    }
  }, [])

  async function handleLogin(event) {
    event.preventDefault()

    if (!hasSupabaseConfig || !supabase) {
      setAuthMessage(
        'Supabase is not configured in this environment. Add the VITE Supabase variables first.',
      )
      return
    }

    if (!loginIdentifier.trim() || !password.trim()) {
      setAuthMessage('Enter both email or username and password to continue.')
      return
    }

    setIsAuthenticating(true)
    setAuthMessage('')

    let loginEmail = loginIdentifier.trim().toLowerCase()

    const { data: resolvedLoginEmail, error: resolveError } = await supabase.rpc(
      'resolve_admin_login_email',
      {
        login_identifier: loginEmail,
      },
    )

    if (resolveError) {
      setIsAuthenticating(false)
      setAuthMessage('Admin login could not be prepared. Run the latest admin SQL setup first.')
      return
    }

    if (typeof resolvedLoginEmail === 'string' && resolvedLoginEmail.trim()) {
      loginEmail = resolvedLoginEmail.trim()
    }

    if (!loginEmail.includes('@')) {
      setIsAuthenticating(false)
      setAuthMessage('Admin login could not be completed. Check the admin_users setup first.')
      return
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password,
    })

    setIsAuthenticating(false)

    if (error) {
      setAuthMessage(error.message || 'Admin login could not be completed.')
      return
    }

    setLoginIdentifier('')
    setPassword('')
  }

  async function handleLogout() {
    if (!supabase) return

    setIsAuthenticating(true)
    setAuthMessage('')

    const { error } = await supabase.auth.signOut()

    setIsAuthenticating(false)

    if (error) {
      setAuthMessage('Admin logout could not be completed. Try again.')
      return
    }

    setLoginIdentifier('')
    setPassword('')
    setIsPasswordVisible(false)
    setIsAuthenticated(false)
    setAuthStatus('unauthenticated')
    setActiveSectionId('dashboard')
    setMenuOpen(false)
    window.history.replaceState({ admin: false }, '', '/admin')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function requestLogout() {
    setLogoutCountdown(10)
    setIsLogoutConfirmationOpen(true)
  }

  function closeLogoutConfirmation() {
    if (isAuthenticating) return
    setIsLogoutConfirmationOpen(false)
    setLogoutCountdown(10)
  }

  function handleSectionChange(sectionId) {
    if (!enabledSidebarSectionIds.has(sectionId)) return

    setActiveSectionId(sectionId)
    setMenuOpen(false)
  }

  if (!isAuthenticated) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-page__backdrop" aria-hidden="true"></div>

        <section className="admin-login-card">
          <p className="admin-login-card__eyebrow">Siris Realty Admin</p>
          <h1 className="admin-login-card__title">Admin access</h1>

          {authStatus === 'checking' ? (
            <div className="admin-login-card__message">
              Checking admin session...
            </div>
          ) : (
            <form className="admin-login-card__form" onSubmit={handleLogin}>
              <div className="admin-login-card__field">
                <label htmlFor="admin-email">Email/Username</label>
                <input
                  id="admin-email"
                  type="text"
                  autoComplete="username"
                  value={loginIdentifier}
                  placeholder="Enter Email or Username"
                  onChange={(event) => setLoginIdentifier(event.target.value)}
                />
              </div>

              <div className="admin-login-card__field">
                <label htmlFor="admin-password">Password</label>
                <div className="admin-login-card__password-wrap">
                  <input
                    id="admin-password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    placeholder="Enter password"
                    onChange={(event) => setPassword(event.target.value)}
                  />
                  <button
                    className="admin-login-card__password-toggle"
                    type="button"
                    aria-label={
                      isPasswordVisible ? 'Hide password' : 'Show password'
                    }
                    onClick={() =>
                      setIsPasswordVisible((isVisible) => !isVisible)
                    }
                  >
                    {isPasswordVisible ? (
                      <EyeOff aria-hidden="true" size={18} strokeWidth={2.1} />
                    ) : (
                      <Eye aria-hidden="true" size={18} strokeWidth={2.1} />
                    )}
                  </button>
                </div>
              </div>

              {authMessage ? (
                <div
                  className={`admin-login-card__message${
                    authStatus === 'no-config' ||
                    authMessage.includes('could not') ||
                    authMessage.includes('does not') ||
                    authMessage.includes('Enter both')
                      ? ' admin-login-card__message--error'
                      : ''
                  }`}
                >
                  {authMessage}
                </div>
              ) : null}

              <button
                className="admin-login-card__button"
                type="submit"
                disabled={isAuthenticating || authStatus === 'no-config'}
              >
                {isAuthenticating ? 'Logging in...' : 'Log in'}
              </button>
            </form>
          )}
        </section>
      </main>
    )
  }

  return (
    <div className="admin-shell">
      <aside className={`admin-sidebar${menuOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar__top">
          <a className="admin-sidebar__brandmark" href="/" aria-label="Go to website">
            <span className="admin-sidebar__logo" aria-hidden="true"></span>
          </a>

          <button
            className="admin-sidebar__close"
            type="button"
            aria-label="Close section menu"
            onClick={() => setMenuOpen(false)}
          >
            <X aria-hidden="true" size={18} strokeWidth={2.3} />
          </button>
        </div>

        <nav className="admin-sidebar__nav" aria-label="Admin sections">
          {adminSections.map((section) => {
            const Icon = section.icon
            const isEnabled = enabledSidebarSectionIds.has(section.id)

            return (
              <button
                className={`admin-sidebar__item${
                  activeSection.id === section.id ? ' is-active' : ''
                }${
                  !isEnabled ? ' is-disabled' : ''
                }`}
                key={section.id}
                type="button"
                disabled={!isEnabled}
                onClick={() => handleSectionChange(section.id)}
              >
                <Icon aria-hidden="true" size={18} strokeWidth={2.1} />
                <span>{section.label}</span>
              </button>
            )
          })}
        </nav>

        <div className="admin-sidebar__footer">
          <button
            className="admin-sidebar__logout"
            type="button"
            disabled={isAuthenticating}
            onClick={requestLogout}
          >
            <LogOut aria-hidden="true" size={16} strokeWidth={2.1} />
            <span>{isAuthenticating ? 'Logging out...' : 'Logout'}</span>
          </button>
        </div>
      </aside>

      <div
        className={`admin-sidebar__overlay${menuOpen ? ' is-open' : ''}`}
        onClick={() => setMenuOpen(false)}
        aria-hidden="true"
      ></div>

      <main className="admin-content">
        <header className="admin-topbar">
          <div className="admin-topbar__left">
            <button
              className="admin-topbar__menu"
              type="button"
              aria-label="Open section menu"
              onClick={() => setMenuOpen(true)}
            >
              <Menu aria-hidden="true" size={20} strokeWidth={2.3} />
            </button>

            <a className="admin-topbar__brand" href="/" aria-label="Go to website">
              <span className="admin-topbar__brand-copy">
                <span className="admin-topbar__brand-title">
                  Siris Realty Group
                </span>
                <span className="admin-topbar__brand-subtitle">
                  <span>Dream big</span>
                  <span>.</span>
                  <span>Buy with courage</span>
                </span>
              </span>
            </a>
          </div>
        </header>

        <section className="admin-panel">
          <ActiveSectionComponent />
        </section>
      </main>

      <ConfirmationModal
        cancelLabel={`No (${logoutCountdown}s)`}
        confirmLabel="Yes, Logout"
        description="Log out of the admin portal?"
        isLoading={isAuthenticating}
        isOpen={isLogoutConfirmationOpen}
        onCancel={closeLogoutConfirmation}
        onConfirm={handleLogout}
        title="Confirm logout?"
        tone="danger"
      />
    </div>
  )
}

export default AdminPage
