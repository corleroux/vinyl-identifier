// Cloudflare Worker / Vercel Edge Function
// GET /api/discogs/barcode?barcode=...
// GET /api/discogs/search?artist=...&album=...
// Proxies requests to Discogs API, keeping consumer key/secret server-side

export async function handleDiscogs(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const barcode = url.searchParams.get('barcode')
  const artist = url.searchParams.get('artist')
  const album = url.searchParams.get('album')

  // Validate and route to appropriate Discogs endpoint
  if (barcode) {
    // GET https://api.discogs.com/database/search?barcode=...
  } else if (artist && album) {
    // GET https://api.discogs.com/database/search?artist=...&release_title=...
  }

  return new Response(JSON.stringify({ error: 'Not implemented' }), {
    status: 501,
    headers: { 'Content-Type': 'application/json' },
  })
}
