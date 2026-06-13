import type { LLMProvider, LLMCallOptions, LLMMessage, LLMContentPart } from './types'

interface GeminiPart {
  text?: string
  inlineData?: { mimeType: string; data: string }
}

interface GeminiContent {
  role: 'user' | 'model'
  parts: GeminiPart[]
}

interface GeminiRequest {
  contents: GeminiContent[]
  generationConfig: {
    temperature: number
    responseMimeType?: string
  }
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> }
  }>
  error?: { message: string; code: number }
}

function mapRole(role: LLMMessage['role']): 'user' | 'model' {
  return role === 'assistant' ? 'model' : 'user'
}

function convertParts(content: LLMMessage['content']): GeminiPart[] {
  if (typeof content === 'string') {
    return [{ text: content }]
  }

  return content.map((part: LLMContentPart) => {
    if (part.type === 'text') {
      return { text: part.text }
    }

    // Extract mime type and base64 data from data URL
    const url = part.image_url.url
    const match = url.match(/^data:([^;]+);base64,(.+)$/)
    if (match) {
      return { inlineData: { mimeType: match[1], data: match[2] } }
    }

    // Fallback: pass as text (won't work for images but avoids silent failure)
    return { text: `[image: ${url}]` }
  })
}

export const geminiProvider: LLMProvider = {
  name: 'gemini',

  async complete(endpoint, apiKey, options): Promise<string> {
    const {
      model,
      messages,
      responseFormat = 'json_object',
      temperature = 0.1,
      timeout = 30_000,
    } = options

    const contents: GeminiContent[] = messages.map((msg) => ({
      role: mapRole(msg.role),
      parts: convertParts(msg.content),
    }))

    const body: GeminiRequest = {
      contents,
      generationConfig: {
        temperature,
      },
    }

    if (responseFormat === 'json_object') {
      body.generationConfig.responseMimeType = 'application/json'
    }

    // Endpoint template: {baseUrl}/models/{model}:generateContent
    const url = `${endpoint}/models/${model}:generateContent?key=${apiKey}`

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timer)

      if (!response.ok) {
        const text = await response.text()
        console.error(`[llm:gemini] API error: ${response.status} ${text}`)
        throw new Error(`Gemini API error: ${response.status} ${text}`)
      }

      const data = (await response.json()) as GeminiResponse

      if (data.error) {
        console.error(`[llm:gemini] API error: ${data.error.code} ${data.error.message}`)
        throw new Error(`Gemini API error: ${data.error.code} ${data.error.message}`)
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) {
        console.error('[llm:gemini] Empty response from model')
        throw new Error('Gemini returned empty content')
      }

      return text
    } catch (err) {
      clearTimeout(timer)
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error(`Gemini request timed out after ${timeout}ms`)
      }
      throw err
    }
  },
}
