import type { LLMProvider, LLMCallOptions } from './types'

interface OpenAIRequest {
  model: string
  messages: Array<{ role: string; content: string | Array<unknown> }>
  response_format?: { type: 'json_object' }
  temperature: number
}

interface OpenAIResponse {
  choices?: Array<{ message?: { content?: string } }>
  error?: { message: string }
}

export const openAICompatProvider: LLMProvider = {
  name: 'openai-compat',

  async complete(endpoint, apiKey, options): Promise<string> {
    const {
      model,
      messages,
      responseFormat = 'json_object',
      temperature = 0.1,
      timeout = 30_000,
    } = options

    const body: OpenAIRequest = {
      model,
      messages: messages.map((m) => ({ role: m.role, content: m.content })),
      temperature,
    }

    if (responseFormat === 'json_object') {
      body.response_format = { type: 'json_object' }
    }

    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeout)

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      clearTimeout(timer)

      if (!response.ok) {
        const text = await response.text()
        console.error(`[llm:openai-compat] API error: ${response.status} ${text}`)
        throw new Error(`LLM API error: ${response.status} ${text}`)
      }

      const data = (await response.json()) as OpenAIResponse

      if (data.error) {
        console.error(`[llm:openai-compat] API error: ${data.error.message}`)
        throw new Error(`LLM API error: ${data.error.message}`)
      }

      const content = data.choices?.[0]?.message?.content
      if (!content) {
        console.error('[llm:openai-compat] Empty response from model')
        throw new Error('LLM returned empty content')
      }

      return content
    } catch (err) {
      clearTimeout(timer)
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new Error(`LLM request timed out after ${timeout}ms`)
      }
      throw err
    }
  },
}
