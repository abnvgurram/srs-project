import { BadgeDollarSign, House, KeyRound } from 'lucide-react'

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
    icon: BadgeDollarSign,
  },
  {
    title: 'Property Management',
    description:
      'Sit back and earn. We handle tenant placement, rent collection, maintenance, and full compliance for your rental.',
    features: [
      'Tenant Placement',
      'Rent Collection',
      'Maintenance & Compliance',
      'Landlord Consulting',
    ],
    linkLabel: 'Learn More',
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
            From your first home search to long-term property management, Siris
            Realty handles it all with expertise and care.
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

                <a className="service-card-react__link" href="#agent-section">
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
