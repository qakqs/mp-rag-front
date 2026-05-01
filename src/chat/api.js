import { BASE_URL } from '../config.js'

const MODEL = 'gpt-oss:120b-cloud'
const extractContent = (i) => i?.result?.output?.content || i?.results?.[0]?.output?.content || ''

export async function* streamChat(message) {
  const res = await fetch(`${BASE_URL}/api/v1/ollama/generateStream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, message }),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)

  const items = [].concat(JSON.parse(await res.text()))
  for (const item of items) {
    const c = extractContent(item)
    if (c) yield c
  }
}
