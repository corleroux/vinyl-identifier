import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { useScanStore } from '@/store/useScanStore'
import { identifyVinyl } from '@/services/api'
import { db } from '@/db'
import { useAppStore } from '@/store/useAppStore'
import { trimScanHistory } from '@/utils/scanHistory'

export function ProcessingScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const processedRef = useRef(false)

  const imageBlob = useScanStore((s) => s.imageBlob)
  const setProcessingStep = useScanStore((s) => s.setProcessingStep)
  const setProcessingError = useScanStore((s) => s.setProcessingError)
  const setReport = useScanStore((s) => s.setReport)
  const addToBatch = useScanStore((s) => s.addToBatch)
  const batchMode = useScanStore((s) => s.batchMode)
  const reset = useScanStore((s) => s.reset)
  const incrementScanCount = useAppStore((s) => s.incrementScanCount)

  useEffect(() => {
    const blob = imageBlob
    if (processedRef.current || !blob) return
    processedRef.current = true

    async function process() {
      try {
        setProcessingStep('vision')
        const record = await identifyVinyl(blob!)

        setProcessingStep('research')
        setProcessingStep('discogs')

        setReport(record)
        incrementScanCount()

        await db.scanHistory.add({
          id: record.id,
          status: 'complete',
          imageUri: '',
          record,
          createdAt: Date.now(),
        })
        await trimScanHistory()

        if (batchMode) {
          addToBatch(record)
          navigate('/scan/camera', { replace: true })
        } else {
          navigate(`/report/${record.id}`, { replace: true })
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setProcessingError(message)
        navigate('/scan/manual', { replace: true })
      }
    }

    process()
  }, [
    imageBlob,
    navigate,
    setProcessingStep,
    setProcessingError,
    setReport,
    incrementScanCount,
    addToBatch,
    batchMode,
  ])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 gap-8">
      <p className="text-lg font-semibold text-gray-900">{t('scan.processing')}</p>
      <ProgressIndicator currentStep="vision" />
      <button
        onClick={() => {
          reset()
          navigate('/', { replace: true })
        }}
        className="text-sm text-gray-500 underline"
      >
        {t('common.cancel')}
      </button>
    </div>
  )
}
