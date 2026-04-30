import { useState, useRef, useCallback, useEffect } from 'react'
import { queryRagTagList, uploadFiles } from './api'

const ALLOWED_EXTS = ['.md', '.txt', '.sql']

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function getExtension(name) {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i).toLowerCase() : ''
}

export default function RagUpload() {
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [files, setFiles] = useState([])
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [result, setResult] = useState(null)

  const fileInputRef = useRef(null)

  const loadTags = useCallback(() => {
    queryRagTagList()
      .then((res) => {
        if (res?.code === '0000' && Array.isArray(res.data)) setTags(res.data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => { loadTags() }, [loadTags])

  const addFiles = useCallback(
    (incoming) => {
      const valid = incoming.filter((f) => {
        const ext = getExtension(f.name)
        if (!ALLOWED_EXTS.includes(ext)) return false
        return !files.some((x) => x.name === f.name && x.size === f.size)
      })
      if (valid.length) setFiles((prev) => [...prev, ...valid])
    },
    [files],
  )

  const removeFile = useCallback((idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }, [])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDragIn = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(true)
  }, [])

  const handleDragOut = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      e.stopPropagation()
      setDragOver(false)
      if (e.dataTransfer.files?.length) {
        addFiles(Array.from(e.dataTransfer.files))
      }
    },
    [addFiles],
  )

  const handleUpload = useCallback(async () => {
    const tag = tagInput.trim()
    if (!tag || files.length === 0 || uploading) return

    setUploading(true)
    setResult(null)
    try {
      const res = await uploadFiles(tag, files)
      if (res?.code === '0000') {
        setResult({ type: 'success', msg: `上传成功，共 ${files.length} 个文件` })
        setFiles([])
        loadTags()
      } else {
        setResult({ type: 'error', msg: res?.info || '上传失败' })
      }
    } catch {
      setResult({ type: 'error', msg: '网络请求失败，请检查后端服务是否正常。' })
    } finally {
      setUploading(false)
    }
  }, [tagInput, files, uploading, loadTags])

  return (
    <div className="flex-1 flex divide-x divide-pip-border overflow-hidden">
      {/* ====== Left: Upload ====== */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {/* ---- ragTag ---- */}
        <div>
          <label className="block text-pip-text text-sm font-medium mb-2 pip-glow">
            知识库名称
          </label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="请输入知识库名称..."
            className="w-full bg-pip-green-dim/10 border border-pip-border rounded-xl px-4 py-3 text-pip-text text-sm placeholder-pip-text-dim/50 outline-none focus:border-pip-green/50 focus:ring-1 focus:ring-pip-green/30 transition-all pip-input-glow"
          />
        </div>

        {/* ---- upload zone ---- */}
        <div>
          <label className="block text-pip-text text-sm font-medium mb-2 pip-glow">
            上传文件
          </label>
          <div
            onDragEnter={handleDragIn}
            onDragLeave={handleDragOut}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-pip-green bg-pip-green/10 pip-border-glow'
                : 'border-pip-border hover:border-pip-green/40 hover:bg-pip-green-dim/10'
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-pip-green/15 flex items-center justify-center">
                <svg className="w-6 h-6 text-pip-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-pip-text text-sm font-medium">
                  拖拽文件到此处，或<span className="text-pip-green pip-glow">点击上传</span>
                </p>
                <p className="text-pip-text-dim text-xs mt-1">
                  支持 .md、.txt、.sql 格式
                </p>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".md,.txt,.sql"
              onChange={(e) => {
                if (e.target.files?.length) addFiles(Array.from(e.target.files))
                e.target.value = ''
              }}
              className="hidden"
            />
          </div>
        </div>

        {/* ---- file list ---- */}
        {files.length > 0 && (
          <div>
            <label className="block text-pip-text text-sm font-medium mb-2 pip-glow">
              已选文件 ({files.length})
            </label>
            <div className="space-y-2">
              {files.map((f, i) => (
                <div
                  key={`${f.name}-${f.size}-${i}`}
                  className="flex items-center gap-3 bg-pip-green-dim/20 border border-pip-border rounded-xl px-4 py-3 group"
                >
                  <div className="w-8 h-8 rounded-lg bg-pip-green/15 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-pip-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-pip-text text-sm truncate">{f.name}</p>
                    <p className="text-pip-text-dim text-xs">{formatSize(f.size)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-pip-text-dim hover:text-red-400 hover:bg-red-400/10 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ---- result ---- */}
        {result && (
          <div
            className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 border ${
              result.type === 'success'
                ? 'bg-pip-green/10 border-pip-green/30 text-pip-green'
                : 'bg-red-500/10 border-red-500/20 text-red-400'
            }`}
          >
            {result.type === 'success' ? (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {result.msg}
          </div>
        )}

        {/* ---- upload button ---- */}
        <button
          type="button"
          onClick={handleUpload}
          disabled={!tagInput.trim() || files.length === 0 || uploading}
          className="w-full py-3 rounded-xl bg-pip-green hover:bg-[#00cc33] text-pip-bg font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 pip-glow"
        >
          {uploading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              上传中...
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              开始上传
            </>
          )}
        </button>
      </div>

      {/* ====== Right: Knowledge Base List ====== */}
      <div className="w-56 shrink-0 overflow-y-auto px-4 py-6">
        <h3 className="text-pip-text text-sm font-medium mb-3 flex items-center gap-2 pip-glow">
          <svg className="w-4 h-4 text-pip-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
          </svg>
          知识库列表
        </h3>

        {tags.length === 0 ? (
          <p className="text-pip-text-dim text-xs">暂无知识库</p>
        ) : (
          <div className="space-y-1">
            {tags.map((t) => (
              <div
                key={t}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-pip-text-dim"
              >
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
