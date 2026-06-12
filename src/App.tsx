import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { OfflineBanner } from '@/components/OfflineBanner'
import { BottomNav } from '@/components/BottomNav'

const HomeScreen = lazy(() =>
  import('@/screens/HomeScreen').then((m) => ({ default: m.HomeScreen })),
)
const CameraScreen = lazy(() =>
  import('@/screens/CameraScreen').then((m) => ({ default: m.CameraScreen })),
)
const ImagePreviewScreen = lazy(() =>
  import('@/screens/ImagePreviewScreen').then((m) => ({ default: m.ImagePreviewScreen })),
)
const GalleryScreen = lazy(() =>
  import('@/screens/GalleryScreen').then((m) => ({ default: m.GalleryScreen })),
)
const BarcodeScreen = lazy(() =>
  import('@/screens/BarcodeScreen').then((m) => ({ default: m.BarcodeScreen })),
)
const ProcessingScreen = lazy(() =>
  import('@/screens/ProcessingScreen').then((m) => ({ default: m.ProcessingScreen })),
)
const ManualInputScreen = lazy(() =>
  import('@/screens/ManualInputScreen').then((m) => ({ default: m.ManualInputScreen })),
)
const ReportScreen = lazy(() =>
  import('@/screens/ReportScreen').then((m) => ({ default: m.ReportScreen })),
)
const BatchSessionScreen = lazy(() =>
  import('@/screens/BatchSessionScreen').then((m) => ({ default: m.BatchSessionScreen })),
)
const LibraryScreen = lazy(() =>
  import('@/screens/LibraryScreen').then((m) => ({ default: m.LibraryScreen })),
)
const ScanHistoryScreen = lazy(() =>
  import('@/screens/ScanHistoryScreen').then((m) => ({ default: m.ScanHistoryScreen })),
)
const CompareScreen = lazy(() =>
  import('@/screens/CompareScreen').then((m) => ({ default: m.CompareScreen })),
)
const SettingsScreen = lazy(() =>
  import('@/screens/SettingsScreen').then((m) => ({ default: m.SettingsScreen })),
)

const HIDE_NAV_ROUTES = ['/scan/camera', '/scan/processing', '/scan/gallery']

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"
        aria-label="Loading"
        role="status"
      />
    </div>
  )
}

export default function App() {
  const location = useLocation()
  const showNav = !HIDE_NAV_ROUTES.includes(location.pathname)

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2 focus:rounded"
      >
        Skip to content
      </a>
      <OfflineBanner />
      <main id="main-content" className={showNav ? 'pb-16' : ''}>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/scan/camera" element={<CameraScreen />} />
            <Route path="/scan/preview" element={<ImagePreviewScreen />} />
            <Route path="/scan/gallery" element={<GalleryScreen />} />
            <Route path="/scan/barcode" element={<BarcodeScreen />} />
            <Route path="/scan/processing" element={<ProcessingScreen />} />
            <Route path="/scan/manual" element={<ManualInputScreen />} />
            <Route path="/report/:id" element={<ReportScreen />} />
            <Route path="/batch" element={<BatchSessionScreen />} />
            <Route path="/library" element={<LibraryScreen />} />
            <Route path="/library/history" element={<ScanHistoryScreen />} />
            <Route path="/compare" element={<CompareScreen />} />
            <Route path="/settings" element={<SettingsScreen />} />
          </Routes>
        </Suspense>
      </main>
      {showNav && <BottomNav />}
    </>
  )
}
