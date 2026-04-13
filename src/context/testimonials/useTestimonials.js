import { useContext } from 'react'
import TestimonialsContext from './testimonialsContext.js'

function useTestimonials() {
  const context = useContext(TestimonialsContext)

  if (!context) {
    throw new Error('useTestimonials must be used within TestimonialsProvider')
  }

  return context
}

export default useTestimonials
