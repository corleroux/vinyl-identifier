import i18n from 'i18next'
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

function buildShareText(record: VinylRecord): string {
  const t = i18n.t.bind(i18n)
  return [
    `${record.artist} — ${record.album}`,
    `${t('export.rarity')}: ${t(`rarity.${record.rarityTier}`)}`,
    `${t('export.value')}: $${record.estimatedValueLow} – $${record.estimatedValueHigh}`,
    record.label ? `${t('export.label')}: ${record.label}` : '',
    record.releaseYear ? `${t('export.year')}: ${record.releaseYear}` : '',
  ]
    .filter(Boolean)
    .join('\n')
}

export async function shareReport(record: VinylRecord): Promise<void> {
  const title = `${record.artist} — ${record.album}`
  const text = buildShareText(record)

  // Try Capacitor Share plugin first (native platforms)
  try {
    const { Share } = await import('@capacitor/share')
    await Share.share({ title, text })
    return
  } catch {
    // Capacitor Share not available (web), fall through
  }

  // Fall back to Web Share API (PWA / mobile browsers)
  if (navigator.share) {
    await navigator.share({ title, text })
    return
  }

  // Final fallback: clipboard
  await navigator.clipboard.writeText(text)
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
