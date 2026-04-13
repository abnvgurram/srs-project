import { Star } from 'lucide-react'
import useTestimonials from '../../context/testimonials/useTestimonials.js'
import './TestimonialsSection.scss'

function TestimonialsSection() {
  const { isLoading, testimonials } = useTestimonials()
  const publishedTestimonials = testimonials.filter(
    (testimonial) => testimonial.isPublished,
  )

  return (
    <section className="testimonials-section" id="testimonials">
      <div className="testimonials-section__inner">
        <header className="testimonials-section__header">
          <p className="testimonials-section__eyebrow">Client Reviews</p>
          <h2 className="testimonials-section__title">What Our Clients Say</h2>
          <p className="testimonials-section__copy">
            Real words from real clients across the Richmond metro area.
          </p>
        </header>

        {isLoading ? (
          <div className="testimonials-section__empty">
            Loading client reviews...
          </div>
        ) : publishedTestimonials.length ? (
          <div className="testimonials-section__grid">
            {publishedTestimonials.map((item) => (
              <article className="testimonial-card-react" key={item.id}>
                <span
                  className="testimonial-card-react__quote-mark"
                  aria-hidden="true"
                >
                  "
                </span>

                <div
                  className="testimonial-card-react__stars"
                  aria-label={`${item.rating} star review`}
                >
                  {Array.from({ length: 5 }).map((_, index) => (
                    <Star
                      className={index < item.rating ? 'is-active' : ''}
                      key={`${item.id}-star-${index + 1}`}
                      size={15}
                      strokeWidth={2}
                    />
                  ))}
                </div>

                <p className="testimonial-card-react__quote">{item.review}</p>

                <div className="testimonial-card-react__author">
                  <span className="testimonial-card-react__avatar" aria-hidden="true">
                    {item.initials}
                  </span>

                  <span className="testimonial-card-react__meta">
                    <span className="testimonial-card-react__name">{item.name}</span>
                    <span className="testimonial-card-react__detail">
                      {item.subtitle}
                    </span>
                  </span>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="testimonials-section__empty">
            Client reviews will appear here once they are published.
          </div>
        )}

        <div className="testimonials-section__action">
          <a
            className="testimonials-section__button"
            href="https://www.zillow.com/profile/Vijay-Kanth/#reviews"
            target="_blank"
            rel="noreferrer"
          >
            Read All Reviews on Zillow
          </a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
