import './Header.scss'
import SectionVisibilityGate from '../common/sectionVisibilityGate/SectionVisibilityGate.jsx'

const navItems = ['Services', 'Properties', 'Why Us', 'Reviews', 'Blog', 'Contact Us']

function Header() {
  return (
    <SectionVisibilityGate sectionKey="header">
      <div className="header-admin-section">
        <div className="header-admin-section__header">
          <p className="header-admin-section__eyebrow">Header</p>
          <h2 className="header-admin-section__title">Navigation Controls</h2>
          <p className="header-admin-section__copy">
            This section will later manage brand text, menu visibility, call CTA,
            sticky behavior, and mobile navigation.
          </p>
        </div>

        <div className="header-admin-section__panel">
          <h3>Menu Items Placeholder</h3>
          <div className="header-admin-section__chips">
            {navItems.map((item) => (
              <span className="header-admin-section__chip" key={item}>
                {item}
              </span>
            ))}
          </div>
        </div>

        <div className="header-admin-section__grid">
          <article className="header-admin-section__card">
            <h3>Brand Block</h3>
            <p>
              Logo visibility, title text, and subtitle line will become editable
              here.
            </p>
          </article>

          <article className="header-admin-section__card">
            <h3>CTA Settings</h3>
            <p>
              Call button text, destination, and menu ordering controls will be
              added in this panel.
            </p>
          </article>
        </div>
      </div>
    </SectionVisibilityGate>
  )
}

export default Header
