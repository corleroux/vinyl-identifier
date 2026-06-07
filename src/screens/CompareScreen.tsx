import { useTranslation } from 'react-i18next'

export function CompareScreen() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-2xl font-bold">{t('compare.title')}</h1>
      <p className="mt-4 text-gray-500">{t('compare.selectRecords')}</p>
    </div>
  )
}
