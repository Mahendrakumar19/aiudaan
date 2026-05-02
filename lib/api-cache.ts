/**
 * API Response Caching Utility
 * Reduces database queries and improves performance on Hostinger
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

const cache = new Map<string, CacheEntry<any>>()

/**
 * Get cached data or null if expired
 */
export function getCached<T>(key: string): T | null {
  const entry = cache.get(key)
  if (!entry) return null

  const isExpired = Date.now() - entry.timestamp > entry.ttl
  if (isExpired) {
    cache.delete(key)
    return null
  }

  return entry.data
}

/**
 * Set cache with TTL (in milliseconds)
 */
export function setCached<T>(key: string, data: T, ttlMs: number = 3600000): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl: ttlMs,
  })
}

/**
 * Clear specific cache key or all cache
 */
export function clearCache(key?: string): void {
  if (key) {
    cache.delete(key)
  } else {
    cache.clear()
  }
}

/**
 * Cache wrapper for API responses
 * Example: const data = await cacheOrFetch('courses', () => fetchCourses(), 3600000)
 */
export async function cacheOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlMs: number = 3600000 // 1 hour default
): Promise<T> {
  const cached = getCached<T>(key)
  if (cached) return cached

  const data = await fetchFn()
  setCached(key, data, ttlMs)
  return data
}

/**
 * Invalidate cache patterns (e.g., 'courses:*')
 */
export function invalidatePattern(pattern: string): void {
  const regex = new RegExp(pattern.replace('*', '.*'))
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key)
    }
  }
}
