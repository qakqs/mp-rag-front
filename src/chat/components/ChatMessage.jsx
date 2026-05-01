import { memo } from 'react'

const DOT = 'w-2 h-2 bg-pip-green rounded-full animate-bounce shadow-[0_0_6px_rgba(26,255,78,0.6)]'
const CURSOR = 'inline-block w-2 h-[14px] bg-pip-green ml-0.5 align-middle animate-pulse shadow-[0_0_6px_rgba(26,255,78,0.6)]'

export default memo(function ChatMessage({ role, content, isStreaming }) {
  const isUser = role === 'user'
  const avatarCls = isUser
    ? 'bg-pip-amber/20 text-pip-amber border-pip-amber/30'
    : 'bg-pip-green/15 text-pip-green border-pip-green/30 animate-glow-pulse'
  const bubbleCls = isUser
    ? 'bg-pip-amber/8 text-pip-amber rounded-tr-sm border-pip-amber/20'
    : 'bg-pip-green-dim/15 text-pip-text rounded-tl-sm border-pip-green/20 shadow-[inset_0_0_8px_rgba(26,255,78,0.03)]'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 border ${avatarCls}`}>
        {isUser ? '我' : 'AI'}
      </div>
      <div className={`rounded-xl px-4 py-3 text-sm leading-relaxed max-w-[85%] whitespace-pre-wrap border ${bubbleCls}`}>
        {!isUser && !isStreaming && (
          <span className="text-pip-green/40 mr-1 select-none">&gt;</span>
        )}
        {isStreaming && !content ? (
          <span className="flex gap-1">
            <span className={DOT} />
            <span className={`${DOT} bounce-delay-1`} />
            <span className={`${DOT} bounce-delay-2`} />
          </span>
        ) : (
          <>
            {content}
            {isStreaming && <span className={CURSOR} />}
          </>
        )}
      </div>
    </div>
  )
})
