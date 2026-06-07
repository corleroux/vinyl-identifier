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
  batchMode: boolean
  batchQueue: VinylRecord[]

  setStage: (stage: ScanStage) => void
  setImage: (uri: string, blob: Blob | null) => void
  setProcessingStep: (step: string) => void
  setProcessingError: (error: string | null) => void
  setReport: (report: VinylRecord | null) => void
  addToBatch: (record: VinylRecord) => void
  removeFromBatch: (id: string) => void
  clearBatch: () => void
  toggleBatchMode: () => void
  reset: () => void
}

export const useScanStore = create<ScanState>((set) => ({
  stage: 'idle',
  imageUri: null,
  imageBlob: null,
  processingStep: 'vision',
  processingError: null,
  report: null,
  batchMode: false,
  batchQueue: [],

  setStage: (stage) => set({ stage }),
  setImage: (uri, blob) => set({ imageUri: uri, imageBlob: blob }),
  setProcessingStep: (step) => set({ processingStep: step }),
  setProcessingError: (error) => set({ processingError: error }),
  setReport: (report) => set({ report }),
  addToBatch: (record) => set((s) => ({ batchQueue: [...s.batchQueue, record] })),
  removeFromBatch: (id) => set((s) => ({ batchQueue: s.batchQueue.filter((r) => r.id !== id) })),
  clearBatch: () => set({ batchQueue: [] }),
  toggleBatchMode: () => set((s) => ({ batchMode: !s.batchMode })),
  reset: () =>
    set({
      stage: 'idle',
      imageUri: null,
      imageBlob: null,
      processingStep: 'vision',
      processingError: null,
      report: null,
      batchQueue: [],
      batchMode: false,
    }),
}))
