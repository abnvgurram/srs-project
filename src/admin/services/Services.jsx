import './Services.scss'

const services = ['Buy a Home', 'Sell Your Home', 'Property Management']

function Services() {
  return (
    <div className="services-admin-section">
      <div className="services-admin-section__header">
        <p className="services-admin-section__eyebrow">Services</p>
        <h2 className="services-admin-section__title">Service Cards</h2>
        <p className="services-admin-section__copy">
          Service ordering, card text, feature bullets, and CTA labels will be
          managed in this section.
        </p>
      </div>

      <div className="services-admin-section__grid">
        {services.map((service) => (
          <article className="services-admin-section__card" key={service}>
            <h3>{service}</h3>
            <p>
              Placeholder for description, bullet list, icon mapping, and action
              link settings.
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Services
