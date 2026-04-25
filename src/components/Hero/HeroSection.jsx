import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight,
  BadgeDollarSign,
  ChevronLeft,
  ChevronRight,
  House,
  KeyRound,
  MapPin,
  MessageCircle,
} from 'lucide-react'
import './HeroSection.scss'

const AUTOPLAY_DURATION = 5500
const EXIT_DURATION = 700

const heroSlides = [
  {
    location: 'Glen Allen | Richmond | Henrico, VA',
    headingLines: [
      { prefix: 'Your ', highlight: 'Dream Home' },
      { text: 'Starts Right Here' },
    ],
    copy:
      'Siris Realty Group brings expert guidance on buying, selling, and managing property - with the personalized care only a dedicated full-time agent can provide.',
    primaryAction: {
      label: 'Talk to Our AI Agent',
      mode: 'support-chat',
      prompt: 'I want to buy a home',
      icon: MessageCircle,
    },
    secondaryAction: {
      label: 'Browse Properties',
      href: '#properties',
      icon: House,
    },
    stats: [
      { value: '128+', label: 'Closed Sales' },
      { value: '8+', label: 'Years Experience' },
      { value: '5-Star', label: 'Zillow Rating' },
    ],
    card: {
      tag: 'Buy a Home',
      body: 'Personalized search, off-market access, and expert negotiation - all for you.',
      href: '#services',
      label: 'Explore Buying',
      icon: House,
    },
    image:
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80',
  },
  {
    location: 'Maximum Value | Proven Strategy',
    headingLines: [
      { text: 'Sell Smarter,' },
      { prefix: 'Earn ', highlight: 'More' },
    ],
    copy:
      "From accurate CMA pricing to high-impact marketing and strong negotiation - we maximize your home's value and get it sold on your terms.",
    primaryAction: {
      label: 'Get a Free Home Valuation',
      mode: 'support-chat',
      prompt: 'I want to sell my home',
      icon: BadgeDollarSign,
    },
    secondaryAction: {
      label: 'How We Sell',
      href: '#services',
      icon: ArrowRight,
    },
    stats: [
      { value: '$1.3M', label: 'Top Sale Value' },
      { value: 'High', label: 'Impact Marketing' },
      { value: 'CMA', label: 'Accurate Pricing' },
    ],
    card: {
      tag: 'Sell Your Home',
      body: 'Professional staging advice, MLS listing, Zillow marketing, and max-value negotiation.',
      href: '#services',
      label: 'Explore Selling',
      icon: BadgeDollarSign,
    },
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1600&q=80',
  },
  {
    location: 'Tenant Placement | Rent Collection | Compliance',
    headingLines: [
      { text: 'Passive Income,' },
      { highlight: 'Zero', suffix: ' Headaches' },
    ],
    copy:
      'Let Siris Realty handle everything - from screening tenants to collecting rent and managing maintenance. You invest; we manage.',
    primaryAction: {
      label: 'Start Managing Today',
      mode: 'support-chat',
      prompt: 'I need property management',
      icon: KeyRound,
    },
    secondaryAction: {
      label: 'Management Services',
      href: '#services',
      icon: ArrowRight,
    },
    stats: [
      { value: 'Full', label: 'Tenant Screening' },
      { value: '24/7', label: 'Maintenance' },
      { value: '100%', label: 'Compliance' },
    ],
    card: {
      tag: 'Property Management',
      body: 'End-to-end rental management for landlords and investors across the Richmond metro.',
      href: '#services',
      label: 'Explore Management',
      icon: KeyRound,
    },
    image:
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1600&q=80',
  },
  {
    location: 'NOVA | Richmond | Virginia Beach | Henrico',
    headingLines: [
      { text: 'Move to Virginia' },
      { prefix: 'with ', highlight: 'Confidence' },
    ],
    copy:
      'Relocating to the Richmond area? Our specialists guide you through every neighborhood, school district, and community so your transition feels like coming home.',
    primaryAction: {
      label: 'Plan My Relocation',
      mode: 'support-chat',
      prompt: 'I need relocation help',
      icon: MapPin,
    },
    secondaryAction: {
      label: 'Explore Neighborhoods',
      href: '#properties',
      icon: ArrowRight,
    },
    stats: [
      { value: '7+', label: 'Service Areas' },
      { value: 'Local', label: 'Expert Knowledge' },
      { value: 'E2E', label: 'Support' },
    ],
    card: {
      tag: 'Relocation Services',
      body: 'School districts, commute planning, and community tours - we make Virginia feel like home.',
      href: '#services',
      label: 'Explore Relocation',
      icon: MapPin,
    },
    image:
      'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1600&q=80',
  },
]

function renderHeading(lines) {
  return lines.map((line, index) => (
    <span key={`${line.text ?? line.highlight ?? line.prefix ?? 'line'}-${index}`}>
      {line.text ? line.text : null}
      {!line.text ? (
        <>
          {line.prefix ?? ''}
          {line.highlight ? <em>{line.highlight}</em> : null}
          {line.suffix ?? ''}
        </>
      ) : null}
      {index < lines.length - 1 ? <br /> : null}
    </span>
  ))
}

function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitingIndex, setExitingIndex] = useState(null)
  const exitTimerRef = useRef(null)

  useEffect(() => {
    return () => {
      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const nextIndex = (activeIndex + 1) % heroSlides.length

      if (exitTimerRef.current) {
        window.clearTimeout(exitTimerRef.current)
      }

      setExitingIndex(activeIndex)
      setActiveIndex(nextIndex)

      exitTimerRef.current = window.setTimeout(() => {
        setExitingIndex(null)
        exitTimerRef.current = null
      }, EXIT_DURATION)
    }, AUTOPLAY_DURATION)

    return () => {
      window.clearTimeout(timer)
    }
  }, [activeIndex])

  function handleSlideChange(index) {
    const nextIndex = (index + heroSlides.length) % heroSlides.length

    if (nextIndex === activeIndex) return

    if (exitTimerRef.current) {
      window.clearTimeout(exitTimerRef.current)
    }

    setExitingIndex(activeIndex)
    setActiveIndex(nextIndex)

    exitTimerRef.current = window.setTimeout(() => {
      setExitingIndex(null)
      exitTimerRef.current = null
    }, EXIT_DURATION)
  }

  function handlePrevious() {
    handleSlideChange(activeIndex - 1)
  }

  function handleNext() {
    handleSlideChange(activeIndex + 1)
  }

  function openSupportChat(prompt) {
    window.dispatchEvent(
      new CustomEvent('siris-support:open', {
        detail: {
          prompt,
          view: 'chat',
        },
      }),
    )
  }

  return (
    <section className="hero-section-react" id="hero">
      <div className="hero-carousel-react">
        {heroSlides.map((slide, index) => {
          const isActive = index === activeIndex
          const isExiting = index === exitingIndex
          const PrimaryIcon = slide.primaryAction.icon
          const SecondaryIcon = slide.secondaryAction.icon
          const CardIcon = slide.card.icon
          const TitleTag = isActive ? 'h1' : 'h2'

          return (
            <article
              className={`hero-carousel-react__slide${
                isActive ? ' is-active' : ''
              }${isExiting ? ' is-exiting' : ''}`}
              key={slide.location}
            >
              <div
                className="hero-carousel-react__bg"
                style={{ backgroundImage: `url('${slide.image}')` }}
                aria-hidden="true"
              ></div>
              <div className="hero-carousel-react__overlay" aria-hidden="true"></div>

              <div className="hero-carousel-react__inner">
                <div className="hero-carousel-react__content">
                  <div className="hero-carousel-react__badge">
                    <span className="hero-carousel-react__dot"></span>
                    <span>{slide.location}</span>
                  </div>

                  <TitleTag className="hero-carousel-react__title">
                    {renderHeading(slide.headingLines)}
                  </TitleTag>

                  <p className="hero-carousel-react__copy">{slide.copy}</p>

                  <div className="hero-carousel-react__actions">
                    {slide.primaryAction.mode === 'support-chat' ? (
                      <button
                        className="hero-carousel-react__button hero-carousel-react__button--primary"
                        type="button"
                        onClick={() => openSupportChat(slide.primaryAction.prompt)}
                      >
                        <PrimaryIcon
                          aria-hidden="true"
                          size={18}
                          strokeWidth={2.1}
                        />
                        <span>{slide.primaryAction.label}</span>
                      </button>
                    ) : (
                      <a
                        className="hero-carousel-react__button hero-carousel-react__button--primary"
                        href={slide.primaryAction.href}
                      >
                        <PrimaryIcon
                          aria-hidden="true"
                          size={18}
                          strokeWidth={2.1}
                        />
                        <span>{slide.primaryAction.label}</span>
                      </a>
                    )}

                    <a
                      className="hero-carousel-react__button hero-carousel-react__button--ghost"
                      href={slide.secondaryAction.href}
                    >
                      <SecondaryIcon
                        aria-hidden="true"
                        size={18}
                        strokeWidth={2.1}
                      />
                      <span>{slide.secondaryAction.label}</span>
                    </a>
                  </div>

                  <div className="hero-carousel-react__stats">
                    {slide.stats.map((stat) => (
                      <div className="hero-carousel-react__stat" key={stat.label}>
                        <div className="hero-carousel-react__stat-value">
                          {stat.value}
                        </div>
                        <div className="hero-carousel-react__stat-label">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="hero-carousel-react__visual">
                  <div className="hero-carousel-react__card">
                    <div className="hero-carousel-react__card-icon" aria-hidden="true">
                      <CardIcon size={34} strokeWidth={1.9} />
                    </div>
                    <div className="hero-carousel-react__card-tag">
                      {slide.card.tag}
                    </div>
                    <p className="hero-carousel-react__card-copy">
                      {slide.card.body}
                    </p>
                    <a
                      className="hero-carousel-react__card-link"
                      href={slide.card.href}
                    >
                      <span>{slide.card.label}</span>
                      <ArrowRight aria-hidden="true" size={16} strokeWidth={2.2} />
                    </a>
                  </div>
                </div>
              </div>
            </article>
          )
        })}

        <button
          className="hero-carousel-react__arrow hero-carousel-react__arrow--prev"
          type="button"
          aria-label="Previous slide"
          onClick={handlePrevious}
        >
          <ChevronLeft aria-hidden="true" size={22} strokeWidth={2.4} />
        </button>

        <button
          className="hero-carousel-react__arrow hero-carousel-react__arrow--next"
          type="button"
          aria-label="Next slide"
          onClick={handleNext}
        >
          <ChevronRight aria-hidden="true" size={22} strokeWidth={2.4} />
        </button>

        <div className="hero-carousel-react__dots" aria-label="Hero slides">
          {heroSlides.map((slide, index) => (
            <button
              className={`hero-carousel-react__dot-button${
                index === activeIndex ? ' is-active' : ''
              }`}
              key={slide.location}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={index === activeIndex}
              onClick={() => handleSlideChange(index)}
            ></button>
          ))}
        </div>

        <div className="hero-carousel-react__progress" aria-hidden="true">
          <div
            className="hero-carousel-react__progress-bar"
            key={activeIndex}
            style={{ animationDuration: `${AUTOPLAY_DURATION}ms` }}
          ></div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection
