/**
 * Discogs proxy endpoint — queries Discogs API with barcode / artist+album.
 * @see AGENTS.md#architecture — Backend layer
 * @see PRD.md §6.3 — Discogs Integration requirements
 * @see PRD.md §8 — Technology Choices (Cloudflare Workers rationale)
 */
import type { Env } from '../env'
import { searchByBarcode, searchByArtistAlbum } from '../lib/discogs'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function handleDiscogs(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url)
  const barcode = url.searchParams.get('barcode')
  const artist = url.searchParams.get('artist')
  const album = url.searchParams.get('album')

  if (!barcode && !(artist && album)) {
    return new Response(
      JSON.stringify({ error: 'Provide either barcode or both artist and album parameters' }),
      { status: 400, headers: JSON_HEADERS },
    )
  }

  try {
    let result

    if (barcode) {
      result = await searchByBarcode(barcode, env)
    } else {
      result = await searchByArtistAlbum(artist!, album!, env)
    }

    if (!result) {
      return new Response(JSON.stringify({ error: 'No results found on Discogs' }), {
        status: 404,
        headers: JSON_HEADERS,
      })
    }

    return new Response(JSON.stringify(result), { status: 200, headers: JSON_HEADERS })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: `Discogs lookup failed: ${message}` }), {
      status: 502,
      headers: JSON_HEADERS,
    })
  }
}
