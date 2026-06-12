import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { db } from '@/db'
import type { ScanResult } from '@/types'

export function ScanHistoryScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [scans, setScans] = useState<ScanResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    db.scanHistory
      .orderBy('createdAt')
      .reverse()
      .limit(100)
      .toArray()
      .then((results) => {
        setScans(results)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">{t('home.recentScans')}</h1>
        {scans.length > 0 && (
          <button
            onClick={async () => {
              await db.scanHistory.clear()
              setScans([])
            }}
            className="text-sm text-red-600"
          >
            {t('library.clearAll')}
          </button>
        )}
      </div>

      {scans.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-gray-500">{t('library.historyEmpty')}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {scans.map((scan) => (
            <button
              key={scan.id}
              onClick={() => scan.record && navigate(`/report/${scan.record.id}`)}
              className="w-full text-left p-4 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              {scan.record ? (
                <div>
                  <p className="font-semibold">
                    {scan.record.artist} — {scan.record.album}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(scan.createdAt).toLocaleDateString()} ·{' '}
                    {t(`rarity.${scan.record.rarityTier}`)}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500">
                  {t('home.scanDate', { date: new Date(scan.createdAt).toLocaleDateString() })}
                </p>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
