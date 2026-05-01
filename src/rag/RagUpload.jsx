import { useState, useCallback, useEffect } from 'react'
import { queryRagTagList } from './api'
import FileUpload from './components/FileUpload'
import GitImport from './components/GitImport'

function SectionLabel({ children }) {
  return (
    <label className="block text-pip-text text-sm font-medium mb-2 pip-glow flex items-center gap-2">
      <span className="w-1 h-4 bg-pip-green rounded-full shadow-[0_0_6px_rgba(26,255,78,0.5)]" />
      {children}
    </label>
  )
}

export default function RagUpload() {
  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState('')
  const [files, setFiles] = useState([])
  const [upload, setUpload] = useState({ loading: false, result: null })
  const [git, setGit] = useState({ url: '', user: '', token: '', loading: false, result: null })

  const loadTags = useCallback(() => {
    queryRagTagList()
      .then((res) => {
        if (res?.code === '0000' && Array.isArray(res.data)) setTags(res.data)
      })
      .catch(() => {})
  }, [])

  useEffect(() => { loadTags() }, [loadTags])

  return (
    <div className="flex-1 flex divide-x divide-pip-border overflow-hidden">
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        <div>
          <SectionLabel>知识库名称</SectionLabel>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="请输入知识库名称..."
            className="w-full bg-pip-green-dim/10 border border-pip-border rounded-xl px-4 py-3 text-pip-text text-sm placeholder-pip-text-dim/50 outline-none focus:border-pip-green/50 focus:ring-1 focus:ring-pip-green/30 transition-all pip-input-glow"
          />
        </div>

        <div>
          <SectionLabel>上传文件</SectionLabel>
          <FileUpload
            tagInput={tagInput}
            files={files}
            setFiles={setFiles}
            upload={upload}
            setUpload={setUpload}
            loadTags={loadTags}
          />
        </div>

        <div className="border-t border-pip-border" />

        <GitImport git={git} setGit={setGit} loadTags={loadTags} />
      </div>

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
              <div key={t} className="w-full text-left px-3 py-2 rounded-lg text-sm text-pip-text-dim">
                {t}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
