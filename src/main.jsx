import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MetricsProvider } from './context/metrics/MetricsContext.jsx'
import { PropertyListingsProvider } from './context/propertyListings/PropertyListingsContext.jsx'
import { SiteSectionsProvider } from './context/siteSections/SiteSectionsContext.jsx'
import { TestimonialsProvider } from './context/testimonials/TestimonialsContext.jsx'
import RootRouter from './RootRouter.jsx'
import './styles/main.scss'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteSectionsProvider>
      <PropertyListingsProvider>
        <TestimonialsProvider>
          <MetricsProvider>
            <RootRouter />
          </MetricsProvider>
        </TestimonialsProvider>
      </PropertyListingsProvider>
    </SiteSectionsProvider>
  </StrictMode>,
)
