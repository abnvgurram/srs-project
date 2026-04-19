import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import './ServiceFaqAccordion.scss'

function ServiceFaqAccordion({ items = [] }) {
  const [openIndex, setOpenIndex] = useState(items.length ? 0 : -1)

  return (
    <div className="service-faq-accordion">
      {items.map((item, index) => {
        const isOpen = index === openIndex

        return (
          <article
            className={`service-faq-accordion__item${isOpen ? ' is-open' : ''}`}
            key={item.question}
          >
            <button
              className="service-faq-accordion__trigger"
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex((current) => (current === index ? -1 : index))}
            >
              <span className="service-faq-accordion__question">
                {item.question}
              </span>
              <span className="service-faq-accordion__chevron" aria-hidden="true">
                <ChevronDown size={18} strokeWidth={2.2} />
              </span>
            </button>

            <div className="service-faq-accordion__content">
              <div className="service-faq-accordion__content-inner">
                <p>{item.answer}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}

export default ServiceFaqAccordion
