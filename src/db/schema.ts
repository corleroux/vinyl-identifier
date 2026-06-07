import Dexie, { type EntityTable } from 'dexie'
import type { VinylRecord, Folder, Tag, ScanResult } from '@/types'

export class VinylDatabase extends Dexie {
  records!: EntityTable<VinylRecord, 'id'>
  folders!: EntityTable<Folder, 'id'>
  tags!: EntityTable<Tag, 'id'>
  scanHistory!: EntityTable<ScanResult, 'id'>

  constructor() {
    super('vinyl-identifier')

    this.version(1).stores({
      records: 'id, artist, album, label, releaseYear, rarityTier, condition, folderId, createdAt',
      folders: 'id, name, createdAt',
      tags: 'id, name',
      scanHistory: 'id, status, createdAt',
    })
  }
}

export const db = new VinylDatabase()
