import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useScanStore } from '@/store/useScanStore'
import type { VinylRecord, VinylCondition } from '@/types'

export function ManualInputScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [artist, setArtist] = useState('')
  const [album, setAlbum] = useState('')
  const setReport = useScanStore((s) => s.setReport)
  const reset = useScanStore((s) => s.reset)
  const processingError = useScanStore((s) => s.processingError)

  function handleSubmit() {
    if (!artist.trim() || !album.trim()) return

    const record: VinylRecord = {
      id: crypto.randomUUID(),
      artist: artist.trim(),
      album: album.trim(),
      rarityTier: 'common',
      estimatedValueLow: 0,
      estimatedValueHigh: 0,
      currency: 'USD',
      condition: 'vg' as VinylCondition,
      conditionSource: 'user',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      tags: [],
    }
    setReport(record)
    navigate(`/report/${record.id}`)
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <h2 className="text-xl font-bold mb-2">{t('scan.manualFallback')}</h2>
      <p className="text-sm text-gray-500 mb-2">{t('scan.error')}</p>
      {processingError && <p className="text-xs text-red-500 mb-6 font-mono">{processingError}</p>}
      {!processingError && <div className="mb-6" />}

      <div className="flex flex-col gap-4">
        <label htmlFor="manual-artist" className="sr-only">
          {t('scan.artistPlaceholder')}
        </label>
        <input
          id="manual-artist"
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          placeholder={t('scan.artistPlaceholder')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <label htmlFor="manual-album" className="sr-only">
          {t('scan.albumPlaceholder')}
        </label>
        <input
          id="manual-album"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder={t('scan.albumPlaceholder')}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSubmit}
          disabled={!artist.trim() || !album.trim()}
          className="btn-primary"
        >
          {t('scan.submit')}
        </button>
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
