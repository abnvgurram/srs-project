import { useEffect, useState } from 'react'
import {
  normalizeTestimonial,
  toTestimonialRecord,
} from '../../data/testimonials.js'
import { hasSupabaseConfig, supabase } from '../../lib/supabase.js'
import TestimonialsContext from './testimonialsContext.js'

const TESTIMONIALS_TABLE = 'testimonials'

function TestimonialsProvider({ children }) {
  const [testimonials, setTestimonials] = useState([])
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadTestimonials() {
      if (!hasSupabaseConfig) {
        setIsLoading(false)
        setErrorMessage('')
        return
      }

      const { data, error } = await supabase
        .from(TESTIMONIALS_TABLE)
        .select('*')
        .order('display_order', { ascending: true })

      if (isCancelled) return

      if (error) {
        setErrorMessage(
          'Unable to load testimonials from Supabase. Run the testimonials SQL setup first.',
        )
        setIsLoading(false)
        return
      }

      setTestimonials(
        (data ?? []).map((testimonial, index) =>
          normalizeTestimonial(testimonial, index),
        ),
      )
      setErrorMessage('')
      setIsLoading(false)
    }

    loadTestimonials()

    return () => {
      isCancelled = true
    }
  }, [])

  async function saveTestimonial(testimonialInput) {
    const testimonialIndex = testimonials.findIndex(
      (testimonial) => testimonial.id === testimonialInput.id,
    )
    const nextDisplayOrder =
      testimonials.reduce(
        (highestOrder, testimonial) =>
          Math.max(highestOrder, Number(testimonial.displayOrder) || 0),
        0,
      ) + 1
    const normalizedTestimonial = normalizeTestimonial(
      {
        ...testimonialInput,
        id: testimonialInput.id ?? crypto.randomUUID(),
        displayOrder:
          testimonialInput.displayOrder ??
          (testimonialIndex >= 0
            ? testimonials[testimonialIndex].displayOrder
            : nextDisplayOrder),
      },
      testimonialIndex >= 0 ? testimonialIndex : testimonials.length,
    )

    if (!hasSupabaseConfig) {
      setErrorMessage(
        'Supabase is not configured yet. Add the environment variables before saving testimonials.',
      )
      return null
    }

    setIsSaving(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from(TESTIMONIALS_TABLE)
      .upsert(toTestimonialRecord(normalizedTestimonial), { onConflict: 'id' })
      .select('*')
      .single()

    if (error) {
      setErrorMessage(
        'Unable to save the testimonial in Supabase. Check the testimonials table policies.',
      )
      setIsSaving(false)
      return null
    }

    const savedTestimonial = normalizeTestimonial(
      data,
      testimonialIndex >= 0 ? testimonialIndex : testimonials.length,
    )

    setTestimonials((currentTestimonials) => {
      const existingIndex = currentTestimonials.findIndex(
        (testimonial) => testimonial.id === savedTestimonial.id,
      )

      if (existingIndex === -1) {
        return [...currentTestimonials, savedTestimonial].sort(
          (left, right) => left.displayOrder - right.displayOrder,
        )
      }

      return currentTestimonials
        .map((testimonial) =>
          testimonial.id === savedTestimonial.id ? savedTestimonial : testimonial,
        )
        .sort((left, right) => left.displayOrder - right.displayOrder)
    })

    setIsSaving(false)
    return savedTestimonial
  }

  async function deleteTestimonial(testimonialId) {
    if (!hasSupabaseConfig) {
      setErrorMessage(
        'Supabase is not configured yet. Add the environment variables before deleting testimonials.',
      )
      return false
    }

    setIsSaving(true)
    setErrorMessage('')

    const { error } = await supabase
      .from(TESTIMONIALS_TABLE)
      .delete()
      .eq('id', testimonialId)

    if (error) {
      setErrorMessage(
        'Unable to delete the testimonial in Supabase. Check the testimonials table policies.',
      )
      setIsSaving(false)
      return false
    }

    setTestimonials((currentTestimonials) =>
      currentTestimonials.filter((testimonial) => testimonial.id !== testimonialId),
    )
    setIsSaving(false)
    return true
  }

  async function setTestimonialPublished(testimonialId, isPublished) {
    const testimonial = testimonials.find((item) => item.id === testimonialId)

    if (!testimonial) return false

    const savedTestimonial = await saveTestimonial({
      ...testimonial,
      isPublished,
    })

    return Boolean(savedTestimonial)
  }

  return (
    <TestimonialsContext.Provider
      value={{
        deleteTestimonial,
        errorMessage,
        isLoading,
        isSaving,
        saveTestimonial,
        setTestimonialPublished,
        testimonials,
      }}
    >
      {children}
    </TestimonialsContext.Provider>
  )
}

export { TestimonialsProvider }
