import { useMemo, useState } from 'react'
import {
  BadgeCheck,
  HandCoins,
  PhoneCall,
  ReceiptText,
  ShieldCheck,
  UserCheck,
  Wrench,
} from 'lucide-react'
import Footer from '../../components/Footer/Footer.jsx'
import Header from '../../components/Header/Header.jsx'
import useSiteSections from '../../context/siteSections/useSiteSections.js'
import ServiceFaqAccordion from '../services/common/ServiceFaqAccordion.jsx'
import './Pricing.scss'

const coreManagementFees = [
  {
    title: 'Monthly Management Fee',
    fee: '5% of gross monthly rent',
    note: '$100 minimum per unit',
    description:
      'Covers rent collection, tenant communication, repair coordination, and ongoing VRLTA and DPOR compliance oversight.',
  },
  {
    title: 'Leasing / Tenant Placement Fee',
    fee: "50% of the first month's rent",
    note: 'Includes marketing and lease setup',
    description:
      'Includes marketing, photography, MLS syndication, tenant screening, lease preparation, brokerage administration, and move-in coordination.',
  },
  {
    title: 'Lease Renewal / Admin Fee',
    fee: '$250 per renewal',
    note: 'Annual renewal support',
    description:
      'Covers updated lease documentation, compliance review, renewal coordination, and execution.',
  },
  {
    title: 'Onboarding / Setup Fee',
    fee: '$250 one-time per property',
    note: 'Initial setup',
    description:
      'Includes inspection, account setup, escrow setup, and portal activation at onboarding.',
  },
]

const maintenanceServices = [
  {
    title: 'Maintenance Coordination Fee',
    fee: '10% of vendor invoice',
    description:
      'Includes vendor compliance checks, scheduling, follow-up, and quality control on repair execution.',
  },
  {
    title: 'Preventive Maintenance / Wellness Visit',
    fee: '$150 per scheduled visit',
    description:
      'Optional quarterly or semi-annual inspections for owners who want proactive oversight and early issue detection.',
  },
  {
    title: 'Move-In / Move-Out Inspection',
    fee: 'Included for managed clients',
    description:
      'Photo-documented inspections are treated as part of the service. Standalone reporting is typically valued at $250 per inspection.',
  },
]

const legalAndCompliance = [
  {
    title: 'Eviction Processing Fee',
    fee: '$300 plus court or attorney costs',
    description:
      'Includes filing support, court coordination, and sheriff scheduling when an eviction process is required.',
  },
  {
    title: 'Fair Housing & HOA Compliance',
    fee: 'Included in management services',
    description:
      'Management is handled with Virginia fair housing standards and HOA compliance requirements in mind.',
  },
]

const additionalServices = [
  {
    title: 'Vacancy Management',
    fee: 'Included with Siris',
    description:
      'No added charge is currently applied for vacancy oversight tied to utilities, lawn care, or HOA coordination under this service structure.',
  },
  {
    title: 'Bill Payment Services',
    fee: '$10 per utility or HOA bill',
    description:
      'Available when owners want recurring utility or HOA payments processed through management.',
  },
  {
    title: 'Broker Compliance / Admin Fee',
    fee: '$450 per lease transaction',
    description:
      'Minimum $250 per lease transaction depending on scope and compliance requirements.',
  },
  {
    title: 'Property Marketing Boost',
    fee: '$150',
    description:
      'Premium advertising support for Zillow, Apartments.com, and similar channels when stronger listing exposure is needed.',
  },
]

const pricingBenefits = [
  {
    title: 'Licensed Brokerage Oversight',
    description: 'Licensed Principal Broker support through Virginia DPOR and CVR MLS.',
    Icon: BadgeCheck,
  },
  {
    title: 'VRLTA Compliance',
    description: 'Management systems built with Virginia landlord-tenant compliance in view.',
    Icon: ShieldCheck,
  },
  {
    title: 'Transparent Accounting',
    description: 'Owner visibility through AppFolio reporting and online ticketing workflows.',
    Icon: ReceiptText,
  },
  {
    title: 'Tenant Screening & Retention',
    description: 'A defined screening process designed to support stronger placements and renewals.',
    Icon: UserCheck,
  },
  {
    title: 'Vendor Coordination',
    description: 'Strong vendor relationships with negotiated rates and repair follow-through.',
    Icon: Wrench,
  },
  {
    title: '24/7 Emergency Response',
    description: 'Emergency coordination so urgent issues are not left to ad hoc handling.',
    Icon: PhoneCall,
  },
]

const pricingFaqs = [
  {
    question: 'What does the monthly management fee typically cover?',
    answer:
      'The monthly fee is designed to cover rent collection, tenant communication, repair coordination, and the ongoing compliance oversight that keeps day-to-day management organized.',
  },
  {
    question: 'How are maintenance requests handled?',
    answer:
      'Maintenance is coordinated through vendor scheduling, follow-up, and quality control. Owners get a defined process instead of ad hoc repair handling.',
  },
  {
    question: 'Will owners be able to see reporting and account activity?',
    answer:
      'Yes. The management structure includes transparent accounting and portal-based visibility through AppFolio.',
  },
  {
    question: 'Is leasing support separate from monthly management?',
    answer:
      "Yes. Tenant placement is priced separately from ongoing monthly management because it covers marketing, screening, lease preparation, and move-in coordination.",
  },
]

function parseMoneyInput(value) {
  const numeric = Number(String(value).replace(/[^\d.]/g, ''))
  return Number.isFinite(numeric) ? numeric : 0
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

function Pricing({ currentPath }) {
  const [monthlyRent, setMonthlyRent] = useState('2500')
  const [repairInvoice, setRepairInvoice] = useState('300')
  const { sectionVisibility } = useSiteSections()

  const parsedRent = useMemo(() => parseMoneyInput(monthlyRent), [monthlyRent])
  const parsedRepairInvoice = useMemo(
    () => parseMoneyInput(repairInvoice),
    [repairInvoice],
  )

  const scenarioItems = useMemo(() => {
    const monthlyManagement =
      parsedRent > 0 ? Math.max(parsedRent * 0.05, 100) : 0
    const leasingFee = parsedRent * 0.5
    const maintenanceFee = parsedRepairInvoice * 0.1

    return [
      {
        label: `Monthly management on ${formatCurrency(parsedRent)} rent`,
        value: formatCurrency(monthlyManagement),
        detail: 'Calculated at 5% of rent with a $100 minimum per unit.',
        Icon: HandCoins,
      },
      {
        label: `Leasing fee on ${formatCurrency(parsedRent)} rent`,
        value: formatCurrency(leasingFee),
        detail: "Calculated at 50% of the first month's rent.",
        Icon: ReceiptText,
      },
      {
        label: 'Renewal fee in year two',
        value: formatCurrency(250),
        detail: 'Annual renewal and admin support.',
        Icon: BadgeCheck,
      },
      {
        label: `Maintenance coordination on ${formatCurrency(parsedRepairInvoice)} repair`,
        value: formatCurrency(maintenanceFee),
        detail: 'Calculated at 10% of the vendor invoice.',
        Icon: Wrench,
      },
    ]
  }, [parsedRent, parsedRepairInvoice])

  return (
    <div className="pricing-page-shell">
      {sectionVisibility.header ? <Header currentPath={currentPath} /> : null}

      <main className="pricing-page">
        <section className="pricing-page__hero">
          <div className="pricing-page__inner">
            <p className="pricing-page__eyebrow">Pricing</p>
            <h1 className="pricing-page__title">
              Transparent Pricing for Property Management Services
            </h1>
            <p className="pricing-page__summary">
              Review the current Siris Realty Group fee structure for
              management, leasing, renewals, inspections, and additional
              support services. This page is designed to make the operating
              costs easier to understand before you make a decision.
            </p>

            <div className="pricing-page__actions">
              <a className="pricing-page__primary" href="/#inquiry">
                Ask About Pricing
              </a>
            </div>
          </div>
        </section>

        <section className="pricing-page__section">
          <div className="pricing-page__inner">
            <div className="pricing-page__section-head">
              <p className="pricing-page__section-label">Core Management Fees</p>
              <h2>Fee structure for ongoing management and leasing support.</h2>
              <p>
                This structure is designed to show owners what is included in
                day-to-day management, where leasing support is priced
                separately, and how renewals and onboarding are handled.
              </p>
            </div>

            <div className="pricing-page__grid">
              {coreManagementFees.map((item) => (
                <article className="pricing-page__card" key={item.title}>
                  <h3>{item.title}</h3>
                  <div className="pricing-page__meta-list">
                    <p className="pricing-page__meta-line">
                      <strong>Fee:</strong> {item.fee}
                    </p>
                    <p className="pricing-page__meta-line">
                      <strong>Details:</strong> {item.note}
                    </p>
                  </div>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-page__section pricing-page__section--soft">
          <div className="pricing-page__inner pricing-page__inner--split">
            <article className="pricing-page__content-card">
              <p className="pricing-page__section-label">Maintenance & Inspections</p>
              <h2>Repair coordination and preventive oversight.</h2>
              <div className="pricing-page__list">
                {maintenanceServices.map((item) => (
                  <div className="pricing-page__list-item" key={item.title}>
                    <h3>{item.title}</h3>
                    <p className="pricing-page__meta-line">
                      <strong>Fee:</strong> {item.fee}
                    </p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="pricing-page__content-card">
              <p className="pricing-page__section-label">Legal & Compliance</p>
              <h2>Operational support with compliance in view.</h2>
              <div className="pricing-page__list">
                {legalAndCompliance.map((item) => (
                  <div className="pricing-page__list-item" key={item.title}>
                    <h3>{item.title}</h3>
                    <p className="pricing-page__meta-line">
                      <strong>Fee:</strong> {item.fee}
                    </p>
                    <p>{item.description}</p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>

        <section className="pricing-page__section">
          <div className="pricing-page__inner">
            <div className="pricing-page__section-head">
              <p className="pricing-page__section-label">Additional Services</p>
              <h2>Optional support and transaction-based charges.</h2>
            </div>

            <div className="pricing-page__grid">
              {additionalServices.map((item) => (
                <article className="pricing-page__card" key={item.title}>
                  <h3>{item.title}</h3>
                  <p className="pricing-page__meta-line">
                    <strong>Fee:</strong> {item.fee}
                  </p>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-page__section pricing-page__section--soft">
          <div className="pricing-page__inner">
            <div className="pricing-page__section-head">
              <p className="pricing-page__section-label">Sample Owner Scenario</p>
              <h2>See how the fees shift based on your numbers.</h2>
              <p>
                Enter your projected monthly rent and a sample repair invoice to
                preview how the standard management structure translates into
                actual dollar amounts.
              </p>
            </div>

            <div className="pricing-page__scenario-controls">
              <label className="pricing-page__scenario-field">
                <span>Monthly rent</span>
                <div className="pricing-page__scenario-input">
                  <span>$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={monthlyRent}
                    onChange={(event) => setMonthlyRent(event.target.value)}
                  />
                </div>
              </label>

              <label className="pricing-page__scenario-field">
                <span>Sample repair invoice</span>
                <div className="pricing-page__scenario-input">
                  <span>$</span>
                  <input
                    type="number"
                    min="0"
                    step="50"
                    value={repairInvoice}
                    onChange={(event) => setRepairInvoice(event.target.value)}
                  />
                </div>
              </label>
            </div>

            <div className="pricing-page__scenario-grid">
              {scenarioItems.map((item) => (
                <article className="pricing-page__scenario-card" key={item.label}>
                  <span className="pricing-page__scenario-icon" aria-hidden="true">
                    <item.Icon size={20} strokeWidth={2} />
                  </span>
                  <span className="pricing-page__scenario-value">{item.value}</span>
                  <h3>{item.label}</h3>
                  <p>{item.detail}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-page__section">
          <div className="pricing-page__inner">
            <div className="pricing-page__section-head">
              <p className="pricing-page__section-label">
                Why Choose Siris Realty Group
              </p>
              <h2>Operational strengths that matter to owners.</h2>
            </div>

            <div className="pricing-page__benefits">
              {pricingBenefits.map((benefit) => (
                <article className="pricing-page__benefit" key={benefit.title}>
                  <span className="pricing-page__benefit-icon" aria-hidden="true">
                    <benefit.Icon size={22} strokeWidth={2} />
                  </span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="pricing-page__section pricing-page__section--soft">
          <div className="pricing-page__inner">
            <div className="pricing-page__section-head">
              <p className="pricing-page__section-label">FAQ</p>
            </div>

            <ServiceFaqAccordion items={pricingFaqs} />
          </div>
        </section>
      </main>

      {sectionVisibility.footer ? <Footer currentPath={currentPath} /> : null}
    </div>
  )
}

export default Pricing
