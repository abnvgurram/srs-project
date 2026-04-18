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
  const {
    amount: priceAmount,
    prefix: pricePrefix,
    suffix: priceSuffix,
  } = splitPropertyPrice(
    listing.price,
    listing.type,
  )

  function handleKeyDown(event) {
    if (!isInteractive) return

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onSelect(listing)
    }
  }

  return (
    <article
      className={`listing-card${isInteractive ? ' is-interactive' : ''}`}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      onClick={isInteractive ? () => onSelect(listing) : undefined}
      onKeyDown={handleKeyDown}
    >
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
        <p className="listing-card__address">
          <MapPin size={14} />
          <span>{listing.address}</span>
        </p>

        <div className="listing-card__stats">
          <span className="listing-card__stat">
            <BedDouble size={14} />
            <span>{listing.beds ? `${listing.beds} Beds` : '- Beds'}</span>
          </span>
          <span className="listing-card__stat">
            <Bath size={14} />
            <span>{listing.baths ? `${listing.baths} Baths` : '- Baths'}</span>
          </span>
          <span className="listing-card__stat">
            <Ruler size={14} />
            <span>{listing.size || '- sqft'}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default ListingCard
