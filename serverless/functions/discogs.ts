import { searchByBarcode, searchByArtistAlbum } from '../lib/discogs'

export async function handleDiscogs(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const barcode = url.searchParams.get('barcode')
  const artist = url.searchParams.get('artist')
  const album = url.searchParams.get('album')

  try {
    if (barcode) {
      const result = await searchByBarcode(barcode)
      if (!result) {
        return new Response(JSON.stringify({ error: 'No results found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (artist && album) {
      const result = await searchByArtistAlbum(artist, album)
      if (!result) {
        return new Response(JSON.stringify({ error: 'No results found' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        })
      }
      return new Response(JSON.stringify(result), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ error: 'Provide barcode or artist+album parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: 'Discogs lookup failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } },
    )
  }
}
