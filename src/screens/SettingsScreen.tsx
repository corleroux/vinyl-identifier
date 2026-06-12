import { useTranslation } from 'react-i18next'
import { useAppStore } from '@/store/useAppStore'
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
  const currency = useAppStore((s) => s.currency)
  const setCurrency = useAppStore((s) => s.setCurrency)
  const isFullVersion = useAppStore((s) => s.isFullVersion)
  const scanCount = useAppStore((s) => s.scanCount)
  const maxFreeScans = useAppStore((s) => s.maxFreeScans)

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
          <p className="text-sm text-gray-500">{t('settings.scanLimit')}</p>
          <p className="font-semibold">
            {isFullVersion
              ? t('settings.purchased')
              : `${Math.max(0, maxFreeScans - scanCount)} / ${maxFreeScans}`}
          </p>
        </div>

        <div className="border-t pt-4">
          <p className="text-sm text-gray-500">{t('settings.about')}</p>
          <p className="text-sm">{t('settings.version')} 1.0.0</p>
        </div>
      </div>
    </div>
  )
}
