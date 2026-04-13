import './Properties.scss'

const filters = ['All', 'For Sale', 'For Rent', 'Recently Sold']

function Properties() {
  return (
    <div className="properties-admin-section">
      <div className="properties-admin-section__header">
        <p className="properties-admin-section__eyebrow">Featured Listings</p>
        <h2 className="properties-admin-section__title">Listings Control</h2>
        <p className="properties-admin-section__copy">
          Filters, listing cards, pricing display, and external listing links
          will later be editable here.
        </p>
      </div>

      <div className="properties-admin-section__filters">
        {filters.map((filter) => (
          <span className="properties-admin-section__filter" key={filter}>
            {filter}
          </span>
        ))}
      </div>

      <div className="properties-admin-section__grid">
        <article className="properties-admin-section__card">
          <h3>Listing Data</h3>
          <p>
            Property cards will be created, reordered, hidden, or updated from
            this panel.
          </p>
        </article>

        <article className="properties-admin-section__card">
          <h3>External Actions</h3>
          <p>
            Zillow and Homes.com link targets plus button labels will be
            controlled here.
          </p>
        </article>
      </div>
    </div>
  )
}

export default Properties
