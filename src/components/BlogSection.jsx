import {
  CalendarDays,
  ChartColumn,
  Clock3,
  GraduationCap,
  House,
  KeyRound,
  Lightbulb,
  NotebookPen,
} from 'lucide-react'

const featuredPost = {
  tag: 'Market Update',
  title: 'Richmond VA Real Estate Market: What Buyers and Sellers Need to Know in 2025',
  excerpt:
    "The Richmond metro area continues to show strong demand across Glen Allen, Henrico, and the West End. Inventory remains tight while interest rates are creating unique opportunities for both buyers and sellers. Here's what you need to know before making your next move.",
  icon: House,
  meta: [
    { label: 'Vijay Kanth', icon: NotebookPen },
    { label: 'March 2025', icon: CalendarDays },
    { label: '5 min read', icon: Clock3 },
  ],
}

const sidebarPosts = [
  {
    title: '5 Things First-Time Buyers Must Know Before Making an Offer',
    meta: 'February 2025 · Buying Tips',
    icon: Lightbulb,
  },
  {
    title: "How to Price Your Home Right the First Time - A Seller's Guide",
    meta: 'January 2025 · Selling Tips',
    icon: ChartColumn,
  },
  {
    title: 'Is Becoming a Landlord Worth It in Virginia? A Realistic Look',
    meta: 'December 2024 · Investment',
    icon: KeyRound,
  },
  {
    title: 'Best School Districts in Henrico County - A Neighborhood Guide',
    meta: 'November 2024 · Neighborhood',
    icon: GraduationCap,
  },
]

function BlogSection() {
  const FeaturedIcon = featuredPost.icon

  return (
    <section className="blog-section" id="blog">
      <div className="blog-section__inner">
        <header className="blog-section__header">
          <p className="blog-section__eyebrow">Resources &amp; Insights</p>
          <h2 className="blog-section__title">Real Estate Tips &amp; Market Updates</h2>
          <p className="blog-section__copy">
            Stay informed with the latest market trends, home buying tips, and
            investment insights for the Richmond VA area.
          </p>
        </header>

        <div className="blog-section__grid">
          <article className="blog-featured-card">
            <div className="blog-featured-card__visual" aria-hidden="true">
              <FeaturedIcon size={72} strokeWidth={1.75} />
            </div>

            <div className="blog-featured-card__body">
              <span className="blog-featured-card__tag">{featuredPost.tag}</span>
              <h3 className="blog-featured-card__title">{featuredPost.title}</h3>
              <p className="blog-featured-card__excerpt">{featuredPost.excerpt}</p>

              <div className="blog-featured-card__meta">
                {featuredPost.meta.map((item) => {
                  const Icon = item.icon

                  return (
                    <span className="blog-featured-card__meta-item" key={item.label}>
                      <Icon size={14} />
                      <span>{item.label}</span>
                    </span>
                  )
                })}
              </div>
            </div>
          </article>

          <div className="blog-sidebar">
            {sidebarPosts.map((post) => {
              const Icon = post.icon

              return (
                <article className="blog-sidebar-card" key={post.title}>
                  <div className="blog-sidebar-card__icon" aria-hidden="true">
                    <Icon size={24} />
                  </div>

                  <div>
                    <h3 className="blog-sidebar-card__title">{post.title}</h3>
                    <p className="blog-sidebar-card__meta">{post.meta}</p>
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BlogSection
