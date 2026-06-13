import type { Env } from './env'
import { handleIdentify } from './functions/identify'
import { handleDiscogs } from './functions/discogs'

function corsHeaders(origin: string | null, env: Env): Record<string, string> {
  const allowed = env.ALLOWED_ORIGINS || 'http://localhost:5173'
  const allowOrigin = origin && allowed.split(',').includes(origin) ? origin : allowed.split(',')[0]

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function json(data: string, status: number, origin: string | null, env: Env): Response {
  return new Response(data, {
    status,
    headers: { 'Content-Type': 'application/json', ...corsHeaders(origin, env) },
  })
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url)
    const origin = request.headers.get('Origin')

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders(origin, env) })
    }

    if (url.pathname === '/api/identify' && request.method === 'POST') {
      const res = await handleIdentify(request, env)
      Object.entries(corsHeaders(origin, env)).forEach(([k, v]) => res.headers.set(k, v))
      return res
    }

    if (url.pathname === '/api/discogs' && request.method === 'GET') {
      const res = await handleDiscogs(request, env)
      Object.entries(corsHeaders(origin, env)).forEach(([k, v]) => res.headers.set(k, v))
      return res
    }

    return json(JSON.stringify({ error: 'Not Found' }), 404, origin, env)
  },
} satisfies ExportedHandler<Env>
