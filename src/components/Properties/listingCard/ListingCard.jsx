import { Bath, BedDouble, MapPin, Ruler } from 'lucide-react'
import {
  orderPropertyImages,
  splitPropertyPrice,
} from '../../../data/properties.js'
import PropertyImageCarousel from '../propertyImageCarousel/PropertyImageCarousel.jsx'
import './ListingCard.scss'

function ListingCard({ listing, onSelect }) {
  const images = orderPropertyImages(listing.imageUrls, listing.coverImageIndex)
  const isInteractive = typeof onSelect === 'function'
  const title = listing.streetAddress || listing.address || 'Property Listing'
  const {
    amount: priceAmount,
    prefix: pricePrefix,
    suffix: priceSuffix,
  } = splitPropertyPrice(
    listing.price,
    listing.type,
  )

  function handleViewDetails(event) {
    event.preventDefault()
    event.stopPropagation()

    if (isInteractive) {
      onSelect(listing)
    }
  }

  return (
    <article className={`listing-card${isInteractive ? ' is-interactive' : ''}`}>
      <div className="listing-card__visual">
        <PropertyImageCarousel
          alt={listing.address}
          images={images}
          size="default"
        />
        <span className={`listing-card__badge listing-card__badge--${listing.badgeVariant}`}>
          {listing.badge}
        </span>
      </div>

      <div className="listing-card__body">
        <div className="listing-card__meta">
          <h3 className="listing-card__title">{title}</h3>
          <p className="listing-card__address">
            <MapPin size={14} />
            <span>{listing.address}</span>
          </p>
        </div>

        <p className="listing-card__price">
          {pricePrefix ? (
            <>
              <span className="listing-card__price-prefix">{pricePrefix}</span>
              <span className="listing-card__price-value">
                <span>{priceAmount}</span>
                {priceSuffix ? (
                  <span className="listing-card__price-suffix">{priceSuffix}</span>
                ) : null}
              </span>
            </>
          ) : (
            listing.price
          )}
        </p>

        <div className="listing-card__stats">
          <span className="listing-card__stat">
            <BedDouble size={14} />
            <span>{listing.beds || '-'}</span>
          </span>
          <span className="listing-card__stat">
            <Bath size={14} />
            <span>{listing.baths || '-'}</span>
          </span>
          <span className="listing-card__stat">
            <Ruler size={14} />
            <span>{listing.size || '- sqft'}</span>
          </span>
        </div>
      </div>

      {isInteractive ? (
        <div className="listing-card__footer">
          <button
            className="listing-card__view"
            type="button"
            onClick={handleViewDetails}
          >
            View Details
          </button>
        </div>
      ) : null}
    </article>
  )
}

export default ListingCard
