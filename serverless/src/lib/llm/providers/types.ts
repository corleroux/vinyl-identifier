export interface LLMMessage {
  role: 'user' | 'assistant' | 'system'
  content: string | Array<LLMContentPart>
}

export type LLMContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

export interface LLMCallOptions {
  model: string
  messages: LLMMessage[]
  responseFormat?: 'json_object' | 'text'
  temperature?: number
  timeout?: number
}

export interface LLMProvider {
  readonly name: string

  /** Send a chat completion request and return the raw JSON content string. */
  complete(endpoint: string, apiKey: string, options: LLMCallOptions): Promise<string>
}
