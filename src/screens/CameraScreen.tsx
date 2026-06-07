import { useRef, useCallback, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { AROverlay } from '@/components/AROverlay'
import { useScanStore } from '@/store/useScanStore'

export function CameraScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const setImage = useScanStore((s) => s.setImage)
  const setStage = useScanStore((s) => s.setStage)
  const capturedRef = useRef(false)

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1920 } },
        audio: false,
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
    } catch {
      navigate(-1)
    }
  }, [navigate])

  useEffect(() => {
    startCamera()
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [startCamera])

  const capture = useCallback(() => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas || capturedRef.current) return
    capturedRef.current = true

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
  }, [navigate, setImage, setStage])

  return (
    <div className="relative flex flex-col min-h-screen bg-black">
      <video
        ref={videoRef}
        autoPlay
        playsInline
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
          className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center"
        >
          <div className="w-16 h-16 rounded-full bg-white" />
        </button>
        <div className="w-16" />
      </div>
    </div>
  )
}
