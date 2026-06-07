import { create } from 'zustand'
import type { Currency } from '@/types'

interface AppState {
  isFullVersion: boolean
  scanCount: number
  maxFreeScans: number
  currency: Currency
  setFullVersion: (value: boolean) => void
  incrementScanCount: () => void
  setCurrency: (currency: Currency) => void
}

export const useAppStore = create<AppState>((set) => ({
  isFullVersion: false,
  scanCount: 0,
  maxFreeScans: 5,
  currency: 'USD',
  setFullVersion: (value) => set({ isFullVersion: value }),
  incrementScanCount: () => set((s) => ({ scanCount: s.scanCount + 1 })),
  setCurrency: (currency) => set({ currency }),
}))
