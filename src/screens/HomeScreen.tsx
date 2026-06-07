import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useScanStore } from '@/store/useScanStore'
import { db } from '@/db'
import type { ScanResult } from '@/types'

export function HomeScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const batchMode = useScanStore((s) => s.batchMode)
  const toggleBatchMode = useScanStore((s) => s.toggleBatchMode)
  const batchQueue = useScanStore((s) => s.batchQueue)
  const [recentScans, setRecentScans] = useState<ScanResult[]>([])

  useEffect(() => {
    db.scanHistory.orderBy('createdAt').reverse().limit(5).toArray().then(setRecentScans)
  }, [])

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <h1 className="text-3xl font-bold">{t('home.title')}</h1>
        <p className="text-lg text-center text-gray-600">{t('home.subtitle')}</p>

        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button onClick={() => navigate('/scan/camera')} className="btn-primary">
            {t('home.camera')}
          </button>
          <button onClick={() => navigate('/scan/gallery')} className="btn-secondary">
            {t('home.gallery')}
          </button>
          <button onClick={() => navigate('/scan/barcode')} className="btn-secondary">
            {t('home.barcode')}
          </button>
        </div>

        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={batchMode}
            onChange={toggleBatchMode}
            className="rounded"
          />
          Batch mode ({batchQueue.length} scanned)
        </label>

        {batchQueue.length > 0 && (
          <button onClick={() => navigate('/batch')} className="btn-secondary max-w-sm">
            Review Batch ({batchQueue.length} records)
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
                  <span className="text-gray-400">
                    Scan {new Date(scan.createdAt).toLocaleDateString()}
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
