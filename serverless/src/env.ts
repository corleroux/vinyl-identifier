export interface Env {
  // Provider selection ("gemini" | "openai-compat")
  LLM_PROVIDER: string
  LLM_FALLBACK_PROVIDER: string

  // Gemini config (primary)
  GEMINI_API_KEY: string
  GEMINI_MODEL: string
  GEMINI_ENDPOINT: string

  // OpenAI-compatible config (fallback — works with NVIDIA NIM, OpenAI, Groq, etc.)
  OPENAI_COMPAT_API_KEY: string
  OPENAI_COMPAT_MODEL: string
  OPENAI_COMPAT_ENDPOINT: string

  // Discogs
  DISCOGS_CONSUMER_KEY: string
  DISCOGS_CONSUMER_SECRET: string

  // CORS
  ALLOWED_ORIGINS: string

  // Sync
  SYNC_KV: KVNamespace
}
