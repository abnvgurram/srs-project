import './Dashboard.scss'

const overviewCards = [
  {
    label: 'Site Status',
    value: 'Draft Admin Shell',
    note: 'Editing controls will be connected after section wiring is approved.',
  },
  {
    label: 'Editable Sections',
    value: '12',
    note: 'Header through footer placeholders are now mapped in the admin shell.',
  },
  {
    label: 'Current Mode',
    value: 'Maintenance',
    note: 'Saving is still disabled while the section structure is being finalized.',
  },
]

function Dashboard() {
  return (
    <div className="dashboard-admin-section">
      <div className="dashboard-admin-section__header">
        <p className="dashboard-admin-section__eyebrow">Dashboard</p>
        <h2 className="dashboard-admin-section__title">Admin Overview</h2>
        <p className="dashboard-admin-section__copy">
          This dashboard will become the control center for editing website
          content, section visibility, and publishing workflows.
        </p>
      </div>

      <div className="dashboard-admin-section__grid">
        {overviewCards.map((card) => (
          <article className="dashboard-admin-section__card" key={card.label}>
            <span className="dashboard-admin-section__card-label">
              {card.label}
            </span>
            <strong className="dashboard-admin-section__card-value">
              {card.value}
            </strong>
            <p>{card.note}</p>
          </article>
        ))}
      </div>

      <article className="dashboard-admin-section__wide-card">
        <h3>Next Workflow Placeholder</h3>
        <p>
          Recent activity, draft state, last published time, and quick section
          shortcuts will live here once the editing forms are implemented.
        </p>
      </article>
    </div>
  )
}

export default Dashboard
