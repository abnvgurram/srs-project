import { useEffect } from 'react'
import AgentSection from './components/Agent/AgentSection.jsx'
import AboutUsSection from './components/AboutUs/AboutUsSection.jsx'
import BlogSection from './components/Blog/BlogSection.jsx'
import CtaSection from './components/Cta/CtaSection.jsx'
import InquirySection from './components/Inquiry/InquirySection.jsx'
import MetricsSection from './components/Metrics/MetricsSection.jsx'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import HeroSection from './components/Hero/HeroSection.jsx'
import PropertiesSection from './components/Properties/propertiesSection/PropertiesSection.jsx'
import ServicesSection from './components/Services/ServicesSection.jsx'
import TestimonialsSection from './components/Testimonials/TestimonialsSection.jsx'
import useSiteSections from './context/siteSections/useSiteSections.js'
import { getHomeSectionIdFromPath } from './utils/siteNavigation.js'

function App({ currentPath = '/' }) {
  const { sectionVisibility } = useSiteSections()

  useEffect(() => {
    const sectionId = getHomeSectionIdFromPath(currentPath)

    if (!sectionId) return undefined

    const timeoutId = window.setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }, 80)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [currentPath])

  return (
    <div className="app-shell">
      {sectionVisibility.header && <Header currentPath={currentPath} />}
      {sectionVisibility.hero && <HeroSection />}
      {sectionVisibility.hero && <MetricsSection />}
      {sectionVisibility.agent && <AgentSection />}
      {sectionVisibility.services && <ServicesSection />}
      {sectionVisibility.properties && <PropertiesSection />}
      {sectionVisibility['about-us'] && <AboutUsSection />}
      {sectionVisibility.testimonials && <TestimonialsSection />}
      {sectionVisibility.blog && <BlogSection />}
      {sectionVisibility.cta && <CtaSection />}
      {sectionVisibility.inquiry && <InquirySection />}
      {sectionVisibility.footer && <Footer currentPath={currentPath} />}
    </div>
  )
}

export default App
