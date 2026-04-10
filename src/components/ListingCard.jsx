import {
  Bath,
  BedDouble,
  Building2,
  House,
  HousePlus,
  MapPin,
  Ruler,
} from 'lucide-react'

const illustrationIcons = {
  house: House,
  villa: HousePlus,
  building: Building2,
}

function ListingCard({ listing }) {
  const IllustrationIcon = illustrationIcons[listing.illustration] ?? House

  return (
    <article className="listing-card">
      <div className="listing-card__visual" aria-hidden="true">
        <IllustrationIcon
          className="listing-card__illustration"
          size={60}
          strokeWidth={1.8}
        />
        <span className={`listing-card__badge listing-card__badge--${listing.badgeVariant}`}>
          {listing.badge}
        </span>
      </div>

      <div className="listing-card__body">
        <p className="listing-card__price">{listing.price}</p>
        <p className="listing-card__address">
          <MapPin size={14} />
          <span>{listing.address}</span>
        </p>

        <div className="listing-card__stats">
          <span className="listing-card__stat">
            <BedDouble size={14} />
            <span>{listing.beds}</span>
          </span>
          <span className="listing-card__stat">
            <Bath size={14} />
            <span>{listing.baths}</span>
          </span>
          <span className="listing-card__stat">
            <Ruler size={14} />
            <span>{listing.size}</span>
          </span>
        </div>
      </div>
    </article>
  )
}

export default ListingCard
