import { Capacitor } from '@capacitor/core'

export interface PurchaseResult {
  success: boolean
  productId?: string
  error?: string
}

const PRODUCT_ID = 'vinyl_identifier_full_version'

export async function purchaseFullVersion(): Promise<PurchaseResult> {
  const platform = Capacitor.getPlatform()

  if (platform === 'ios') {
    return purchaseIOS()
  } else if (platform === 'android') {
    return purchaseAndroid()
  }
  // PWA / web — simulate purchase
  return { success: true, productId: PRODUCT_ID }
}

export async function restorePurchases(): Promise<PurchaseResult> {
  const platform = Capacitor.getPlatform()

  if (platform === 'ios') {
    return restoreIOS()
  } else if (platform === 'android') {
    return restoreAndroid()
  }
  return { success: false, error: 'Restoring purchases is not available on web' }
}

async function purchaseIOS(): Promise<PurchaseResult> {
  try {
    // StoreKit integration — requires @capacitor/in-app-purchase-2 or similar
    // Placeholder: will be wired when native IAP plugin is installed
    const { InAppPurchase } = await import('@/services/inAppPurchase').catch(() => ({
      InAppPurchase: null,
    }))
    if (InAppPurchase) {
      return await InAppPurchase.purchase(PRODUCT_ID)
    }
    return { success: false, error: 'StoreKit not available' }
  } catch {
    return { success: false, error: 'Purchase failed' }
  }
}

async function purchaseAndroid(): Promise<PurchaseResult> {
  try {
    const { InAppPurchase } = await import('@/services/inAppPurchase').catch(() => ({
      InAppPurchase: null,
    }))
    if (InAppPurchase) {
      return await InAppPurchase.purchase(PRODUCT_ID)
    }
    return { success: false, error: 'Google Play Billing not available' }
  } catch {
    return { success: false, error: 'Purchase failed' }
  }
}

async function restoreIOS(): Promise<PurchaseResult> {
  try {
    const { InAppPurchase } = await import('@/services/inAppPurchase').catch(() => ({
      InAppPurchase: null,
    }))
    if (InAppPurchase) {
      return await InAppPurchase.restore()
    }
    return { success: false, error: 'StoreKit not available' }
  } catch {
    return { success: false, error: 'Restore failed' }
  }
}

async function restoreAndroid(): Promise<PurchaseResult> {
  try {
    const { InAppPurchase } = await import('@/services/inAppPurchase').catch(() => ({
      InAppPurchase: null,
    }))
    if (InAppPurchase) {
      return await InAppPurchase.restore()
    }
    return { success: false, error: 'Google Play Billing not available' }
  } catch {
    return { success: false, error: 'Restore failed' }
  }
}
