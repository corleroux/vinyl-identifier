import { useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useScanStore } from '@/store/useScanStore'

export function GalleryScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement>(null)
  const setImage = useScanStore((s) => s.setImage)
  const setStage = useScanStore((s) => s.setStage)

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = () => {
        setImage(reader.result as string, file)
        setStage('preview')
        navigate('/scan/preview')
      }
      reader.readAsDataURL(file)
    },
    [navigate, setImage, setStage],
  )

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <p className="text-lg text-center text-gray-600 mb-6">{t('home.gallery')}</p>

      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />

      <button onClick={() => inputRef.current?.click()} className="btn-primary max-w-sm">
        {t('home.gallery')}
      </button>

      <button onClick={() => navigate(-1)} className="btn-secondary max-w-sm mt-4">
        {t('common.cancel')}
      </button>
    </div>
  )
}
