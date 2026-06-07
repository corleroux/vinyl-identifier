const DISCOGS_KEY = process.env.DISCOGS_CONSUMER_KEY ?? ''
const DISCOGS_SECRET = process.env.DISCOGS_CONSUMER_SECRET ?? ''

export interface DiscogsResult {
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

function discogsHeaders(): Record<string, string> {
  return {
    'User-Agent': 'VinylIdentifier/1.0',
    Authorization: `Discogs key=${DISCOGS_KEY}, secret=${DISCOGS_SECRET}`,
  }
}

export async function searchByBarcode(barcode: string): Promise<DiscogsResult | null> {
  const url = `https://api.discogs.com/database/search?barcode=${encodeURIComponent(barcode)}&type=release&per_page=1`
  const response = await fetch(url, { headers: discogsHeaders() })

  if (!response.ok) return null

  const data = (await response.json()) as {
    results: Array<{
      title: string
      label: string[]
      catno: string
      country: string
      year: string
      format: string[]
      genre: string[]
      style: string[]
      cover_image: string
      id: number
    }>
  }

  if (!data.results?.length) return null

  const r = data.results[0]
  const [artist, ...titleParts] = r.title.split(' - ')

  const priceData = await fetch(`https://api.discogs.com/marketplace/stats/${r.id}`, {
    headers: discogsHeaders(),
  })
  const prices = priceData.ok
    ? ((await priceData.json()) as {
        lowest_price: { value: number | null }
        num_for_sale: number
        block_average: { value: number | null }
        block_median: { value: number | null }
      })
    : null

  return {
    artist: artist?.trim() ?? 'Unknown',
    title: (titleParts.join(' - ').trim() || artist?.trim()) ?? 'Unknown',
    label: r.label?.[0] ?? '',
    catalogNumber: r.catno ?? '',
    country: r.country ?? '',
    year: parseInt(r.year, 10) || 0,
    format: r.format?.join(', ') ?? '',
    genre: r.genre ?? [],
    styles: r.style ?? [],
    lowestPrice: prices?.lowest_price?.value ?? null,
    numForSale: prices?.num_for_sale ?? 0,
    blockAvgPrice: prices?.block_average?.value ?? null,
    blockMedianPrice: prices?.block_median?.value ?? null,
  }
}

export async function searchByArtistAlbum(
  artist: string,
  album: string,
): Promise<DiscogsResult | null> {
  const url = `https://api.discogs.com/database/search?artist=${encodeURIComponent(artist)}&release_title=${encodeURIComponent(album)}&type=release&per_page=1`
  const response = await fetch(url, { headers: discogsHeaders() })

  if (!response.ok) return null

  const data = (await response.json()) as {
    results: Array<{
      id: number
      title: string
      label: string[]
      catno: string
      country: string
      year: string
      format: string[]
      genre: string[]
      style: string[]
    }>
  }

  if (!data.results?.length) return null

  return searchByBarcode(data.results[0].catno)
}
