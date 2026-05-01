import { useState, useRef, useEffect, useCallback } from 'react'
import ChatMessage from './components/ChatMessage'
import ResizableTextarea from './components/ResizableTextarea'
import { streamChat } from './api'

const WELCOME_MSG = {
  role: 'assistant',
  content: 'Vault-Tec 终端系统已就绪。有什么可以帮你的，监督者？',
}

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const messagesEndRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: isStreaming ? 'auto' : 'smooth' })
  }, [messages, streaming, isStreaming])

  const handleSend = useCallback(async () => {
    const text = textareaRef.current?.value?.trim()
    if (!text || isStreaming) return

    const userMsg = { role: 'user', content: text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setIsStreaming(true)
    setStreaming('')

    let fullContent = ''
    try {
      for await (const chunk of streamChat(text)) {
        fullContent += chunk
        setStreaming(fullContent)
      }
      setMessages((prev) => [...prev, { role: 'assistant', content: fullContent }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fullContent || '请求失败，请重试。' },
      ])
    } finally {
      setStreaming('')
      setIsStreaming(false)
      textareaRef.current?.focus()
    }
  }, [isStreaming])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
        {isStreaming && (
          <ChatMessage
            role="assistant"
            content={streaming}
            isStreaming
          />
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="px-6 py-4 border-t border-pip-border shrink-0">
        <div className="flex gap-3 items-end">
          <ResizableTextarea
            value={input}
            onChange={setInput}
            onKeyDown={handleKeyDown}
            placeholder="输入消息..."
            textareaRef={textareaRef}
          />
          <button
            onClick={handleSend}
            disabled={isStreaming || !input.trim()}
            className="w-10 h-10 rounded-xl bg-pip-green hover:bg-[#00cc33] text-pip-bg flex items-center justify-center shrink-0 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        <p className="text-pip-text-dim text-xs mt-2 text-center">
          Enter 发送，Shift+Enter 换行
        </p>
      </div>
    </>
  )
}
