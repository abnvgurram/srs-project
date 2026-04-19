import Header from '../../../components/Header/Header.jsx'
import Footer from '../../../components/Footer/Footer.jsx'
import useSiteSections from '../../../context/siteSections/useSiteSections.js'
import { serviceChildPages } from '../../../data/servicePages.js'
import ServiceFaqAccordion from '../common/ServiceFaqAccordion.jsx'
import './Services.scss'

const serviceCards = [
  {
    path: '/services/buy-a-home',
    title: 'Buy A Home',
    description:
      'Get clear guidance on financing readiness, neighborhood fit, touring strategy, and confident offer-making.',
    highlights: ['Search plan', 'Offer support', 'Closing guidance'],
  },
  {
    path: '/services/sell-your-home',
    title: 'Sell Your Home',
    description:
      'Position your listing for stronger offers with sharper pricing, better presentation, and disciplined negotiation.',
    highlights: ['Pricing strategy', 'Launch plan', 'Negotiation support'],
  },
  {
    path: '/services/property-management',
    title: 'Property Management',
    description:
      'Browse rental opportunities and understand how leasing support, maintenance coordination, and property oversight should work in practice.',
    highlights: ['Rental listings', 'Leasing support', 'Management clarity'],
  },
]

const serviceFaqs = [
  {
    question: 'Do I start here if I am not sure which service I need yet?',
    answer:
      'Yes. This page is the overview. From here you can move into the buyer, seller, or property management path depending on what decision you are making next.',
  },
  {
    question: 'Why break the services into separate pages?',
    answer:
      'Each service comes with different questions. Buyers want search and offer guidance, sellers want pricing and launch strategy, and rental or management clients want leasing, maintenance, and oversight clarity.',
  },
  {
    question: 'What should I expect from Siris Realty Group across all services?',
    answer:
      'A practical process, clear communication, and guidance that stays tied to the actual goal, whether that is moving into a home, selling well, or managing an investment property responsibly.',
  },
]

function Services({ currentPath }) {
  const { sectionVisibility } = useSiteSections()

  return (
    <div className="services-page-shell">
      {sectionVisibility.header ? <Header currentPath={currentPath} /> : null}

      <main className="services-page">
        <section className="services-page__hero">
          <div className="services-page__inner">
            <p className="services-page__eyebrow">Services</p>
            <h1 className="services-page__title">
              Real Estate Support Built Around the Decision You Need to Make Next
            </h1>
            <p className="services-page__summary">
              Whether you are preparing to buy, planning a sale, or looking for
              support managing an investment property, this page gives you a
              direct starting point. Each service has its own landing page so
              you can move quickly into the information that fits your goal.
            </p>

            <div className="services-page__actions">
              <a className="services-page__primary" href="/#inquiry">
                Start a Conversation
              </a>
              <a className="services-page__secondary" href="/">
                Back to Home
              </a>
            </div>
          </div>
        </section>

        <section className="services-page__section">
          <div className="services-page__inner">
            <div className="services-page__section-head">
              <p className="services-page__section-label">Core Services</p>
              <h2>Choose the path that matches your current goal.</h2>
              <p>
                Buyers, sellers, and landlords do not need the same answers.
                These service pages are designed to keep the message focused,
                reduce navigation friction, and make the next step easier to
                understand.
              </p>
            </div>

            <div className="services-page__grid">
              {serviceCards.map((card) => (
                <a className="services-page__card" href={card.path} key={card.path}>
                  <span className="services-page__card-title">
                    {card.title}
                  </span>
                  <span className="services-page__card-copy">
                    {card.description}
                  </span>
                  <div className="services-page__card-tags">
                    {card.highlights.map((highlight) => (
                      <span key={highlight}>{highlight}</span>
                    ))}
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="services-page__section services-page__section--soft">
          <div className="services-page__inner services-page__inner--split">
            <article className="services-page__content-card">
              <p className="services-page__section-label">What Visitors Need</p>
              <h2>Focused pages are easier to trust and easier to use.</h2>
              <p>
                A buyer should not have to sort through seller messaging, and a
                property owner should not have to dig through home-search copy.
                Clear service paths help visitors find the right information
                without wasting time.
              </p>
            </article>

            <article className="services-page__content-card">
              <p className="services-page__section-label">How We Work</p>
              <h2>Strategy first, then a cleaner execution plan.</h2>
              <p>
                Good real estate service is not just about access. It is about
                helping clients move through decisions with better structure,
                better communication, and fewer avoidable surprises along the
                way.
              </p>
            </article>
          </div>
        </section>

        <section className="services-page__section">
          <div className="services-page__inner">
            <div className="services-page__section-head">
              <p className="services-page__section-label">FAQ</p>
            </div>

            <ServiceFaqAccordion items={serviceFaqs} />

            <div className="services-page__jump-links">
              {serviceChildPages.map((page) => (
                <a href={page.path} key={page.key}>
                  Go to {page.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>

      {sectionVisibility.footer ? <Footer currentPath={currentPath} /> : null}
    </div>
  )
}

export default Services
