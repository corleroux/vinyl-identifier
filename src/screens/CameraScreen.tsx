import { useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'
import { AROverlay } from '@/components/AROverlay'
import { useScanStore } from '@/store/useScanStore'
import { isNativePlatform } from '@/utils/platform'

async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl)
  return res.blob()
}

async function captureWithCapacitor(): Promise<{ dataUrl: string; blob: Blob } | null> {
  try {
    const photo = await Camera.getPhoto({
      quality: 92,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
      width: 1920,
      height: 1920,
      correctOrientation: true,
    })

    if (!photo.dataUrl) return null
    const blob = await dataUrlToBlob(photo.dataUrl)
    return { dataUrl: photo.dataUrl, blob }
  } catch {
    return null
  }
}

export function CameraScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const setImage = useScanStore((s) => s.setImage)
  const setStage = useScanStore((s) => s.setStage)
  const capturedRef = useRef(false)

  const isNative = isNativePlatform()

  useEffect(() => {
    if (isNative) return

    let cancelled = false
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1920 } },
        audio: false,
      })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      })
      .catch(() => {
        if (!cancelled) navigate(-1)
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [navigate, isNative])

  const capture = useCallback(async () => {
    if (capturedRef.current) return
    capturedRef.current = true

    if (isNative) {
      const result = await captureWithCapacitor()
      if (result) {
        setImage(result.dataUrl, result.blob)
        setStage('preview')
        navigate('/scan/preview')
      } else {
        capturedRef.current = false
      }
      return
    }

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cx = video.videoWidth / 2
    const cy = video.videoHeight / 2
    const size = Math.min(video.videoWidth, video.videoHeight) * 0.8
    const sx = cx - size / 2
    const sy = cy - size / 2
    ctx.drawImage(video, sx, sy, size, size, 0, 0, size, size)

    canvas.toBlob(
      async (blob) => {
        if (!blob) return
        setImage(canvas.toDataURL('image/jpeg', 0.92), blob)
        setStage('preview')
        streamRef.current?.getTracks().forEach((t) => t.stop())
        navigate('/scan/preview')
      },
      'image/jpeg',
      0.92,
    )
  }, [navigate, setImage, setStage, isNative])

  if (isNative) {
    return (
      <div className="relative flex flex-col min-h-screen bg-black">
        <div className="absolute inset-0 flex items-center justify-center">
          <AROverlay />
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-6">
          <button
            onClick={() => navigate(-1)}
            className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
          >
            <span className="text-white text-sm font-medium">{t('common.cancel')}</span>
          </button>
          <button
            onClick={capture}
            aria-label={t('common.takePhoto')}
            className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
          >
            <div className="w-16 h-16 rounded-full bg-white" />
          </button>
          <div className="w-16" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        aria-label={t('common.cameraPreview')}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <canvas ref={canvasRef} className="hidden" />
      <AROverlay />

      <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-center gap-6">
        <button
          onClick={() => {
            streamRef.current?.getTracks().forEach((t) => t.stop())
            navigate(-1)
          }}
          className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center"
        >
          <span className="text-white text-sm font-medium">{t('common.cancel')}</span>
        </button>
        <button
          onClick={capture}
          aria-label={t('common.takePhoto')}
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-white" />
        </button>
        <div className="w-16" />
      </div>
    </div>
  )
}
