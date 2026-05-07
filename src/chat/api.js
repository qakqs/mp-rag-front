import { BASE_URL } from '../config.js'

export async function* streamChat(message, ragTag) {
  const body = { message }
  if (ragTag) body.ragTag = ragTag

  const res = await fetch(`${BASE_URL}/api/v1/anthropic/generate_stream_rag`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const text = await res.text()
  let data
  try {
    data = JSON.parse(text)
  } catch {
    throw new Error('响应解析失败')
  }

  const items = Array.isArray(data) ? data : [data]
  for (const item of items) {
    const content = item?.results?.[0]?.output?.text
      || item?.result?.output?.text
    if (content) yield content
  }
}
