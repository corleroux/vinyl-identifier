import { useTranslation } from 'react-i18next'

export function SettingsScreen() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
    </div>
  )
}
