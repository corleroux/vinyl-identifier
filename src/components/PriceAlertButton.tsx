import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { createPriceAlert, deletePriceAlert, getAlertsForRecord } from '@/services/priceAlerts'
import type { PriceAlert } from '@/types'

interface PriceAlertButtonProps {
  recordId: string
}

export function PriceAlertButton({ recordId }: PriceAlertButtonProps) {
  const { t } = useTranslation()
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [showDialog, setShowDialog] = useState(false)
  const [thresholdPercent, setThresholdPercent] = useState(10)
  const [direction, setDirection] = useState<'up' | 'down' | 'both'>('both')

  useEffect(() => {
    getAlertsForRecord(recordId).then(setAlerts)
  }, [recordId])

  async function handleCreateAlert() {
    await createPriceAlert(recordId, thresholdPercent, undefined, direction)
    const updated = await getAlertsForRecord(recordId)
    setAlerts(updated)
    setShowDialog(false)
  }

  async function handleDeleteAlert(alertId: string) {
    await deletePriceAlert(alertId)
    const updated = await getAlertsForRecord(recordId)
    setAlerts(updated)
  }

  if (alerts.length > 0) {
    return (
      <div className="space-y-2">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
          >
            <div className="flex items-center gap-2">
              <span className="text-blue-600">🔔</span>
              <div className="text-sm">
                <p className="font-medium">{t('priceAlerts.alertActive')}</p>
                <p className="text-gray-600">
                  {alert.direction === 'both'
                    ? t('priceAlerts.directionBoth', { percent: alert.thresholdPercent })
                    : alert.direction === 'up'
                      ? t('priceAlerts.directionUp', { percent: alert.thresholdPercent })
                      : t('priceAlerts.directionDown', { percent: alert.thresholdPercent })}
                </p>
              </div>
            </div>
            <button
              onClick={() => handleDeleteAlert(alert.id)}
              className="text-red-600 text-sm underline min-h-[44px] px-2"
            >
              {t('common.delete')}
            </button>
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <button
        onClick={() => setShowDialog(true)}
        className="btn-secondary w-full min-h-[44px] flex items-center justify-center gap-2"
      >
        <span>🔔</span>
        {t('priceAlerts.setAlert')}
      </button>

      {showDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full space-y-4">
            <h3 className="text-lg font-semibold">{t('priceAlerts.createTitle')}</h3>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {t('priceAlerts.threshold')}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={thresholdPercent}
                  onChange={(e) => setThresholdPercent(Number(e.target.value))}
                  min={1}
                  max={100}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm"
                />
                <span className="text-sm text-gray-600">%</span>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 block mb-2">
                {t('priceAlerts.direction')}
              </label>
              <select
                value={direction}
                onChange={(e) => setDirection(e.target.value as 'up' | 'down' | 'both')}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="both">{t('priceAlerts.directionBothLabel')}</option>
                <option value="up">{t('priceAlerts.directionUpLabel')}</option>
                <option value="down">{t('priceAlerts.directionDownLabel')}</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowDialog(false)}
                className="btn-secondary flex-1 min-h-[44px]"
              >
                {t('common.cancel')}
              </button>
              <button onClick={handleCreateAlert} className="btn-primary flex-1 min-h-[44px]">
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
