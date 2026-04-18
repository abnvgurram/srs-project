import useSiteSections from '../../../context/siteSections/useSiteSections.js'
import { isSiteSectionEditable } from '../../../config/siteSections.js'
import './SectionVisibilityGate.scss'

function SectionVisibilityGate({ children, sectionKey }) {
  const { isLoading, isSaving, sectionVisibility, setSectionEnabled } =
    useSiteSections()
  const isEnabled = Boolean(sectionVisibility[sectionKey])
  const isBusy = isLoading || isSaving
  const isEditable = isSiteSectionEditable(sectionKey)

  async function handleToggle() {
    if (isBusy || !isEditable) return
    await setSectionEnabled(sectionKey, !isEnabled)
  }

  return (
    <div className="section-visibility-gate">
      <div className="section-visibility-gate__top">
        <div className="section-visibility-gate__copy">
          <p className="section-visibility-gate__label">Show on website</p>
        </div>

        <button
          className={`section-visibility-gate__toggle${
            isEnabled ? ' is-active' : ''
          }`}
          type="button"
          role="switch"
          aria-checked={isEnabled}
          aria-label="Show on website"
          disabled={isBusy || !isEditable}
          onClick={handleToggle}
        >
          <span className="section-visibility-gate__thumb"></span>
        </button>
      </div>

      {isEnabled ? children : null}
    </div>
  )
}

export default SectionVisibilityGate
