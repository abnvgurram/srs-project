export const defaultMetrics = [
  {
    id: 'sales-last-12-months',
    label: 'Sales in Last 12 Months',
    value: '18',
    displayOrder: 1,
  },
  {
    id: 'total-sales',
    label: 'Total Sales',
    value: '209',
    displayOrder: 2,
  },
  {
    id: 'price-range',
    label: 'Price Range',
    value: '$330K - $1.5M',
    displayOrder: 3,
  },
  {
    id: 'average-price',
    label: 'Average Price',
    value: '$619K',
    displayOrder: 4,
  },
]

export function normalizeMetric(metric, fallbackIndex = 0) {
  const fallbackMetric = defaultMetrics[fallbackIndex] ?? defaultMetrics[0]
  const displayOrder = Number(metric.displayOrder ?? metric.display_order)

  return {
    id: String(metric.id ?? fallbackMetric.id),
    label: String(metric.label ?? fallbackMetric.label).trim(),
    value: String(metric.value ?? metric.value_text ?? fallbackMetric.value).trim(),
    displayOrder: Number.isFinite(displayOrder)
      ? displayOrder
      : fallbackMetric.displayOrder,
  }
}

export function toMetricRecord(metric) {
  return {
    id: metric.id,
    label: metric.label,
    value_text: metric.value,
    display_order: metric.displayOrder,
    updated_at: new Date().toISOString(),
  }
}
