import { useMemo, useState } from 'react'
import Footer from '../../../components/Footer/Footer.jsx'
import Header from '../../../components/Header/Header.jsx'
import ListingCard from '../../../components/Properties/listingCard/ListingCard.jsx'
import PropertyDetailsModal from '../../../components/Properties/propertyDetailsModal/PropertyDetailsModal.jsx'
import usePropertyListings from '../../../context/propertyListings/usePropertyListings.js'
import useSiteSections from '../../../context/siteSections/useSiteSections.js'
import ServiceFaqAccordion from '../common/ServiceFaqAccordion.jsx'
import './BuyAHome.scss'

const listingFilters = [
  { label: 'All', value: 'all' },
  { label: 'For Sale', value: 'buy' },
  { label: 'For Rent', value: 'rent' },
]

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
    question: 'Why are both for-sale and rental properties shown here?',
    answer:
      'Not every visitor is ready to purchase immediately. Showing both options keeps this page useful for people comparing neighborhoods, timing, and budget before making a final decision.',
  },
  {
    question: 'What should buyers have in place before touring seriously?',
    answer:
      'A realistic budget, a lender conversation, and a clear list of must-haves versus nice-to-haves. That usually prevents the search from drifting.',
  },
  {
    question: 'What makes a buyer strategy stronger in a competitive market?',
    answer:
      'Preparation. Buyers who understand their limits, know their preferred areas, and can compare homes consistently usually make better decisions under pressure.',
  },
]

function BuyAHome({ currentPath }) {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const { sectionVisibility } = useSiteSections()
  const { isLoading, propertyListings } = usePropertyListings()

  const visibleListings = useMemo(() => {
    const filteredListings = propertyListings.filter(
      (listing) =>
        listing.isPublished && (listing.type === 'buy' || listing.type === 'rent'),
    )

    if (activeFilter === 'all') return filteredListings

    return filteredListings.filter((listing) => listing.type === activeFilter)
  }, [activeFilter, propertyListings])

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
                confident decisions.
              </p>
            </article>

            <article className="buy-home-page__card">
              <p className="buy-home-page__card-label">Buyer Support</p>
              <h2>Search planning, financing readiness, and offer guidance.</h2>
              <p>
                A strong buying experience should help you understand what you
                can comfortably afford, where to focus, how to evaluate tradeoffs,
                and what it takes to move from touring into a competitive offer.
              </p>
            </article>
          </div>
        </section>

        <section className="buy-home-page__section buy-home-page__section--soft">
          <div className="buy-home-page__inner">
            <div className="buy-home-page__section-head">
              <p className="buy-home-page__card-label">Available Properties</p>
              <h2>Published properties tagged for sale or for rent.</h2>
            </div>

            <div className="buy-home-page__filters" role="tablist" aria-label="Buyer listing filters">
              {listingFilters.map((filter) => (
                <button
                  className={`buy-home-page__filter${
                    activeFilter === filter.value ? ' is-active' : ''
                  }`}
                  key={filter.value}
                  type="button"
                  onClick={() => setActiveFilter(filter.value)}
                >
                  {filter.label}
                </button>
              ))}
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
                No published sale or rent listings are available right now.
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
