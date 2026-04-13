import './Inquiry.scss'

const formFields = ['Name', 'Email', 'Phone Number', 'Type of Service', 'Message']

function Inquiry() {
  return (
    <div className="inquiry-admin-section">
      <div className="inquiry-admin-section__header">
        <p className="inquiry-admin-section__eyebrow">Inquiry Form</p>
        <h2 className="inquiry-admin-section__title">Contact Flow</h2>
        <p className="inquiry-admin-section__copy">
          Inquiry section content, left-panel contact details, and form settings
          will be configured here.
        </p>
      </div>

      <div className="inquiry-admin-section__grid">
        <article className="inquiry-admin-section__card">
          <h3>Contact Details</h3>
          <p>
            Phone, email, and location rows will later be editable from this
            panel.
          </p>
        </article>

        <article className="inquiry-admin-section__card">
          <h3>Form Fields</h3>
          <ul>
            {formFields.map((field) => (
              <li key={field}>{field}</li>
            ))}
          </ul>
        </article>
      </div>
    </div>
  )
}

export default Inquiry
