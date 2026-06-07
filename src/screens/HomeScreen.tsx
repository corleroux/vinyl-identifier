import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function HomeScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-6">
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
    </div>
  )
}
