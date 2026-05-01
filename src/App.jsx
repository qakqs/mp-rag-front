import { useState, useCallback } from 'react'
import Chat from './chat/Chat'
import RagUpload from './rag/RagUpload'
import CrtOverlay from './components/CrtOverlay'

const CHAT_ICON = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
)

const FOLDER_ICON = (
  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
)

const TABS = [
  { key: 'chat', label: '对话', icon: CHAT_ICON },
  { key: 'rag', label: '知识库管理', icon: FOLDER_ICON },
]

export default function App() {
  const [activeTab, setActiveTab] = useState('chat')
  const [wipe, setWipe] = useState(false)

  const switchTab = useCallback((key) => {
    if (key === activeTab) return
    setWipe(true)
    setTimeout(() => {
      setActiveTab(key)
      setTimeout(() => setWipe(false), 150)
    }, 150)
  }, [activeTab])

  return (
    <div className="h-dvh bg-pip-bg flex items-center justify-center sm:p-4 animate-flicker">
      <CrtOverlay />
      <div className="crt-vignette" />

      <div className="w-full h-full sm:max-w-6xl sm:h-[90vh] bg-pip-panel sm:rounded-2xl pip-box-glow animate-bloom flex flex-col overflow-hidden border border-pip-border relative">

        <header className="px-6 py-3 border-b border-pip-border flex items-center gap-1 shrink-0 bg-pip-green-dim/10">
          <div className="flex items-center gap-3 mr-4">
            <div className="relative">
              <div className="w-9 h-9 rounded-full border-2 border-vault-yellow flex items-center justify-center bg-vault-blue shadow-[0_0_12px_rgba(0,102,179,0.4)]">
                <span className="text-vault-yellow text-[10px] font-bold font-[Georgia,serif]">VT</span>
              </div>
              <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-1 bg-vault-yellow rounded-full opacity-60" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-vault-yellow text-[11px] font-bold tracking-[0.15em] font-[Georgia,serif] pip-glow-amber">
                VAULT-TEC
              </span>
              <span className="text-pip-green text-[10px] tracking-[0.2em] opacity-70">
                PIP-OS v4.0
              </span>
            </div>
          </div>

          <div className="w-px h-8 bg-pip-border mx-1" />

          {TABS.map(({ key, label, icon }) => (
            <button
              key={key}
              onClick={() => switchTab(key)}
              className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs tracking-wider transition-all duration-200 border ${
                activeTab === key
                  ? 'bg-pip-green/12 text-pip-green pip-glow border-pip-green/30 shadow-[0_0_10px_rgba(26,255,78,0.1)]'
                  : 'text-pip-text-dim border-transparent hover:text-pip-green hover:bg-pip-green-dim/30 hover:border-pip-border'
              }`}
            >
              {icon}
              {label}
            </button>
          ))}

          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-pip-green animate-pulse shadow-[0_0_6px_rgba(26,255,78,0.8)]" />
            <span className="text-pip-text-dim text-[10px] tracking-wider">SYS.ONLINE</span>
          </div>
        </header>

        <div className="flex-1 flex flex-col relative overflow-hidden">
          {wipe && (
            <div className="crt-wipe-overlay">
              <div className="crt-wipe-line" />
              <div className="crt-wipe-screen bg-pip-panel" />
            </div>
          )}
          {activeTab === 'chat' ? <Chat /> : <RagUpload />}
        </div>

        <footer className="px-6 py-1.5 border-t border-pip-border flex items-center gap-4 text-[10px] text-pip-text-dim tracking-wider shrink-0 bg-pip-green-dim/5">
          <span>MEM: 64K</span>
          <span className="w-px h-3 bg-pip-border" />
          <span>SIG: 97%</span>
          <span className="w-px h-3 bg-pip-border" />
          <span>RAD: 0.14/h</span>
          <span className="ml-auto">PIP-BOY 3000 MK IV</span>
        </footer>
      </div>
    </div>
  )
}
