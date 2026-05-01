import { useState, useRef, useCallback } from 'react'
import { uploadFiles } from '../api'
import { runAsync, btnClass, UPLOAD_ICON, FILE_ICON } from '../shared'
import ResultBanner from './ResultBanner'
import ProgressBar from '../../components/ProgressBar'

const ALLOWED_EXTS = ['.md', '.txt', '.sql']

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

function getExt(name) {
  const i = name.lastIndexOf('.')
  return i >= 0 ? name.slice(i).toLowerCase() : ''
}

export default function FileUpload({ tagInput, files, setFiles, upload, setUpload, loadTags }) {
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef(null)

  const addFiles = useCallback((incoming) => {
    setFiles((prev) => {
      const valid = incoming.filter((f) => {
        if (!ALLOWED_EXTS.includes(getExt(f.name))) return false
        return !prev.some((x) => x.name === f.name && x.size === f.size)
      })
      return valid.length ? [...prev, ...valid] : prev
    })
  }, [setFiles])

  const removeFile = useCallback((idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx))
  }, [setFiles])

  const handleDrag = useCallback((e, on) => {
    e.preventDefault()
    e.stopPropagation()
    if (on !== undefined) setDragOver(on)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragOver(false)
    if (e.dataTransfer.files?.length) {
      addFiles(Array.from(e.dataTransfer.files))
    }
  }, [addFiles])

  const handleUpload = useCallback(async () => {
    const tag = tagInput.trim()
    if (!tag || files.length === 0 || upload.loading) return
    await runAsync(setUpload, () => uploadFiles(tag, files), {
      successMsg: `上传成功，共 ${files.length} 个文件`,
      onSuccess: () => { setFiles([]); loadTags() },
    })
  }, [tagInput, files, upload.loading, setUpload, setFiles, loadTags])

  return (
    <div>
      <div
        onDragEnter={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDragOver={(e) => handleDrag(e)}
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
            {UPLOAD_ICON}
          </div>
          <div>
            <p className="text-pip-text text-sm font-medium">
              拖拽文件到此处，或<span className="text-pip-green pip-glow">点击上传</span>
            </p>
            <p className="text-pip-text-dim text-xs mt-1">支持 .md、.txt、.sql 格式</p>
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

      {files.length > 0 && (
        <div className="mt-4">
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
                  {FILE_ICON}
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

      <div className="mt-4 space-y-3">
        <ResultBanner result={upload.result} />
        {upload.loading && <ProgressBar label="正在上传并处理文件..." />}
        <button
          type="button"
          onClick={handleUpload}
          disabled={!tagInput.trim() || files.length === 0 || upload.loading}
          className={btnClass}
        >
          {upload.loading ? '处理中...' : <>{UPLOAD_ICON}开始上传</>}
        </button>
      </div>
    </div>
  )
}
