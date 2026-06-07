import { useEffect, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { db } from '@/db'
import { RarityBadge } from '@/components/RarityBadge'
import { exportCollectionAsCSV, exportCollectionAsJSON } from '@/utils/export'
import type { VinylRecord, Folder } from '@/types'

type ViewMode = 'grid' | 'list'
type SortKey = 'createdAt' | 'estimatedValueHigh' | 'artist' | 'releaseYear'

export function LibraryScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [records, setRecords] = useState<VinylRecord[]>([])
  const [folders, setFolders] = useState<Folder[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('createdAt')
  const [filterFolder, setFilterFolder] = useState<string>('')
  const [filterRarity, setFilterRarity] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [showFolderModal, setShowFolderModal] = useState(false)
  const [folderName, setFolderName] = useState('')
  const [editingFolderId, setEditingFolderId] = useState<string | null>(null)
  const [showConfirmDelete, setShowConfirmDelete] = useState<string | null>(null)

  useEffect(() => {
    Promise.all([db.records.orderBy('createdAt').reverse().toArray(), db.folders.toArray()]).then(
      ([r, f]) => {
        setRecords(r)
        setFolders(f)
        setLoading(false)
      },
    )
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

    result.sort((a, b) => {
      switch (sortKey) {
        case 'artist':
          return a.artist.localeCompare(b.artist)
        case 'releaseYear':
          return (b.releaseYear ?? 0) - (a.releaseYear ?? 0)
        case 'estimatedValueHigh':
          return b.estimatedValueHigh - a.estimatedValueHigh
        default:
          return b.createdAt - a.createdAt
      }
    })

    return result
  }, [records, search, sortKey, filterFolder, filterRarity])

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

        <input
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
            <option value="createdAt">{t('common.sortBy')}: Date</option>
            <option value="artist">Artist</option>
            <option value="releaseYear">Year</option>
            <option value="estimatedValueHigh">Value</option>
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
            <option value="">Rarity: All</option>
            <option value="common">{t('rarity.common')}</option>
            <option value="uncommon">{t('rarity.uncommon')}</option>
            <option value="rare">{t('rarity.rare')}</option>
            <option value="very_rare">{t('rarity.very_rare')}</option>
            <option value="legendary">{t('rarity.legendary')}</option>
          </select>

          {records.length > 0 && (
            <div className="flex gap-1">
              <button
                onClick={() => exportCollectionAsCSV(filtered)}
                className="text-sm border rounded px-2 py-1 hover:bg-gray-50"
                title="Export CSV"
              >
                CSV
              </button>
              <button
                onClick={() => exportCollectionAsJSON(filtered)}
                className="text-sm border rounded px-2 py-1 hover:bg-gray-50"
                title="Export JSON"
              >
                JSON
              </button>
            </div>
          )}
        </div>

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
          {folders.length > 0 && (
            <div className="flex gap-1 flex-wrap">
              {folders.map((f) => (
                <span
                  key={f.id}
                  className="inline-flex items-center gap-1 text-xs bg-gray-100 rounded px-2 py-1"
                >
                  {f.name}
                  <button onClick={() => handleEditFolder(f)} className="text-blue-600">
                    ✎
                  </button>
                  <button onClick={() => handleDeleteFolder(f.id)} className="text-red-600">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {filtered.map((record) => (
              <div
                key={record.id}
                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => navigate(`/report/${record.id}`)}
              >
                <div className="w-full aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-2xl">💿</span>
                </div>
                <p className="font-semibold text-sm truncate">{record.artist}</p>
                <p className="text-xs text-gray-500 truncate">{record.album}</p>
                <div className="mt-1">
                  <RarityBadge tier={record.rarityTier} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((record) => (
              <div
                key={record.id}
                className="border rounded-lg p-3 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0" onClick={() => navigate(`/report/${record.id}`)}>
                    <p className="font-semibold truncate">
                      {record.artist} — {record.album}
                    </p>
                    <p className="text-xs text-gray-500">
                      {record.label && `${record.label}`}
                      {record.releaseYear && ` · ${record.releaseYear}`}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <RarityBadge tier={record.rarityTier} />
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-2">
                    <select
                      value={record.folderId ?? ''}
                      onChange={(e) => handleAssignFolder(record.id, e.target.value)}
                      className="text-xs border rounded px-1 py-0.5"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="">No folder</option>
                      {folders.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setShowConfirmDelete(record.id)
                      }}
                      className="text-xs text-red-600 px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full">
            <h3 className="font-bold mb-4">
              {editingFolderId ? t('library.editFolder') : t('library.addFolder')}
            </h3>
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="Folder name"
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
    </div>
  )
}
