export default function ChatMessage({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5 ${
          isUser ? 'bg-gray-500' : 'bg-violet-600'
        }`}
      >
        {isUser ? '我' : 'AI'}
      </div>
      <div
        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap ${
          isUser
            ? 'bg-violet-600 text-white rounded-tr-sm'
            : 'bg-white/5 text-gray-200 rounded-tl-sm'
        }`}
      >
        {content}
      </div>
    </div>
  )
}
