const CACHE_PREFIX = 'vinyl-cache:'
const CACHE_TTL = 24 * 60 * 60 * 1000 // 24 hours

interface CacheEntry<T> {
  data: T
  expires: number
}

export function getCached<T>(key: string): T | null {
  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key)
    if (!raw) return null
    const entry = JSON.parse(raw) as CacheEntry<T>
    if (Date.now() > entry.expires) {
      localStorage.removeItem(CACHE_PREFIX + key)
      return null
    }
    return entry.data
  } catch {
    return null
  }
}

export function setCached<T>(key: string, data: T): void {
  try {
    const entry: CacheEntry<T> = { data, expires: Date.now() + CACHE_TTL }
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry))
  } catch {
    // Storage full or unavailable — silently fail
  }
}

export function clearCache(): void {
  try {
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX))
    keys.forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
}
