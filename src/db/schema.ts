/**
 * Local database schema — Dexie (IndexedDB) for offline-first collection storage.
 * @see AGENTS.md#architecture — Local DB layer
 * @see PRD.md §6.7 — Offline / Local-First requirements
 * @see PRD.md §8 — Technology Choices (Dexie rationale)
 */
import Dexie, { type EntityTable } from 'dexie'
import type {
  VinylRecord,
  Folder,
  Tag,
  ScanResult,
  PriceAlert,
  PriceAlertNotification,
} from '@/types'

export class VinylDatabase extends Dexie {
  records!: EntityTable<VinylRecord, 'id'>
  folders!: EntityTable<Folder, 'id'>
  tags!: EntityTable<Tag, 'id'>
  scanHistory!: EntityTable<ScanResult, 'id'>
  priceAlerts!: EntityTable<PriceAlert, 'id'>
  priceAlertNotifications!: EntityTable<PriceAlertNotification, 'id'>

  constructor() {
    super('vinyl-identifier')

    this.version(2).stores({
      records: 'id, artist, album, label, releaseYear, rarityTier, condition, folderId, createdAt',
      folders: 'id, name, createdAt',
      tags: 'id, name',
      scanHistory: 'id, status, createdAt',
      priceAlerts: 'id, recordId, enabled, createdAt',
      priceAlertNotifications: 'id, alertId, createdAt, read',
    })
  }
}

export const db = new VinylDatabase()
