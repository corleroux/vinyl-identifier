import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function GalleryScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <p className="text-lg text-center text-gray-600">Gallery picker will open here</p>
      <button onClick={() => navigate(-1)} className="btn-secondary mt-6">
        {t('common.cancel')}
      </button>
    </div>
  )
}
