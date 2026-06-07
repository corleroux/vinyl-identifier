import type { VinylRecord } from '@/types'

export async function exportReportAsImage(element: HTMLElement, filename: string): Promise<void> {
  const html2canvas = (await import('html2canvas')).default
  const canvas = await html2canvas(element, { useCORS: true, scale: 2 })
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'))
  if (!blob) return

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}.png`
  a.click()
  URL.revokeObjectURL(url)
}

export async function shareReport(record: VinylRecord): Promise<void> {
  const text = [
    `${record.artist} — ${record.album}`,
    `Rarity: ${record.rarityTier}`,
    `Value: $${record.estimatedValueLow} – $${record.estimatedValueHigh}`,
    record.label ? `Label: ${record.label}` : '',
    record.releaseYear ? `Year: ${record.releaseYear}` : '',
  ]
    .filter(Boolean)
    .join('\n')

  if (navigator.share) {
    await navigator.share({
      title: `${record.artist} — ${record.album}`,
      text,
    })
  } else {
    await navigator.clipboard.writeText(text)
  }
}

export function exportCollectionAsCSV(records: VinylRecord[]): void {
  const headers = [
    'Artist',
    'Album',
    'Label',
    'Catalog #',
    'Country',
    'Year',
    'Format',
    'Rarity',
    'Value Low',
    'Value High',
    'Currency',
    'Condition',
    'Notes',
  ]
  const rows = records.map((r) =>
    [
      r.artist,
      r.album,
      r.label ?? '',
      r.catalogNumber ?? '',
      r.country ?? '',
      r.releaseYear ?? '',
      r.format ?? '',
      r.rarityTier,
      r.estimatedValueLow,
      r.estimatedValueHigh,
      r.currency,
      r.condition,
      (r.notes ?? '').replace(/,/g, ';'),
    ].join(','),
  )
  const csv = [headers.join(','), ...rows].join('\n')
  const blob = new Blob([csv], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'vinyl-collection.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function exportCollectionAsJSON(records: VinylRecord[]): void {
  const json = JSON.stringify(records, null, 2)
  const blob = new Blob([json], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'vinyl-collection.json'
  a.click()
  URL.revokeObjectURL(url)
}
