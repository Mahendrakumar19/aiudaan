/**
 * Performance Monitoring & Metrics
 * Track response times, errors, and other metrics for Hostinger
 */

interface PerformanceMetric {
  name: string
  duration: number
  timestamp: number
  tags?: Record<string, string>
}

const metrics: PerformanceMetric[] = []

/**
 * Start performance timer
 */
export function startTimer(): () => number {
  const start = Date.now()
  return () => Date.now() - start
}

/**
 * Record a metric
 */
export function recordMetric(
  name: string,
  duration: number,
  tags?: Record<string, string>
): void {
  metrics.push({
    name,
    duration,
    timestamp: Date.now(),
    tags,
  })

  // Keep only last 1000 metrics in memory
  if (metrics.length > 1000) {
    metrics.shift()
  }

  // Log slow operations
  if (duration > 1000) {
    console.warn(`⚠️ Slow operation: ${name} took ${duration}ms`, tags)
  }
}

/**
 * Get average response time for a metric name
 */
export function getAverageMetric(name: string): number {
  const filtered = metrics.filter((m) => m.name === name)
  if (filtered.length === 0) return 0
  const total = filtered.reduce((sum, m) => sum + m.duration, 0)
  return total / filtered.length
}

/**
 * Get all metrics for monitoring
 */
export function getAllMetrics() {
  return metrics.map((m) => ({
    ...m,
    slow: m.duration > 1000,
  }))
}

/**
 * Clear metrics (call periodically to free memory)
 */
export function clearMetrics(): void {
  metrics.length = 0
}

/**
 * Middleware wrapper for automatic metric recording
 */
export function withMetrics<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return (async (...args: any[]) => {
    const timer = startTimer()
    try {
      const result = await fn(...args)
      recordMetric(name, timer())
      return result
    } catch (error) {
      recordMetric(name, timer(), { error: 'true' })
      throw error
    }
  }) as T
}

/**
 * Get performance summary for dashboard
 */
export function getPerformanceSummary() {
  if (metrics.length === 0) {
    return {
      totalRequests: 0,
      averageResponseTime: 0,
      slowRequests: 0,
      topMetrics: [],
    }
  }

  const slowCount = metrics.filter((m) => m.duration > 1000).length
  const avgResponseTime =
    metrics.reduce((sum, m) => sum + m.duration, 0) / metrics.length

  // Group by name and get slowest
  const byName = new Map<string, PerformanceMetric[]>()
  metrics.forEach((m) => {
    if (!byName.has(m.name)) {
      byName.set(m.name, [])
    }
    byName.get(m.name)!.push(m)
  })

  const topMetrics = Array.from(byName.entries())
    .map(([name, ms]) => ({
      name,
      count: ms.length,
      avgTime: ms.reduce((sum, m) => sum + m.duration, 0) / ms.length,
      maxTime: Math.max(...ms.map((m) => m.duration)),
    }))
    .sort((a, b) => b.avgTime - a.avgTime)
    .slice(0, 10)

  return {
    totalRequests: metrics.length,
    averageResponseTime: Math.round(avgResponseTime),
    slowRequests: slowCount,
    slowPercentage: ((slowCount / metrics.length) * 100).toFixed(1),
    topMetrics,
  }
}
