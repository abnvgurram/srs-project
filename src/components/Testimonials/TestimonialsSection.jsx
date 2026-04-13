import './TestimonialsSection.scss'

const testimonials = [
  {
    quote:
      'From the moment we met, Vijay impressed us with his professionalism, knowledge and dedication to helping us find our dream home in the highly rated school district in Wyndham. His expertise in the local market was evident throughout every step.',
    name: 'Dr. Fanta Meleza',
    detail: 'Bought in Wyndham, Glen Allen • April 2024',
    initials: 'FM',
  },
  {
    quote:
      'Vijay was very good in educating us on all steps related to house buying. He gave us a wide variety of options and was there from search to closing. His assurance to guide us even after we bought the home was outstanding.',
    name: 'Abhiram B.',
    detail: 'Bought a Home • February 2024',
    initials: 'AB',
  },
  {
    quote:
      'Vijay did an outstanding job helping with our house sale. He has great local knowledge and excellent negotiation skills. He was on top of all the work that needed to be done for the house. Highly recommend!',
    name: 'Mahalakshmi Boddupally',
    detail: 'Sold in Glen Allen • December 2022',
    initials: 'MB',
  },
]

function TestimonialsSection() {
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

        <div className="testimonials-section__grid">
          {testimonials.map((item) => (
            <article className="testimonial-card-react" key={item.name}>
              <span className="testimonial-card-react__quote-mark" aria-hidden="true">
                "
              </span>

              <div className="testimonial-card-react__stars" aria-label="5 star review">
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
                <span>★</span>
              </div>

              <p className="testimonial-card-react__quote">{item.quote}</p>

              <div className="testimonial-card-react__author">
                <span className="testimonial-card-react__avatar" aria-hidden="true">
                  {item.initials}
                </span>

                <span className="testimonial-card-react__meta">
                  <span className="testimonial-card-react__name">{item.name}</span>
                  <span className="testimonial-card-react__detail">{item.detail}</span>
                </span>
              </div>
            </article>
          ))}
        </div>

        <div className="testimonials-section__action">
          <a
            className="testimonials-section__button"
            href="https://www.zillow.com/profile/Vijay-Kanth/#reviews"
            target="_blank"
            rel="noreferrer"
          >
            Read All Reviews on Zillow →
          </a>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
