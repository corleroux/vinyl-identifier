import { useState, useCallback, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
  CapacitorBarcodeScannerCameraDirection,
} from '@capacitor/barcode-scanner'
import { searchDiscogsBarcode } from '@/services/api'
import { useScanStore } from '@/store/useScanStore'
import { useAppStore } from '@/store/useAppStore'
import { isNativePlatform } from '@/utils/platform'
import { db } from '@/db'
import { trimScanHistory } from '@/utils/scanHistory'
import type { VinylRecord, VinylCondition } from '@/types'

export function BarcodeScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [manualBarcode, setManualBarcode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scanning, setScanning] = useState(false)
  const setReport = useScanStore((s) => s.setReport)
  const reset = useScanStore((s) => s.reset)
  const batchMode = useScanStore((s) => s.batchMode)
  const addToBatch = useScanStore((s) => s.addToBatch)
  const incrementScanCount = useAppStore((s) => s.incrementScanCount)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const detectorRef = useRef<BarcodeDetector | null>(null)
  const scanFrameRef = useRef<number>(0)
  const scanningRef = useRef(false)

  const isNative = isNativePlatform()

  const processBarcode = useCallback(
    async (barcode: string) => {
      setLoading(true)
      setError(null)

      try {
        const result = await searchDiscogsBarcode(barcode)

        const record: VinylRecord = {
          id: crypto.randomUUID(),
          artist: result.artist,
          album: result.title,
          label: result.label,
          catalogNumber: result.catalogNumber,
          country: result.country,
          releaseYear: result.year || undefined,
          format: result.format,
          rarityTier: 'common',
          estimatedValueLow: result.blockAvgPrice ?? 0,
          estimatedValueHigh: result.blockMedianPrice ?? 0,
          currency: 'USD',
          condition: 'vg' as VinylCondition,
          conditionSource: 'user',
          createdAt: Date.now(),
          updatedAt: Date.now(),
          tags: [],
        }

        setReport(record)
        incrementScanCount()

        await db.scanHistory.add({
          id: record.id,
          imageUri: '',
          status: 'complete',
          record,
          createdAt: Date.now(),
        })
        await trimScanHistory()

        if (batchMode) {
          addToBatch(record)
          reset()
          navigate('/', { replace: true })
        } else {
          navigate(`/report/${record.id}`, { replace: true })
        }
      } catch {
        setError(t('scan.barcodeNotFound'))
      } finally {
        setLoading(false)
      }
    },
    [setReport, incrementScanCount, batchMode, addToBatch, reset, navigate, t],
  )

  const stopWebScanner = useCallback(() => {
    scanningRef.current = false
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    if (scanFrameRef.current) {
      cancelAnimationFrame(scanFrameRef.current)
      scanFrameRef.current = 0
    }
  }, [])

  const startWebScanner = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }

      if (typeof BarcodeDetector !== 'undefined') {
        detectorRef.current = new BarcodeDetector({
          formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128', 'code_39'],
        })
        scanningRef.current = true

        const scanLoop = () => {
          if (!scanningRef.current) return
          const video = videoRef.current
          const detector = detectorRef.current
          if (!video || !detector || video.readyState < 2) {
            scanFrameRef.current = requestAnimationFrame(scanLoop)
            return
          }

          detector
            .detect(video)
            .then((barcodes) => {
              if (barcodes.length > 0) {
                const barcode = barcodes[0].rawValue
                if (barcode) {
                  stopWebScanner()
                  setScanning(false)
                  processBarcode(barcode)
                  return
                }
              }
              scanFrameRef.current = requestAnimationFrame(scanLoop)
            })
            .catch(() => {
              scanFrameRef.current = requestAnimationFrame(scanLoop)
            })
        }

        scanFrameRef.current = requestAnimationFrame(scanLoop)
      }
    } catch {
      setScanning(false)
    }
  }, [stopWebScanner, processBarcode])

  useEffect(() => {
    return () => {
      stopWebScanner()
    }
  }, [stopWebScanner])

  const startNativeScanner = useCallback(async () => {
    setScanning(true)
    setError(null)

    try {
      const result = await CapacitorBarcodeScanner.scanBarcode({
        hint: CapacitorBarcodeScannerTypeHint.ALL,
        scanInstructions: t('scan.barcodeScanInstructions'),
        scanButton: false,
        cameraDirection: CapacitorBarcodeScannerCameraDirection.BACK,
      })

      if (result.ScanResult) {
        processBarcode(result.ScanResult)
      } else {
        setScanning(false)
      }
    } catch {
      setScanning(false)
    }
  }, [processBarcode, t])

  const startWebCameraScanner = useCallback(() => {
    setScanning(true)
    setError(null)
    startWebScanner()
  }, [startWebScanner])

  const handleStartScan = useCallback(() => {
    if (isNative) {
      startNativeScanner()
    } else {
      startWebCameraScanner()
    }
  }, [isNative, startNativeScanner, startWebCameraScanner])

  const handleManualSubmit = useCallback(() => {
    if (!manualBarcode.trim()) return
    processBarcode(manualBarcode.trim())
  }, [manualBarcode, processBarcode])

  return (
    <div className="flex flex-col min-h-screen">
      {scanning && !isNative && (
        <div className="relative flex-1 bg-black">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            aria-label={t('common.barcodePreview')}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-32 border-2 border-white rounded-lg" />
          </div>
          <div className="absolute top-4 left-0 right-0 text-center">
            <p className="text-white text-sm bg-black/50 inline-block px-3 py-1 rounded-full">
              {t('scan.barcodeScanInstructions')}
            </p>
          </div>
          <button
            onClick={() => {
              stopWebScanner()
              setScanning(false)
            }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 bg-white/20 backdrop-blur rounded-full text-white text-sm"
          >
            {t('common.cancel')}
          </button>
        </div>
      )}

      {!scanning && (
        <div className="flex flex-col p-6 gap-6 flex-1">
          <h2 className="text-xl font-bold">{t('home.barcode')}</h2>

          <button onClick={handleStartScan} disabled={loading} className="btn-primary min-h-[48px]">
            {t('scan.scanBarcode')}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">{t('scan.or')}</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label htmlFor="barcode-input" className="sr-only">
              {t('scan.barcodePlaceholder')}
            </label>
            <input
              id="barcode-input"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleManualSubmit()}
              placeholder={t('scan.barcodePlaceholder')}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleManualSubmit}
              disabled={loading || !manualBarcode.trim()}
              className="btn-secondary"
            >
              {loading ? t('common.loading') : t('scan.submit')}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            onClick={() => {
              reset()
              navigate('/', { replace: true })
            }}
            className="btn-secondary mt-auto"
          >
            {t('common.cancel')}
          </button>
        </div>
      )}
    </div>
  )
}
