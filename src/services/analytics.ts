import posthog from 'posthog-js'

const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST ?? 'https://us.i.posthog.com'

if (POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    capture_pageview: false,
    capture_pageleave: true,
    autocapture: true,
    persistence: 'localStorage',
  })
}

export function identify(distinctId: string) {
  if (POSTHOG_KEY) posthog.identify(distinctId)
}

export function track(event: string, properties?: Record<string, unknown>) {
  if (POSTHOG_KEY) posthog.capture(event, properties)
}

export function reset() {
  if (POSTHOG_KEY) posthog.reset()
}

export { posthog }
