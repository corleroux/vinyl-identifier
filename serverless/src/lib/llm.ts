import type { Env } from '../env'

export interface VisionResult {
  artist: string
  album: string
  label: string | null
  catalogNumber: string | null
  confidence: number
}

export interface ResearchResult {
  rarityTier: string
  estimatedValueLow: number
  estimatedValueHigh: number
  currency: string
  condition: string
  priceHistory: string
  variants: Array<{
    label: string
    catalogNumber: string
    country: string
    year: number
    format: string
  }>
  similarReleases: Array<{
    artist: string
    album: string
    year: number | null
  }>
}

async function callLLM(
  endpoint: string,
  model: string,
  apiKey: string,
  messages: Array<{ role: string; content: string | Array<unknown> }>,
  responseFormat: 'json_object' | 'text' = 'json_object',
): Promise<Record<string, unknown>> {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages,
      response_format: responseFormat === 'json_object' ? { type: 'json_object' } : undefined,
      temperature: 0.1,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    console.error(`[llm] API error (${model}): ${response.status} ${body}`)
    throw new Error(`LLM API error (${model}): ${response.status} ${body}`)
  }

  const data = (await response.json()) as {
    choices: Array<{ message: { content: string | null } }>
  }

  const content = data.choices[0]?.message?.content
  if (!content) {
    console.error(`[llm] Empty content from model: ${model}`)
    throw new Error(`LLM returned empty content (model: ${model})`)
  }

  return JSON.parse(content) as Record<string, unknown>
}

export async function identifyWithVision(
  imageBuffer: ArrayBuffer,
  contentType: string,
  env: Env,
): Promise<VisionResult> {
  const base64 = btoa(
    new Uint8Array(imageBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), ''),
  )

  const result = await callLLM(
    env.VISION_LLM_ENDPOINT,
    env.VISION_LLM_MODEL,
    env.VISION_LLM_API_KEY,
    [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: 'Identify this vinyl record from the image. Return JSON with: artist, album, label, catalogNumber (as string or null), confidence (0-1).',
          },
          {
            type: 'image_url',
            image_url: { url: `data:${contentType};base64,${base64}` },
          },
        ],
      },
    ],
  )

  return {
    artist: (result.artist as string) ?? 'Unknown Artist',
    album: (result.album as string) ?? 'Unknown Album',
    label: (result.label as string | null) ?? null,
    catalogNumber: (result.catalogNumber as string | null) ?? null,
    confidence: (result.confidence as number) ?? 0,
  }
}

export async function researchWithLLM(
  identification: VisionResult,
  env: Env,
): Promise<ResearchResult> {
  const prompt = `You are a vinyl record rarity expert. Given the following record identification, provide a detailed rarity and value assessment.

Artist: ${identification.artist}
Album: ${identification.album}
Label: ${identification.label ?? 'Unknown'}
Catalog #: ${identification.catalogNumber ?? 'Unknown'}

Return JSON with exactly:
- rarityTier: "common" | "uncommon" | "rare" | "very_rare" | "legendary"
- estimatedValueLow: number (lowest market value in USD)
- estimatedValueHigh: number (highest market value in USD)
- currency: "USD"
- condition: "mint" | "near_mint" | "vg_plus" | "vg" | "g_plus" | "good" | "fair" | "poor"
- priceHistory: string (2-3 sentences about market trends)
- variants: array of { label, catalogNumber, country, year, format }
- similarReleases: array of { artist, album, year }`

  const result = await callLLM(
    env.RESEARCH_LLM_ENDPOINT,
    env.RESEARCH_LLM_MODEL,
    env.RESEARCH_LLM_API_KEY,
    [{ role: 'user', content: prompt }],
  )

  return {
    rarityTier: (result.rarityTier as string) ?? 'common',
    estimatedValueLow: (result.estimatedValueLow as number) ?? 0,
    estimatedValueHigh: (result.estimatedValueHigh as number) ?? 0,
    currency: (result.currency as string) ?? 'USD',
    condition: (result.condition as string) ?? 'vg',
    priceHistory: (result.priceHistory as string) ?? '',
    variants: (result.variants as ResearchResult['variants']) ?? [],
    similarReleases: (result.similarReleases as ResearchResult['similarReleases']) ?? [],
  }
}
