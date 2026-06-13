import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '@/store/useAppStore'
import { purchaseFullVersion, restorePurchases } from '@/services/purchase'
import { track } from '@/services/analytics'

export function PaywallScreen() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const setFullVersion = useAppStore((s) => s.setFullVersion)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handlePurchase() {
    setLoading(true)
    setError(null)
    try {
      const result = await purchaseFullVersion()
      if (result.success) {
        setFullVersion(true)
        track('purchase_completed', { product_id: result.productId })
        navigate(-1)
      } else {
        setError(result.error ?? t('paywall.purchaseFailed'))
      }
    } catch {
      setError(t('paywall.purchaseFailed'))
    } finally {
      setLoading(false)
    }
  }

  async function handleRestore() {
    setLoading(true)
    setError(null)
    try {
      const result = await restorePurchases()
      if (result.success) {
        setFullVersion(true)
        track('purchase_restored')
        navigate(-1)
      } else {
        setError(result.error ?? t('paywall.restoreFailed'))
      }
    } catch {
      setError(t('paywall.restoreFailed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 items-center justify-center">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-full bg-blue-600 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">{t('paywall.title')}</h1>
          <p className="text-gray-600">{t('paywall.description')}</p>
        </div>

        <ul className="space-y-3">
          {[t('paywall.feature1'), t('paywall.feature2'), t('paywall.feature3')].map((feature) => (
            <li key={feature} className="flex items-center gap-3 text-sm">
              <svg
                className="w-5 h-5 text-green-500 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        {error && (
          <p className="text-sm text-red-600 text-center" role="alert">
            {error}
          </p>
        )}

        <div className="space-y-3">
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="btn-primary w-full min-h-[48px]"
          >
            {loading ? t('common.loading') : t('paywall.purchaseButton')}
          </button>
          <button
            onClick={handleRestore}
            disabled={loading}
            className="btn-secondary w-full min-h-[48px]"
          >
            {t('paywall.restoreButton')}
          </button>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="block w-full text-center text-sm text-gray-500 hover:text-gray-700"
        >
          {t('common.close')}
        </button>
      </div>
    </div>
  )
}
