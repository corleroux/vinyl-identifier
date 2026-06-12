import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { Env } from '../env'

const mockEnv: Env = {
  VISION_LLM_API_KEY: 'test-vision-key',
  RESEARCH_LLM_API_KEY: 'test-research-key',
  VISION_LLM_MODEL: 'test-vision-model',
  RESEARCH_LLM_MODEL: 'test-research-model',
  VISION_LLM_ENDPOINT: 'https://api.test.com/v1/chat/completions',
  RESEARCH_LLM_ENDPOINT: 'https://api.test.com/v1/chat/completions',
  DISCOGS_CONSUMER_KEY: 'test-discogs-key',
  DISCOGS_CONSUMER_SECRET: 'test-discogs-secret',
  ALLOWED_ORIGINS: 'http://localhost:5173',
}

function mockFetchResponse(body: unknown, ok = true, status = 200) {
  return vi.fn().mockResolvedValue({
    ok,
    status,
    statusText: ok ? 'OK' : 'Error',
    text: () => Promise.resolve(JSON.stringify(body)),
    json: () => Promise.resolve(body),
  })
}

describe('handleIdentify', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when image field is missing', async () => {
    const { handleIdentify } = await import('../functions/identify')
    const formData = new FormData()
    const request = new Request('http://localhost/api/identify', {
      method: 'POST',
      body: formData,
    })

    const response = await handleIdentify(request, mockEnv)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toMatch(/missing or invalid image/i)
  })

  it('returns 500 when vision LLM fails', async () => {
    const { handleIdentify } = await import('../functions/identify')

    vi.stubGlobal('fetch', mockFetchResponse({ error: 'model unavailable' }, false, 500))

    const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' })
    const formData = new FormData()
    formData.append('image', blob, 'test.jpg')
    const request = new Request('http://localhost/api/identify', {
      method: 'POST',
      body: formData,
    })

    const response = await handleIdentify(request, mockEnv)
    expect(response.status).toBe(502)
  })

  it('returns merged result when all services succeed', async () => {
    const { handleIdentify } = await import('../functions/identify')

    let callCount = 0
    vi.stubGlobal(
      'fetch',
      vi.fn().mockImplementation(async () => {
        callCount++
        if (callCount === 1) {
          // Vision LLM response
          return {
            ok: true,
            json: () =>
              Promise.resolve({
                choices: [
                  {
                    message: {
                      content: JSON.stringify({
                        artist: 'Pink Floyd',
                        album: 'The Dark Side of the Moon',
                        label: 'Harvest',
                        catalogNumber: 'SHVL 804',
                        confidence: 0.95,
                      }),
                    },
                  },
                ],
              }),
          }
        }
        if (callCount === 2) {
          // Research LLM response
          return {
            ok: true,
            json: () =>
              Promise.resolve({
                choices: [
                  {
                    message: {
                      content: JSON.stringify({
                        rarityTier: 'uncommon',
                        estimatedValueLow: 25,
                        estimatedValueHigh: 80,
                        currency: 'USD',
                        condition: 'vg_plus',
                        priceHistory: 'Steady demand.',
                        variants: [],
                        similarReleases: [],
                      }),
                    },
                  },
                ],
              }),
          }
          // Discogs response
          return { ok: false }
        }
      }),
    )

    const blob = new Blob([new Uint8Array([1, 2, 3])], { type: 'image/jpeg' })
    const formData = new FormData()
    formData.append('image', blob, 'test.jpg')
    const request = new Request('http://localhost/api/identify', {
      method: 'POST',
      body: formData,
    })

    const response = await handleIdentify(request, mockEnv)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.artist).toBe('Pink Floyd')
    expect(data.album).toBe('The Dark Side of the Moon')
    expect(data.rarityTier).toBe('uncommon')
    expect(data.confidence).toBe(0.95)
  })
})

describe('handleDiscogs', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('returns 400 when no params provided', async () => {
    const { handleDiscogs } = await import('../functions/discogs')
    const request = new Request('http://localhost/api/discogs')

    const response = await handleDiscogs(request, mockEnv)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toMatch(/provide either barcode/i)
  })

  it('returns 404 when Discogs finds nothing', async () => {
    const { handleDiscogs } = await import('../functions/discogs')
    vi.stubGlobal('fetch', mockFetchResponse({ results: [] }))

    const request = new Request('http://localhost/api/discogs?barcode=0000000000')
    const response = await handleDiscogs(request, mockEnv)
    const data = await response.json()

    expect(response.status).toBe(404)
  })
})
