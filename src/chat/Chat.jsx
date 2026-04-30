import { useState, useRef, useEffect, useCallback } from 'react'
import ChatMessage from './components/ChatMessage'
import ResizableTextarea from './components/ResizableTextarea'
import { streamChat } from './api'

const WELCOME_MSG = { role: 'assistant', content: '你好，有什么可以帮你的？' }

export default function Chat() {
  const [messages, setMessages] = useState([WELCOME_MSG])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)

  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // ---- scroll ----
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, streaming, scrollToBottom])

  // ---- stream ----
  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text || isStreaming) return

    setMessages((prev) => [...prev, { role: 'user', content: text }])
    setInput('')
    setIsStreaming(true)
    setStreaming('')

    let fullContent = ''

    try {
      for await (const chunk of streamChat(text)) {
        fullContent += chunk
        setStreaming(fullContent)
        await new Promise((r) => setTimeout(r, 20))
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: fullContent }])
      setStreaming('')
      setIsStreaming(false)
      inputRef.current?.focus()
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: fullContent || '请求失败，请重试。' },
      ])
      setStreaming('')
      setIsStreaming(false)
    }
  }, [input, isStreaming])

  // ---- keyboard ----
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSend()
      }
    },
    [handleSend],
  )

  // ---- render ----
  return (
    <>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} role={msg.role} content={msg.content} />
          ))}
          {isStreaming && streaming && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                AI
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed max-w-[85%]">
                <span className="text-gray-200 whitespace-pre-wrap">{streaming}</span>
                <span className="inline-block w-0.5 h-4 bg-violet-500 ml-0.5 align-middle animate-pulse" />
              </div>
            </div>
          )}
          {isStreaming && !streaming && (
            <div className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                AI
              </div>
              <div className="bg-white/5 rounded-2xl rounded-tl-sm px-4 py-3">
                <span className="inline-block w-2 h-2 bg-violet-400 rounded-full animate-bounce mr-1" />
                <span className="inline-block w-2 h-2 bg-violet-400 rounded-full animate-bounce mr-1" style={{ animationDelay: '0.15s' }} />
                <span className="inline-block w-2 h-2 bg-violet-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-6 py-4 border-t border-white/10 shrink-0">
          <div className="flex gap-3 items-end">
            <ResizableTextarea
              value={input}
              onChange={setInput}
              onKeyDown={handleKeyDown}
              placeholder="输入消息..."
              inputRef={inputRef}
            />
            <button
              onClick={handleSend}
              disabled={isStreaming || !input.trim()}
              className="w-10 h-10 rounded-xl bg-violet-600 hover:bg-violet-700 text-white flex items-center justify-center shrink-0 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <p className="text-gray-500 text-xs mt-2 text-center">
            Enter 发送，Shift+Enter 换行
          </p>
        </div>

    </>
  )
}
