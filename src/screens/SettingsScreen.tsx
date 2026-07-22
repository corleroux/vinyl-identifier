import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { restorePurchases } from '@/services/purchase'
import { track } from '@/services/analytics'
import {
  isSyncEnabled,
  setSyncToken,
  clearSyncToken,
  generateSyncToken,
  syncToCloud,
  syncFromCloud,
  getLastSync,
} from '@/services/sync'
import type { Currency } from '@/types'

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'ja', label: '日本語' },
]

const CURRENCIES: Currency[] = ['USD', 'EUR', 'GBP']

export function SettingsScreen() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const currency = useAppStore((s) => s.currency)
  const setCurrency = useAppStore((s) => s.setCurrency)
  const isFullVersion = useAppStore((s) => s.isFullVersion)
  const setFullVersion = useAppStore((s) => s.setFullVersion)
  const scanCount = useAppStore((s) => s.scanCount)
  const maxFreeScans = useAppStore((s) => s.maxFreeScans)
  const [restoring, setRestoring] = useState(false)
  const [syncEnabled, setSyncEnabled] = useState(isSyncEnabled())
  const [syncing, setSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<number | null>(getLastSync())
  const [syncError, setSyncError] = useState<string | null>(null)

  async function handleRestore() {
    setRestoring(true)
    try {
      const result = await restorePurchases()
      if (result.success) {
        setFullVersion(true)
        track('purchase_restored')
      }
    } finally {
      setRestoring(false)
    }
  }

  function handleEnableSync() {
    const token = generateSyncToken()
    setSyncToken(token)
    setSyncEnabled(true)
    track('sync_enabled')
  }

  function handleDisableSync() {
    clearSyncToken()
    setSyncEnabled(false)
    setLastSync(null)
    track('sync_disabled')
  }

  async function handleSyncUp() {
    setSyncing(true)
    setSyncError(null)
    const result = await syncToCloud()
    setSyncing(false)
    if (result.success) {
      setLastSync(getLastSync())
      track('sync_upload')
    } else {
      setSyncError(result.error || 'Sync failed')
    }
  }

  async function handleSyncDown() {
    setSyncing(true)
    setSyncError(null)
    const result = await syncFromCloud()
    setSyncing(false)
    if (result.success) {
      setLastSync(getLastSync())
      track('sync_download')
    } else {
      setSyncError(result.error || 'Sync failed')
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-6">{t('settings.title')}</h1>

      <div className="space-y-6">
        <div>
          <label htmlFor="language-select" className="text-sm font-medium text-gray-700 block mb-2">
            {t('settings.language')}
          </label>
          <select
            id="language-select"
            value={i18n.language}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {LANGUAGES.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="currency-select" className="text-sm font-medium text-gray-700 block mb-2">
            {t('settings.currency')}
          </label>
          <select
            id="currency-select"
            value={currency}
            onChange={(e) => setCurrency(e.target.value as Currency)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CURRENCIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-3">{t('settings.sync')}</h2>
          {syncEnabled ? (
            <div className="space-y-3">
              <p className="text-sm text-green-600">{t('settings.syncEnabled')}</p>
              {lastSync && (
                <p className="text-xs text-gray-500">
                  {t('settings.lastSync')}: {new Date(lastSync).toLocaleString()}
                </p>
              )}
              {syncError && <p className="text-sm text-red-600">{syncError}</p>}
              <div className="flex gap-2">
                <button
                  onClick={handleSyncUp}
                  disabled={syncing}
                  className="flex-1 btn-secondary min-h-[44px]"
                >
                  {syncing ? t('common.loading') : t('settings.syncUp')}
                </button>
                <button
                  onClick={handleSyncDown}
                  disabled={syncing}
                  className="flex-1 btn-secondary min-h-[44px]"
                >
                  {syncing ? t('common.loading') : t('settings.syncDown')}
                </button>
              </div>
              <button
                onClick={handleDisableSync}
                className="w-full text-sm text-red-600 underline min-h-[44px]"
              >
                {t('settings.disableSync')}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">{t('sync.description')}</p>
              <button onClick={handleEnableSync} className="btn-primary w-full min-h-[44px]">
                {t('settings.enableSync')}
              </button>
            </div>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">{t('settings.scanLimit')}</p>
          <p className="font-semibold mb-3">
            {isFullVersion
              ? t('settings.purchased')
              : `${Math.max(0, maxFreeScans - scanCount)} / ${maxFreeScans}`}
          </p>
          {!isFullVersion && (
            <button
              onClick={() => navigate('/paywall')}
              className="btn-primary w-full min-h-[44px]"
            >
              {t('settings.purchase')}
            </button>
          )}
          {isFullVersion && (
            <button
              onClick={handleRestore}
              disabled={restoring}
              className="btn-secondary w-full min-h-[44px]"
            >
              {restoring ? t('common.loading') : t('settings.restorePurchases')}
            </button>
          )}
        </div>

        <div className="border-t pt-4">
          <button
            onClick={() => navigate('/alerts')}
            className="btn-secondary w-full min-h-[44px] flex items-center justify-center gap-2"
          >
            <span>🔔</span>
            {t('settings.priceAlerts')}
          </button>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">{t('settings.about')}</p>
          <p className="text-sm">{t('settings.version')} 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
