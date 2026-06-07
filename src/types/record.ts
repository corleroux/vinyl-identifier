export type RarityTier = 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary'

export type VinylCondition =
  | 'mint'
  | 'near_mint'
  | 'vg_plus'
  | 'vg'
  | 'g_plus'
  | 'good'
  | 'fair'
  | 'poor'

export type Currency = 'USD' | 'EUR' | 'GBP'

export interface VinylRecord {
  id: string
  artist: string
  album: string
  label?: string
  catalogNumber?: string
  country?: string
  releaseYear?: number
  format?: string
  genre?: string[]
  coverArtUrl?: string
  rarityTier: RarityTier
  estimatedValueLow: number
  estimatedValueHigh: number
  currency: Currency
  condition: VinylCondition
  conditionSource: 'llm' | 'user'
  priceHistory?: string
  variants?: VinylVariant[]
  similarReleases?: SimilarRelease[]
  notes?: string
  tags?: string[]
  folderId?: string
  createdAt: number
  updatedAt: number
}

export interface VinylVariant {
  label: string
  catalogNumber: string
  country: string
  year: number
  format: string
}

export interface SimilarRelease {
  artist: string
  album: string
  year?: number
  rarityTier?: RarityTier
}

export interface ScanResult {
  id: string
  imageUri: string
  status: 'pending' | 'processing' | 'complete' | 'error'
  record?: VinylRecord
  error?: string
  createdAt: number
}

export interface Folder {
  id: string
  name: string
  color?: string
  createdAt: number
  updatedAt: number
}

export interface Tag {
  id: string
  name: string
  color?: string
}
