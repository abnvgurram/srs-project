import AgentSection from './components/AgentSection.jsx'
import BlogSection from './components/BlogSection.jsx'
import CtaSection from './components/CtaSection.jsx'
import InquirySection from './components/InquirySection.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import HeroSection from './components/HeroSection.jsx'
import PropertiesSection from './components/PropertiesSection.jsx'
import ServicesSection from './components/ServicesSection.jsx'
import TestimonialsSection from './components/TestimonialsSection.jsx'
import WhySection from './components/WhySection.jsx'

function App() {
  return (
    <div className="app-shell">
      <Header />
      <HeroSection />
      <AgentSection />
      <ServicesSection />
      <PropertiesSection />
      <WhySection />
      <TestimonialsSection />
      <BlogSection />
      <CtaSection />
      <InquirySection />
      <Footer />
    </div>
  )
}

export default App
