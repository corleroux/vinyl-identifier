import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import {
  getAllNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
  checkPriceAlerts,
} from '@/services/priceAlerts'
import type { PriceAlertNotification } from '@/types'

export function PriceAlertsScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState<PriceAlertNotification[]>([])
  const [checking, setChecking] = useState(false)

  useEffect(() => {
    loadNotifications()
  }, [])

  async function loadNotifications() {
    const notifs = await getAllNotifications()
    setNotifications(notifs)
  }

  async function handleCheckAlerts() {
    setChecking(true)
    await checkPriceAlerts()
    await loadNotifications()
    setChecking(false)
  }

  async function handleMarkRead(notificationId: string) {
    await markNotificationRead(notificationId)
    await loadNotifications()
  }

  async function handleMarkAllRead() {
    await markAllNotificationsRead()
    await loadNotifications()
  }

  async function handleDelete(notificationId: string) {
    await deleteNotification(notificationId)
    await loadNotifications()
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="flex flex-col min-h-screen p-6">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('priceAlerts.title')}</h1>
          {unreadCount > 0 && (
            <p className="text-sm text-gray-600 mt-1">
              {t('priceAlerts.unreadCount', { count: unreadCount })}
            </p>
          )}
        </div>
        <button onClick={() => navigate(-1)} className="text-blue-600 min-h-[44px] px-2">
          {t('common.close')}
        </button>
      </header>

      <div className="space-y-4 mb-6">
        <button
          onClick={handleCheckAlerts}
          disabled={checking}
          className="btn-primary w-full min-h-[44px]"
        >
          {checking ? t('common.loading') : t('priceAlerts.checkNow')}
        </button>

        {unreadCount > 0 && (
          <button onClick={handleMarkAllRead} className="btn-secondary w-full min-h-[44px]">
            {t('priceAlerts.markAllRead')}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('priceAlerts.noNotifications')}</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    {!notification.read && <span className="w-2 h-2 bg-blue-600 rounded-full" />}
                    <p className="font-medium text-sm">{notification.message}</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                  <div className="flex gap-4 mt-2 text-xs">
                    <span className="text-gray-600">
                      {t('priceAlerts.oldPrice')}: ${notification.oldPrice.toFixed(2)}
                    </span>
                    <span className="text-gray-600">
                      {t('priceAlerts.newPrice')}: ${notification.newPrice.toFixed(2)}
                    </span>
                    <span
                      className={notification.changePercent > 0 ? 'text-green-600' : 'text-red-600'}
                    >
                      {notification.changePercent > 0 ? '+' : ''}
                      {notification.changePercent.toFixed(1)}%
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  {!notification.read && (
                    <button
                      onClick={() => handleMarkRead(notification.id)}
                      className="text-blue-600 text-xs underline min-h-[44px] px-2"
                    >
                      {t('priceAlerts.markRead')}
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(notification.id)}
                    className="text-red-600 text-xs underline min-h-[44px] px-2"
                  >
                    {t('common.delete')}
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
