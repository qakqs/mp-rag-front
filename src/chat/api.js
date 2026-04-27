const BASE_URL = 'http://127.0.0.1:8092'
const MODEL = 'gpt-oss:120b-cloud'

function extractContent(item) {
  return (
    item?.result?.output?.content ||
    item?.results?.[0]?.output?.content ||
    ''
  )
}

export async function* streamChat(message) {
  const response = await fetch(`${BASE_URL}/api/v1/ollama/generateStream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, message }),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`)
  }

  const raw = await response.text()
  const parsed = JSON.parse(raw)
  const items = Array.isArray(parsed) ? parsed : [parsed]

  for (const item of items) {
    const content = extractContent(item)
    if (content) {
      yield content
    }
  }
}
