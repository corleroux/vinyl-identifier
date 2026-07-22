/**
 * Price alerts service — monitors record values and generates notifications.
 * @see AGENTS.md#architecture — Client state layer
 * @see PRD.md §6.5 — Collection Library requirements
 */
import { db } from '@/db'
import type { PriceAlert, PriceAlertNotification, VinylRecord } from '@/types'

export async function createPriceAlert(
  recordId: string,
  thresholdPercent?: number,
  thresholdAbsolute?: number,
  direction: 'up' | 'down' | 'both' = 'both',
): Promise<PriceAlert> {
  const alert: PriceAlert = {
    id: crypto.randomUUID(),
    recordId,
    thresholdPercent,
    thresholdAbsolute,
    direction,
    enabled: true,
    createdAt: Date.now(),
  }
  await db.priceAlerts.add(alert)
  return alert
}

export async function updatePriceAlert(
  alertId: string,
  updates: Partial<PriceAlert>,
): Promise<void> {
  await db.priceAlerts.update(alertId, updates)
}

export async function deletePriceAlert(alertId: string): Promise<void> {
  await db.priceAlerts.delete(alertId)
  await db.priceAlertNotifications.where('alertId').equals(alertId).delete()
}

export async function getAlertsForRecord(recordId: string): Promise<PriceAlert[]> {
  return db.priceAlerts.where('recordId').equals(recordId).toArray()
}

export async function getAllAlerts(): Promise<PriceAlert[]> {
  return db.priceAlerts.toArray()
}

export async function getEnabledAlerts(): Promise<PriceAlert[]> {
  return db.priceAlerts.where('enabled').equals(1).toArray()
}

export async function getUnreadNotifications(): Promise<PriceAlertNotification[]> {
  return db.priceAlertNotifications.where('read').equals(0).toArray()
}

export async function getAllNotifications(): Promise<PriceAlertNotification[]> {
  return db.priceAlertNotifications.orderBy('createdAt').reverse().toArray()
}

export async function markNotificationRead(notificationId: string): Promise<void> {
  await db.priceAlertNotifications.update(notificationId, { read: true })
}

export async function markAllNotificationsRead(): Promise<void> {
  const unread = await getUnreadNotifications()
  await Promise.all(unread.map((n) => db.priceAlertNotifications.update(n.id, { read: true })))
}

export async function deleteNotification(notificationId: string): Promise<void> {
  await db.priceAlertNotifications.delete(notificationId)
}

export async function clearAllNotifications(): Promise<void> {
  await db.priceAlertNotifications.clear()
}

interface PriceCheckResult {
  alert: PriceAlert
  record: VinylRecord
  currentPrice: number
  triggered: boolean
  notification?: PriceAlertNotification
}

export async function checkPriceAlerts(): Promise<PriceCheckResult[]> {
  const alerts = await getEnabledAlerts()
  const results: PriceCheckResult[] = []

  for (const alert of alerts) {
    const record = await db.records.get(alert.recordId)
    if (!record) continue

    const currentPrice = (record.estimatedValueLow + record.estimatedValueHigh) / 2
    const oldPrice =
      alert.lastCheckedPrice ?? (record.estimatedValueLow + record.estimatedValueHigh) / 2

    if (oldPrice === 0) {
      await db.priceAlerts.update(alert.id, { lastCheckedPrice: currentPrice })
      continue
    }

    const changeAmount = currentPrice - oldPrice
    const changePercent = (changeAmount / oldPrice) * 100

    let triggered = false

    if (alert.direction === 'up' || alert.direction === 'both') {
      if (alert.thresholdPercent && changePercent >= alert.thresholdPercent) {
        triggered = true
      }
      if (alert.thresholdAbsolute && changeAmount >= alert.thresholdAbsolute) {
        triggered = true
      }
    }

    if (alert.direction === 'down' || alert.direction === 'both') {
      if (alert.thresholdPercent && changePercent <= -alert.thresholdPercent) {
        triggered = true
      }
      if (alert.thresholdAbsolute && -changeAmount >= alert.thresholdAbsolute) {
        triggered = true
      }
    }

    let notification: PriceAlertNotification | undefined

    if (triggered) {
      notification = {
        id: crypto.randomUUID(),
        alertId: alert.id,
        recordId: record.id,
        oldPrice,
        newPrice: currentPrice,
        changePercent,
        message: generateAlertMessage(record, oldPrice, currentPrice, changePercent),
        createdAt: Date.now(),
        read: false,
      }
      await db.priceAlertNotifications.add(notification)
      await db.priceAlerts.update(alert.id, {
        lastCheckedPrice: currentPrice,
        triggeredAt: Date.now(),
      })
    } else {
      await db.priceAlerts.update(alert.id, { lastCheckedPrice: currentPrice })
    }

    results.push({
      alert,
      record,
      currentPrice,
      triggered,
      notification,
    })
  }

  return results
}

function generateAlertMessage(
  record: VinylRecord,
  oldPrice: number,
  newPrice: number,
  changePercent: number,
): string {
  const direction = newPrice > oldPrice ? 'increased' : 'decreased'
  const absChange = Math.abs(newPrice - oldPrice).toFixed(2)
  const percentChange = Math.abs(changePercent).toFixed(1)

  return `${record.artist} - ${record.album} value has ${direction} by $${absChange} (${percentChange}%)`
}

export function hasAlertForRecord(alerts: PriceAlert[], recordId: string): boolean {
  return alerts.some((a) => a.recordId === recordId)
}
