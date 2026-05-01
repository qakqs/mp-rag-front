import { BASE_URL } from '../config.js'

async function post(path, body, headers) {
  const res = await fetch(`${BASE_URL}${path}`, { method: 'POST', headers, body })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res.json()
}

export const queryRagTagList = () => post('/api/v1/rag/queryRagTagList')

export async function uploadFiles(ragTag, files) {
  const fd = new FormData()
  fd.append('ragTag', ragTag)
  files.forEach((f) => fd.append('files', f))
  return post('/api/v1/rag/file/upload', fd)
}

export async function analyzeGitRepository(repoUrl, userName, token) {
  const body = new URLSearchParams({ repoUrl, userName, token })
  return post('/api/v1/rag/analyzeGitRepository', body.toString(), {
    'Content-Type': 'application/x-www-form-urlencoded',
  })
}
