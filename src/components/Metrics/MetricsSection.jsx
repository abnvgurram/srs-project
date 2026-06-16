import { useEffect, useRef, useState } from 'react'
import useMetrics from '../../context/metrics/useMetrics.js'
import './MetricsSection.scss'

function parseAnimatedMetricValue(value) {
  const match = String(value ?? '')
    .trim()
    .match(/^(\$)?\s*(\d+(?:\.\d+)?)\s*([KMB])?$/i)

  if (!match) return null

  const [, prefix = '', numericValue, suffix = ''] = match

  return {
    decimals: numericValue.includes('.') ? 1 : 0,
    prefix,
    suffix: suffix.toUpperCase(),
    value: Number(numericValue),
  }
}

function formatMetricValue(metric, progress) {
  const animatedValue = parseAnimatedMetricValue(metric.value)

  if (!animatedValue) return metric.value

  const value = animatedValue.value * progress

  if (animatedValue.decimals > 0) {
    return value.toFixed(animatedValue.decimals)
  }

  return String(Math.round(value))
}

function MetricValue({ metric, progress }) {
  const animatedValue = parseAnimatedMetricValue(metric.value)

  if (!animatedValue) {
    return (
      <span className="metric-card__value-part">
        {formatMetricValue(metric, progress)}
      </span>
    )
  }

  return (
    <>
      {animatedValue.prefix ? (
        <span className="metric-card__value-part metric-card__value-part--prefix">
          {animatedValue.prefix}
        </span>
      ) : null}
      <span className="metric-card__value-part">
        {formatMetricValue(metric, progress)}
      </span>
      {animatedValue.suffix ? (
        <span className="metric-card__value-part metric-card__value-part--suffix">
          {animatedValue.suffix}
        </span>
      ) : null}
    </>
  )
}

function MetricsSection() {
  const { metrics } = useMetrics()
  const [progress, setProgress] = useState(0)
  const [animationRun, setAnimationRun] = useState(0)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return

        setProgress(0)
        setAnimationRun((currentRun) => currentRun + 1)
      },
      {
        threshold: 0.35,
      },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!animationRun) return

    let frameId = null
    const duration = 1400
    const startTime = performance.now()

    function tick(currentTime) {
      const elapsed = currentTime - startTime
      const nextProgress = Math.min(elapsed / duration, 1)
      setProgress(nextProgress)

      if (nextProgress < 1) {
        frameId = window.requestAnimationFrame(tick)
      }
    }

    frameId = window.requestAnimationFrame(tick)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
    }
  }, [animationRun])

  return (
    <section className="metrics-section" ref={sectionRef} aria-label="Company metrics">
      <div className="metrics-section__inner">
        <div className="metrics-section__grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.id}>
              <div className="metric-card__value">
                <MetricValue metric={metric} progress={progress} />
              </div>
              <div className="metric-card__label">{metric.label}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MetricsSection
