import AgentSection from './components/Agent/AgentSection.jsx'
import BlogSection from './components/Blog/BlogSection.jsx'
import CtaSection from './components/Cta/CtaSection.jsx'
import InquirySection from './components/Inquiry/InquirySection.jsx'
import Footer from './components/Footer/Footer.jsx'
import Header from './components/Header/Header.jsx'
import HeroSection from './components/Hero/HeroSection.jsx'
import PropertiesSection from './components/Properties/PropertiesSection.jsx'
import ServicesSection from './components/Services/ServicesSection.jsx'
import TestimonialsSection from './components/Testimonials/TestimonialsSection.jsx'
import WhySection from './components/Why/WhySection.jsx'
import useSiteSections from './context/siteSections/useSiteSections.js'

function App() {
  const { sectionVisibility } = useSiteSections()

  return (
    <div className="app-shell">
      {sectionVisibility.header && <Header />}
      {sectionVisibility.hero && <HeroSection />}
      {sectionVisibility.agent && <AgentSection />}
      {sectionVisibility.services && <ServicesSection />}
      {sectionVisibility.properties && <PropertiesSection />}
      {sectionVisibility.why && <WhySection />}
      {sectionVisibility.testimonials && <TestimonialsSection />}
      {sectionVisibility.blog && <BlogSection />}
      {sectionVisibility.cta && <CtaSection />}
      {sectionVisibility.inquiry && <InquirySection />}
      {sectionVisibility.footer && <Footer />}
    </div>
  )
}

export default App
