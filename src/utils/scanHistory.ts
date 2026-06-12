import { db } from '@/db'

const MAX_SCANS = 50

export async function trimScanHistory(): Promise<void> {
  const count = await db.scanHistory.count()
  if (count <= MAX_SCANS) return

  const excess = count - MAX_SCANS
  const oldest = await db.scanHistory.orderBy('createdAt').limit(excess).primaryKeys()

  await db.scanHistory.bulkDelete(oldest)
}
