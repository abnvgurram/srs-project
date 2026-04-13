import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPhone } from '@fortawesome/free-solid-svg-icons'
import useSiteSections from '../../context/siteSections/useSiteSections.js'
import './Header.scss'

const navItems = [
  { label: 'Services', href: '#services', sectionKey: 'services' },
  { label: 'Properties', href: '#properties', sectionKey: 'properties' },
  { label: 'Why Us', href: '#why', sectionKey: 'why' },
  { label: 'Reviews', href: '#testimonials', sectionKey: 'testimonials' },
  { label: 'Blog', href: '#blog', sectionKey: 'blog' },
  { label: 'Contact Us', href: '#inquiry', sectionKey: 'inquiry' },
]

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const { sectionVisibility } = useSiteSections()

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
            {visibleNavItems.map((item) => (
              <a key={item.label} href={item.href}>
                {item.label}
              </a>
            ))}

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
        {visibleNavItems.map((item) => (
          <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)}>
            {item.label}
          </a>
        ))}

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
