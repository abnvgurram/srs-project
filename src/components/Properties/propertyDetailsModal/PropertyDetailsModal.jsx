import { useEffect, useId, useState } from 'react'
import {
  Bath,
  BedDouble,
  ChevronLeft,
  ChevronRight,
  Image,
  MapPin,
  Ruler,
  X,
} from 'lucide-react'
import {
  orderPropertyImages,
  splitPropertyPrice,
} from '../../../data/properties.js'
import './PropertyDetailsModal.scss'

function PropertyDetailsModal({ listing, onClose }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState([])
  const titleId = useId()

  useEffect(() => {
    if (!listing) return undefined

    const previousOverflow = document.body.style.overflow

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [listing, onClose])

  const safeImages = Array.isArray(listing?.imageUrls)
    ? orderPropertyImages(listing.imageUrls, listing.coverImageIndex).filter(
        (imageUrl) => typeof imageUrl === 'string' && imageUrl.trim(),
      )
    : []

  const availableImages = safeImages.filter(
    (imageUrl) => !failedImages.includes(imageUrl),
  )

  const photoCount = availableImages.length
  const currentIndex =
    availableImages[activeIndex] !== undefined ? activeIndex : 0
  const currentImage = availableImages[currentIndex] ?? ''
  const {
    amount: priceAmount,
    prefix: pricePrefix,
    suffix: priceSuffix,
  } = splitPropertyPrice(
    listing?.price,
    listing?.type,
  )
  const mapsUrl = listing?.address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`
    : ''

  if (!listing) return null

  function handleBackdropClick(event) {
    if (event.target === event.currentTarget) {
      onClose()
    }
  }

  function goToIndex(nextIndex) {
    setActiveIndex(Math.max(0, Math.min(nextIndex, photoCount - 1)))
  }

  function handleImageError() {
    const failedUrl = availableImages[currentIndex]

    if (!failedUrl) return

    setFailedImages((currentFailedImages) =>
      currentFailedImages.includes(failedUrl)
        ? currentFailedImages
        : [...currentFailedImages, failedUrl],
    )
    setActiveIndex(0)
  }

  return (
    <div
      className="property-details-modal"
      role="presentation"
      onClick={handleBackdropClick}
    >
      <div
        className="property-details-modal__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <button
          className="property-details-modal__close"
          type="button"
          aria-label="Close property details"
          onClick={onClose}
        >
          <X aria-hidden="true" size={18} strokeWidth={2.2} />
        </button>

        <div className="property-details-modal__media">
          <div className="property-details-modal__image-wrap">
            {currentImage ? (
              <img
                className="property-details-modal__image"
                src={currentImage}
                alt={`${listing.address} ${currentIndex + 1}`}
                onError={handleImageError}
              />
            ) : (
              <div className="property-details-modal__fallback" aria-hidden="true">
                <Image size={48} strokeWidth={1.8} />
              </div>
            )}

            {photoCount > 1 ? (
              <div className="property-details-modal__gallery-ui">
                <button
                  className="property-details-modal__arrow"
                  type="button"
                  onClick={() => goToIndex(currentIndex - 1)}
                  disabled={currentIndex === 0}
                  aria-label="Previous property photo"
                >
                  <ChevronLeft size={18} />
                </button>

                <span className="property-details-modal__count">
                  {currentIndex + 1} / {photoCount}
                </span>

                <button
                  className="property-details-modal__arrow"
                  type="button"
                  onClick={() => goToIndex(currentIndex + 1)}
                  disabled={currentIndex === photoCount - 1}
                  aria-label="Next property photo"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            ) : null}
          </div>

          {photoCount > 1 ? (
            <div
              className="property-details-modal__thumbs"
              aria-label="Property gallery thumbnails"
            >
              {availableImages.map((imageUrl, index) => (
                <button
                  key={`${listing.id}-thumb-${index}`}
                  className={
                    index === currentIndex
                      ? 'property-details-modal__thumb is-active'
                      : 'property-details-modal__thumb'
                  }
                  type="button"
                  onClick={() => goToIndex(index)}
                  aria-label={`Show property photo ${index + 1}`}
                >
                  <img src={imageUrl} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="property-details-modal__content">
          <span
            className={`property-details-modal__badge property-details-modal__badge--${listing.badgeVariant}`}
          >
            {listing.badge}
          </span>

          <h2 className="property-details-modal__price" id={titleId}>
            {pricePrefix ? (
              <>
                <span className="property-details-modal__price-prefix">
                  {pricePrefix}
                </span>
                <span className="property-details-modal__price-value">
                  <span>{priceAmount}</span>
                  {priceSuffix ? (
                    <span className="property-details-modal__price-suffix">
                      {priceSuffix}
                    </span>
                  ) : null}
                </span>
              </>
            ) : (
              listing.price
            )}
          </h2>

          <a
            className="property-details-modal__address"
            href={mapsUrl || undefined}
            target="_blank"
            rel="noreferrer"
          >
            <MapPin aria-hidden="true" size={16} strokeWidth={2.1} />
            <span>{listing.address}</span>
          </a>

          <div className="property-details-modal__stats">
            <span className="property-details-modal__stat">
              <BedDouble aria-hidden="true" size={16} strokeWidth={2.1} />
              <span>{listing.beds ? `${listing.beds} Beds` : '- Beds'}</span>
            </span>
            <span className="property-details-modal__stat">
              <Bath aria-hidden="true" size={16} strokeWidth={2.1} />
              <span>{listing.baths ? `${listing.baths} Baths` : '- Baths'}</span>
            </span>
            <span className="property-details-modal__stat">
              <Ruler aria-hidden="true" size={16} strokeWidth={2.1} />
              <span>{listing.size || '- sqft'}</span>
            </span>
          </div>

          <div className="property-details-modal__copy">
            <h3 className="property-details-modal__copy-title">Overview</h3>

            <div className="property-details-modal__copy-body">
              <p className="property-details-modal__description">
                {listing.description || 'Property details will be updated soon.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetailsModal
