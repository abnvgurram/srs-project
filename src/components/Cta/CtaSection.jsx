import { CalendarDays, MapPin, Phone } from 'lucide-react'
import './CtaSection.scss'

const areas = [
  'Glen Allen',
  'Richmond',
  'Henrico',
  'Short Pump',
  'West End',
  'NOVA',
  'VA Beach',
]

function CtaSection() {
  return (
    <section className="react-cta" id="cta">
      <div className="react-cta__glow" aria-hidden="true"></div>

      <div className="react-cta__inner">
        <p className="react-cta__eyebrow">Ready To Get Started?</p>
        <h2 className="react-cta__title">
          Let&apos;s Build Your Real Estate Success Story
        </h2>
        <p className="react-cta__copy">
          Whether you&apos;re buying your first home, selling an investment
          property, or need reliable property management, Vijay Kanth is ready
          to guide you every step of the way.
        </p>

        <div className="react-cta__actions">
          <a className="react-cta__button react-cta__button--primary" href="tel:8044266495">
            <Phone size={16} />
            <span>804-426-6495</span>
          </a>

          <a
            className="react-cta__button react-cta__button--ghost"
            href="https://calendly.com/vijaykanth"
            target="_blank"
            rel="noreferrer"
          >
            <CalendarDays size={16} />
            <span>Book an Appointment</span>
          </a>
        </div>

        <div className="react-cta__areas" aria-label="Service areas">
          {areas.map((area) => (
            <span className="react-cta__badge" key={area}>
              <MapPin size={13} />
              <span>{area}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}

export default CtaSection
