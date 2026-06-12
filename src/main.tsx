import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { startOfflineQueueListener, processPendingScans } from './utils/scanQueue'
import './i18n'
import './index.css'

const queryClient = new QueryClient()

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js')
}

const stopOfflineQueue = startOfflineQueueListener()

// Process any pending scans from previous sessions
if (navigator.onLine) {
  processPendingScans()
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)

// Cleanup on HMR
if (import.meta.hot) {
  import.meta.hot.dispose(() => stopOfflineQueue())
}
