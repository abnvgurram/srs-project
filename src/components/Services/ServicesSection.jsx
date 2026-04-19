import { BadgeDollarSign, House, KeyRound } from 'lucide-react'
import { serviceChildPages } from '../../data/servicePages.js'
import './ServicesSection.scss'

const services = [
  {
    title: 'Buy a Home',
    description:
      'Find your perfect home with personalized guidance, off-market access, and expert negotiation on your behalf.',
    features: [
      'Personalized Home Search',
      'Off-Market Opportunities',
      'Strong Negotiation Skills',
      'First-Time Buyer Support',
    ],
    linkLabel: 'Start Your Search',
    href: serviceChildPages[0].path,
    icon: House,
  },
  {
    title: 'Sell Your Home',
    description:
      "Maximize your home's value with accurate pricing, high-impact marketing, and a proven maximum-value strategy.",
    features: [
      'Accurate CMA Pricing',
      'High-Impact Marketing',
      'Professional Photography',
      'Max Value Strategy',
    ],
    linkLabel: 'Get a Free CMA',
    href: serviceChildPages[1].path,
    icon: BadgeDollarSign,
  },
  {
    title: 'Property Management',
    description:
      'Explore rental opportunities with a clearer view of leasing support, maintenance coordination, and day-to-day management expectations.',
    features: [
      'Rental Listings',
      'Leasing Support',
      'Maintenance Coordination',
      'Management Guidance',
    ],
    linkLabel: 'Learn More',
    href: serviceChildPages[2].path,
    icon: KeyRound,
  },
]

function ServicesSection() {
  return (
    <section className="services-section" id="services">
      <div className="services-section__inner">
        <header className="services-section__header">
          <p className="services-section__eyebrow">What We Do</p>
          <h2 className="services-section__title">
            Full-Service Real Estate, Simplified
          </h2>
          <p className="services-section__copy">
            From home search and sale prep to rental and management support,
            Siris Realty keeps the next step clear and practical.
          </p>
        </header>

        <div className="services-grid-react">
          {services.map((service) => {
            const Icon = service.icon

            return (
              <article className="service-card-react" key={service.title}>
                <div className="service-card-react__icon" aria-hidden="true">
                  <Icon size={34} strokeWidth={1.9} />
                </div>

                <h3 className="service-card-react__title">{service.title}</h3>
                <p className="service-card-react__description">
                  {service.description}
                </p>

                <ul className="service-card-react__features">
                  {service.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>

                <a className="service-card-react__link" href={service.href}>
                  {service.linkLabel} {'->'}
                </a>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection
