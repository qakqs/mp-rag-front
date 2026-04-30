const BASE_URL = 'http://127.0.0.1:8092'

export async function queryRagTagList() {
  const res = await fetch(`${BASE_URL}/api/v1/rag/queryRagTagList`, { method: 'POST' })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export async function uploadFiles(ragTag, files) {
  const formData = new FormData()
  formData.append('ragTag', ragTag)
  files.forEach((f) => formData.append('files', f))

  const res = await fetch(`${BASE_URL}/api/v1/rag/file/upload`, {
    method: 'POST',
    body: formData,
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}
