import './Hero.scss'

const slides = ['Buy Slide', 'Sell Slide', 'Management Slide', 'Relocation Slide']

function Hero() {
  return (
    <div className="hero-admin-section">
      <div className="hero-admin-section__header">
        <p className="hero-admin-section__eyebrow">Hero</p>
        <h2 className="hero-admin-section__title">Carousel Management</h2>
        <p className="hero-admin-section__copy">
          Future controls here will manage slide text, background imagery, CTA
          links, stats, and the floating accent card.
        </p>
      </div>

      <div className="hero-admin-section__slides">
        {slides.map((slide) => (
          <article className="hero-admin-section__slide" key={slide}>
            <span className="hero-admin-section__badge">Slide</span>
            <h3>{slide}</h3>
            <p>
              Placeholder for slide title, intro copy, action buttons, and media
              settings.
            </p>
          </article>
        ))}
      </div>
    </div>
  )
}

export default Hero
