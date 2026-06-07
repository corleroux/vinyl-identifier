import { create } from 'zustand'
import type { VinylRecord } from '@/types'

type ScanStage = 'idle' | 'capturing' | 'preview' | 'processing' | 'manual' | 'report' | 'error'

interface ScanState {
  stage: ScanStage
  imageUri: string | null
  imageBlob: Blob | null
  processingStep: string
  processingError: string | null
  report: VinylRecord | null
  batchQueue: string[]

  setStage: (stage: ScanStage) => void
  setImage: (uri: string, blob: Blob | null) => void
  setProcessingStep: (step: string) => void
  setProcessingError: (error: string | null) => void
  setReport: (report: VinylRecord | null) => void
  reset: () => void
}

export const useScanStore = create<ScanState>((set) => ({
  stage: 'idle',
  imageUri: null,
  imageBlob: null,
  processingStep: 'vision',
  processingError: null,
  report: null,
  batchQueue: [],

  setStage: (stage) => set({ stage }),
  setImage: (uri, blob) => set({ imageUri: uri, imageBlob: blob }),
  setProcessingStep: (step) => set({ processingStep: step }),
  setProcessingError: (error) => set({ processingError: error }),
  setReport: (report) => set({ report }),
  reset: () =>
    set({
      stage: 'idle',
      imageUri: null,
      imageBlob: null,
      processingStep: 'vision',
      processingError: null,
      report: null,
    }),
}))
