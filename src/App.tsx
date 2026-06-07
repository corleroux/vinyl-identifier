import { Routes, Route } from 'react-router-dom'
import { HomeScreen } from '@/screens/HomeScreen'
import { CameraScreen } from '@/screens/CameraScreen'
import { GalleryScreen } from '@/screens/GalleryScreen'
import { BarcodeScreen } from '@/screens/BarcodeScreen'
import { ReportScreen } from '@/screens/ReportScreen'
import { LibraryScreen } from '@/screens/LibraryScreen'
import { CompareScreen } from '@/screens/CompareScreen'
import { SettingsScreen } from '@/screens/SettingsScreen'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/scan/camera" element={<CameraScreen />} />
      <Route path="/scan/gallery" element={<GalleryScreen />} />
      <Route path="/scan/barcode" element={<BarcodeScreen />} />
      <Route path="/report/:id" element={<ReportScreen />} />
      <Route path="/library" element={<LibraryScreen />} />
      <Route path="/compare" element={<CompareScreen />} />
      <Route path="/settings" element={<SettingsScreen />} />
    </Routes>
  )
}
