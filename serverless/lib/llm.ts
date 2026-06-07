// LLM client wrappers for Vision and Research models

export interface VisionResult {
  artist: string
  album: string
  label: string | null
  catalogNumber: string | null
  confidence: number
}

export interface ResearchResult {
  rarityTier: string
  estimatedValueLow: number
  estimatedValueHigh: number
  currency: string
  condition: string
  priceHistory: string
  variants: Array<{
    label: string
    catalogNumber: string
    country: string
    year: number
    format: string
  }>
  similarReleases: Array<{
    artist: string
    album: string
    year: number | null
  }>
}

export async function identifyWithVision(imageBuffer: ArrayBuffer): Promise<VisionResult> {
  // Call Vision LLM (e.g., OpenAI GPT-4o or Google Gemini)
  // Return structured identification
  throw new Error('Not implemented')
}

export async function researchWithLLM(identification: VisionResult): Promise<ResearchResult> {
  // Call Research LLM (e.g., Claude or GPT-4)
  // Return structured rarity and value report
  throw new Error('Not implemented')
}
