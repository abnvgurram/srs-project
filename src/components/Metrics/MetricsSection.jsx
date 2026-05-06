import { useEffect, useRef, useState } from 'react'
import './MetricsSection.scss'

const metrics = [
  {
    label: 'Closed Sales',
    value: 128,
    suffix: '+',
    decimals: 0,
  },
  {
    label: 'Yrs Experience',
    value: 8,
    suffix: '+',
    decimals: 0,
  },
  {
    label: 'Top Sale Value',
    value: 1.3,
    prefix: '$',
    suffix: 'M',
    decimals: 1,
  },
  {
    label: 'Zillow Rating',
    value: 5,
    suffix: '-Star',
    decimals: 0,
  },
]

function formatMetric(metric, progress) {
  const value = metric.value * progress

  if (metric.decimals > 0) {
    return `${metric.prefix ?? ''}${value.toFixed(metric.decimals)}${metric.suffix ?? ''}`
  }

  return `${metric.prefix ?? ''}${Math.round(value)}${metric.suffix ?? ''}`
}

function MetricsSection() {
  const [progress, setProgress] = useState(0)
  const [hasStarted, setHasStarted] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setHasStarted(true)
        observer.disconnect()
      },
      {
        threshold: 0.35,
      },
    )

    observer.observe(section)

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return

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
  }, [hasStarted])

  return (
    <section className="metrics-section" ref={sectionRef} aria-label="Company metrics">
      <div className="metrics-section__inner">
        <div className="metrics-section__grid">
          {metrics.map((metric) => (
            <article className="metric-card" key={metric.label}>
              <div className="metric-card__value">
                {formatMetric(metric, progress)}
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
