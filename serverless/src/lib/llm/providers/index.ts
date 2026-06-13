import type { LLMProvider } from './types'
import { geminiProvider } from './gemini'
import { openAICompatProvider } from './openai-compat'

export type { LLMProvider, LLMMessage, LLMContentPart, LLMCallOptions } from './types'

const providers: Record<string, LLMProvider> = {
  gemini: geminiProvider,
  'openai-compat': openAICompatProvider,
  // To add a new provider:
  // 1. Create a file in providers/ that implements LLMProvider
  // 2. Import and register it here
  // 3. Set LLM_PROVIDER env var to the provider name
}

export function getProvider(name: string): LLMProvider {
  const provider = providers[name]
  if (!provider) {
    const available = Object.keys(providers).join(', ')
    throw new Error(`Unknown LLM provider "${name}". Available: ${available}`)
  }
  return provider
}
