import { useState } from 'react'
import { ChevronLeft, ChevronRight, Image } from 'lucide-react'
import './PropertyImageCarousel.scss'

function PropertyImageCarousel({
  alt,
  className = '',
  images,
  size = 'default',
}) {
  const safeImages = Array.isArray(images)
    ? images.filter((imageUrl) => typeof imageUrl === 'string' && imageUrl.trim())
    : []
  const [activeIndex, setActiveIndex] = useState(0)
  const hasMultipleImages = safeImages.length > 1
  const currentIndex =
    safeImages[activeIndex] !== undefined ? activeIndex : 0

  function showPreviousImage(event) {
    event?.stopPropagation?.()
    setActiveIndex((currentIndex) =>
      safeImages[currentIndex] === undefined
        ? 0
        : currentIndex === 0
          ? safeImages.length - 1
          : currentIndex - 1,
    )
  }

  function showNextImage(event) {
    event?.stopPropagation?.()
    setActiveIndex((currentIndex) =>
      safeImages[currentIndex] === undefined
        ? 0
        : currentIndex === safeImages.length - 1
          ? 0
          : currentIndex + 1,
    )
  }

  if (!safeImages.length) {
    return (
      <div
        className={`property-image-carousel property-image-carousel--${size} property-image-carousel--fallback ${className}`.trim()}
      >
        <div className="property-image-carousel__fallback" aria-hidden="true">
          <Image size={size === 'compact' ? 28 : 40} strokeWidth={1.9} />
        </div>
      </div>
    )
  }

  return (
    <div className={`property-image-carousel property-image-carousel--${size} ${className}`.trim()}>
      <img
        className="property-image-carousel__image"
        src={safeImages[currentIndex]}
        alt={alt}
        loading="lazy"
      />

      {hasMultipleImages ? (
        <div className="property-image-carousel__controls">
          <span className="property-image-carousel__count">
            {currentIndex + 1} / {safeImages.length}
          </span>

          <div className="property-image-carousel__actions">
            <button
              className="property-image-carousel__button"
              type="button"
              aria-label="Previous image"
              onClick={showPreviousImage}
            >
              <ChevronLeft aria-hidden="true" size={16} strokeWidth={2.2} />
            </button>

            <button
              className="property-image-carousel__button"
              type="button"
              aria-label="Next image"
              onClick={showNextImage}
            >
              <ChevronRight aria-hidden="true" size={16} strokeWidth={2.2} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default PropertyImageCarousel
