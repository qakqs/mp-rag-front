import { useState, useCallback } from 'react'
import Chat from './chat/Chat'
import RagUpload from './rag/RagUpload'
import CrtOverlay from './rag/components/CrtOverlay'

const TABS = [
  { key: 'chat', label: 'AI 对话', icon: ChatIcon },
  { key: 'rag', label: '知识库管理', icon: FolderIcon },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('chat')
  const [glitch, setGlitch] = useState(false)

  const switchTab = useCallback((key) => {
    if (key === activeTab) return
    setGlitch(true)
    setActiveTab(key)
    setTimeout(() => setGlitch(false), 300)
  }, [activeTab])

  return (
    <div className="h-dvh bg-pip-bg flex items-center justify-center sm:p-4">
      <CrtOverlay />

      <div className={`w-full h-full sm:max-w-6xl sm:h-[90vh] bg-pip-panel sm:rounded-2xl pip-box-glow flex flex-col overflow-hidden border border-pip-border ${glitch ? 'animate-glitch' : ''}`}>

        {/* Header with tabs */}
        <header className="px-6 py-4 border-b border-pip-border flex items-center gap-1 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-pip-green flex items-center justify-center text-pip-bg text-sm font-bold mr-3 animate-glow-pulse">
            AI
          </div>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-all ${
                activeTab === key
                  ? 'bg-pip-green-dim text-pip-green pip-glow'
                  : 'text-pip-text-dim hover:text-pip-text hover:bg-pip-green-dim/50'
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </header>

        {/* Content */}
        {activeTab === 'chat' ? <Chat /> : <RagUpload />}
      </div>
    </div>
  )
}

function ChatIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
    </svg>
  )
}

function FolderIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  )
}
