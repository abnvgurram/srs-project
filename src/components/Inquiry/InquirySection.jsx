import { useEffect, useRef, useState } from 'react'
import { ChevronDown, Mail, MapPin, Phone } from 'lucide-react'
import './InquirySection.scss'

const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mjgpqowr'
const serviceOptions = ['Buy', 'Sell', 'Rent']

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
    href: 'mailto:info@sirisrealtygroup.com',
    label: 'info@sirisrealtygroup.com',
  },
  {
    title: 'Address',
    icon: MapPin,
    href: 'https://www.google.com/maps/search/?api=1&query=11549+Nuckold+Rd%2C+Ste+B%2C+Glenn+Allen%2C+VA+23059',
    label: '11549 Nuckold Rd, Ste B, Glenn Allen, VA 23059',
  },
]

function InquirySection() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedService, setSelectedService] = useState('')
  const [isServiceMenuOpen, setIsServiceMenuOpen] = useState(false)
  const [submissionState, setSubmissionState] = useState({
    type: 'idle',
    message: '',
  })
  const serviceMenuRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!serviceMenuRef.current?.contains(event.target)) {
        setIsServiceMenuOpen(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsServiceMenuOpen(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSubmitting(true)
    setSubmissionState({ type: 'idle', message: '' })

    if (!selectedService) {
      setIsSubmitting(false)
      setSubmissionState({
        type: 'error',
        message: 'Please choose a service before sending your inquiry.',
      })
      return
    }

    const form = event.currentTarget
    const formData = new FormData(form)
    formData.set('service', selectedService)

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
      setSelectedService('')
      setIsServiceMenuOpen(false)
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

              <div className="inquiry-field">
                <span>Type of Service</span>
                <div
                  className={`inquiry-select${isServiceMenuOpen ? ' is-open' : ''}`}
                  ref={serviceMenuRef}
                >
                  <input type="hidden" name="service" value={selectedService} />
                  <button
                    className="inquiry-select__trigger"
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={isServiceMenuOpen}
                    onClick={() => setIsServiceMenuOpen((open) => !open)}
                  >
                    <span
                      className={`inquiry-select__value${
                        selectedService ? '' : ' is-placeholder'
                      }`}
                    >
                      {selectedService || 'Select service'}
                    </span>
                    <ChevronDown
                      className="inquiry-select__chevron"
                      aria-hidden="true"
                      size={18}
                    />
                  </button>

                  {isServiceMenuOpen ? (
                    <div className="inquiry-select__menu" role="listbox">
                      {serviceOptions.map((option) => (
                        <button
                          key={option}
                          className={`inquiry-select__option${
                            selectedService === option ? ' is-selected' : ''
                          }`}
                          type="button"
                          role="option"
                          aria-selected={selectedService === option}
                          onClick={() => {
                            setSelectedService(option)
                            setIsServiceMenuOpen(false)
                            setSubmissionState({ type: 'idle', message: '' })
                          }}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

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
