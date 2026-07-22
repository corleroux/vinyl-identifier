import type { Env } from '../env'
import { getProvider, type LLMMessage } from './llm/providers'

const LLM_TIMEOUT = 25_000

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

export interface ConditionGradeResult {
  overallGrade: string
  confidence: number
  surfaceNoise: 'none' | 'light' | 'moderate' | 'heavy'
  scratches: { count: number; severity: 'minor' | 'moderate' | 'major' }
  warps: { present: boolean; severity: 'none' | 'mild' | 'moderate' | 'severe' }
  wear: { edge: number; surface: number }
  defects: string[]
  recommendation: string
}

function getProviderConfig(env: Env, providerName: string) {
  switch (providerName) {
    case 'gemini':
      return {
        provider: getProvider('gemini'),
        endpoint: env.GEMINI_ENDPOINT,
        apiKey: env.GEMINI_API_KEY,
        model: env.GEMINI_MODEL,
      }
    case 'openai-compat':
      return {
        provider: getProvider('openai-compat'),
        endpoint: env.OPENAI_COMPAT_ENDPOINT,
        apiKey: env.OPENAI_COMPAT_API_KEY,
        model: env.OPENAI_COMPAT_MODEL,
      }
    default:
      throw new Error(`Unknown LLM provider: ${providerName}`)
  }
}

async function callLLMWithFallback(
  env: Env,
  primaryMessages: LLMMessage[],
  fallbackMessages: LLMMessage[],
  isVision: boolean,
): Promise<Record<string, unknown>> {
  const primaryConfig = getProviderConfig(env, env.LLM_PROVIDER)
  const messages = isVision ? primaryMessages : fallbackMessages
  const model = primaryConfig.model

  try {
    const content = await primaryConfig.provider.complete(
      primaryConfig.endpoint,
      primaryConfig.apiKey,
      { model, messages, timeout: LLM_TIMEOUT },
    )
    return JSON.parse(content) as Record<string, unknown>
  } catch (err) {
    const primaryName = env.LLM_PROVIDER
    const fallbackName = env.LLM_FALLBACK_PROVIDER
    console.warn(`[llm] ${primaryName} failed, trying fallback ${fallbackName}: ${err}`)

    const fallbackConfig = getProviderConfig(env, fallbackName)
    const fallbackModel = fallbackConfig.model

    const content = await fallbackConfig.provider.complete(
      fallbackConfig.endpoint,
      fallbackConfig.apiKey,
      { model: fallbackModel, messages, timeout: LLM_TIMEOUT },
    )
    return JSON.parse(content) as Record<string, unknown>
  }
}

export async function identifyWithVision(
  imageBuffer: ArrayBuffer,
  contentType: string,
  env: Env,
): Promise<VisionResult> {
  const base64 = btoa(
    new Uint8Array(imageBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), ''),
  )

  const visionPrompt: LLMMessage[] = [
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
  ]

  const result = await callLLMWithFallback(env, visionPrompt, visionPrompt, true)

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

  const researchMessages: LLMMessage[] = [{ role: 'user', content: prompt }]

  const result = await callLLMWithFallback(env, researchMessages, researchMessages, false)

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

export async function gradeConditionWithVision(
  imageBuffer: ArrayBuffer,
  contentType: string,
  env: Env,
): Promise<ConditionGradeResult> {
  const base64 = btoa(
    new Uint8Array(imageBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), ''),
  )

  const conditionPrompt: LLMMessage[] = [
    {
      role: 'user',
      content: [
        {
          type: 'text',
          text: `You are a vinyl record condition grading expert. Analyze this vinyl record image and provide a detailed condition assessment.

Evaluate the following aspects:
1. Overall condition grade (mint, near_mint, vg_plus, vg, g_plus, good, fair, poor)
2. Surface noise level (none, light, moderate, heavy)
3. Scratches (count and severity)
4. Warps (presence and severity)
5. Edge wear (0-100 scale)
6. Surface wear (0-100 scale)
7. Any visible defects (list them)
8. Confidence in your assessment (0-1)
9. Recommendation for the seller

Return JSON with exactly:
- overallGrade: string (mint|near_mint|vg_plus|vg|g_plus|good|fair|poor)
- confidence: number (0-1)
- surfaceNoise: string (none|light|moderate|heavy)
- scratches: { count: number, severity: string (minor|moderate|major) }
- warps: { present: boolean, severity: string (none|mild|moderate|severe) }
- wear: { edge: number, surface: number }
- defects: string[] (list of visible defects)
- recommendation: string (advice for seller)`,
        },
        {
          type: 'image_url',
          image_url: { url: `data:${contentType};base64,${base64}` },
        },
      ],
    },
  ]

  const result = await callLLMWithFallback(env, conditionPrompt, conditionPrompt, true)

  return {
    overallGrade: (result.overallGrade as string) ?? 'vg',
    confidence: (result.confidence as number) ?? 0.5,
    surfaceNoise: (result.surfaceNoise as ConditionGradeResult['surfaceNoise']) ?? 'light',
    scratches: (result.scratches as ConditionGradeResult['scratches']) ?? {
      count: 0,
      severity: 'minor',
    },
    warps: (result.warps as ConditionGradeResult['warps']) ?? {
      present: false,
      severity: 'none',
    },
    wear: (result.wear as ConditionGradeResult['wear']) ?? { edge: 0, surface: 0 },
    defects: (result.defects as string[]) ?? [],
    recommendation: (result.recommendation as string) ?? '',
  }
}
