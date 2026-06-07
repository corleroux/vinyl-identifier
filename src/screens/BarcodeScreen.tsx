import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { searchDiscogsBarcode } from '@/services/api'
import { useScanStore } from '@/store/useScanStore'
import { useAppStore } from '@/store/useAppStore'
import type { VinylRecord, VinylCondition } from '@/types'

export function BarcodeScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [barcode, setBarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const setReport = useScanStore((s) => s.setReport)
  const reset = useScanStore((s) => s.reset)
  const incrementScanCount = useAppStore((s) => s.incrementScanCount)

  async function handleSearch() {
    if (!barcode.trim()) return
    setLoading(true)
    setError(null)

    try {
      const result = await searchDiscogsBarcode(barcode.trim())

      const record: VinylRecord = {
        id: crypto.randomUUID(),
        artist: result.artist,
        album: result.title,
        label: result.label,
        catalogNumber: result.catalogNumber,
        country: result.country,
        releaseYear: result.year || undefined,
        format: result.format,
        rarityTier: 'common',
        estimatedValueLow: result.blockAvgPrice ?? 0,
        estimatedValueHigh: result.blockMedianPrice ?? 0,
        currency: 'USD',
        condition: 'vg' as VinylCondition,
        conditionSource: 'user',
        createdAt: Date.now(),
        updatedAt: Date.now(),
        tags: [],
      }

      setReport(record)
      incrementScanCount()
      navigate(`/report/${record.id}`)
    } catch {
      setError(t('common.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <h2 className="text-xl font-bold mb-6">{t('home.barcode')}</h2>

      <div className="flex flex-col gap-4">
        <input
          value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          placeholder="Enter barcode number"
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSearch}
          disabled={loading || !barcode.trim()}
          className="btn-primary"
        >
          {loading ? t('common.loading') : t('scan.submit')}
        </button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={() => {
            reset()
            navigate('/', { replace: true })
          }}
          className="btn-secondary"
        >
          {t('common.cancel')}
        </button>
      </div>
    </div>
  )
}
