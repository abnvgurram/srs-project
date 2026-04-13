import './Testimonials.scss'

const cards = ['Review Card 01', 'Review Card 02', 'Review Card 03']

function Testimonials() {
  return (
    <div className="testimonials-admin-section">
      <div className="testimonials-admin-section__header">
        <p className="testimonials-admin-section__eyebrow">Testimonials</p>
        <h2 className="testimonials-admin-section__title">Review Management</h2>
        <p className="testimonials-admin-section__copy">
          Testimonials, reviewer names, external platform links, and card order
          will be managed here.
        </p>
      </div>

      <div className="testimonials-admin-section__grid">
        {cards.map((card) => (
          <article className="testimonials-admin-section__card" key={card}>
            <h3>{card}</h3>
            <p>
              Placeholder for star rating, review copy, reviewer identity, and
              platform metadata.
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Testimonials
