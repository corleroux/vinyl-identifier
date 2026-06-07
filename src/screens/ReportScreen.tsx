import { useTranslation } from 'react-i18next'

export function ReportScreen() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen p-6">
      <h1 className="text-2xl font-bold">{t('report.title')}</h1>
      <p className="mt-4 text-gray-500">Report content will render here</p>
    </div>
  )
}
