import {
  BadgeDollarSign,
  CalendarDays,
  MapPinned,
  ShieldCheck,
  Target,
  Trophy,
} from 'lucide-react'
import './WhySection.scss'

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

const stats = [
  {
    value: '128+',
    label: 'Successful Closings',
    icon: Trophy,
  },
  {
    value: '$1.3M',
    label: 'Top Sale Value',
    icon: BadgeDollarSign,
  },
  {
    value: '5.0',
    label: 'Average Zillow Rating',
    icon: Trophy,
  },
  {
    value: '2017',
    label: 'Licensed Since',
    icon: CalendarDays,
  },
]

function WhySection() {
  return (
    <section className="why-section" id="why">
      <div className="why-section__circle why-section__circle--large" aria-hidden="true"></div>
      <div className="why-section__circle why-section__circle--small" aria-hidden="true"></div>

      <div className="why-section__inner">
        <div className="why-section__content">
          <div className="why-section__left">
            <p className="why-section__eyebrow">Why Choose Us</p>
            <h2 className="why-section__title">A Realtor Who&apos;s Always In Your Corner</h2>
            <p className="why-section__copy">
              Vijay Kanth is a full-time, dedicated realtor, not a part-time
              agent. That means you get expert attention, fast response times,
              and unwavering advocacy throughout your real estate journey.
            </p>

            <div className="why-section__features">
              {features.map((feature) => {
                const Icon = feature.icon

                return (
                  <article className="why-feature-react" key={feature.title}>
                    <span className="why-feature-react__icon" aria-hidden="true">
                      <Icon size={20} />
                    </span>

                    <div className="why-feature-react__body">
                      <h3>{feature.title}</h3>
                      <p>{feature.body}</p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>

          <div className="why-section__right">
            {stats.map((stat) => {
              const Icon = stat.icon

              return (
                <article className="why-stat-react" key={stat.label}>
                  <span className="why-stat-react__icon" aria-hidden="true">
                    <Icon size={28} />
                  </span>

                  <div>
                    <p className="why-stat-react__value">{stat.value}</p>
                    <p className="why-stat-react__label">{stat.label}</p>
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

export default WhySection
