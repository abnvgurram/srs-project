import './AboutUs.scss'
import SectionVisibilityGate from '../common/sectionVisibilityGate/SectionVisibilityGate.jsx'

const proofItems = ['Market Guidance', 'Negotiation Strength', 'Property Management', 'Client Care']

function AboutUs() {
  return (
    <SectionVisibilityGate sectionKey="about-us">
      <div className="about-us-admin-section">
        <div className="about-us-admin-section__header">
          <p className="about-us-admin-section__eyebrow">About Us</p>
          <h2 className="about-us-admin-section__title">About Us Section</h2>
          <p className="about-us-admin-section__copy">
            This section will later manage differentiators, stats, and the
            narrative that supports Siris Realty&apos;s positioning.
          </p>
        </div>

        <div className="about-us-admin-section__list">
          {proofItems.map((item) => (
            <article className="about-us-admin-section__item" key={item}>
              <h3>{item}</h3>
              <p>Placeholder for supporting copy and proof-point visibility.</p>
            </article>
          ))}
        </div>
      </div>
    </SectionVisibilityGate>
  )
}

export default AboutUs
