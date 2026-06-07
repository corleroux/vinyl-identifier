import { identifyWithVision, researchWithLLM } from '../lib/llm'
import { searchByArtistAlbum } from '../lib/discogs'
import type { VisionResult, ResearchResult } from '../lib/llm'
import type { DiscogsResult } from '../lib/discogs'

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

function mergeResults(
  vision: VisionResult,
  research: ResearchResult,
  discogs: DiscogsResult | null,
): IdentifyResponse {
  return {
    artist: discogs?.artist ?? vision.artist,
    album: discogs?.title ?? vision.album,
    label: discogs?.label ?? vision.label ?? undefined,
    catalogNumber: discogs?.catalogNumber ?? vision.catalogNumber ?? undefined,
    country: discogs?.country ?? undefined,
    releaseYear: discogs?.year || undefined,
    format: discogs?.format ?? undefined,
    genre: discogs?.genre ?? undefined,
    rarityTier: research.rarityTier,
    estimatedValueLow: discogs?.blockAvgPrice ?? research.estimatedValueLow,
    estimatedValueHigh: discogs?.blockMedianPrice ?? research.estimatedValueHigh,
    currency: research.currency,
    condition: research.condition,
    priceHistory: research.priceHistory,
    variants: research.variants,
    similarReleases: research.similarReleases,
    confidence: vision.confidence,
  }
}

export async function handleIdentify(request: Request): Promise<Response> {
  try {
    const formData = await request.formData()
    const imageFile = formData.get('image')

    if (!imageFile || !(imageFile instanceof Blob)) {
      return new Response(JSON.stringify({ error: 'No image file provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const buffer = await imageFile.arrayBuffer()
    const contentType = imageFile.type || 'image/jpeg'

    const vision = await identifyWithVision(buffer, contentType)

    const [research, discogs] = await Promise.all([
      researchWithLLM(vision),
      searchByArtistAlbum(vision.artist, vision.album).catch(() => null),
    ])

    const result = mergeResults(vision, research, discogs)

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Identification failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
