export const testimonialSourceOptions = [
  { label: 'Zillow', value: 'zillow' },
  { label: 'Google', value: 'google' },
]

const testimonialSourceMeta = {
  zillow: {
    label: 'Zillow',
    sourceLabel: 'Verified Zillow Review',
  },
  google: {
    label: 'Google',
    sourceLabel: 'Verified Google Review',
  },
}

export function getTestimonialSourceMeta(source) {
  const normalizedSource = normalizeTestimonialSource(source)
  return testimonialSourceMeta[normalizedSource]
}

export function normalizeTestimonialSource(source) {
  return Object.hasOwn(testimonialSourceMeta, source) ? source : 'zillow'
}

export function buildTestimonialInitials(name) {
  return String(name ?? '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

function clampRating(rating) {
  const numericRating = Number(rating)
  if (!Number.isFinite(numericRating)) return 5
  return Math.min(5, Math.max(1, Math.round(numericRating)))
}

export function normalizeTestimonial(testimonial, fallbackIndex = 0) {
  const source = normalizeTestimonialSource(testimonial.source)
  const sourceMeta = getTestimonialSourceMeta(source)
  const name = String(testimonial.name ?? '').trim()

  return {
    id: String(testimonial.id ?? crypto.randomUUID()),
    name,
    subtitle: String(testimonial.subtitle ?? '').trim(),
    review: String(testimonial.review ?? '').trim(),
    rating: clampRating(testimonial.rating),
    source,
    sourceLabel: String(
      testimonial.sourceLabel ?? testimonial.source_label ?? sourceMeta.sourceLabel,
    ).trim(),
    isPublished:
      typeof testimonial.isPublished === 'boolean'
        ? testimonial.isPublished
        : typeof testimonial.is_published === 'boolean'
          ? testimonial.is_published
          : true,
    displayOrder:
      Number.isFinite(Number(testimonial.displayOrder ?? testimonial.display_order))
        ? Number(testimonial.displayOrder ?? testimonial.display_order)
        : fallbackIndex + 1,
    initials: buildTestimonialInitials(name),
  }
}

export function toTestimonialRecord(testimonial) {
  return {
    id: testimonial.id,
    name: testimonial.name,
    subtitle: testimonial.subtitle,
    review: testimonial.review,
    rating: testimonial.rating,
    source: testimonial.source,
    source_label: testimonial.sourceLabel,
    is_published: testimonial.isPublished,
    display_order: testimonial.displayOrder,
    updated_at: new Date().toISOString(),
  }
}
