import { Routes, Route } from 'react-router-dom'
import { HomeScreen } from '@/screens/HomeScreen'
import { CameraScreen } from '@/screens/CameraScreen'
import { ImagePreviewScreen } from '@/screens/ImagePreviewScreen'
import { GalleryScreen } from '@/screens/GalleryScreen'
import { BarcodeScreen } from '@/screens/BarcodeScreen'
import { ProcessingScreen } from '@/screens/ProcessingScreen'
import { ManualInputScreen } from '@/screens/ManualInputScreen'
import { ReportScreen } from '@/screens/ReportScreen'
import { BatchSessionScreen } from '@/screens/BatchSessionScreen'
import { LibraryScreen } from '@/screens/LibraryScreen'
import { ScanHistoryScreen } from '@/screens/ScanHistoryScreen'
import { CompareScreen } from '@/screens/CompareScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'

export default function App() {
  return (
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
  )
}
