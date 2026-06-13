import type { Env } from '../env'
import { identifyWithVision, researchWithLLM } from '../lib/llm'
import { searchByBarcode, searchByArtistAlbum } from '../lib/discogs'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function handleIdentify(request: Request, env: Env): Promise<Response> {
  const start = Date.now()
  let imageBuffer: ArrayBuffer
  let contentType: string

  try {
    const formData = await request.formData()
    const imageField = formData.get('image')

    if (!imageField || !(imageField instanceof Blob)) {
      console.error('[identify] Missing or invalid image field')
      return new Response(JSON.stringify({ error: 'Missing or invalid image field' }), {
        status: 400,
        headers: JSON_HEADERS,
      })
    }

    const arrayBuf = await imageField.arrayBuffer()
    imageBuffer = arrayBuf
    contentType = imageField.type || 'image/jpeg'
    console.log(`[identify] Parsed FormData: ${contentType}, ${imageBuffer.byteLength} bytes`)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[identify] Failed to parse request body: ${message}`)
    return new Response(JSON.stringify({ error: 'Failed to parse request body' }), {
      status: 400,
      headers: JSON_HEADERS,
    })
  }

  // Step 1: Vision identification
  let vision
  try {
    console.log('[identify] Step 1: Calling vision LLM...')
    vision = await identifyWithVision(imageBuffer, contentType, env)
    console.log(
      `[identify] Step 1 complete: ${vision.artist} - ${vision.album} (confidence: ${vision.confidence})`,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[identify] Step 1 failed: ${message}`)
    return new Response(JSON.stringify({ error: `Vision identification failed: ${message}` }), {
      status: 502,
      headers: JSON_HEADERS,
    })
  }

  // Step 2: Research enrichment (runs even if confidence is low — frontend decides what to do)
  let research
  try {
    console.log('[identify] Step 2: Calling research LLM...')
    research = await researchWithLLM(vision, env)
    console.log(
      `[identify] Step 2 complete: rarity=${research.rarityTier}, value=$${research.estimatedValueLow}-${research.estimatedValueHigh}`,
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[identify] Step 2 failed: ${message}`)
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
      console.log(`[identify] Step 3: Searching Discogs by barcode ${vision.catalogNumber}...`)
      discogs = await searchByBarcode(vision.catalogNumber, env)
    }
    if (!discogs && vision.artist && vision.album) {
      console.log(`[identify] Step 3: Searching Discogs by artist/album...`)
      discogs = await searchByArtistAlbum(vision.artist, vision.album, env)
    }
    console.log(`[identify] Step 3 complete: ${discogs ? 'found' : 'no match'}`)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[identify] Step 3 (Discogs) failed (non-fatal): ${message}`)
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

  console.log(`[identify] Complete in ${Date.now() - start}ms`)
  return new Response(JSON.stringify(response), { status: 200, headers: JSON_HEADERS })
}
