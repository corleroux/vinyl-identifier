import type { Env } from '../env'
import { gradeConditionWithVision } from '../lib/llm'

const JSON_HEADERS = { 'Content-Type': 'application/json' }

export async function handleGradeCondition(request: Request, env: Env): Promise<Response> {
  const start = Date.now()

  try {
    const formData = await request.formData()
    const imageField = formData.get('image')

    if (!imageField || !(imageField instanceof Blob)) {
      console.error('[grade-condition] Missing or invalid image field')
      return new Response(JSON.stringify({ error: 'Missing or invalid image field' }), {
        status: 400,
        headers: JSON_HEADERS,
      })
    }

    const imageBuffer = await imageField.arrayBuffer()
    const contentType = imageField.type || 'image/jpeg'
    console.log(`[grade-condition] Received image: ${contentType}, ${imageBuffer.byteLength} bytes`)

    const result = await gradeConditionWithVision(imageBuffer, contentType, env)

    const duration = Date.now() - start
    console.log(
      `[grade-condition] Completed in ${duration}ms: grade=${result.overallGrade}, confidence=${result.confidence}`,
    )

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: JSON_HEADERS,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error(`[grade-condition] Failed: ${message}`)
    return new Response(JSON.stringify({ error: `Condition grading failed: ${message}` }), {
      status: 500,
      headers: JSON_HEADERS,
    })
  }
}
