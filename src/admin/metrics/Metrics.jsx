import { useEffect, useState } from 'react'
import { PencilLine, Save, X } from 'lucide-react'
import useMetrics from '../../context/metrics/useMetrics.js'
import './Metrics.scss'

function Metrics() {
  const { errorMessage, isLoading, isSaving, metrics, saveMetric } = useMetrics()
  const [draftMetrics, setDraftMetrics] = useState(metrics)
  const [editingMetricId, setEditingMetricId] = useState('')
  const [formMessage, setFormMessage] = useState('')

  useEffect(() => {
    setDraftMetrics(metrics)
  }, [metrics])

  useEffect(() => {
    if (!formMessage) return undefined

    const timeoutId = window.setTimeout(() => {
      setFormMessage('')
    }, 2200)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [formMessage])

  function handleMetricChange(metricId, field, value) {
    setDraftMetrics((currentMetrics) =>
      currentMetrics.map((metric) =>
        metric.id === metricId
          ? {
              ...metric,
              [field]: value,
            }
          : metric,
      ),
    )
  }

  function handleEdit(metricId) {
    setEditingMetricId(metricId)
    setFormMessage('')
  }

  function handleCancel(metricId) {
    const currentMetric = metrics.find((metric) => metric.id === metricId)

    if (currentMetric) {
      setDraftMetrics((currentMetrics) =>
        currentMetrics.map((metric) =>
          metric.id === metricId ? currentMetric : metric,
        ),
      )
    }

    setEditingMetricId('')
    setFormMessage('')
  }

  async function handleSave(metric) {
    if (!metric.label.trim() || !metric.value.trim()) {
      setFormMessage('Complete the metric label and value before saving.')
      return
    }

    const didSave = await saveMetric(metric)

    if (didSave) {
      setEditingMetricId('')
    }

    setFormMessage(
      didSave ? 'Metric updated successfully.' : 'Metric could not be saved.',
    )
  }

  return (
    <div className="metrics-admin-section">
      <div className="metrics-admin-section__header">
        <p className="metrics-admin-section__eyebrow">Metrics</p>
        <h2 className="metrics-admin-section__title">Website Metrics</h2>
        <p className="metrics-admin-section__copy">
          Update the metrics to be shown on the public website.
        </p>
      </div>

      <div className="metrics-admin-section__grid">
        {draftMetrics.map((metric, index) => {
          const isEditing = editingMetricId === metric.id

          return (
            <article className="metrics-admin-section__card" key={metric.id}>
              <span className="metrics-admin-section__card-index">
                Metric {index + 1}
              </span>

              {isEditing ? (
                <>
                  <label className="metrics-admin-section__field">
                    <span>Value</span>
                    <input
                      type="text"
                      value={metric.value}
                      placeholder="18"
                      onChange={(event) =>
                        handleMetricChange(metric.id, 'value', event.target.value)
                      }
                    />
                  </label>

                  <label className="metrics-admin-section__field">
                    <span>Label</span>
                    <input
                      type="text"
                      value={metric.label}
                      placeholder="Sales in Last 12 Months"
                      onChange={(event) =>
                        handleMetricChange(metric.id, 'label', event.target.value)
                      }
                    />
                  </label>

                  <div className="metrics-admin-section__card-actions">
                    <button
                      className="metrics-admin-section__secondary-button"
                      type="button"
                      disabled={isSaving}
                      onClick={() => handleCancel(metric.id)}
                    >
                      <X aria-hidden="true" size={16} strokeWidth={2.1} />
                      <span>Cancel</span>
                    </button>

                    <button
                      className="metrics-admin-section__save-button"
                      type="button"
                      disabled={isLoading || isSaving}
                      onClick={() => handleSave(metric)}
                    >
                      <Save aria-hidden="true" size={16} strokeWidth={2.1} />
                      <span>{isSaving ? 'Saving...' : 'Save'}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="metrics-admin-section__preview">
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>

                  <div className="metrics-admin-section__card-actions">
                    <button
                      className="metrics-admin-section__secondary-button"
                      type="button"
                      disabled={isLoading || isSaving}
                      onClick={() => handleEdit(metric.id)}
                    >
                      <PencilLine aria-hidden="true" size={16} strokeWidth={2.1} />
                      <span>Edit</span>
                    </button>
                  </div>
                </>
              )}
            </article>
          )
        })}
      </div>

      {formMessage ? (
        <div className="metrics-admin-section__message">{formMessage}</div>
      ) : null}

      {errorMessage ? (
        <div className="metrics-admin-section__message metrics-admin-section__message--error">
          {errorMessage}
        </div>
      ) : null}
    </div>
  )
}

export default Metrics
