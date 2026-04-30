export default function ChatMessage({ role, content }) {
  const isUser = role === 'user'
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div
        className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
          isUser
            ? 'bg-pip-amber text-pip-bg'
            : 'bg-pip-green text-pip-bg animate-glow-pulse'
        }`}
      >
        {isUser ? '我' : 'AI'}
      </div>
      <div
        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap border ${
          isUser
            ? 'bg-pip-green/15 text-pip-text rounded-tr-sm border-pip-green/30'
            : 'bg-pip-green-dim/20 text-pip-text rounded-tl-sm border-pip-border'
        }`}
      >
        {content}
      </div>
    </div>
  )
}
