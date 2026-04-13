import './Cta.scss'
import SectionVisibilityGate from '../common/SectionVisibilityGate.jsx'

const chips = ['Glen Allen', 'Richmond', 'Henrico', 'Short Pump', 'West End']

function Cta() {
  return (
    <SectionVisibilityGate sectionKey="cta">
      <div className="cta-admin-section">
        <div className="cta-admin-section__header">
          <p className="cta-admin-section__eyebrow">CTA</p>
          <h2 className="cta-admin-section__title">Bottom Call To Action</h2>
          <p className="cta-admin-section__copy">
            This section will later manage the closing message, CTA buttons, and
            service-area chips above the inquiry form.
          </p>
        </div>

        <article className="cta-admin-section__card">
          <h3>Area Chips Placeholder</h3>
          <div className="cta-admin-section__chips">
            {chips.map((chip) => (
              <span className="cta-admin-section__chip" key={chip}>
                {chip}
              </span>
            ))}
          </div>
        </article>
      </div>
    </SectionVisibilityGate>
  )
}

export default Cta
