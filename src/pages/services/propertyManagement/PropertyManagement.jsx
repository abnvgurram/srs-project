import { useMemo, useState } from 'react'
import Footer from '../../../components/Footer/Footer.jsx'
import Header from '../../../components/Header/Header.jsx'
import ListingCard from '../../../components/Properties/listingCard/ListingCard.jsx'
import PropertyDetailsModal from '../../../components/Properties/propertyDetailsModal/PropertyDetailsModal.jsx'
import usePropertyListings from '../../../context/propertyListings/usePropertyListings.js'
import useSiteSections from '../../../context/siteSections/useSiteSections.js'
import ServiceFaqAccordion from '../common/ServiceFaqAccordion.jsx'
import './PropertyManagement.scss'

const managementSteps = [
  {
    title: 'Review available rentals with clear criteria',
    copy:
      'Focus first on budget, lease timing, neighborhood fit, pet or parking requirements, and the day-to-day needs that will matter after move-in.',
  },
  {
    title: 'Prepare your documents before applying',
    copy:
      'Applications move faster when income documentation, identification, rental history, and timing details are already in order.',
  },
  {
    title: 'Move in with clearer expectations',
    copy:
      'Good property management should make the next step more organized by setting expectations around communication, maintenance handling, and the move-in process.',
  },
]

const managementFaqs = [
  {
    question: 'What should I focus on when comparing rental properties?',
    answer:
      'Look at the full fit, not just the monthly rent. Location, lease term, utility responsibilities, commute, condition, and daily livability all matter.',
  },
  {
    question: 'What should applicants have ready before submitting a rental application?',
    answer:
      'It helps to have identification, proof of income, recent pay information, rental history, and timing details prepared in advance so the process stays efficient.',
  },
  {
    question: 'How does professional property management help residents and owners?',
    answer:
      'It creates a clearer system for communication, maintenance coordination, lease administration, and day-to-day accountability instead of relying on ad hoc follow-up.',
  },
]

function PropertyManagement({ currentPath }) {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const { sectionVisibility } = useSiteSections()
  const { isLoading, propertyListings } = usePropertyListings()

  const visibleListings = useMemo(
    () =>
      propertyListings.filter(
        (listing) => listing.isPublished && listing.type === 'rent',
      ),
    [propertyListings],
  )

  return (
    <div className="property-management-page-shell">
      {sectionVisibility.header ? <Header currentPath={currentPath} /> : null}

      <main className="property-management-page">
        <section className="property-management-page__hero">
          <div className="property-management-page__inner">
            <p className="property-management-page__eyebrow">Property Management</p>
            <h1 className="property-management-page__title">
              Rental Opportunities Backed by Clearer Property Management Support
            </h1>
            <p className="property-management-page__summary">
              Explore currently published rental properties while getting a
              clearer picture of how responsive management, organized leasing,
              and structured communication can improve the experience for both
              residents and owners.
            </p>

            <div className="property-management-page__actions">
              <a className="property-management-page__primary" href="/#inquiry">
                Ask About Property Management
              </a>
            </div>
          </div>
        </section>

        <section className="property-management-page__section">
          <div className="property-management-page__inner property-management-page__inner--split">
            <article className="property-management-page__card">
              <p className="property-management-page__card-label">Rental Search</p>
              <h2>Clarity matters before the application starts.</h2>
              <p>
                Rental decisions go better when the search is grounded in real
                monthly comfort, neighborhood fit, lease timing, and the
                details that shape daily living. A more focused search usually
                leads to better applications and fewer avoidable surprises after
                move-in.
              </p>
            </article>

            <article className="property-management-page__card">
              <p className="property-management-page__card-label">Management Support</p>
              <h2>Good management should feel organized, responsive, and clear.</h2>
              <p>
                Whether you are a prospective resident or an owner reviewing
                rental opportunities, the process works better when maintenance
                expectations, communication flow, and leasing steps are defined
                upfront instead of handled reactively.
              </p>
            </article>
          </div>
        </section>

        <section className="property-management-page__section property-management-page__section--soft">
          <div className="property-management-page__inner">
            <div className="property-management-page__section-head">
              <p className="property-management-page__card-label">Available Rental Properties</p>
            </div>

            {isLoading ? (
              <div className="property-management-page__status">
                Loading rental listings...
              </div>
            ) : visibleListings.length ? (
              <div className="property-management-page__grid">
                {visibleListings.map((listing) => (
                  <ListingCard
                    key={listing.id}
                    listing={listing}
                    onSelect={setSelectedProperty}
                  />
                ))}
              </div>
            ) : (
              <div className="property-management-page__status">
                No published rental listings are available right now.
              </div>
            )}

            <div className="property-management-page__listing-actions">
              <a
                className="property-management-page__listing-button"
                href="https://www.zillow.com/profile/Vijay-Kanth"
                target="_blank"
                rel="noreferrer"
              >
                View All Listings on Zillow {'->'}
              </a>
              <a
                className="property-management-page__listing-button"
                href="https://www.homes.com/real-estate-agents/vijay-kanth/q4872hy"
                target="_blank"
                rel="noreferrer"
              >
                View All Listings on Homes.com {'->'}
              </a>
            </div>
          </div>
        </section>

        <section className="property-management-page__section">
          <div className="property-management-page__inner">
            <div className="property-management-page__section-head">
              <p className="property-management-page__card-label">Rental Process</p>
              <h2>A cleaner flow from search to move-in.</h2>
            </div>

            <div className="property-management-page__steps">
              {managementSteps.map((step, index) => (
                <article className="property-management-page__step" key={step.title}>
                  <span className="property-management-page__step-number">
                    0{index + 1}
                  </span>
                  <h3>{step.title}</h3>
                  <p>{step.copy}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="property-management-page__section property-management-page__section--soft">
          <div className="property-management-page__inner">
            <div className="property-management-page__section-head">
              <p className="property-management-page__card-label">FAQ</p>
            </div>

            <ServiceFaqAccordion items={managementFaqs} />
          </div>
        </section>
      </main>

      <PropertyDetailsModal
        key={selectedProperty?.id ?? 'property-management-property-modal'}
        listing={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />

      {sectionVisibility.footer ? <Footer currentPath={currentPath} /> : null}
    </div>
  )
}

export default PropertyManagement
