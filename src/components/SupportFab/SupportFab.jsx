import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { X } from 'lucide-react'
import './SupportFab.scss'

const SUPPORT_WHATSAPP_URL = 'https://wa.me/18044266495'

function SupportFab() {
  const [isExpanded, setIsExpanded] = useState(false)
  const supportFabRef = useRef(null)

  useEffect(() => {
    function handlePointerDown(event) {
      if (!supportFabRef.current?.contains(event.target)) {
        setIsExpanded(false)
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsExpanded(false)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
    }
  }, [])

  return (
    <div
      className={`support-fab${isExpanded ? ' is-expanded' : ''}`}
      ref={supportFabRef}
    >
      {isExpanded ? (
        <>
          <button
            className="support-fab__close"
            type="button"
            aria-label="Close support options"
            onClick={() => setIsExpanded(false)}
          >
            <X aria-hidden="true" size={16} strokeWidth={2.4} />
          </button>

          <a
            className="support-fab__cta"
            href={SUPPORT_WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            onClick={() => setIsExpanded(false)}
          >
            Chat with us
          </a>
        </>
      ) : null}

      <button
        className="support-fab__button"
        type="button"
        aria-label="Open support options"
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((expanded) => !expanded)}
      >
        <FontAwesomeIcon icon={faWhatsapp} />
      </button>
    </div>
  )
}

export default SupportFab
