import './Why.scss'
import SectionVisibilityGate from '../common/SectionVisibilityGate.jsx'

const proofItems = ['Market Guidance', 'Negotiation Strength', 'Property Management', 'Client Care']

function Why() {
  return (
    <SectionVisibilityGate sectionKey="why">
      <div className="why-admin-section">
        <div className="why-admin-section__header">
          <p className="why-admin-section__eyebrow">Why Us</p>
          <h2 className="why-admin-section__title">Trust Section</h2>
          <p className="why-admin-section__copy">
            This section will later manage differentiators, stats, and the
            narrative that supports Siris Realty&apos;s positioning.
          </p>
        </div>

        <div className="why-admin-section__list">
          {proofItems.map((item) => (
            <article className="why-admin-section__item" key={item}>
              <h3>{item}</h3>
              <p>Placeholder for supporting copy and proof-point visibility.</p>
            </article>
          ))}
        </div>
      </div>
    </SectionVisibilityGate>
  )
}

export default Why
