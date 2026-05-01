const CHECK_PATH = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
const ERR_PATH = <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />

export default function ResultBanner({ result }) {
  if (!result) return null
  const ok = result.type === 'success'
  return (
    <div className={`rounded-xl px-4 py-3 text-sm flex items-center gap-2 border ${
      ok ? 'bg-pip-green/10 border-pip-green/30 text-pip-green' : 'bg-red-500/10 border-red-500/20 text-red-400'
    }`}>
      <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {ok ? CHECK_PATH : ERR_PATH}
      </svg>
      {result.msg}
    </div>
  )
}
