import './Footer.scss'
import SectionVisibilityGate from '../common/sectionVisibilityGate/SectionVisibilityGate.jsx'

const footerGroups = ['Brand', 'Services', 'Resources', 'Contact']

function Footer() {
  return (
    <SectionVisibilityGate sectionKey="footer">
      <div className="footer-admin-section">
        <div className="footer-admin-section__header">
          <p className="footer-admin-section__eyebrow">Footer</p>
          <h2 className="footer-admin-section__title">Footer Layout</h2>
          <p className="footer-admin-section__copy">
            Footer columns, contact details, social links, and legal copy will be
            managed here.
          </p>
        </div>

        <div className="footer-admin-section__grid">
          {footerGroups.map((group) => (
            <article className="footer-admin-section__card" key={group}>
              <h3>{group}</h3>
              <p>Placeholder for links, labels, and ordering controls.</p>
            </article>
          ))}
        </div>
      </div>
    </SectionVisibilityGate>
  )
}

export default Footer
