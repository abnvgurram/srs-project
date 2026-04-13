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
