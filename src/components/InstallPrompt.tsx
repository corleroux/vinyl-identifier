import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Capacitor } from '@capacitor/core'

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const { t } = useTranslation()
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (Capacitor.isNativePlatform()) return

    function handler(e: Event) {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function handleInstall() {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setVisible(false)
    }
    setDeferredPrompt(null)
  }

  function handleDismiss() {
    setVisible(false)
    sessionStorage.setItem('install-dismissed', 'true')
  }

  if (!visible || sessionStorage.getItem('install-dismissed')) return null

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
        <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
          />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{t('install.title')}</p>
        <p className="text-xs text-gray-500 truncate">{t('install.description')}</p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={handleDismiss}
          className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 min-h-[36px]"
        >
          {t('install.dismissButton')}
        </button>
        <button
          onClick={handleInstall}
          className="text-xs bg-blue-600 text-white rounded px-3 py-1 min-h-[36px] hover:bg-blue-700"
        >
          {t('install.installButton')}
        </button>
      </div>
    </div>
  )
}
