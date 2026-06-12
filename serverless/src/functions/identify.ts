import type { Env } from '../env'
import { identifyWithVision, researchWithLLM } from '../lib/llm'
import { searchByBarcode, searchByArtistAlbum } from '../lib/discogs'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function handleIdentify(request: Request, env: Env): Promise<Response> {
  let imageBuffer: ArrayBuffer
  let contentType: string

  try {
    const formData = await request.formData()
    const imageField = formData.get('image')

    if (!imageField || !(imageField instanceof Blob)) {
      return new Response(JSON.stringify({ error: 'Missing or invalid image field' }), {
        status: 400,
        headers: JSON_HEADERS,
      })
    }

    const arrayBuf = await imageField.arrayBuffer()
    imageBuffer = arrayBuf
    contentType = imageField.type || 'image/jpeg'
  } catch {
    return new Response(JSON.stringify({ error: 'Failed to parse request body' }), {
      status: 400,
      headers: JSON_HEADERS,
    })
  }

  // Step 1: Vision identification
  let vision
  try {
    vision = await identifyWithVision(imageBuffer, contentType, env)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: `Vision identification failed: ${message}` }), {
      status: 502,
      headers: JSON_HEADERS,
    })
  }

  // Step 2: Research enrichment (runs even if confidence is low — frontend decides what to do)
  let research
  try {
    research = await researchWithLLM(vision, env)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(
      JSON.stringify({
        error: `Research enrichment failed: ${message}`,
        vision,
      }),
      { status: 502, headers: JSON_HEADERS },
    )
  }

  // Step 3: Discogs enrichment (best-effort — don't fail the whole request if Discogs is down)
  let discogs = null
  try {
    if (vision.catalogNumber) {
      discogs = await searchByBarcode(vision.catalogNumber, env)
    }
    if (!discogs && vision.artist && vision.album) {
      discogs = await searchByArtistAlbum(vision.artist, vision.album, env)
    }
  } catch {
    // Discogs is optional — continue without it
  }

  // Merge: Discogs takes precedence for structured metadata when available
  const response = {
    artist: vision.artist,
    album: vision.album,
    label: discogs?.label || vision.label || undefined,
    catalogNumber: discogs?.catalogNumber || vision.catalogNumber || undefined,
    country: discogs?.country || undefined,
    releaseYear: discogs?.year || undefined,
    format: discogs?.format || undefined,
    genre: discogs?.genre || undefined,
    rarityTier: research.rarityTier,
    estimatedValueLow: discogs?.lowestPrice ?? research.estimatedValueLow,
    estimatedValueHigh: research.estimatedValueHigh,
    currency: research.currency,
    condition: research.condition,
    priceHistory: research.priceHistory,
    variants: research.variants,
    similarReleases: research.similarReleases,
    confidence: vision.confidence,
  }

  return new Response(JSON.stringify(response), { status: 200, headers: JSON_HEADERS })
}
