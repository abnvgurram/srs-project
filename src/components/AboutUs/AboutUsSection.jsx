import {
  BadgeDollarSign,
  CalendarDays,
  MapPinned,
  ShieldCheck,
  Target,
  Trophy,
} from 'lucide-react'
import useMetrics from '../../context/metrics/useMetrics.js'
import './AboutUsSection.scss'

const features = [
  {
    title: 'Full-Time Expert',
    body: "Not a side hustle - real estate is Vijay's only profession. You get 100% commitment, every time.",
    icon: Target,
  },
  {
    title: 'Negotiation Specialist',
    body: 'ABR and SRS certified with a track record of winning deals in competitive markets.',
    icon: ShieldCheck,
  },
  {
    title: 'Deep Local Knowledge',
    body: 'From Wyndham to Short Pump, Southside to NOVA, Vijay knows the neighborhoods, school districts, and market trends.',
    icon: MapPinned,
  },
  {
    title: 'End-to-End Support',
    body: 'From your first search through closing day and beyond, Vijay stays available to answer every question.',
    icon: CalendarDays,
  },
]

const statIcons = [Trophy, BadgeDollarSign, Trophy, CalendarDays]

function AboutUsSection() {
  const { metrics } = useMetrics()

  return (
    <section className="about-us-section" id="about-us">
      <div className="about-us-section__circle about-us-section__circle--large" aria-hidden="true"></div>
      <div className="about-us-section__circle about-us-section__circle--small" aria-hidden="true"></div>

      <div className="about-us-section__inner">
        <div className="about-us-section__content">
          <div className="about-us-section__left">
            <p className="about-us-section__eyebrow">About Us</p>
            <h2 className="about-us-section__title">A Realtor Who&apos;s Always In Your Corner</h2>
            <p className="about-us-section__copy">
              Vijay Kanth is a full-time, dedicated realtor, not a part-time
              agent. That means you get expert attention, fast response times,
              and unwavering advocacy throughout your real estate journey.
            </p>

            <div className="about-us-section__features">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <article className="about-us-feature-react" key={feature.title}>
                    <span className="about-us-feature-react__icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>

                    <div className="about-us-feature-react__body">
                      <h3>{feature.title}</h3>
                      <p>{feature.body}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="about-us-section__right">
            {metrics.map((metric, index) => {
              const Icon = statIcons[index] ?? Trophy

              return (
                <article className="about-us-stat-react" key={metric.id}>
                  <span className="about-us-stat-react__icon" aria-hidden="true">
                    <Icon size={28} />
                  </span>

                  <div>
                    <p className="about-us-stat-react__value">{metric.value}</p>
                    <p className="about-us-stat-react__label">{metric.label}</p>
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

export default AboutUsSection
