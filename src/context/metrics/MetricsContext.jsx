import { useEffect, useState } from 'react'
import {
  defaultMetrics,
  normalizeMetric,
  toMetricRecord,
} from '../../data/metrics.js'
import { hasSupabaseConfig, supabase } from '../../lib/supabase.js'
import MetricsContext from './metricsContext.js'

const METRICS_TABLE = 'site_metrics'

function normalizeMetricList(metrics) {
  const normalizedById = new Map(
    (metrics ?? []).map((metric, index) => {
      const normalizedMetric = normalizeMetric(metric, index)
      return [normalizedMetric.id, normalizedMetric]
    }),
  )

  return defaultMetrics
    .map((metric, index) =>
      normalizeMetric(normalizedById.get(metric.id) ?? metric, index),
    )
    .sort((left, right) => left.displayOrder - right.displayOrder)
}

function MetricsProvider({ children }) {
  const [metrics, setMetrics] = useState(defaultMetrics)
  const [isLoading, setIsLoading] = useState(hasSupabaseConfig)
  const [isSaving, setIsSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isCancelled = false

    async function loadMetrics() {
      if (!hasSupabaseConfig) {
        setMetrics(defaultMetrics)
        setIsLoading(false)
        setErrorMessage('')
        return
      }

      const { data, error } = await supabase
        .from(METRICS_TABLE)
        .select('*')
        .order('display_order', { ascending: true })

      if (isCancelled) return

      if (error) {
        setMetrics(defaultMetrics)
        setErrorMessage(
          'Unable to load metrics from Supabase. Run the metrics SQL setup first.',
        )
        setIsLoading(false)
        return
      }

      setMetrics(normalizeMetricList(data))
      setErrorMessage('')
      setIsLoading(false)
    }

    loadMetrics()

    return () => {
      isCancelled = true
    }
  }, [])

  async function saveMetrics(metricInputs) {
    const normalizedMetrics = normalizeMetricList(metricInputs)

    if (!hasSupabaseConfig) {
      setErrorMessage(
        'Supabase is not configured yet. Add the environment variables before saving metrics.',
      )
      return false
    }

    setIsSaving(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from(METRICS_TABLE)
      .upsert(normalizedMetrics.map(toMetricRecord), { onConflict: 'id' })
      .select('*')

    if (error) {
      setErrorMessage(
        'Unable to save metrics in Supabase. Check the site_metrics table policies.',
      )
      setIsSaving(false)
      return false
    }

    setMetrics(normalizeMetricList(data))
    setIsSaving(false)
    return true
  }

  async function saveMetric(metricInput) {
    const existingMetricIndex = defaultMetrics.findIndex(
      (metric) => metric.id === metricInput.id,
    )
    const normalizedMetric = normalizeMetric(
      metricInput,
      existingMetricIndex >= 0 ? existingMetricIndex : metrics.length,
    )

    if (!hasSupabaseConfig) {
      setErrorMessage(
        'Supabase is not configured yet. Add the environment variables before saving metrics.',
      )
      return false
    }

    setIsSaving(true)
    setErrorMessage('')

    const { data, error } = await supabase
      .from(METRICS_TABLE)
      .upsert(toMetricRecord(normalizedMetric), { onConflict: 'id' })
      .select('*')
      .single()

    if (error) {
      setErrorMessage(
        'Unable to save this metric in Supabase. Check the site_metrics table policies.',
      )
      setIsSaving(false)
      return false
    }

    const savedMetric = normalizeMetric(
      data,
      existingMetricIndex >= 0 ? existingMetricIndex : metrics.length,
    )

    setMetrics((currentMetrics) =>
      normalizeMetricList(
        currentMetrics.map((metric) =>
          metric.id === savedMetric.id ? savedMetric : metric,
        ),
      ),
    )
    setIsSaving(false)
    return true
  }

  return (
    <MetricsContext.Provider
      value={{
        errorMessage,
        isLoading,
        isSaving,
        metrics,
        saveMetric,
        saveMetrics,
      }}
    >
      {children}
    </MetricsContext.Provider>
  )
}

export { MetricsProvider }
