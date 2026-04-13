import { useState } from 'react'
import { Mail, MapPin, Phone } from 'lucide-react'
import './InquirySection.scss'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgpqowr'

const contactPoints = [
  {
    title: 'Phone',
    icon: Phone,
    href: 'tel:8044266495',
    label: '804-426-6495',
  },
  {
    title: 'Email',
    icon: Mail,
    href: 'mailto:vijay@sirisrealtygroup.com',
    label: 'vijay@sirisrealtygroup.com',
  },
  {
    title: 'Address',
    icon: MapPin,
    href: 'https://www.google.com/maps/search/?api=1&query=Glen+Allen+VA+23060',
    label: 'Glen Allen, VA 23060',
  },
]

function InquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionState, setSubmissionState] = useState({
    type: 'idle',
    message: '',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmissionState({ type: 'idle', message: '' })

    const form = event.currentTarget
    const formData = new FormData(form)
    const selectedService = formData.get('service')

    formData.append(
      'subject',
      `New Siris Realty inquiry${selectedService ? ` - ${selectedService}` : ''}`,
    )

    try {
      const response = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        const message =
          data?.errors?.map((error) => error.message).join(', ') ||
          'There was a problem sending your inquiry. Please try again.'

        setSubmissionState({ type: 'error', message })
        return
      }

      form.reset()
      setSubmissionState({
        type: 'success',
        message: 'Thank You! Your inquiry was sent successfully.',
      })
    } catch {
      setSubmissionState({
        type: 'error',
        message:
          'There was a network problem while sending your inquiry. Please try again.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="inquiry-section" id="inquiry">
      <div className="inquiry-section__inner">
        <div className="inquiry-section__header">
          <p className="inquiry-section__eyebrow">Inquiry Form</p>
          <h2 className="inquiry-section__title">Start the Conversation</h2>
          <p className="inquiry-section__copy">
            Buying, selling, or renting in Virginia? Share the basics and we will
            shape the right next step around your timeline, budget, and goals.
          </p>
        </div>

        <div className="inquiry-section__grid">
          <aside className="inquiry-panel inquiry-panel--info">
            <div className="inquiry-panel__intro">
              <h3>Tell us what you need.</h3>
            </div>

            <div className="inquiry-panel__points">
              {contactPoints.map((point) => {
                const Icon = point.icon

                return (
                  <a
                    key={point.title}
                    className="inquiry-point"
                    href={point.href}
                    target={point.href.startsWith('http') ? '_blank' : undefined}
                    rel={point.href.startsWith('http') ? 'noreferrer' : undefined}
                  >
                    <span className="inquiry-point__icon" aria-hidden="true">
                      <Icon size={18} />
                    </span>

                    <span className="inquiry-point__body">
                      <span className="inquiry-point__title">{point.title}</span>
                      <span className="inquiry-point__link">{point.label}</span>
                    </span>
                  </a>
                )
              })}
            </div>
          </aside>

          <div className="inquiry-panel inquiry-panel--form">
            <form className="inquiry-form" onSubmit={handleSubmit}>
              <label className="inquiry-field">
                <span>Name</span>
                <input
                  type="text"
                  name="name"
                  placeholder="Your full name"
                  required
                />
              </label>

              <label className="inquiry-field">
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                />
              </label>

              <label className="inquiry-field">
                <span>Phone Number</span>
                <div className="inquiry-phone">
                  <span className="inquiry-phone__prefix">+1</span>
                  <input
                    type="tel"
                    name="phone"
                    inputMode="tel"
                    placeholder="Phone No."
                    required
                  />
                </div>
              </label>

              <label className="inquiry-field">
                <span>Type of Service</span>
                <select name="service" defaultValue="" required>
                  <option value="" disabled>
                    Select service
                  </option>
                  <option value="Buy">Buy</option>
                  <option value="Sell">Sell</option>
                  <option value="Rent">Rent</option>
                </select>
              </label>

              <label className="inquiry-field inquiry-field--message">
                <span>Message</span>
                <textarea
                  name="message"
                  rows="6"
                  placeholder="Tell us what kind of property support you need."
                  required
                ></textarea>
              </label>

              <div className="inquiry-form__actions">
                <button
                  className="inquiry-form__submit"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Inquiry'}
                </button>
              </div>

              {submissionState.type !== 'idle' ? (
                <p
                  className={`inquiry-form__status inquiry-form__status--${submissionState.type}`}
                  role="status"
                >
                  {submissionState.message}
                </p>
              ) : null}
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InquirySection
