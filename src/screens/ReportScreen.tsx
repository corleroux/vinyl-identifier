import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams, useNavigate } from 'react-router-dom'
import { RarityBadge } from '@/components/RarityBadge'
import { ConditionSelector } from '@/components/ConditionSelector'
import { CurrencySelector } from '@/components/CurrencySelector'
import { useScanStore } from '@/store/useScanStore'
import { useAppStore } from '@/store/useAppStore'
import { db } from '@/db'
import type { VinylRecord, VinylCondition, Currency } from '@/types'

export function ReportScreen() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const report = useScanStore((s) => s.report)
  const globalCurrency = useAppStore((s) => s.currency)
  const [saved, setSaved] = useState(false)
  const [record, setRecord] = useState<VinylRecord | null>(report)
  const [condition, setCondition] = useState<VinylCondition>(report?.condition ?? 'vg')
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(
    report?.currency ?? globalCurrency,
  )
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (!record && id) {
      db.records.get(id).then((r) => {
        if (r) {
          setRecord(r)
          setCondition(r.condition)
          setSelectedCurrency(r.currency)
          setNotes(r.notes ?? '')
        }
      })
    }
  }, [id, record])

  if (!record) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <p className="text-gray-500">{t('common.loading')}</p>
        <button onClick={() => navigate('/')} className="btn-secondary mt-4">
          {t('common.close')}
        </button>
      </div>
    )
  }

  function formatValue(val: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: selectedCurrency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val)
  }

  async function handleSave() {
    if (!record) return
    const updated: VinylRecord = {
      ...record,
      condition,
      currency: selectedCurrency,
      notes,
      id: record.id,
      conditionSource: condition !== record.condition ? 'user' : record.conditionSource,
      updatedAt: Date.now(),
    }
    await db.records.put(updated)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">{t('report.title')}</h1>
          <RarityBadge tier={record.rarityTier} />
        </div>

        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">{t('report.artist')}</p>
            <p className="font-semibold">{record.artist}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">{t('report.album')}</p>
            <p className="font-semibold">{record.album}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {record.label && (
              <div>
                <p className="text-sm text-gray-500">{t('report.label')}</p>
                <p className="font-medium">{record.label}</p>
              </div>
            )}
            {record.catalogNumber && (
              <div>
                <p className="text-sm text-gray-500">{t('report.catalogNumber')}</p>
                <p className="font-medium">{record.catalogNumber}</p>
              </div>
            )}
            {record.country && (
              <div>
                <p className="text-sm text-gray-500">{t('report.country')}</p>
                <p className="font-medium">{record.country}</p>
              </div>
            )}
            {record.releaseYear && (
              <div>
                <p className="text-sm text-gray-500">{t('report.releaseYear')}</p>
                <p className="font-medium">{record.releaseYear}</p>
              </div>
            )}
            {record.format && (
              <div>
                <p className="text-sm text-gray-500">{t('report.format')}</p>
                <p className="font-medium">{record.format}</p>
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-1">{t('report.estimatedValue')}</p>
            <div className="flex items-center gap-3">
              <p className="text-2xl font-bold text-blue-600">
                {formatValue(record.estimatedValueLow)} – {formatValue(record.estimatedValueHigh)}
              </p>
              <CurrencySelector value={selectedCurrency} onChange={setSelectedCurrency} />
            </div>
          </div>

          <div className="border-t pt-4">
            <ConditionSelector value={condition} onChange={setCondition} />
          </div>

          {record.priceHistory && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-1">{t('report.priceHistory')}</p>
              <p className="text-sm">{record.priceHistory}</p>
            </div>
          )}

          {record.variants && record.variants.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">{t('report.variants')}</p>
              <div className="space-y-2">
                {record.variants.map((v, i) => (
                  <div key={i} className="text-sm p-2 bg-gray-50 rounded">
                    <p className="font-medium">
                      {v.label} – {v.catalogNumber}
                    </p>
                    <p className="text-gray-500">
                      {v.country}, {v.year} · {v.format}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {record.similarReleases && record.similarReleases.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm text-gray-500 mb-2">{t('report.similarReleases')}</p>
              <div className="space-y-1">
                {record.similarReleases.map((s, i) => (
                  <p key={i} className="text-sm">
                    {s.artist} – {s.album}
                    {s.year ? ` (${s.year})` : ''}
                  </p>
                ))}
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <p className="text-sm text-gray-500 mb-2">{t('report.notes')}</p>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Add notes..."
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
        <button onClick={handleSave} className="btn-primary">
          {saved ? '✓ ' : ''}
          {t('report.saveToCollection')}
        </button>
        <button onClick={() => navigate('/')} className="btn-secondary w-24 flex-shrink-0">
          {t('common.close')}
        </button>
      </div>
    </div>
  )
}
