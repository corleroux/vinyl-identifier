/**
 * Global application state — Zustand client state store.
 * @see AGENTS.md#architecture — Client state layer
 * @see PRD.md §8 — Technology Choices (Zustand rationale)
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
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

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isFullVersion: false,
      scanCount: 0,
      maxFreeScans: 5,
      currency: 'USD',
      setFullVersion: (value) => set({ isFullVersion: value }),
      incrementScanCount: () => set((s) => ({ scanCount: s.scanCount + 1 })),
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'vinyl-app-store',
    },
  ),
)
