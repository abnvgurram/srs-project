import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faFacebookF,
  faInstagram,
  faLinkedinIn,
  faXTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { Calendar, Globe, Mail, MapPin, Phone } from 'lucide-react'
import './Footer.scss'

const serviceLinks = [
  { label: 'Buy a Home', href: '#services' },
  { label: 'Sell Your Home', href: '#services' },
  { label: 'Property Management', href: '#services' },
  { label: 'Relocation', href: '#services' },
  { label: 'Foreclosures', href: '#services' },
  { label: 'Landlord Consulting', href: '#services' },
]

const resourceLinks = [
  { label: 'Market Updates', href: '#blog' },
  { label: "Buyer's Guide", href: '#blog' },
  { label: "Seller's Guide", href: '#blog' },
  { label: 'Investor Tips', href: '#blog' },
  {
    label: 'Reviews',
    href: '#testimonials',
  },
  {
    label: 'Book Appointment',
    href: 'https://calendly.com/vijaykanth',
    external: true,
  },
]

const contactLinks = [
  {
    label: '804-426-6495',
    href: 'tel:8044266495',
    icon: Phone,
  },
  {
    label: 'vijay@sirisrealtygroup.com',
    href: 'mailto:vijay@sirisrealtygroup.com',
    icon: Mail,
  },
  {
    label: 'Glen Allen, VA 23060',
    href: '#why',
    icon: MapPin,
  },
  {
    label: 'sirisrealtygroup.com',
    href: 'https://sirisrealtygroup.com',
    icon: Globe,
    external: true,
  },
  {
    label: 'Book a Consultation',
    href: 'https://calendly.com/vijaykanth',
    icon: Calendar,
    external: true,
  },
]

const socialLinks = [
  { label: 'Facebook', href: 'https://www.facebook.com', icon: faFacebookF },
  { label: 'Instagram', href: 'https://www.instagram.com', icon: faInstagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com', icon: faLinkedinIn },
  { label: 'X', href: 'https://twitter.com', icon: faXTwitter },
]

function FooterLink({ href, label, external = false }) {
  return (
    <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
      {label}
    </a>
  )
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__grid">
          <section className="site-footer__brand">
            <a className="site-footer__brand-link" href="/">
              <span className="site-footer__brand-mark" aria-hidden="true"></span>

              <span className="site-footer__brand-copy">
                <span className="site-footer__brand-title">Siris Realty Group</span>
                <span className="site-footer__brand-subtitle">
                  Workflow of Wealth
                </span>
              </span>
            </a>

            <p className="site-footer__brand-text">
              Real Estate With Common Sense. Serving Glen Allen, Richmond,
              Henrico and the greater Virginia area since 2017 with integrity,
              expertise, and a commitment to your success.
            </p>

            <div className="site-footer__socials">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  className="site-footer__social-link"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={link.label}
                >
                  <FontAwesomeIcon icon={link.icon} />
                </a>
              ))}
            </div>
          </section>

          <section>
            <h2 className="site-footer__heading">Services</h2>
            <ul className="site-footer__links">
              {serviceLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink href={link.href} label={link.label} />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="site-footer__heading">Resources</h2>
            <ul className="site-footer__links">
              {resourceLinks.map((link) => (
                <li key={link.label}>
                  <FooterLink
                    href={link.href}
                    label={link.label}
                    external={link.external}
                  />
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="site-footer__heading">Contact</h2>
            <ul className="site-footer__links site-footer__links--contact">
              {contactLinks.map((link) => {
                const Icon = link.icon

                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.external
                        ? { target: '_blank', rel: 'noreferrer' }
                        : {})}
                    >
                      <Icon className="site-footer__contact-icon" size={16} />
                      <span>{link.label}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </section>
        </div>

        <div className="site-footer__bottom">
          <p>&copy; {new Date().getFullYear()} Siris Realty Group. All rights reserved.</p>
          <p className="site-footer__legal">
            <a href="#">Privacy Policy</a>
            <span>&middot;</span>
            <a href="#">Terms</a>
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
