import { useMemo, useState } from 'react'
import Footer from '../../../components/Footer/Footer.jsx'
import Header from '../../../components/Header/Header.jsx'
import ListingCard from '../../../components/Properties/listingCard/ListingCard.jsx'
import PropertyDetailsModal from '../../../components/Properties/propertyDetailsModal/PropertyDetailsModal.jsx'
import usePropertyListings from '../../../context/propertyListings/usePropertyListings.js'
import useSiteSections from '../../../context/siteSections/useSiteSections.js'
import ServiceFaqAccordion from '../common/ServiceFaqAccordion.jsx'
import './BuyAHome.scss'

const buyerSteps = [
  {
    title: 'Start with a clear budget and timeline',
    copy:
      'Before tours begin, define your target payment range, financing readiness, move timeline, and non-negotiables so the search stays efficient.',
  },
  {
    title: 'Search with criteria that actually matters',
    copy:
      'The strongest searches are built around neighborhood fit, property condition, layout needs, and long-term usability, not just headline price.',
  },
  {
    title: 'Write offers with context, not guesswork',
    copy:
      'A competitive offer should reflect market pace, financing strength, contingencies, and the actual leverage available on that property.',
  },
]

const buyerFaqs = [
  {
    question: 'What should buyers do before they start touring seriously?',
    answer:
      'Start with the basics that shape every later decision: payment comfort, pre-approval readiness, timeline, preferred neighborhoods, and the features that are truly non-negotiable.',
  },
  {
    question: 'How should I compare multiple homes without getting overwhelmed?',
    answer:
      'Use the same decision framework on every showing. Layout, condition, location, resale strength, monthly carrying cost, and required updates should all be reviewed the same way each time.',
  },
  {
    question: 'What helps a buyer make a stronger offer in a competitive market?',
    answer:
      'Preparation and clarity. Buyers who understand their financing, know their walk-away points, and can recognize true fit quickly usually respond with better timing and fewer emotional mistakes.',
  },
]

function BuyAHome({ currentPath }) {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const { sectionVisibility } = useSiteSections()
  const { isLoading, propertyListings } = usePropertyListings()

  const visibleListings = useMemo(() => {
    return propertyListings.filter(
      (listing) => listing.isPublished && listing.type === 'buy',
    )
  }, [propertyListings])

  return (
    <div className="buy-home-page-shell">
      {sectionVisibility.header ? <Header currentPath={currentPath} /> : null}

      <main className="buy-home-page">
        <section className="buy-home-page__hero">
          <div className="buy-home-page__inner">
            <p className="buy-home-page__eyebrow">Buyer Services</p>
            <h1 className="buy-home-page__title">Buy A Home With a Sharper Search Strategy</h1>
            <p className="buy-home-page__summary">
              Buying a home goes better when the search is structured from the
              start. This page combines live listings with practical buyer
              guidance so you can compare options with more confidence and less
              wasted motion.
            </p>

            <div className="buy-home-page__actions">
              <a className="buy-home-page__primary" href="/#inquiry">
                Talk About Your Search
              </a>
            </div>
          </div>
        </section>

        <section className="buy-home-page__section">
          <div className="buy-home-page__inner buy-home-page__inner--split">
            <article className="buy-home-page__card">
              <p className="buy-home-page__card-label">Search Strategy</p>
              <h2>Clarity beats volume.</h2>
              <p>
                Buyers usually get better results when the search is narrowed by
                budget, location, layout, and long-term fit before the touring
                calendar fills up. That produces cleaner comparisons and more
                confident decisions. It also helps buyers avoid the usual trap
                of chasing every new listing without a real framework for what
                actually belongs on the shortlist. A smaller, better-qualified
                pool of homes usually leads to stronger decisions and less
                second-guessing once offers become real.
              </p>
            </article>

            <article className="buy-home-page__card">
              <p className="buy-home-page__card-label">Buyer Support</p>
              <h2>Search planning, financing readiness, and offer guidance.</h2>
              <p>
                A strong buying experience should help you understand what you
                can comfortably afford, where to focus, how to evaluate tradeoffs,
                and what it takes to move from touring into a competitive offer.
                That means looking beyond list price into monthly cost,
                condition, neighborhood momentum, resale strength, and the
                timing pressures of the current market so the final decision is
                based on fit and leverage, not just urgency.
              </p>
            </article>
          </div>
        </section>

        <section className="buy-home-page__section buy-home-page__section--soft">
          <div className="buy-home-page__inner">
            <div className="buy-home-page__section-head">
              <p className="buy-home-page__card-label">Available Properties</p>
            </div>

            {isLoading ? (
              <div className="buy-home-page__status">Loading buyer listings...</div>
            ) : visibleListings.length ? (
              <div className="buy-home-page__grid">
                {visibleListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={setSelectedProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="buy-home-page__status">
                No published sale listings are available right now.
              </div>
            )}

            <div className="buy-home-page__listing-actions">
              <a
                className="buy-home-page__listing-button"
                href="https://www.zillow.com/profile/Vijay-Kanth"
                target="_blank"
                rel="noreferrer"
              >
                View All Listings on Zillow {'->'}
              </a>
              <a
                className="buy-home-page__listing-button"
                href="https://www.homes.com/real-estate-agents/vijay-kanth/q4872hy"
                target="_blank"
                rel="noreferrer"
              >
                View All Listings on Homes.com {'->'}
              </a>
            </div>
          </div>
        </section>

        <section className="buy-home-page__section">
          <div className="buy-home-page__inner">
            <div className="buy-home-page__section-head">
              <p className="buy-home-page__card-label">Buyer Process</p>
              <h2>A cleaner decision flow for the home search.</h2>
            </div>

            <div className="buy-home-page__steps">
              {buyerSteps.map((step, index) => (
                <article className="buy-home-page__step" key={step.title}>
                  <span className="buy-home-page__step-number">0{index + 1}</span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="buy-home-page__section buy-home-page__section--soft">
          <div className="buy-home-page__inner">
            <div className="buy-home-page__section-head">
              <p className="buy-home-page__card-label">FAQ</p>
            </div>

            <ServiceFaqAccordion items={buyerFaqs} />
          </div>
        </section>
      </main>

      <PropertyDetailsModal
        key={selectedProperty?.id ?? 'buy-a-home-property-modal'}
        listing={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {sectionVisibility.footer ? <Footer currentPath={currentPath} /> : null}
    </div>
  )
}

export default BuyAHome
