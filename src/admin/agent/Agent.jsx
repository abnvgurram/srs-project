import './Agent.scss'
import SectionVisibilityGate from '../common/SectionVisibilityGate.jsx'

const quickReplies = [
  'Buy a Home',
  'Sell My Home',
  'Property Management',
  'Service Areas',
]

function Agent() {
  return (
    <SectionVisibilityGate sectionKey="agent">
      <div className="agent-admin-section">
        <div className="agent-admin-section__header">
          <p className="agent-admin-section__eyebrow">Agent Section</p>
          <h2 className="agent-admin-section__title">AI Experience</h2>
          <p className="agent-admin-section__copy">
            This placeholder will later manage assistant copy, quick-reply chips,
            canned responses, and chat reset behavior.
          </p>
        </div>

        <article className="agent-admin-section__card">
          <h3>Quick Replies</h3>
          <div className="agent-admin-section__replies">
            {quickReplies.map((reply) => (
              <span className="agent-admin-section__reply" key={reply}>
                {reply}
              </span>
            ))}
          </div>
        </article>

        <article className="agent-admin-section__card">
          <h3>Response Library Placeholder</h3>
          <p>
            Buying, selling, management, and service-area responses will be edited
            here once the admin editor is connected.
          </p>
        </article>
      </div>
    </SectionVisibilityGate>
  )
}

export default Agent
