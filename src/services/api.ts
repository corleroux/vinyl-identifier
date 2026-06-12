import type { VinylRecord, VinylCondition } from '@/types'
import { getCached, setCached } from '@/utils/cache'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

const DEFAULT_TIMEOUT = 30_000
const MAX_RETRIES = 2
const RETRY_DELAY = 1_000

export class NetworkError extends Error {
  status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'NetworkError'
    this.status = status
  }
}

export class OfflineError extends Error {
  constructor() {
    super('You appear to be offline. Please check your connection.')
    this.name = 'OfflineError'
  }
}

export function isOffline(): boolean {
  return typeof navigator !== 'undefined' && !navigator.onLine
}

async function fetchWithRetry(
  url: string,
  options: RequestInit = {},
  retries = MAX_RETRIES,
  timeout = DEFAULT_TIMEOUT,
): Promise<Response> {
  if (isOffline()) throw new OfflineError()

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      })
      clearTimeout(timeoutId)
      return response
    } catch (err) {
      clearTimeout(timeoutId)

      if (err instanceof DOMException && err.name === 'AbortError') {
        if (attempt < retries) {
          await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)))
          continue
        }
        throw new NetworkError(`Request timed out after ${timeout / 1000}s`)
      }

      if (isOffline()) throw new OfflineError()

      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, RETRY_DELAY * (attempt + 1)))
        continue
      }

      throw err
    }
  }

  throw new NetworkError('Request failed after all retries')
}

export interface IdentifyResponse {
  artist: string
  album: string
  label?: string
  catalogNumber?: string
  country?: string
  releaseYear?: number
  format?: string
  genre?: string[]
  rarityTier: string
  estimatedValueLow: number
  estimatedValueHigh: number
  currency: string
  condition: string
  priceHistory?: string
  variants?: Array<{
    label: string
    catalogNumber: string
    country: string
    year: number
    format: string
  }>
  similarReleases?: Array<{
    artist: string
    album: string
    year?: number
  }>
  confidence: number
}

export async function identifyVinyl(image: Blob): Promise<VinylRecord> {
  const formData = new FormData()
  formData.append('image', image, 'vinyl.jpg')

  const response = await fetchWithRetry(
    `${API_BASE}/identify`,
    {
      method: 'POST',
      body: formData,
    },
    MAX_RETRIES,
    60_000,
  )

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new NetworkError(
      err?.error ?? `Identification failed: ${response.statusText}`,
      response.status,
    )
  }

  const data = (await response.json()) as IdentifyResponse

  const record: VinylRecord = {
    id: crypto.randomUUID(),
    artist: data.artist,
    album: data.album,
    label: data.label,
    catalogNumber: data.catalogNumber,
    country: data.country,
    releaseYear: data.releaseYear,
    format: data.format,
    rarityTier: data.rarityTier as VinylRecord['rarityTier'],
    estimatedValueLow: data.estimatedValueLow,
    estimatedValueHigh: data.estimatedValueHigh,
    currency: data.currency as VinylRecord['currency'],
    condition: data.condition as VinylCondition,
    conditionSource: 'llm',
    priceHistory: data.priceHistory,
    variants: data.variants?.map((v) => ({
      label: v.label,
      catalogNumber: v.catalogNumber,
      country: v.country,
      year: v.year,
      format: v.format,
    })),
    similarReleases: data.similarReleases?.map((s) => ({
      artist: s.artist,
      album: s.album,
      year: s.year,
    })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
    tags: [],
  }

  return record
}

export interface DiscogsBarcodeResult {
  artist: string
  title: string
  label: string
  catalogNumber: string
  country: string
  year: number
  format: string
  genre: string[]
  styles: string[]
  lowestPrice: number | null
  numForSale: number
  blockAvgPrice: number | null
  blockMedianPrice: number | null
}

export async function searchDiscogsBarcode(barcode: string): Promise<DiscogsBarcodeResult> {
  const cacheKey = `discogs-barcode:${barcode}`
  const cached = getCached<DiscogsBarcodeResult>(cacheKey)
  if (cached) return cached

  const response = await fetchWithRetry(
    `${API_BASE}/discogs?barcode=${encodeURIComponent(barcode)}`,
  )

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new NetworkError(
      err?.error ?? `Discogs lookup failed: ${response.statusText}`,
      response.status,
    )
  }

  const data = (await response.json()) as DiscogsBarcodeResult
  setCached(cacheKey, data)
  return data
}

export async function searchDiscogsByArtistAlbum(
  artist: string,
  album: string,
): Promise<DiscogsBarcodeResult> {
  const cacheKey = `discogs-artist-album:${artist}:${album}`
  const cached = getCached<DiscogsBarcodeResult>(cacheKey)
  if (cached) return cached

  const response = await fetchWithRetry(
    `${API_BASE}/discogs?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`,
  )

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new NetworkError(
      err?.error ?? `Discogs lookup failed: ${response.statusText}`,
      response.status,
    )
  }

  const data = (await response.json()) as DiscogsBarcodeResult
  setCached(cacheKey, data)
  return data
}
