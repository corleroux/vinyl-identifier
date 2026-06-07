// Discogs API client (server-side only, keeps credentials secure)

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

export async function searchByBarcode(barcode: string): Promise<DiscogsResult | null> {
  // Query Discogs database search endpoint
  throw new Error('Not implemented')
}

export async function searchByArtistAlbum(
  artist: string,
  album: string,
): Promise<DiscogsResult | null> {
  // Query Discogs database search endpoint
  throw new Error('Not implemented')
}
