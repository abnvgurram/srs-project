import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import { ChevronDown } from 'lucide-react'
import useSiteSections from '../../context/siteSections/useSiteSections.js'
import { serviceChildPages } from '../../data/servicePages.js'
import { resolveSiteHref } from '../../utils/siteNavigation.js'
import './Header.scss'

const navItems = [
  {
    label: 'Services',
    href: '/services',
    sectionKey: 'services',
    children: serviceChildPages.map((page) => ({
      label: page.label,
      href: page.path,
    })),
  },
  { label: 'Properties', href: '#properties', sectionKey: 'properties' },
  { label: 'Why Us', href: '#why', sectionKey: 'why' },
  { label: 'Reviews', href: '#testimonials', sectionKey: 'testimonials' },
  { label: 'Blog', href: '#blog', sectionKey: 'blog' },
  { label: 'Contact Us', href: '#inquiry', sectionKey: 'inquiry' },
]

const TABLET_NAV_BREAKPOINT = 1120

function Header({ currentPath = '/' }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false)
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false)
  const { sectionVisibility } = useSiteSections()
  const servicesMenuRef = useRef(null)

  const visibleNavItems = navItems.filter(
    (item) => sectionVisibility[item.sectionKey],
  )

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 60)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    function handleOutsidePointerDown(event) {
      if (!servicesMenuRef.current?.contains(event.target)) {
        setServicesMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setServicesMenuOpen(false)
        setMobileServicesOpen(false)
      }
    }

    window.addEventListener('mousedown', handleOutsidePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handleOutsidePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > TABLET_NAV_BREAKPOINT) {
        setMenuOpen(false)
        setMobileServicesOpen(false)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <>
      <header className={`site-header${isScrolled ? ' is-scrolled' : ''}`}>
        <div className="site-header__bar">
          <a className="site-header__brand" href="/">
            <span className="site-header__logo" aria-hidden="true"></span>

            <span className="site-header__brand-copy">
              <span className="site-header__title">Siris Realty Group</span>
              <span className="site-header__subtitle">
                <span>Dream big</span>
                <span>.</span>
                <span>Buy with courage</span>
              </span>
            </span>
          </a>

          <nav className="site-header__links" aria-label="Primary">
            {visibleNavItems.map((item) =>
              item.children ? (
                <div
                  className={`site-header__nav-group${
                    servicesMenuOpen ? ' is-open' : ''
                  }`}
                  key={item.label}
                  ref={servicesMenuRef}
                  onMouseEnter={() => setServicesMenuOpen(true)}
                  onMouseLeave={() => setServicesMenuOpen(false)}
                >
                  <div className="site-header__nav-trigger-wrap">
                    <a
                      className="site-header__nav-trigger-link"
                      href={item.href}
                      onFocus={() => setServicesMenuOpen(true)}
                    >
                      {item.label}
                    </a>

                    <button
                      className="site-header__nav-trigger-button"
                      type="button"
                      aria-label="Toggle services menu"
                      aria-expanded={servicesMenuOpen}
                      onClick={() => setServicesMenuOpen((open) => !open)}
                    >
                      <ChevronDown aria-hidden="true" size={16} strokeWidth={2.2} />
                    </button>
                  </div>

                  <div className="site-header__dropdown" role="menu">
                    {item.children.map((child) => (
                      <a
                        key={child.href}
                        href={child.href}
                        role="menuitem"
                        onClick={() => setServicesMenuOpen(false)}
                      >
                        {child.label}
                      </a>
                    ))}
                  </div>
                </div>
              ) : (
                <a key={item.label} href={resolveSiteHref(item.href, currentPath)}>
                  {item.label}
                </a>
              ),
            )}

            <a className="site-header__cta" href="tel:8044266495">
              <FontAwesomeIcon
                className="site-header__cta-icon"
                icon={faPhone}
                aria-hidden="true"
              />
              <span>804-426-6495</span>
            </a>
          </nav>

          <button
            className={`site-header__hamburger${menuOpen ? ' is-open' : ''}`}
            type="button"
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      <div className={`mobile-nav-panel${menuOpen ? ' is-open' : ''}`}>
        {visibleNavItems.map((item) =>
          item.children ? (
            <div
              className={`mobile-nav-panel__group${
                mobileServicesOpen ? ' is-open' : ''
              }`}
              key={item.label}
            >
              <div className="mobile-nav-panel__group-head">
                <a href={item.href} onClick={() => setMenuOpen(false)}>
                  {item.label}
                </a>

                <button
                  className="mobile-nav-panel__group-toggle"
                  type="button"
                  aria-label="Toggle services links"
                  aria-expanded={mobileServicesOpen}
                  onClick={() => setMobileServicesOpen((open) => !open)}
                >
                  <ChevronDown aria-hidden="true" size={16} strokeWidth={2.2} />
                </button>
              </div>

              {mobileServicesOpen ? (
                <div className="mobile-nav-panel__group-links">
                  {item.children.map((child) => (
                    <a
                      key={child.href}
                      href={child.href}
                      onClick={() => setMenuOpen(false)}
                    >
                      {child.label}
                    </a>
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <a
              key={item.label}
              href={resolveSiteHref(item.href, currentPath)}
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ),
        )}

        <a
          className="mobile-nav-panel__cta"
          href="tel:8044266495"
          onClick={() => setMenuOpen(false)}
        >
          <FontAwesomeIcon
            className="mobile-nav-panel__cta-icon"
            icon={faPhone}
            aria-hidden="true"
          />
          <span>804-426-6495</span>
        </a>
      </div>
    </>
  )
}

export default Header
