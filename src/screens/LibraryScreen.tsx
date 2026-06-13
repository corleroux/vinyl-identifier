import { useEffect, useState, useMemo, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useVirtualizer } from '@tanstack/react-virtual'
import { db } from '@/db'
import { RarityBadge } from '@/components/RarityBadge'
import { exportCollectionAsCSV, exportCollectionAsJSON } from '@/utils/export'
import type { VinylRecord, Folder, Tag, VinylCondition } from '@/types'

type ViewMode = 'grid' | 'list'
type SortKey =
  | 'createdAt'
  | 'estimatedValueHigh'
  | 'artist'
  | 'releaseYear'
  | 'album'
  | 'rarityTier'

const RARITY_ORDER = { common: 0, uncommon: 1, rare: 2, very_rare: 3, legendary: 4 } as const

function SwipeableListItem({
  record,
  tags,
  folders,
  onNavigate,
  onDelete,
  onAssignFolder,
  onToggleTag,
  onUpdateNotes,
  t,
}: {
  record: VinylRecord
  tags: Tag[]
  folders: Folder[]
  onNavigate: (id: string) => void
  onDelete: (id: string) => void
  onAssignFolder: (recordId: string, folderId: string) => void
  onToggleTag: (recordId: string, tagId: string) => void
  onUpdateNotes: (recordId: string, notes: string) => void
  t: (key: string) => string
}) {
  const startX = useRef(0)
  const elementRef = useRef<HTMLDivElement>(null)
  const [showNotes, setShowNotes] = useState(false)
  const [notesDraft, setNotesDraft] = useState(record.notes ?? '')

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startX.current = e.touches[0].clientX
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const diff = startX.current - e.touches[0].clientX
    if (diff > 0 && elementRef.current) {
      elementRef.current.style.transform = `translateX(-${Math.min(diff, 120)}px)`
      elementRef.current.style.transition = 'none'
    }
  }, [])

  const handleTouchEnd = useCallback(() => {
    if (!elementRef.current) return
    const transform = elementRef.current.style.transform
    const match = transform.match(/translateX\((-?\d+(?:\.\d+)?)px\)/)
    const currentOffset = match ? Math.abs(parseFloat(match[1])) : 0

    elementRef.current.style.transition = 'transform 0.2s ease'
    if (currentOffset > 100) {
      elementRef.current.style.transform = 'translateX(-120px)'
      setTimeout(() => onDelete(record.id), 200)
    } else {
      elementRef.current.style.transform = 'translateX(0)'
    }
  }, [onDelete, record.id])

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute right-0 top-0 bottom-0 flex items-center">
        <button
          onClick={() => onDelete(record.id)}
          className="h-full px-6 bg-red-500 text-white font-semibold"
        >
          {t('common.delete')}
        </button>
      </div>
      <div
        ref={elementRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors bg-white relative z-10"
      >
        <div className="flex items-start justify-between">
          <button onClick={() => onNavigate(record.id)} className="flex-1 min-w-0 text-left">
            <p className="font-semibold truncate">
              {record.artist} — {record.album}
            </p>
            <p className="text-xs text-gray-500">
              {record.label && `${record.label}`}
              {record.releaseYear && ` · ${record.releaseYear}`}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <RarityBadge tier={record.rarityTier} />
              {record.tags && record.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {record.tags.map((tagId) => {
                    const tag = tags.find((t) => t.id === tagId)
                    return tag ? (
                      <span
                        key={tagId}
                        className="text-xs bg-blue-50 text-blue-700 rounded px-1.5 py-0.5"
                      >
                        #{tag.name}
                      </span>
                    ) : null
                  })}
                </div>
              )}
              {record.notes && !showNotes && (
                <span className="text-xs text-gray-500 truncate max-w-[120px]" title={record.notes}>
                  📝 {record.notes}
                </span>
              )}
            </div>
            {showNotes && (
              <div className="mt-2">
                <label htmlFor={`notes-${record.id}`} className="sr-only">
                  {t('report.notes')}
                </label>
                <textarea
                  id={`notes-${record.id}`}
                  value={notesDraft}
                  onChange={(e) => setNotesDraft(e.target.value)}
                  onBlur={() => onUpdateNotes(record.id, notesDraft)}
                  rows={2}
                  className="w-full text-xs border rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                  placeholder={t('report.notesPlaceholder')}
                />
              </div>
            )}
          </button>
          <div className="flex gap-1 flex-shrink-0 ml-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowNotes(!showNotes)
              }}
              className={`text-xs border rounded px-1 py-0.5 ${showNotes ? 'bg-blue-100 text-blue-700' : ''}`}
              title={t('report.notes')}
            >
              📝
            </button>
            <select
              value={record.folderId ?? ''}
              onChange={(e) => onAssignFolder(record.id, e.target.value)}
              className="text-xs border rounded px-1 py-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="">{t('library.noFolder')}</option>
              {folders.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
            {tags.length > 0 && (
              <select
                value=""
                onChange={(e) => {
                  if (e.target.value) onToggleTag(record.id, e.target.value)
                }}
                className="text-xs border rounded px-1 py-0.5"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="">+ {t('library.tags')}</option>
                {tags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {record.tags?.includes(tag.id) ? '✓ ' : ''}
                    {tag.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function VirtualizedGrid({
  records,
  onNavigate,
  t,
}: {
  records: VinylRecord[]
  onNavigate: (id: string) => void
  t: (key: string) => string
}) {
  const parentRef = useRef<HTMLDivElement>(null)
  const COLUMN_COUNT = typeof window !== 'undefined' && window.innerWidth >= 640 ? 3 : 2
  const ROW_HEIGHT = 200
  const rowCount = Math.ceil(records.length / COLUMN_COUNT)

  const rowVirtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ROW_HEIGHT,
    overscan: 3,
  })

  return (
    <div
      ref={parentRef}
      className="h-full overflow-auto"
      role="grid"
      aria-label={t('library.title')}
    >
      <div
        style={{
          height: `${rowVirtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
          const rowIndex = virtualRow.index
          const startIndex = rowIndex * COLUMN_COUNT
          const rowRecords = records.slice(startIndex, startIndex + COLUMN_COUNT)

          return (
            <div
              key={virtualRow.key}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: `${virtualRow.size}px`,
                transform: `translateY(${virtualRow.start}px)`,
              }}
            >
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-0">
                {rowRecords.map((record) => (
                  <button
                    key={record.id}
                    onClick={() => onNavigate(record.id)}
                    className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors text-left w-full"
                    role="gridcell"
                  >
                    <div className="w-full aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                      <span className="text-2xl" aria-hidden="true">
                        💿
                      </span>
                    </div>
                    <p className="font-semibold text-sm truncate">{record.artist}</p>
                    <p className="text-xs text-gray-500 truncate">{record.album}</p>
                    <div className="mt-1">
                      <RarityBadge tier={record.rarityTier} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export function LibraryScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [records, setRecords] = useState<VinylRecord[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [filterFolder, setFilterFolder] = useState<string>('')
  const [filterRarity, setFilterRarity] = useState<string>('')
  const [filterCondition, setFilterCondition] = useState<string>('')
  const [filterTag, setFilterTag] = useState<string>('')
  const [filterTagMode, setFilterTagMode] = useState<'or' | 'and'>('or')
  const [filterDateFrom, setFilterDateFrom] = useState('')
  const [filterDateTo, setFilterDateTo] = useState('')
  const [loading, setLoading] = useState(true)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)
  const [showTagModal, setShowTagModal] = useState(false)
  const [tagName, setTagName] = useState('')
  const [editingTagId, setEditingTagId] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([
      db.records.orderBy('createdAt').reverse().toArray(),
      db.folders.toArray(),
      db.tags.toArray(),
    ]).then(([r, f, t]) => {
      setRecords(r)
      setFolders(f)
      setTags(t)
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    let result = [...records]

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(
        (r) =>
          r.artist.toLowerCase().includes(q) ||
          r.album.toLowerCase().includes(q) ||
          (r.label && r.label.toLowerCase().includes(q)),
      )
    }

    if (filterFolder) {
      result = result.filter((r) => r.folderId === filterFolder)
    }

    if (filterRarity) {
      result = result.filter((r) => r.rarityTier === filterRarity)
    }

    if (filterCondition) {
      result = result.filter((r) => r.condition === filterCondition)
    }

    if (filterTag) {
      const tagIds = filterTag.split(',').filter(Boolean)
      if (filterTagMode === 'and') {
        result = result.filter((r) => tagIds.every((id) => r.tags?.includes(id)))
      } else {
        result = result.filter((r) => tagIds.some((id) => r.tags?.includes(id)))
      }
    }

    if (filterDateFrom) {
      const from = new Date(filterDateFrom).getTime()
      result = result.filter((r) => r.createdAt >= from)
    }
    if (filterDateTo) {
      const to = new Date(filterDateTo).getTime() + 86400000
      result = result.filter((r) => r.createdAt <= to)
    }

    result.sort((a, b) => {
      switch (sortKey) {
        case 'artist':
          return a.artist.localeCompare(b.artist)
        case 'album':
          return a.album.localeCompare(b.album)
        case 'releaseYear':
          return (b.releaseYear ?? 0) - (a.releaseYear ?? 0)
        case 'estimatedValueHigh':
          return b.estimatedValueHigh - a.estimatedValueHigh
        case 'rarityTier':
          return (RARITY_ORDER[b.rarityTier] ?? 0) - (RARITY_ORDER[a.rarityTier] ?? 0)
        default:
          return b.createdAt - a.createdAt
      }
    })

    return result
  }, [
    records,
    search,
    sortKey,
    filterFolder,
    filterRarity,
    filterCondition,
    filterTag,
    filterTagMode,
    filterDateFrom,
    filterDateTo,
  ])

  async function handleDelete(id: string) {
    await db.records.delete(id)
    setRecords((prev) => prev.filter((r) => r.id !== id))
    setShowConfirmDelete(null)
  }

  async function handleSaveFolder() {
    if (!folderName.trim()) return
    if (editingFolderId) {
      await db.folders.update(editingFolderId, { name: folderName.trim(), updatedAt: Date.now() })
      setFolders((prev) =>
        prev.map((f) => (f.id === editingFolderId ? { ...f, name: folderName.trim() } : f)),
      )
    } else {
      const newFolder: Folder = {
        id: crypto.randomUUID(),
        name: folderName.trim(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      await db.folders.add(newFolder)
      setFolders((prev) => [...prev, newFolder])
    }
    setFolderName('')
    setEditingFolderId(null)
    setShowFolderModal(false)
  }

  async function handleDeleteFolder(id: string) {
    await db.folders.delete(id)
    await db.records.where('folderId').equals(id).modify({ folderId: undefined })
    setFolders((prev) => prev.filter((f) => f.id !== id))
  }

  function handleEditFolder(folder: Folder) {
    setFolderName(folder.name)
    setEditingFolderId(folder.id)
    setShowFolderModal(true)
  }

  async function handleAssignFolder(recordId: string, folderId: string) {
    await db.records.update(recordId, { folderId, updatedAt: Date.now() })
    setRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, folderId } : r)))
  }

  async function handleSaveTag() {
    if (!tagName.trim()) return
    if (editingTagId) {
      await db.tags.update(editingTagId, { name: tagName.trim() })
      setTags((prev) =>
        prev.map((t) => (t.id === editingTagId ? { ...t, name: tagName.trim() } : t)),
      )
    } else {
      const newTag: Tag = {
        id: crypto.randomUUID(),
        name: tagName.trim(),
      }
      await db.tags.add(newTag)
      setTags((prev) => [...prev, newTag])
    }
    setTagName('')
    setEditingTagId(null)
    setShowTagModal(false)
  }

  async function handleDeleteTag(id: string) {
    await db.tags.delete(id)
    const recordsWithTag = await db.records
      .filter((r) => r.tags !== undefined && r.tags.includes(id))
      .toArray()
    for (const record of recordsWithTag) {
      const newTags = (record.tags ?? []).filter((t) => t !== id)
      await db.records.update(record.id, { tags: newTags, updatedAt: Date.now() })
    }
    setTags((prev) => prev.filter((t) => t.id !== id))
    setRecords((prev) =>
      prev.map((r) => (r.tags?.includes(id) ? { ...r, tags: r.tags.filter((t) => t !== id) } : r)),
    )
  }

  function handleEditTag(tag: Tag) {
    setTagName(tag.name)
    setEditingTagId(tag.id)
    setShowTagModal(true)
  }

  async function handleToggleRecordTag(recordId: string, tagId: string) {
    const record = records.find((r) => r.id === recordId)
    if (!record) return
    const currentTags = record.tags ?? []
    const newTags = currentTags.includes(tagId)
      ? currentTags.filter((t) => t !== tagId)
      : [...currentTags, tagId]
    await db.records.update(recordId, { tags: newTags, updatedAt: Date.now() })
    setRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, tags: newTags } : r)))
  }

  async function handleUpdateNotes(recordId: string, notes: string) {
    await db.records.update(recordId, { notes, updatedAt: Date.now() })
    setRecords((prev) => prev.map((r) => (r.id === recordId ? { ...r, notes } : r)))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">{t('common.loading')}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 bg-white z-10 p-4 border-b space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">{t('library.title')}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {t('library.grid')}
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded text-sm ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-100'}`}
            >
              {t('library.list')}
            </button>
          </div>
        </div>

        <label htmlFor="library-search" className="sr-only">
          {t('library.search')}
        </label>
        <input
          id="library-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t('library.search')}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2 flex-wrap">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="createdAt">
              {t('library.sortBy')} {t('library.sortDate')}
            </option>
            <option value="artist">{t('library.sortArtist')}</option>
            <option value="album">{t('library.sortAlbum')}</option>
            <option value="releaseYear">{t('library.sortYear')}</option>
            <option value="estimatedValueHigh">{t('library.sortValue')}</option>
            <option value="rarityTier">{t('library.sortRarity')}</option>
          </select>

          <select
            value={filterFolder}
            onChange={(e) => setFilterFolder(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">{t('library.folders')}: All</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={filterRarity}
            onChange={(e) => setFilterRarity(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">
              {t('report.rarityTier')}: {t('library.allRarity')}
            </option>
            <option value="common">{t('rarity.common')}</option>
            <option value="uncommon">{t('rarity.uncommon')}</option>
            <option value="rare">{t('rarity.rare')}</option>
            <option value="very_rare">{t('rarity.very_rare')}</option>
            <option value="legendary">{t('rarity.legendary')}</option>
          </select>

          <select
            value={filterCondition}
            onChange={(e) => setFilterCondition(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">
              {t('report.condition')}: {t('library.allRarity')}
            </option>
            {(
              [
                'mint',
                'near_mint',
                'vg_plus',
                'vg',
                'g_plus',
                'good',
                'fair',
                'poor',
              ] as VinylCondition[]
            ).map((c) => (
              <option key={c} value={c}>
                {t(`condition.${c}`)}
              </option>
            ))}
          </select>

          <select
            value={filterTag}
            onChange={(e) => setFilterTag(e.target.value)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="">{t('library.tags')}: All</option>
            {tags.map((tag) => (
              <option key={tag.id} value={tag.id}>
                {tag.name}
              </option>
            ))}
          </select>

          {filterTag && (
            <button
              onClick={() => setFilterTagMode(filterTagMode === 'or' ? 'and' : 'or')}
              className="text-xs border rounded px-2 py-1 hover:bg-gray-50"
              title={filterTagMode === 'or' ? t('library.tagOr') : t('library.tagAnd')}
            >
              {filterTagMode === 'or' ? t('library.tagOr') : t('library.tagAnd')}
            </button>
          )}

          <label htmlFor="filter-date-from" className="sr-only">
            {t('library.dateFrom')}
          </label>
          <input
            id="filter-date-from"
            type="date"
            value={filterDateFrom}
            onChange={(e) => setFilterDateFrom(e.target.value)}
            className="text-sm border rounded px-2 py-1"
            title={t('library.dateFrom')}
          />
          <label htmlFor="filter-date-to" className="sr-only">
            {t('library.dateTo')}
          </label>
          <input
            id="filter-date-to"
            type="date"
            value={filterDateTo}
            onChange={(e) => setFilterDateTo(e.target.value)}
            className="text-sm border rounded px-2 py-1"
            title={t('library.dateTo')}
          />

          {records.length > 0 && (
            <div className="flex gap-1">
              <button
                onClick={() => exportCollectionAsCSV(filtered)}
                className="text-sm border rounded px-2 py-1 hover:bg-gray-50"
                title={t('library.exportCsv')}
              >
                {t('library.exportCsv')}
              </button>
              <button
                onClick={() => exportCollectionAsJSON(filtered)}
                className="text-sm border rounded px-2 py-1 hover:bg-gray-50"
                title={t('library.exportJson')}
              >
                {t('library.exportJson')}
              </button>
            </div>
          )}
        </div>

        <p aria-live="polite" className="text-xs text-gray-500">
          {t('library.resultsCount', { count: filtered.length })}
        </p>

        <div className="flex gap-2">
          <button
            onClick={() => {
              setFolderName('')
              setEditingFolderId(null)
              setShowFolderModal(true)
            }}
            className="text-sm text-blue-600"
          >
            + {t('library.addFolder')}
          </button>
          <button
            onClick={() => {
              setTagName('')
              setEditingTagId(null)
              setShowTagModal(true)
            }}
            className="text-sm text-blue-600"
          >
            + {t('library.addTag')}
          </button>
          {folders.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {folders.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded px-2 py-1"
                >
                  {f.name}
                  <button
                    onClick={() => handleEditFolder(f)}
                    aria-label={t('library.editFolder')}
                    className="text-blue-600 p-2"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteFolder(f.id)}
                    aria-label={t('library.deleteFolder')}
                    className="text-red-600 p-2"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
          {tags.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag.id}
                  className="inline-flex items-center gap-1 text-xs bg-blue-50 text-blue-700 rounded px-2 py-1"
                >
                  #{tag.name}
                  <button
                    onClick={() => handleEditTag(tag)}
                    aria-label={t('library.editFolder')}
                    className="text-blue-600 p-2"
                  >
                    ✎
                  </button>
                  <button
                    onClick={() => handleDeleteTag(tag.id)}
                    aria-label={t('library.deleteFolder')}
                    className="text-red-600 p-2"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500">
              {records.length === 0 ? t('library.empty') : t('common.noResults')}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <VirtualizedGrid
            records={filtered}
            onNavigate={(id) => navigate(`/report/${id}`)}
            t={t}
          />
        ) : (
          <div className="space-y-2">
            {filtered.map((record) => (
              <SwipeableListItem
                key={record.id}
                record={record}
                tags={tags}
                folders={folders}
                onNavigate={(id) => navigate(`/report/${id}`)}
                onDelete={(id) => {
                  db.records.delete(id)
                  setRecords((prev) => prev.filter((r) => r.id !== id))
                }}
                onAssignFolder={handleAssignFolder}
                onToggleTag={handleToggleRecordTag}
                onUpdateNotes={handleUpdateNotes}
                t={t}
              />
            ))}
          </div>
        )}
      </div>

      {showConfirmDelete && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          role="alertdialog"
          aria-modal="true"
          aria-label={t('library.deleteConfirm')}
          onClick={() => setShowConfirmDelete(null)}
          onKeyDown={(e) => e.key === 'Escape' && setShowConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="mb-4">{t('library.deleteConfirm')}</p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(showConfirmDelete)}
                className="btn-primary bg-red-600 hover:bg-red-700"
              >
                {t('common.delete')}
              </button>
              <button onClick={() => setShowConfirmDelete(null)} className="btn-secondary">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showFolderModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={editingFolderId ? t('library.editFolder') : t('library.addFolder')}
          onClick={() => setShowFolderModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowFolderModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4">
              {editingFolderId ? t('library.editFolder') : t('library.addFolder')}
            </h3>
            <label htmlFor="folder-name-input" className="sr-only">
              {t('library.folderName')}
            </label>
            <input
              id="folder-name-input"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={t('library.folderName')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleSaveFolder} className="btn-primary">
                {t('common.save')}
              </button>
              <button onClick={() => setShowFolderModal(false)} className="btn-secondary">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}

      {showTagModal && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6"
          role="dialog"
          aria-modal="true"
          aria-label={editingTagId ? t('library.editTag') : t('library.addTag')}
          onClick={() => setShowTagModal(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowTagModal(false)}
        >
          <div
            className="bg-white rounded-xl p-6 max-w-sm w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold mb-4">
              {editingTagId ? t('library.editTag') : t('library.addTag')}
            </h3>
            <label htmlFor="tag-name-input" className="sr-only">
              {t('library.tagName')}
            </label>
            <input
              id="tag-name-input"
              value={tagName}
              onChange={(e) => setTagName(e.target.value)}
              placeholder={t('library.tagName')}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
            <div className="flex gap-3">
              <button onClick={handleSaveTag} className="btn-primary">
                {t('common.save')}
              </button>
              <button onClick={() => setShowTagModal(false)} className="btn-secondary">
                {t('common.cancel')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
