import { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faHeadset } from '@fortawesome/free-solid-svg-icons'
import {
  ArrowLeft,
  Mail,
  MessageCircleMore,
  PhoneCall,
  RotateCcw,
  SendHorizontal,
  Sparkles,
  X,
} from 'lucide-react'
import './SupportFab.scss'

const SUPPORT_PHONE_NUMBER = '804-426-6495'
const SUPPORT_PHONE_HREF = 'tel:8044266495'
const SUPPORT_WHATSAPP_URL = 'https://wa.me/18044266495'
const SUPPORT_EMAIL = 'info@sirisrealtygroup.com'
const SUPPORT_EMAIL_HREF = `mailto:${SUPPORT_EMAIL}`

const quickReplies = [
  {
    label: 'Buy a Home',
    prompt: 'I want to buy a home',
  },
  {
    label: 'Sell My Home',
    prompt: 'I want to sell my home',
  },
  {
    label: 'Property Management',
    prompt: 'I need property management',
  },
  {
    label: 'Service Areas',
    prompt: 'What areas do you serve?',
  },
]

const agentReplies = {
  buy: `Buying a home goes better when the search is narrowed early.

- Clarify budget, timeline, and non-negotiables
- Compare neighborhoods based on fit, not just price
- Tour with a clean decision framework
- Write offers with market context and financing clarity

If you want, I can help you prepare the right next question before you reach out.`,
  sell: `Selling should start with positioning, not guessing.

- Sharper pricing through comparative analysis
- Launch prep that improves first impressions
- Better marketing reach across the right platforms
- Negotiation support aimed at cleaner outcomes

If you want, tell me about the property and I will point you in the right direction.`,
  management: `Property management should feel structured, not reactive.

- Leasing support and tenant placement
- Rent collection and day-to-day coordination
- Maintenance follow-through
- Compliance-aware oversight

If you want, I can help you narrow the right management question before you contact the team.`,
  areas: `Siris Realty Group supports clients across the greater Richmond region, including Glen Allen, Richmond, and Henrico.

If you already know the neighborhood or school zone you care about, tell me and I will keep the conversation focused.`,
  default: `I can help you narrow the next step for buying, selling, renting, or management.

If you want a direct response from the team, you can also use WhatsApp, call, or email from this panel.`,
}

const initialMessage = {
  id: 'welcome',
  role: 'agent',
  time: 'Just now',
  text:
    "Hi, I'm the Siris support assistant. Ask about buying, selling, renting, or property management and I will help you narrow the next step.",
}

function getReply(message) {
  const text = message.toLowerCase()

  if (
    text.includes('buy') ||
    text.includes('purchase') ||
    text.includes('search') ||
    text.includes('home')
  ) {
    return agentReplies.buy
  }

  if (
    text.includes('sell') ||
    text.includes('selling') ||
    text.includes('list') ||
    text.includes('valuation')
  ) {
    return agentReplies.sell
  }

  if (
    text.includes('manage') ||
    text.includes('management') ||
    text.includes('rent') ||
    text.includes('tenant') ||
    text.includes('landlord')
  ) {
    return agentReplies.management
  }

  if (
    text.includes('area') ||
    text.includes('where') ||
    text.includes('location') ||
    text.includes('serve')
  ) {
    return agentReplies.areas
  }

  return agentReplies.default
}

function formatTimestamp() {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function SupportFab() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeView, setActiveView] = useState('menu')
  const [messages, setMessages] = useState([initialMessage])
  const [draft, setDraft] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const supportFabRef = useRef(null)
  const chatMessagesRef = useRef(null)
  const typingTimerRef = useRef(null)

  function queueReply(prompt) {
    const trimmedPrompt = prompt.trim()
    if (!trimmedPrompt || isTyping) return

    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current)
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      {
        id: `user-${Date.now()}`,
        role: 'user',
        time: formatTimestamp(),
        text: trimmedPrompt,
      },
    ])
    setDraft('')
    setShowQuickReplies(false)
    setIsTyping(true)

    typingTimerRef.current = window.setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: `agent-${Date.now()}`,
          role: 'agent',
          time: formatTimestamp(),
          text: getReply(trimmedPrompt),
        },
      ])
      setIsTyping(false)
      typingTimerRef.current = null
    }, 900)
  }

  function handleSubmit(event) {
    event.preventDefault()
    queueReply(draft)
  }

  function openChat(prompt = '') {
    setIsOpen(true)
    setActiveView('chat')

    if (prompt) {
      window.setTimeout(() => {
        queueReply(prompt)
      }, 0)
    }
  }

  function closePanel() {
    setIsOpen(false)
    setActiveView('menu')
  }

  function resetChat() {
    if (typingTimerRef.current) {
      window.clearTimeout(typingTimerRef.current)
      typingTimerRef.current = null
    }

    setMessages([initialMessage])
    setDraft('')
    setShowQuickReplies(true)
    setIsTyping(false)
  }

  useEffect(() => {
    function handlePointerDown(event) {
      if (!supportFabRef.current?.contains(event.target)) {
        setIsOpen(false)
        setActiveView('menu')
      }
    }

    function handleEscape(event) {
      if (event.key === 'Escape') {
        setIsOpen(false)
        setActiveView('menu')
      }
    }

    function handleSupportOpen(event) {
      setIsOpen(true)
      setActiveView('chat')

      if (event.detail?.prompt) {
        window.setTimeout(() => {
          queueReply(event.detail.prompt)
        }, 0)
      }
    }

    window.addEventListener('mousedown', handlePointerDown)
    window.addEventListener('keydown', handleEscape)
    window.addEventListener('siris-support:open', handleSupportOpen)

    return () => {
      window.removeEventListener('mousedown', handlePointerDown)
      window.removeEventListener('keydown', handleEscape)
      window.removeEventListener('siris-support:open', handleSupportOpen)
    }
  })

  useEffect(() => {
    const panel = chatMessagesRef.current
    if (!panel) return

    panel.scrollTop = panel.scrollHeight
  }, [messages, isTyping, activeView])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current)
      }
    }
  }, [])

  return (
    <div className={`support-fab${isOpen ? ' is-open' : ''}`} ref={supportFabRef}>
      {isOpen ? (
        <div className="support-fab__panel">
          {activeView === 'menu' ? (
            <>
              <div className="support-fab__panel-header">
                <div>
                  <div className="support-fab__panel-title">
                    <Sparkles aria-hidden="true" size={18} strokeWidth={2.1} />
                    <span>How can we help?</span>
                  </div>
                  <p className="support-fab__panel-copy">
                    Choose how you would like to connect with us.
                  </p>
                </div>

                <button
                  className="support-fab__panel-close"
                  type="button"
                  aria-label="Close support panel"
                  onClick={closePanel}
                >
                  <X aria-hidden="true" size={16} strokeWidth={2.3} />
                </button>
              </div>

              <div className="support-fab__options">
                <button
                  className="support-fab__option"
                  type="button"
                  onClick={() => openChat()}
                >
                  <span className="support-fab__option-icon support-fab__option-icon--chat">
                    <Sparkles aria-hidden="true" size={18} strokeWidth={2.1} />
                  </span>
                  <span className="support-fab__option-body">
                    <span className="support-fab__option-title">Chat with us</span>
                    <span className="support-fab__option-copy">Powered by AI</span>
                  </span>
                </button>

                <a
                  className="support-fab__option"
                  href={SUPPORT_WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="support-fab__option-icon support-fab__option-icon--whatsapp">
                    <FontAwesomeIcon icon={faWhatsapp} />
                  </span>
                  <span className="support-fab__option-body">
                    <span className="support-fab__option-title">WhatsApp us</span>
                    <span className="support-fab__option-copy">
                      Fastest response
                    </span>
                  </span>
                </a>

                <a className="support-fab__option" href={SUPPORT_PHONE_HREF}>
                  <span className="support-fab__option-icon support-fab__option-icon--call">
                    <PhoneCall aria-hidden="true" size={18} strokeWidth={2.1} />
                  </span>
                  <span className="support-fab__option-body">
                    <span className="support-fab__option-title">Call us</span>
                    <span className="support-fab__option-copy">
                      +1 {SUPPORT_PHONE_NUMBER}
                    </span>
                  </span>
                </a>

                <a className="support-fab__option" href={SUPPORT_EMAIL_HREF}>
                  <span className="support-fab__option-icon support-fab__option-icon--email">
                    <Mail aria-hidden="true" size={18} strokeWidth={2.1} />
                  </span>
                  <span className="support-fab__option-body">
                    <span className="support-fab__option-title">Email us</span>
                    <span className="support-fab__option-copy">
                      {SUPPORT_EMAIL}
                    </span>
                  </span>
                </a>
              </div>
            </>
          ) : (
            <>
              <div className="support-fab__panel-header">
                <div className="support-fab__chat-header">
                  <button
                    className="support-fab__back"
                    type="button"
                    aria-label="Back to support options"
                    onClick={() => setActiveView('menu')}
                  >
                    <ArrowLeft aria-hidden="true" size={16} strokeWidth={2.3} />
                  </button>

                  <div>
                    <div className="support-fab__panel-title">
                      <MessageCircleMore
                        aria-hidden="true"
                        size={18}
                        strokeWidth={2.1}
                      />
                      <span>Chat with us</span>
                    </div>
                    <p className="support-fab__panel-copy">Powered by AI</p>
                  </div>
                </div>

                <div className="support-fab__panel-actions">
                  <button
                    className="support-fab__reset support-fab__reset--header"
                    type="button"
                    aria-label="Reset chat"
                    onClick={resetChat}
                  >
                    <RotateCcw aria-hidden="true" size={15} strokeWidth={2.1} />
                  </button>

                  <button
                    className="support-fab__panel-close"
                    type="button"
                    aria-label="Close support panel"
                    onClick={closePanel}
                  >
                    <X aria-hidden="true" size={16} strokeWidth={2.3} />
                  </button>
                </div>
              </div>

              <div className="support-fab__chat-shell">
                <div
                  className="support-fab__messages"
                  ref={chatMessagesRef}
                  aria-live="polite"
                >
                  {messages.map((message) => (
                    <div
                      className={`support-fab__message support-fab__message--${message.role}`}
                      key={message.id}
                    >
                      <div className="support-fab__message-bubble">
                        {message.text}
                      </div>
                      <div className="support-fab__message-time">{message.time}</div>
                    </div>
                  ))}

                  {isTyping ? (
                    <div className="support-fab__message support-fab__message--agent">
                      <div className="support-fab__typing">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  ) : null}
                </div>

                {showQuickReplies ? (
                  <div className="support-fab__quick-replies">
                    {quickReplies.map((reply) => (
                      <button
                        className="support-fab__quick-reply"
                        key={reply.label}
                        type="button"
                        onClick={() => queueReply(reply.prompt)}
                      >
                        {reply.label}
                      </button>
                    ))}
                  </div>
                ) : null}

                <form className="support-fab__composer" onSubmit={handleSubmit}>
                  <input
                    className="support-fab__input"
                    type="text"
                    name="support-ai-question"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about buying, selling, renting, or management..."
                    autoComplete="off"
                  />

                  <button
                    className="support-fab__send"
                    type="submit"
                    aria-label="Send message"
                    disabled={isTyping}
                  >
                    <SendHorizontal aria-hidden="true" size={18} strokeWidth={2.2} />
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      ) : null}

      <button
        className="support-fab__toggle"
        type="button"
        aria-label={isOpen ? 'Close support panel' : 'Open support panel'}
        aria-expanded={isOpen}
        onClick={() => {
          if (isOpen) {
            closePanel()
            return
          }

          setIsOpen(true)
          setActiveView('menu')
        }}
      >
        {isOpen ? (
          <X aria-hidden="true" size={22} strokeWidth={2.5} />
        ) : (
          <FontAwesomeIcon icon={faHeadset} aria-hidden="true" />
        )}
      </button>
    </div>
  )
}

export default SupportFab
