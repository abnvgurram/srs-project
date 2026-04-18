import { useEffect, useState } from 'react'
import './AdminPage.scss'
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

const ADMIN_SESSION_KEY = 'siris-admin-session'
const WEBSITE_TITLE =
  'Siris Realty Group - Real Estate With Common Sense | Glen Allen, Richmond, Henrico VA'
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
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return window.sessionStorage.getItem(ADMIN_SESSION_KEY) === 'active'
  })
  const [activeSectionId, setActiveSectionId] = useState('dashboard')
  const [menuOpen, setMenuOpen] = useState(false)

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
    if (!isAuthenticated) return

    const guardState = { adminGuard: true }
    window.history.pushState(guardState, '', '/admin')

    function keepAdminInPlace() {
      window.history.pushState(guardState, '', '/admin')
      setMenuOpen(false)
    }

    window.addEventListener('popstate', keepAdminInPlace)

    return () => {
      window.removeEventListener('popstate', keepAdminInPlace)
    }
  }, [isAuthenticated])

  function handleLogin() {
    window.sessionStorage.setItem(ADMIN_SESSION_KEY, 'active')
    setIsAuthenticated(true)
    setActiveSectionId('dashboard')
    setMenuOpen(false)
    window.history.replaceState({ admin: true }, '', '/admin')
    window.scrollTo({ top: 0, behavior: 'auto' })
  }

  function handleLogout() {
    window.sessionStorage.removeItem(ADMIN_SESSION_KEY)
    setIsAuthenticated(false)
    setActiveSectionId('dashboard')
    setMenuOpen(false)
    window.history.replaceState({ admin: false }, '', '/admin')
    window.scrollTo({ top: 0, behavior: 'auto' })
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
          <p className="admin-login-card__copy">
            Manage website sections from header to footer. Authentication forms
            will come later. For now, use the temporary admin entry button.
          </p>

          <button
            className="admin-login-card__button"
            type="button"
            onClick={handleLogin}
          >
            Login as Admin
          </button>
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
            onClick={handleLogout}
          >
            <LogOut aria-hidden="true" size={16} strokeWidth={2.1} />
            <span>Logout</span>
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
    </div>
  )
}

export default AdminPage
