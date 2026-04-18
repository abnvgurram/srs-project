import { useMemo, useState } from 'react'
import { propertyFilters } from '../../../data/properties.js'
import usePropertyListings from '../../../context/propertyListings/usePropertyListings.js'
import ListingCard from '../listingCard/ListingCard.jsx'
import PropertyDetailsModal from '../propertyDetailsModal/PropertyDetailsModal.jsx'
import './PropertiesSection.scss'

function PropertiesSection() {
  const [activeFilter, setActiveFilter] = useState('all')
  const [selectedProperty, setSelectedProperty] = useState(null)
  const { isLoading, propertyListings } = usePropertyListings()
  const publishedListings = useMemo(
    () => propertyListings.filter((property) => property.isPublished),
    [propertyListings],
  )

  const visibleProperties = useMemo(() => {
    if (activeFilter === 'all') return publishedListings
    return publishedListings.filter((property) => property.type === activeFilter)
  }, [activeFilter, publishedListings])

  return (
    <section className="properties-section" id="properties">
      <div className="properties-section__inner">
        <header className="properties-section__header">
          <p className="properties-section__eyebrow">Featured Properties</p>
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

        {isLoading ? (
          <div className="properties-section__status">Loading listings...</div>
        ) : visibleProperties.length ? (
          <div className="properties-grid">
            {visibleProperties.map((property) => (
              <ListingCard
                key={property.id}
                listing={property}
                onSelect={setSelectedProperty}
              />
            ))}
          </div>
        ) : (
          <div className="properties-section__status">
            No listings match this filter right now.
          </div>
        )}

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

      <PropertyDetailsModal
        key={selectedProperty?.id ?? 'property-details-modal'}
        listing={selectedProperty}
        onClose={() => setSelectedProperty(null)}
      />
    </section>
  )
}

export default PropertiesSection
