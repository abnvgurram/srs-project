import Footer from '../../../components/Footer/Footer.jsx'
import Header from '../../../components/Header/Header.jsx'
import useSiteSections from '../../../context/siteSections/useSiteSections.js'
import ServiceFaqAccordion from '../common/ServiceFaqAccordion.jsx'
import './SellYourHome.scss'

const sellerPillars = [
  {
    title: 'Pricing Strategy',
    copy:
      'A strong launch starts with a pricing plan tied to current demand, nearby competition, and the condition of the home, not just a target number on paper.',
  },
  {
    title: 'Preparation & Launch',
    copy:
      'Presentation matters. The right prep, media plan, and launch timing can shape how buyers respond in the first days a listing hits the market.',
  },
  {
    title: 'Negotiation & Closing',
    copy:
      'The best offer is not always the one with the highest headline price. Terms, financing strength, contingencies, and timeline all affect the final outcome.',
  },
]

const sellerFaqs = [
  {
    question: 'When should I start preparing my home for sale?',
    answer:
      'As early as possible. Small repair decisions, decluttering, staging choices, and pricing preparation tend to go better when they are not rushed into the week before launch.',
  },
  {
    question: 'What does a seller usually need most before going live?',
    answer:
      'Clear pricing guidance, a realistic preparation list, and a launch plan that explains what happens before showings begin and after offers start coming in.',
  },
  {
    question: 'How should sellers evaluate multiple offers?',
    answer:
      'Look beyond price alone. Closing timeline, financing type, contingencies, repair expectations, and certainty of execution all matter to net outcome.',
  },
]

function SellYourHome({ currentPath }) {
  const { sectionVisibility } = useSiteSections()

  return (
    <div className="sell-home-page-shell">
      {sectionVisibility.header ? <Header currentPath={currentPath} /> : null}

      <main className="sell-home-page">
        <section className="sell-home-page__hero">
          <div className="sell-home-page__inner">
            <p className="sell-home-page__eyebrow">Sell Your Home</p>
            <h1 className="sell-home-page__title">
              Sell With Better Positioning, Cleaner Preparation, and Stronger Offer Review
            </h1>
            <p className="sell-home-page__summary">
              Selling well is not just about putting a property on the market.
              It is about choosing the right price, preparing the home with
              intention, launching with quality, and handling offers with a
              disciplined strategy.
            </p>

            <div className="sell-home-page__actions">
              <a className="sell-home-page__primary" href="/#inquiry">
                Request a Seller Consultation
              </a>
            </div>
          </div>
        </section>

        <section className="sell-home-page__section">
          <div className="sell-home-page__inner sell-home-page__inner--grid">
            {sellerPillars.map((pillar) => (
              <article className="sell-home-page__pillar" key={pillar.title}>
                <p className="sell-home-page__pillar-label">{pillar.title}</p>
                <p>{pillar.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="sell-home-page__section sell-home-page__section--soft">
          <div className="sell-home-page__inner sell-home-page__inner--split">
            <article className="sell-home-page__content-card">
              <p className="sell-home-page__section-label">Before You Launch</p>
              <h2>Prepare the listing before buyers ever see it.</h2>
              <p>
                The strongest seller launches usually come from preparation done
                in advance: pricing analysis, staging decisions, photography,
                showing readiness, and a clear plan for how the property will be
                presented from day one.
              </p>
            </article>

            <article className="sell-home-page__content-card">
              <p className="sell-home-page__section-label">After Offers Arrive</p>
              <h2>Compare certainty, terms, and net result together.</h2>
              <p>
                Offer review works best when price, contingencies, financing,
                closing timing, repair exposure, and overall execution risk are
                weighed together instead of in isolation.
              </p>
            </article>
          </div>
        </section>

        <section className="sell-home-page__section">
          <div className="sell-home-page__inner">
            <div className="sell-home-page__section-head">
              <p className="sell-home-page__section-label">FAQ</p>
            </div>

            <ServiceFaqAccordion items={sellerFaqs} />
          </div>
        </section>
      </main>

      {sectionVisibility.footer ? <Footer currentPath={currentPath} /> : null}
    </div>
  )
}

export default SellYourHome
