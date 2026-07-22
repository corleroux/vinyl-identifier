import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { gradeCondition } from '@/services/api'
import { ConditionGradeDisplay } from '@/components/ConditionGradeDisplay'
import type { ConditionGrade } from '@/types'

export function ConditionGradeScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [grading, setGrading] = useState(false)
  const [grade, setGrade] = useState<ConditionGrade | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
      }
      reader.readAsDataURL(file)
      setGrade(null)
      setError(null)
    }
  }

  const handleGrade = async () => {
    if (!selectedFile) return

    setGrading(true)
    setError(null)
    try {
      const result = await gradeCondition(selectedFile)
      setGrade(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to grade condition')
    } finally {
      setGrading(false)
    }
  }

  const handleRetake = () => {
    setSelectedImage(null)
    setSelectedFile(null)
    setGrade(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="text-blue-600 font-medium">
          {t('common.back')}
        </button>
        <h1 className="text-lg font-semibold">{t('condition.grading.title')}</h1>
        <div className="w-12" />
      </header>

      <div className="flex-1 p-4 space-y-4">
        {!selectedImage ? (
          <div className="space-y-4">
            <p className="text-gray-600 text-center">{t('condition.grading.selectImagePrompt')}</p>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full btn-primary min-h-[44px]"
            >
              {t('condition.grading.selectImage')}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleImageSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <img src={selectedImage} alt="Vinyl record" className="w-full h-auto" />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            {!grade && !grading && (
              <div className="flex gap-3">
                <button onClick={handleRetake} className="flex-1 btn-secondary min-h-[44px]">
                  {t('condition.grading.retake')}
                </button>
                <button onClick={handleGrade} className="flex-1 btn-primary min-h-[44px]">
                  {t('condition.grading.grade')}
                </button>
              </div>
            )}

            {grading && (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                <p className="mt-2 text-gray-600">{t('condition.grading.grading')}</p>
              </div>
            )}

            {grade && (
              <div className="space-y-4">
                <ConditionGradeDisplay grade={grade} />
                <button onClick={handleRetake} className="w-full btn-secondary min-h-[44px]">
                  {t('condition.grading.tryAnother')}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
