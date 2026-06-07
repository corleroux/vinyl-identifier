import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useScanStore } from '@/store/useScanStore'
import { db } from '@/db'
import { RarityBadge } from '@/components/RarityBadge'

export function BatchSessionScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const batchQueue = useScanStore((s) => s.batchQueue)
  const removeFromBatch = useScanStore((s) => s.removeFromBatch)
  const clearBatch = useScanStore((s) => s.clearBatch)

  async function handleSaveAll() {
    await db.records.bulkAdd(batchQueue)
    clearBatch()
    navigate('/library')
  }

  async function handleDeleteRecord(id: string) {
    removeFromBatch(id)
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-1 overflow-y-auto p-6 pb-32">
        <h1 className="text-2xl font-bold mb-6">Batch Review</h1>

        {batchQueue.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No records in batch.</p>
            <button
              onClick={() => navigate('/scan/camera')}
              className="btn-primary max-w-xs mx-auto"
            >
              {t('home.camera')}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {batchQueue.map((record) => (
              <div
                key={record.id}
                className="border rounded-lg p-4 flex items-center justify-between"
              >
                <div className="flex-1 min-w-0 mr-4">
                  <p className="font-semibold truncate">{record.artist}</p>
                  <p className="text-sm text-gray-600 truncate">{record.album}</p>
                  <div className="mt-1">
                    <RarityBadge tier={record.rarityTier} />
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/report/${record.id}`)}
                    className="text-sm text-blue-600 px-3 py-1 rounded hover:bg-blue-50"
                  >
                    {t('common.edit')}
                  </button>
                  <button
                    onClick={() => handleDeleteRecord(record.id)}
                    className="text-sm text-red-600 px-3 py-1 rounded hover:bg-red-50"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {batchQueue.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t flex gap-3">
          <button onClick={handleSaveAll} className="btn-primary">
            Save All ({batchQueue.length})
          </button>
          <button onClick={() => navigate('/scan/camera')} className="btn-secondary flex-1">
            {t('home.camera')}
          </button>
          <button onClick={clearBatch} className="btn-secondary w-24 flex-shrink-0">
            Discard
          </button>
        </div>
      )}
    </div>
  )
}
