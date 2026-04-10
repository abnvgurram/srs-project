import { useMemo, useState } from 'react'
import { propertyFilters, propertyListings } from '../data/properties.js'
import ListingCard from './ListingCard.jsx'

function PropertiesSection() {
  const [activeFilter, setActiveFilter] = useState('all')

  const visibleProperties = useMemo(() => {
    if (activeFilter === 'all') return propertyListings
    return propertyListings.filter((property) => property.type === activeFilter)
  }, [activeFilter])

  return (
    <section className="properties-section" id="properties">
      <div className="properties-section__inner">
        <header className="properties-section__header">
          <p className="properties-section__eyebrow">Featured Listings</p>
          <h2 className="properties-section__title">Properties For You</h2>
          <p className="properties-section__copy">
            Browse active listings, recently sold, and rental properties in the
            Richmond metro area.
          </p>
        </header>

        <div
          className="properties-section__filters"
          role="tablist"
          aria-label="Property filters"
        >
          {propertyFilters.map((filter) => (
            <button
              key={filter.value}
              className={`properties-filter${
                activeFilter === filter.value ? ' is-active' : ''
              }`}
              type="button"
              onClick={() => setActiveFilter(filter.value)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <div className="properties-grid">
          {visibleProperties.map((property) => (
            <ListingCard key={property.id} listing={property} />
          ))}
        </div>

        <div className="properties-section__actions">
          <a
            className="properties-section__button"
            href="https://www.zillow.com/profile/Vijay-Kanth"
            target="_blank"
            rel="noreferrer"
          >
            View All Listings on Zillow {'->'}
          </a>
          <a
            className="properties-section__button"
            href="https://www.homes.com/real-estate-agents/vijay-kanth/q4872hy"
            target="_blank"
            rel="noreferrer"
          >
            View All Listings on Homes.com {'->'}
          </a>
        </div>
      </div>
    </section>
  )
}

export default PropertiesSection
