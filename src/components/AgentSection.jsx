import { useEffect, useRef, useState } from 'react'
import {
  BadgeDollarSign,
  House,
  KeyRound,
  MapPin,
  RotateCcw,
  SendHorizontal,
} from 'lucide-react'

const quickReplies = [
  {
    label: 'Buy a Home',
    prompt: 'I want to buy a home',
    icon: House,
  },
  {
    label: 'Sell My Home',
    prompt: 'I want to sell my home',
    icon: BadgeDollarSign,
  },
  {
    label: 'Property Management',
    prompt: 'I need property management',
    icon: KeyRound,
  },
  {
    label: 'Service Areas',
    prompt: 'What areas do you serve?',
    icon: MapPin,
  },
]

const agentReplies = {
  buy: `Great choice! Here's how we help buyers:

- Personalized home search based on your needs
- Access to off-market opportunities
- Expert negotiation to get you the best price
- Full support from search to closing

Would you like to schedule a free buyer consultation with Vijay? You can call 804-426-6495 or book at calendly.com/vijaykanth.`,
  sell: `Selling your home? Here's what we do:

- Accurate Comparative Market Analysis (CMA)
- Professional photography and staging advice
- High-impact marketing on Zillow, MLS, and social media
- Strong negotiation to maximize your sale price

Get your free home valuation by calling 804-426-6495.`,
  management: `Property management made easy:

- Tenant screening and placement
- Monthly rent collection
- Maintenance coordination
- Legal compliance and documentation

We take the stress out of being a landlord. Want to learn more about our management packages?`,
  areas: `We serve the greater Richmond, Virginia area:

- Glen Allen, including Wyndham and Short Pump
- Richmond, including West End, Southside, and Central
- Henrico County
- Northern Virginia
- Virginia Beach area

Local knowledge is our superpower. Which area are you interested in?`,
  default: `Thanks for reaching out. Vijay Kanth and the Siris Realty Group team are here to help.

Call or text: 804-426-6495
Book online: calendly.com/vijaykanth
Visit: sirisrealtygroup.com

Or ask me anything about buying, selling, renting, or property management in the Richmond area.`,
}

const initialMessage = {
  id: 'welcome',
  role: 'agent',
  time: 'Just now',
  text: `Hello! I'm your Siris Realty AI assistant. Whether you're looking to buy, sell, or manage a property in the Glen Allen, Richmond, or Henrico area - I'm here to guide you every step of the way. What can I help you with today?`,
}

function getReply(message) {
  const text = message.toLowerCase()

  if (
    text.includes('buy') ||
    text.includes('purchase') ||
    text.includes('looking for')
  ) {
    return agentReplies.buy
  }

  if (
    text.includes('sell') ||
    text.includes('selling') ||
    text.includes('list')
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

function AgentSection() {
  const [messages, setMessages] = useState([initialMessage])
  const [draft, setDraft] = useState('')
  const [showQuickReplies, setShowQuickReplies] = useState(true)
  const [isTyping, setIsTyping] = useState(false)
  const chatMessagesRef = useRef(null)
  const typingTimerRef = useRef(null)

  useEffect(() => {
    const panel = chatMessagesRef.current
    if (!panel) return

    panel.scrollTop = panel.scrollHeight
  }, [messages, isTyping])

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) {
        window.clearTimeout(typingTimerRef.current)
      }
    }
  }, [])

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

  return (
    <section className="agent-section-react" id="agent-section">
      <div className="agent-section-react__bg" aria-hidden="true"></div>

      <div className="agent-section-react__inner">
        <p className="agent-section-react__eyebrow">Powered by AI</p>
        <h2 className="agent-section-react__title">
          Meet Your Personal Real Estate Agent
        </h2>
        <p className="agent-section-react__copy">
          Get instant answers about buying, selling, or renting in the Richmond
          area. Our AI agent walks you through every step - 24/7.
        </p>

        <div className="ai-chat-box-react">
          <div className="ai-chat-box-react__header">
            <div className="ai-chat-box-react__avatar" aria-hidden="true">
              S
            </div>

            <div>
              <div className="ai-chat-box-react__name">Siris AI Agent</div>
              <div className="ai-chat-box-react__status">
                Online - Ready to help
              </div>
            </div>

            <button
              className="ai-chat-box-react__reset"
              type="button"
              aria-label="Reset chat"
              onClick={resetChat}
            >
              <RotateCcw aria-hidden="true" size={15} strokeWidth={2.1} />
            </button>
          </div>

          <div
            className="ai-chat-box-react__messages"
            ref={chatMessagesRef}
            aria-live="polite"
          >
            {messages.map((message) => (
              <div
                className={`ai-message ai-message--${message.role}`}
                key={message.id}
              >
                <div className="ai-message__bubble">{message.text}</div>
                <div className="ai-message__time">{message.time}</div>
              </div>
            ))}

            {isTyping ? (
              <div className="ai-message ai-message--agent">
                <div className="ai-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            ) : null}
          </div>

          {showQuickReplies ? (
            <div className="ai-chat-box-react__quick-replies">
              {quickReplies.map((reply) => {
                const Icon = reply.icon

                return (
                  <button
                    className="ai-chat-box-react__quick-reply"
                    key={reply.label}
                    type="button"
                    onClick={() => queueReply(reply.prompt)}
                  >
                    <Icon aria-hidden="true" size={14} strokeWidth={2} />
                    <span>{reply.label}</span>
                  </button>
                )
              })}
            </div>
          ) : null}

          <form className="ai-chat-box-react__composer" onSubmit={handleSubmit}>
            <input
              className="ai-chat-box-react__input"
              type="text"
              name="ai-question"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask me anything about real estate..."
              autoComplete="off"
            />

            <button
              className="ai-chat-box-react__send"
              type="submit"
              aria-label="Send message"
              disabled={isTyping}
            >
              <SendHorizontal aria-hidden="true" size={18} strokeWidth={2.2} />
            </button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default AgentSection
