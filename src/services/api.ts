const API_BASE = import.meta.env.VITE_API_URL ?? '/api'

export async function identifyVinyl(image: Blob): Promise<unknown> {
  const formData = new FormData()
  formData.append('image', image, 'vinyl.jpg')

  const response = await fetch(`${API_BASE}/identify`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Identification failed: ${response.statusText}`)
  }

  return response.json() as unknown
}

export async function searchDiscogsBarcode(barcode: string): Promise<unknown> {
  const response = await fetch(`${API_BASE}/discogs/barcode?barcode=${encodeURIComponent(barcode)}`)

  if (!response.ok) {
    throw new Error(`Discogs lookup failed: ${response.statusText}`)
  }

  return response.json() as unknown
}
