import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useScanStore } from '@/store/useScanStore'
import { useAppStore } from '@/store/useAppStore'
import { db } from '@/db'
import { track } from '@/services/analytics'
import type { ScanResult } from '@/types'

export function HomeScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const batchMode = useScanStore((s) => s.batchMode)
  const toggleBatchMode = useScanStore((s) => s.toggleBatchMode)
  const batchQueue = useScanStore((s) => s.batchQueue)
  const isFullVersion = useAppStore((s) => s.isFullVersion)
  const scanCount = useAppStore((s) => s.scanCount)
  const maxFreeScans = useAppStore((s) => s.maxFreeScans)
  const incrementScanCount = useAppStore((s) => s.incrementScanCount)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])

  const scansRemaining = Math.max(0, maxFreeScans - scanCount)
  const canScan = isFullVersion || scansRemaining > 0

  useEffect(() => {
    db.scanHistory.orderBy('createdAt').reverse().limit(5).toArray().then(setRecentScans)
  }, [])

  function handleScan(path: string) {
    if (!canScan) {
      navigate('/paywall')
      return
    }
    incrementScanCount()
    track('scan_started', {
      method: path.replace('/scan/', ''),
      scans_remaining: scansRemaining - 1,
    })
    navigate(path)
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">{t('home.title')}</h1>
        <p className="text-lg text-center text-gray-600">{t('home.subtitle')}</p>

        {!isFullVersion && (
          <p className="text-sm text-center text-gray-500">
            {t('home.scansRemaining', { count: scansRemaining })}
          </p>
        )}

        <nav aria-label={t('common.scanOptions')} className="flex flex-col gap-4 w-full max-w-sm">
          <button onClick={() => handleScan('/scan/camera')} className="btn-primary min-h-[48px]">
            {t('home.camera')}
          </button>
          <button
            onClick={() => handleScan('/scan/gallery')}
            className="btn-secondary min-h-[48px]"
          >
            {t('home.gallery')}
          </button>
          <button
            onClick={() => handleScan('/scan/barcode')}
            className="btn-secondary min-h-[48px]"
          >
            {t('home.barcode')}
          </button>
        </nav>

        {!isFullVersion && (
          <button
            onClick={() => navigate('/paywall')}
            className="text-sm text-blue-600 hover:text-blue-800 underline min-h-[44px] flex items-center"
          >
            {t('settings.purchase')}
          </button>
        )}

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer min-h-[44px]">
          <input
            type="checkbox"
            checked={batchMode}
            onChange={toggleBatchMode}
            className="rounded w-5 h-5"
          />
          {t('home.batchMode', { count: batchQueue.length })}
        </label>

        {batchQueue.length > 0 && (
          <button onClick={() => navigate('/batch')} className="btn-secondary max-w-sm">
            {t('home.reviewBatch', { count: batchQueue.length })}
          </button>
        )}
      </div>

      {recentScans.length > 0 && (
        <div className="pt-6 border-t mt-6">
          <h2 className="text-sm font-semibold text-gray-500 mb-3">{t('home.recentScans')}</h2>
          <div className="flex flex-col gap-2">
            {recentScans.map((scan) => (
              <button
                key={scan.id}
                onClick={() => scan.record && navigate(`/report/${scan.record.id}`)}
                className="text-left text-sm p-2 rounded hover:bg-gray-50"
              >
                {scan.record ? (
                  <span>
                    <span className="font-medium">{scan.record.artist}</span>
                    {' — '}
                    <span className="text-gray-600">{scan.record.album}</span>
                  </span>
                ) : (
                  <span className="text-gray-500">
                    {t('home.scanDate', { date: new Date(scan.createdAt).toLocaleDateString() })}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
