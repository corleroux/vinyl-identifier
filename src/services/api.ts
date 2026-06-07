import type { VinylRecord, VinylCondition } from '@/types'

const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

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

  const response = await fetch(`${API_BASE}/identify`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.message ?? `Identification failed: ${response.statusText}`)
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
  const response = await fetch(`${API_BASE}/discogs?barcode=${encodeURIComponent(barcode)}`)

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.error ?? `Discogs lookup failed: ${response.statusText}`)
  }

  return response.json() as Promise<DiscogsBarcodeResult>
}

export async function searchDiscogsByArtistAlbum(
  artist: string,
  album: string,
): Promise<DiscogsBarcodeResult> {
  const response = await fetch(
    `${API_BASE}/discogs?artist=${encodeURIComponent(artist)}&album=${encodeURIComponent(album)}`,
  )

  if (!response.ok) {
    const err = await response.json().catch(() => null)
    throw new Error(err?.error ?? `Discogs lookup failed: ${response.statusText}`)
  }

  return response.json() as Promise<DiscogsBarcodeResult>
}
