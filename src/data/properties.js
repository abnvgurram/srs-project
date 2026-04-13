const LEGACY_PROPERTY_PLACEHOLDER_IMAGE = '/images/property-placeholder.svg'

export const propertyFilters = [
  { label: 'All', value: 'all' },
  { label: 'For Sale', value: 'buy' },
  { label: 'For Rent', value: 'rent' },
  { label: 'Recently Sold', value: 'sold' },
]

export const propertyTypeMeta = {
  buy: {
    badge: 'For Sale',
    badgeVariant: 'default',
  },
  rent: {
    badge: 'For Rent',
    badgeVariant: 'rent',
  },
  sold: {
    badge: 'Sold',
    badgeVariant: 'sold',
  },
}

export function buildPropertyAddress(listing) {
  const streetAddress = String(
    listing.streetAddress ?? listing.street_address ?? listing.address ?? '',
  ).trim()
  const city = String(listing.city ?? '').trim()
  const state = String(listing.state ?? '').trim()
  const zipCode = String(listing.zipCode ?? listing.zip_code ?? '').trim()
  const stateZip = [state, zipCode].filter(Boolean).join(' ')
  const regionParts = [city, stateZip].filter(Boolean)

  if (!streetAddress && !regionParts.length) return ''
  if (!regionParts.length) return streetAddress
  if (!streetAddress) return regionParts.join(', ')
  return `${streetAddress}, ${regionParts.join(', ')}`
}

export function normalizePropertyType(type) {
  return Object.hasOwn(propertyTypeMeta, type) ? type : 'buy'
}

export function normalizeImageUrls(imageUrls) {
  if (!Array.isArray(imageUrls)) return []

  return imageUrls
    .map((imageUrl) => String(imageUrl ?? '').trim())
    .filter(
      (imageUrl) =>
        Boolean(imageUrl) && imageUrl !== LEGACY_PROPERTY_PLACEHOLDER_IMAGE,
    )
}

export function normalizePropertyListing(listing, fallbackIndex = 0) {
  const type = normalizePropertyType(listing.type)
  const imageUrls = normalizeImageUrls(
    listing.imageUrls ?? listing.image_urls ?? [],
  )
  const coverImageIndex = Number.isInteger(listing.coverImageIndex)
    ? listing.coverImageIndex
    : Number.isInteger(listing.cover_image)
      ? listing.cover_image
      : 0
  const safeCoverImageIndex =
    imageUrls[coverImageIndex] !== undefined ? coverImageIndex : 0
  const streetAddress = String(
    listing.streetAddress ?? listing.street_address ?? listing.address ?? '',
  ).trim()
  const city = String(listing.city ?? '').trim()
  const state = String(listing.state ?? '').trim()
  const zipCode = String(listing.zipCode ?? listing.zip_code ?? '').trim()

  return {
    id: String(listing.id ?? crypto.randomUUID()),
    type,
    badge: propertyTypeMeta[type].badge,
    badgeVariant: propertyTypeMeta[type].badgeVariant,
    isPublished:
      typeof listing.isPublished === 'boolean'
        ? listing.isPublished
        : typeof listing.is_published === 'boolean'
          ? listing.is_published
          : true,
    price: String(listing.price ?? '').trim(),
    streetAddress,
    city,
    state,
    zipCode,
    address: buildPropertyAddress({
      streetAddress,
      city,
      state,
      zipCode,
      address: listing.address,
    }),
    description: String(listing.description ?? '').trim(),
    beds: String(listing.beds ?? '').trim(),
    baths: String(listing.baths ?? '').trim(),
    size: String(listing.size ?? '').trim(),
    imageUrls,
    coverImageIndex: safeCoverImageIndex,
    displayOrder:
      Number.isFinite(Number(listing.displayOrder ?? listing.display_order))
        ? Number(listing.displayOrder ?? listing.display_order)
        : fallbackIndex + 1,
  }
}

export function toPropertyRecord(listing) {
  return {
    id: listing.id,
    type: listing.type,
    is_published: listing.isPublished,
    price: listing.price,
    address: buildPropertyAddress(listing),
    street_address: listing.streetAddress,
    city: listing.city,
    state: listing.state,
    zip_code: listing.zipCode,
    description: listing.description,
    beds: listing.beds,
    baths: listing.baths,
    size: listing.size,
    image_urls: listing.imageUrls,
    cover_image: listing.coverImageIndex,
    display_order: listing.displayOrder,
    updated_at: new Date().toISOString(),
  }
}
