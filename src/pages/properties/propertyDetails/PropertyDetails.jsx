import { useEffect, useMemo, useState } from 'react'
import { Bath, BedDouble, Image, MapPin, Ruler } from 'lucide-react'
import Footer from '../../../components/Footer/Footer.jsx'
import Header from '../../../components/Header/Header.jsx'
import ListingCard from '../../../components/Properties/listingCard/ListingCard.jsx'
import {
  getPropertyIdFromPath,
  getPropertyPath,
  getPropertySlug,
  orderPropertyImages,
  splitPropertyPrice,
} from '../../../data/properties.js'
import usePropertyListings from '../../../context/propertyListings/usePropertyListings.js'
import useSiteSections from '../../../context/siteSections/useSiteSections.js'
import { navigateToPath } from '../../../utils/siteNavigation.js'
import './PropertyDetails.scss'

function PropertyDetailContent({ listing, propertyListings }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const title = listing?.streetAddress || listing?.address || 'Property Listing'

  const orderedImages = useMemo(
    () => orderPropertyImages(listing.imageUrls, listing.coverImageIndex),
    [listing],
  )

  const safeImages = useMemo(
    () => orderedImages.filter((imageUrl) => typeof imageUrl === 'string' && imageUrl.trim()),
    [orderedImages],
  )

  const galleryTiles = safeImages.slice(1, 5)
  const activeImage = safeImages[activeImageIndex] ?? safeImages[0] ?? ''
  const detailRows = [
    { label: 'Offer Type', value: listing.badge },
    { label: 'Status', value: listing.isPublished ? 'Published' : 'Draft' },
    { label: 'Price', value: listing.price || 'TBD' },
    { label: 'Address', value: listing.address || 'Not provided' },
    { label: 'Bedrooms', value: listing.beds || '-' },
    { label: 'Bathrooms', value: listing.baths || '-' },
    { label: 'Property Size', value: listing.size || '-' },
  ]
  const {
    amount: priceAmount,
    prefix: pricePrefix,
    suffix: priceSuffix,
  } = splitPropertyPrice(listing.price, listing.type)
  const similarProperties = useMemo(() => {
    const sameType = propertyListings.filter(
      (property) =>
        property.isPublished &&
        property.id !== listing.id &&
        property.type === listing.type,
    )
    const otherPublished = propertyListings.filter(
      (property) =>
        property.isPublished &&
        property.id !== listing.id &&
        property.type !== listing.type,
    )

    return [...sameType, ...otherPublished].slice(0, 3)
  }, [listing, propertyListings])

  return (
    <>
      <div className="property-detail-page__hero-head">
        <div className="property-detail-page__hero-copy">
          <h1>{title}</h1>
          <div className="property-detail-page__hero-location">
            <p className="property-detail-page__hero-address">
              <MapPin size={14} />
              <span>{listing.address}</span>
            </p>
            <a
              className="property-detail-page__hero-map-link"
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(listing.address)}`}
              target="_blank"
              rel="noreferrer"
            >
              View On Map
            </a>
          </div>
        </div>

        <p className="property-detail-page__hero-price">
          {pricePrefix ? (
            <>
              <span className="property-detail-page__hero-price-prefix">
                {pricePrefix}
              </span>
              <span className="property-detail-page__hero-price-value">
                <span>{priceAmount}</span>
                {priceSuffix ? (
                  <span className="property-detail-page__hero-price-suffix">
                    {priceSuffix}
                  </span>
                ) : null}
              </span>
            </>
          ) : (
            listing.price
          )}
        </p>
      </div>

      <div className="property-detail-page__layout">
        <div className="property-detail-page__main">
          <section className="property-detail-page__gallery">
            <div className="property-detail-page__gallery-main">
              <span
                className={`property-detail-page__badge property-detail-page__badge--${listing.badgeVariant}`}
              >
                {listing.badge}
              </span>

              {activeImage ? (
                <img src={activeImage} alt={listing.address} />
              ) : (
                <div className="property-detail-page__gallery-fallback">
                  <Image size={44} />
                </div>
              )}
            </div>

            <div className="property-detail-page__gallery-side">
              {galleryTiles.map((imageUrl, index) => {
                const imageIndex = index + 1

                return (
                  <button
                    key={`${listing.id}-gallery-${imageIndex}`}
                    className="property-detail-page__gallery-thumb"
                    type="button"
                    onClick={() => setActiveImageIndex(imageIndex)}
                  >
                    <img src={imageUrl} alt="" />
                  </button>
                )
              })}
            </div>
          </section>

          <section className="property-detail-page__facts">
            <span className="property-detail-page__fact">
              <span>{listing.badge}</span>
              <small>Offer Type</small>
            </span>
            <span className="property-detail-page__fact">
              <BedDouble size={16} />
              <span>{listing.beds || '-'}</span>
              <small>Bedrooms</small>
            </span>
            <span className="property-detail-page__fact">
              <Bath size={16} />
              <span>{listing.baths || '-'}</span>
              <small>Bathrooms</small>
            </span>
            <span className="property-detail-page__fact">
              <Ruler size={16} />
              <span>{listing.size || '-'}</span>
              <small>Property Size</small>
            </span>
          </section>

          <section className="property-detail-page__panel">
            <h2>Description</h2>
            <div className="property-detail-page__description">
              <p>{listing.description || 'Property details will be updated soon.'}</p>
            </div>
          </section>

          <section className="property-detail-page__panel">
            <h2>Details</h2>
            <div className="property-detail-page__details-grid">
              {detailRows.map((item) => (
                <div className="property-detail-page__detail-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
          </section>

          {similarProperties.length ? (
            <section className="property-detail-page__similar-block">
              <div className="property-detail-page__section-head">
                <p className="property-detail-page__section-label">More to Explore</p>
                <h2>Similar Properties</h2>
              </div>

              <div className="property-detail-page__similar-grid">
                {similarProperties.map((property) => (
                  <ListingCard
                    key={property.id}
                    listing={property}
                    onSelect={() => navigateToPath(getPropertyPath(property))}
                  />
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </>
  )
}

function PropertyDetails({ currentPath }) {
  const { sectionVisibility } = useSiteSections()
  const { isLoading, propertyListings } = usePropertyListings()

  const propertyId = useMemo(() => getPropertyIdFromPath(currentPath), [currentPath])

  const listing = useMemo(
    () =>
      propertyListings.find((property) => {
        if (!property.isPublished) return false

        return (
          property.id === propertyId ||
          getPropertySlug(property) === propertyId
        )
      }) ?? null,
    [propertyId, propertyListings],
  )

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [currentPath])

  return (
    <div className="property-detail-page-shell">
      {sectionVisibility.header ? <Header currentPath={currentPath} /> : null}

      <main className="property-detail-page">
        <section className="property-detail-page__section property-detail-page__section--hero">
          <div className="property-detail-page__inner">
            <div className="property-detail-page__breadcrumbs">
              <a href="/">Home</a>
              <span>/</span>
              <a href="/properties">Properties</a>
              {listing ? (
                <>
                  <span>/</span>
                  <span>{listing.streetAddress || listing.address}</span>
                </>
              ) : null}
            </div>

            {isLoading ? (
              <div className="property-detail-page__status">Loading property details...</div>
            ) : !listing ? (
              <div className="property-detail-page__status property-detail-page__status--missing">
                <h1>Property not found</h1>
                <p>
                  This property is no longer available or the listing path is invalid.
                </p>
                <a className="property-detail-page__back" href="/properties">
                  Back to Properties
                </a>
              </div>
            ) : (
              <PropertyDetailContent
                key={listing.id}
                listing={listing}
                propertyListings={propertyListings}
              />
            )}
          </div>
        </section>
      </main>

      {sectionVisibility.footer ? <Footer currentPath={currentPath} /> : null}
    </div>
  )
}

export default PropertyDetails
