import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { db } from '@/db'
import { RarityBadge } from '@/components/RarityBadge'
import { CurrencySelector } from '@/components/CurrencySelector'
import { formatCurrency } from '@/utils/format'
import type { VinylRecord, Currency, RarityTier } from '@/types'

const RARITY_ORDER: Record<RarityTier, number> = {
  common: 0,
  uncommon: 1,
  rare: 2,
  very_rare: 3,
  legendary: 4,
}

function Delta({ current, next }: { current: number; next: number | null }) {
  if (next === null) return null
  const diff = current - next
  if (diff === 0) return null
  return (
    <span
      className={`text-xs ml-1 px-1.5 py-0.5 rounded ${diff > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
    >
      {diff > 0 ? '▲' : '▼'} {Math.abs(diff).toLocaleString()}
    </span>
  )
}

export function CompareScreen() {
  const { t } = useTranslation()
  const [records, setRecords] = useState<VinylRecord[]>([])
  const [selected, setSelected] = useState<VinylRecord[]>([])
  const [currency, setCurrency] = useState<Currency>('USD')

  useEffect(() => {
    db.records.orderBy('createdAt').reverse().toArray().then(setRecords)
  }, [])

  const available = useMemo(
    () => records.filter((r) => !selected.find((s) => s.id === r.id)),
    [records, selected],
  )

  function addRecord(record: VinylRecord) {
    if (selected.length < 4) {
      setSelected((prev) => [...prev, record])
    }
  }

  function removeRecord(id: string) {
    setSelected((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="p-4 border-b bg-white sticky top-0 z-10">
        <h1 className="text-2xl font-bold mb-4">{t('compare.title')}</h1>

        {selected.length < 4 && available.length > 0 && (
          <select
            onChange={(e) => {
              const r = available.find((a) => a.id === e.target.value)
              if (r) addRecord(r)
              e.target.value = ''
            }}
            value=""
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
          >
            <option value="">{t('compare.addRecord')}</option>
            {available.map((r) => (
              <option key={r.id} value={r.id}>
                {r.artist} — {r.album}
              </option>
            ))}
          </select>
        )}

        {selected.length === 0 && (
          <p className="text-gray-500 mt-4">{t('compare.selectRecords')}</p>
        )}
      </div>

      {selected.length > 0 && (
        <div className="flex-1 overflow-x-auto p-4">
          <div className="flex gap-4" style={{ minWidth: `${selected.length * 260}px` }}>
            {selected.map((record, i) => {
              const next = selected[i + 1]

              return (
                <div key={record.id} className="flex-1 min-w-[260px] border rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 mr-2">
                      <RarityBadge tier={record.rarityTier} />
                    </div>
                    <button
                      onClick={() => removeRecord(record.id)}
                      aria-label={t('compare.remove')}
                      className="text-red-600 text-sm flex-shrink-0 p-2"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="font-bold truncate">{record.artist}</p>
                  <p className="text-sm text-gray-600 truncate mb-3">{record.album}</p>

                  <div className="space-y-2.5 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">{t('report.estimatedValue')}</p>
                      <div className="flex items-center flex-wrap">
                        <p className="font-semibold">
                          {formatCurrency(record.estimatedValueLow, currency)} –{' '}
                          {formatCurrency(record.estimatedValueHigh, currency)}
                        </p>
                        <Delta
                          current={record.estimatedValueHigh}
                          next={next?.estimatedValueHigh ?? null}
                        />
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">{t('report.rarityTier')}</p>
                      <div className="flex items-center">
                        <span className="capitalize">{t(`rarity.${record.rarityTier}`)}</span>
                        {next &&
                          RARITY_ORDER[record.rarityTier] !== RARITY_ORDER[next.rarityTier] && (
                            <span
                              className={`text-xs ml-1 px-1.5 py-0.5 rounded ${
                                RARITY_ORDER[record.rarityTier] > RARITY_ORDER[next.rarityTier]
                                  ? 'bg-green-100 text-green-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {RARITY_ORDER[record.rarityTier] > RARITY_ORDER[next.rarityTier]
                                ? '▲'
                                : '▼'}
                            </span>
                          )}
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-500 text-xs">{t('report.condition')}</p>
                      <p>{t(`condition.${record.condition}`)}</p>
                    </div>

                    {record.releaseYear && (
                      <div>
                        <p className="text-gray-500 text-xs">{t('report.releaseYear')}</p>
                        <p>{record.releaseYear}</p>
                      </div>
                    )}

                    {record.label && (
                      <div>
                        <p className="text-gray-500 text-xs">{t('report.label')}</p>
                        <p className="truncate">{record.label}</p>
                      </div>
                    )}

                    {record.catalogNumber && (
                      <div>
                        <p className="text-gray-500 text-xs">{t('report.catalogNumber')}</p>
                        <p>{record.catalogNumber}</p>
                      </div>
                    )}

                    {record.country && (
                      <div>
                        <p className="text-gray-500 text-xs">{t('report.country')}</p>
                        <p>{record.country}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {selected.length > 1 && (
        <div className="sticky bottom-0 bg-white border-t p-4">
          <CurrencySelector value={currency} onChange={setCurrency} />
        </div>
      )}
    </div>
  )
}
