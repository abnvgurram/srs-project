import { useMemo, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import './Dashboard.scss'
import { siteSections } from '../../config/siteSections.js'
import useSiteSections from '../../context/siteSections/useSiteSections.js'

function Dashboard() {
  const {
    isLoading,
    isSaving,
    sectionVisibility,
    setMultipleSectionsEnabled,
    setSectionEnabled,
  } = useSiteSections()
  const [selectedKeys, setSelectedKeys] = useState([])

  const activeSections = useMemo(
    () => siteSections.filter((section) => sectionVisibility[section.key]),
    [sectionVisibility],
  )
  const inactiveSections = useMemo(
    () => siteSections.filter((section) => !sectionVisibility[section.key]),
    [sectionVisibility],
  )

  const selectedKeySet = useMemo(() => new Set(selectedKeys), [selectedKeys])
  const selectedActiveKeys = activeSections
    .filter((section) => selectedKeySet.has(section.key))
    .map((section) => section.key)
  const selectedInactiveKeys = inactiveSections
    .filter((section) => selectedKeySet.has(section.key))
    .map((section) => section.key)
  const isBusy = isLoading || isSaving
  const hasAnySelection = selectedKeys.length > 0

  function handleCheckboxChange(sectionKey, isChecked) {
    setSelectedKeys((currentSelectedKeys) => {
      if (isChecked) {
        return currentSelectedKeys.includes(sectionKey)
          ? currentSelectedKeys
          : [...currentSelectedKeys, sectionKey]
      }

      return currentSelectedKeys.filter((key) => key !== sectionKey)
    })
  }

  async function handleBulkUpdate(sectionKeys, isEnabled) {
    if (!sectionKeys.length || isBusy) return

    const didSave = await setMultipleSectionsEnabled(sectionKeys, isEnabled)

    if (didSave) {
      setSelectedKeys((currentSelectedKeys) =>
        currentSelectedKeys.filter((key) => !sectionKeys.includes(key)),
      )
    }
  }

  async function handleSingleToggle(sectionKey, isEnabled) {
    if (isBusy) return

    await setSectionEnabled(sectionKey, isEnabled)
  }

  function renderSectionGroup(groupLabel, sections) {
    return (
      <section className="dashboard-admin-section__group">
        <p className="dashboard-admin-section__group-eyebrow">{groupLabel}</p>

        {sections.length ? (
          <div className="dashboard-admin-section__list">
            {sections.map((section) => {
              const isEnabled = sectionVisibility[section.key]

              return (
                <article className="dashboard-admin-section__row" key={section.key}>
                  <input
                    className="dashboard-admin-section__checkbox"
                    id={`dashboard-section-${section.key}`}
                    type="checkbox"
                    checked={selectedKeySet.has(section.key)}
                    disabled={isBusy}
                    onChange={(event) =>
                      handleCheckboxChange(section.key, event.target.checked)
                    }
                  />

                  <label
                    className="dashboard-admin-section__row-title"
                    htmlFor={`dashboard-section-${section.key}`}
                  >
                    {section.label}
                  </label>

                  <button
                    className={`dashboard-admin-section__toggle${
                      isEnabled ? ' is-active' : ''
                    }`}
                    type="button"
                    role="switch"
                    aria-checked={isEnabled}
                    aria-label={`Toggle ${section.label}`}
                    disabled={isBusy}
                    onClick={() => handleSingleToggle(section.key, !isEnabled)}
                  >
                    <span className="dashboard-admin-section__toggle-thumb"></span>
                  </button>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="dashboard-admin-section__empty">
            No sections in this group.
          </div>
        )}
      </section>
    )
  }

  return (
    <div className="dashboard-admin-section">
      <div className="dashboard-admin-section__header">
        <p className="dashboard-admin-section__eyebrow">Dashboard</p>
        <h2 className="dashboard-admin-section__title">Section Visibility</h2>
        <p className="dashboard-admin-section__copy">
          Select rows for bulk actions, or use the row toggle to change a single
          section immediately.
        </p>
      </div>

      {hasAnySelection ? (
        <div className="dashboard-admin-section__actions">
          {selectedActiveKeys.length ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleBulkUpdate(selectedActiveKeys, false)}
            >
              <EyeOff aria-hidden="true" size={16} strokeWidth={2.2} />
              <span>Hide {selectedActiveKeys.length} Selected</span>
            </button>
          ) : null}

          {selectedInactiveKeys.length ? (
            <button
              type="button"
              disabled={isBusy}
              onClick={() => handleBulkUpdate(selectedInactiveKeys, true)}
            >
              <Eye aria-hidden="true" size={16} strokeWidth={2.2} />
              <span>Show {selectedInactiveKeys.length} Selected</span>
            </button>
          ) : null}

          <button
            type="button"
            disabled={isBusy}
            onClick={() => setSelectedKeys([])}
          >
            <span>Clear</span>
          </button>
        </div>
      ) : null}

      <div className="dashboard-admin-section__stack">
        {renderSectionGroup('Active', activeSections)}
        {renderSectionGroup('Inactive', inactiveSections)}
      </div>
    </div>
  )
}

export default Dashboard
