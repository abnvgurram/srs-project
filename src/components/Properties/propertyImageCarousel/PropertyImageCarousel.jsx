import { useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight, Image } from 'lucide-react'
import './PropertyImageCarousel.scss'

function PropertyImageCarousel({ alt, className = '', images, size = 'default' }) {
  const safeImages = useMemo(
    () =>
      Array.isArray(images)
        ? images.filter((imageUrl) => typeof imageUrl === 'string' && imageUrl.trim())
        : [],
    [images],
  )
  const [activeIndex, setActiveIndex] = useState(0)
  const [failedImages, setFailedImages] = useState([])

  const availableImages = useMemo(
    () => safeImages.filter((imageUrl) => !failedImages.includes(imageUrl)),
    [failedImages, safeImages],
  )
  const hasMultipleImages = availableImages.length > 1
  const currentIndex = availableImages[activeIndex] !== undefined ? activeIndex : 0

  function showPreviousImage(event) {
    event?.stopPropagation?.()
    setActiveIndex((currentValue) =>
      availableImages[currentValue] === undefined
        ? 0
        : currentValue === 0
          ? availableImages.length - 1
          : currentValue - 1,
    )
  }

  function showNextImage(event) {
    event?.stopPropagation?.()
    setActiveIndex((currentValue) =>
      availableImages[currentValue] === undefined
        ? 0
        : currentValue === availableImages.length - 1
          ? 0
          : currentValue + 1,
    )
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

  if (!availableImages.length) {
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
        src={availableImages[currentIndex]}
        alt={alt}
        loading="lazy"
        onError={handleImageError}
      />

      {hasMultipleImages ? (
        <div className="property-image-carousel__controls">
          <span className="property-image-carousel__count">
            {currentIndex + 1} / {availableImages.length}
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
