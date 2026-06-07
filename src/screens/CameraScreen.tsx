import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

export function CameraScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <p className="text-center text-gray-600">{t('scan.frameGuide')}</p>
      {/* Camera viewfinder with AR overlay will go here */}
      <div className="w-72 h-72 border-2 border-dashed border-gray-400 rounded-lg mt-6 flex items-center justify-center">
        <span className="text-gray-400">Camera Preview</span>
      </div>
      <button onClick={() => navigate(-1)} className="btn-secondary mt-6">
        {t('common.cancel')}
      </button>
    </div>
  )
}
