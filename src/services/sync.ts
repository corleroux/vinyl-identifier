/**
 * Cloud sync service for cross-device data synchronization.
 * @see AGENTS.md#architecture — Backend layer
 * @see PRD.md §8 — Technology Choices (Cloudflare Workers rationale)
 */
import { db } from '@/db'
import type { VinylRecord, Folder, Tag, ScanResult } from '@/types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

interface SyncData {
  records: VinylRecord[]
  folders: Folder[]
  tags: Tag[]
  scanHistory: ScanResult[]
  syncedAt: number
}

function getSyncToken(): string | null {
  return localStorage.getItem('sync-token')
}

export function setSyncToken(token: string): void {
  localStorage.setItem('sync-token', token)
}

export function clearSyncToken(): void {
  localStorage.removeItem('sync-token')
}

export function generateSyncToken(): string {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => byte.toString(16).padStart(2, '0')).join('')
}

export async function syncToCloud(): Promise<{ success: boolean; error?: string }> {
  const token = getSyncToken()
  if (!token) {
    return { success: false, error: 'No sync token' }
  }

  try {
    const records = await db.records.toArray()
    const folders = await db.folders.toArray()
    const tags = await db.tags.toArray()
    const scanHistory = await db.scanHistory.toArray()

    const data: SyncData = {
      records,
      folders,
      tags,
      scanHistory,
      syncedAt: Date.now(),
    }

    const response = await fetch(`${API_URL}/api/sync`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Sync failed' }
    }

    localStorage.setItem('last-sync', Date.now().toString())
    return { success: true }
  } catch (error) {
    console.error('Sync to cloud error:', error)
    return { success: false, error: 'Network error' }
  }
}

export async function syncFromCloud(): Promise<{ success: boolean; error?: string }> {
  const token = getSyncToken()
  if (!token) {
    return { success: false, error: 'No sync token' }
  }

  try {
    const response = await fetch(`${API_URL}/api/sync`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      const error = await response.json()
      return { success: false, error: error.error || 'Sync failed' }
    }

    const result = await response.json()
    if (!result.data) {
      return { success: true }
    }

    const data: SyncData = result.data

    await db.transaction('rw', db.records, db.folders, db.tags, db.scanHistory, async () => {
      await db.records.clear()
      await db.folders.clear()
      await db.tags.clear()
      await db.scanHistory.clear()

      if (data.records.length > 0) await db.records.bulkAdd(data.records)
      if (data.folders.length > 0) await db.folders.bulkAdd(data.folders)
      if (data.tags.length > 0) await db.tags.bulkAdd(data.tags)
      if (data.scanHistory.length > 0) await db.scanHistory.bulkAdd(data.scanHistory)
    })

    localStorage.setItem('last-sync', Date.now().toString())
    return { success: true }
  } catch (error) {
    console.error('Sync from cloud error:', error)
    return { success: false, error: 'Network error' }
  }
}

export function getLastSync(): number | null {
  const lastSync = localStorage.getItem('last-sync')
  return lastSync ? parseInt(lastSync, 10) : null
}

export function isSyncEnabled(): boolean {
  return !!getSyncToken()
}
