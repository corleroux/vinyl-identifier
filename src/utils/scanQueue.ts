import { db } from '@/db'
import { identifyVinyl } from '@/services/api'
import { trimScanHistory } from './scanHistory'

export async function enqueueScan(imageUri: string, _imageBlob: Blob): Promise<string> {
  const id = crypto.randomUUID()
  await db.scanHistory.add({
    id,
    imageUri,
    status: 'pending',
    createdAt: Date.now(),
  })
  // Store the blob separately via a helper — IndexedDB can't reliably query blobs
  // We'll re-process from the URI when online
  return id
}

export async function processPendingScans(): Promise<void> {
  if (!navigator.onLine) return

  const pending = await db.scanHistory.where('status').equals('pending').toArray()

  for (const scan of pending) {
    try {
      // Convert stored URI back to blob for the API
      const response = await fetch(scan.imageUri)
      const blob = await response.blob()
      const record = await identifyVinyl(blob)

      await db.scanHistory.update(scan.id, {
        status: 'complete',
        record,
      })
      await trimScanHistory()
    } catch {
      // Keep as pending — will retry on next connectivity change
    }
  }
}

export function startOfflineQueueListener(): () => void {
  function handleOnline() {
    processPendingScans()
  }

  window.addEventListener('online', handleOnline)
  return () => window.removeEventListener('online', handleOnline)
}
