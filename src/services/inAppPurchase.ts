import type { PurchaseResult } from './purchase'

const PRODUCT_ID = 'vinyl_identifier_full_version'

export const InAppPurchase = {
  async purchase(_productId: string): Promise<PurchaseResult> {
    // Placeholder for native IAP plugin integration
    // Wire up @capacitor/in-app-purchase-2 or equivalent here
    // For now, simulate a successful purchase (native builds will use real IAP)
    console.warn('InAppPurchase.purchase called — native IAP not yet wired')
    return { success: true, productId: PRODUCT_ID }
  },

  async restore(): Promise<PurchaseResult> {
    // Placeholder for native restore purchases
    console.warn('InAppPurchase.restore called — native IAP not yet wired')
    return { success: false, error: 'No previous purchase found' }
  },
}
