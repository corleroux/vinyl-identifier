import type { Env } from '../env'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function handleSyncPut(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: JSON_HEADERS,
    })
  }

  const token = authHeader.substring(7)
  if (!token || token.length < 32) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: JSON_HEADERS,
    })
  }

  try {
    const data = await request.json()
    const key = `sync:${token}`

    await env.SYNC_KV.put(
      key,
      JSON.stringify({
        ...data,
        updatedAt: Date.now(),
      }),
    )

    return new Response(JSON.stringify({ success: true }), {
      headers: JSON_HEADERS,
    })
  } catch (error) {
    console.error('Sync PUT error:', error)
    return new Response(JSON.stringify({ error: 'Failed to sync data' }), {
      status: 500,
      headers: JSON_HEADERS,
    })
  }
}

export async function handleSyncGet(request: Request, env: Env): Promise<Response> {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: JSON_HEADERS,
    })
  }

  const token = authHeader.substring(7)
  if (!token || token.length < 32) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), {
      status: 401,
      headers: JSON_HEADERS,
    })
  }

  try {
    const key = `sync:${token}`
    const data = await env.SYNC_KV.get(key)

    if (!data) {
      return new Response(JSON.stringify({ data: null }), {
        headers: JSON_HEADERS,
      })
    }

    return new Response(data, {
      headers: JSON_HEADERS,
    })
  } catch (error) {
    console.error('Sync GET error:', error)
    return new Response(JSON.stringify({ error: 'Failed to fetch data' }), {
      status: 500,
      headers: JSON_HEADERS,
    })
  }
}
