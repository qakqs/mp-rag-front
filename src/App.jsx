import { useState } from 'react'
import Chat from './chat/Chat'
import RagUpload from './rag/RagUpload'

const TABS = [
  { key: 'chat', label: 'AI 对话', icon: ChatIcon },
  { key: 'rag', label: '知识库管理', icon: FolderIcon },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('chat')

  return (
    <div className="h-dvh bg-[#1e1e2e] flex items-center justify-center sm:p-4">
      <div className="w-full h-full sm:max-w-4xl sm:h-[90vh] bg-[#2a2a3c] sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">

        {/* Header with tabs */}
        <header className="px-6 py-4 border-b border-white/10 flex items-center gap-1 shrink-0">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white text-sm font-bold mr-3">
            AI
          </div>
          {TABS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === key
                  ? 'bg-white/10 text-white'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
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
