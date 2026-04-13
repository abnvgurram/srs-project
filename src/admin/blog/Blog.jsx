import './Blog.scss'

function Blog() {
  return (
    <div className="blog-admin-section">
      <div className="blog-admin-section__header">
        <p className="blog-admin-section__eyebrow">Blog / Resources</p>
        <h2 className="blog-admin-section__title">Content Section</h2>
        <p className="blog-admin-section__copy">
          The featured article, secondary resources, and section messaging will
          be controlled here later.
        </p>
      </div>

      <div className="blog-admin-section__layout">
        <article className="blog-admin-section__feature">
          <h3>Featured Story Placeholder</h3>
          <p>
            Main article card title, excerpt, media, and CTA will be editable in
            this area.
          </p>
        </article>

        <article className="blog-admin-section__sidebar">
          <h3>Secondary Resources</h3>
          <ul>
            <li>Resource card 01</li>
            <li>Resource card 02</li>
            <li>Resource card 03</li>
            <li>Resource card 04</li>
          </ul>
        </article>
      </div>
    </div>
  )
}

export default Blog
