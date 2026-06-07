import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useScanStore } from '@/store/useScanStore'

export function ImagePreviewScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const imageUri = useScanStore((s) => s.imageUri)
  const setStage = useScanStore((s) => s.setStage)
  const reset = useScanStore((s) => s.reset)

  if (!imageUri) {
    navigate('/', { replace: true })
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <img src={imageUri} alt="Preview" className="flex-1 object-contain p-4" />

      <div className="p-6 bg-white rounded-t-2xl flex flex-col gap-4">
        <button
          onClick={() => {
            setStage('processing')
            navigate('/scan/processing')
          }}
          className="btn-primary"
        >
          {t('scan.confirm')}
        </button>
        <button
          onClick={() => {
            reset()
            navigate('/scan/camera', { replace: true })
          }}
          className="btn-secondary"
        >
          {t('scan.retake')}
        </button>
      </div>
    </div>
  )
}
