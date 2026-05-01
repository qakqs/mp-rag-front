export const inputClass =
  'w-full bg-pip-green-dim/10 border border-pip-border rounded-xl px-4 py-3 text-pip-text text-sm placeholder-pip-text-dim/50 outline-none focus:border-pip-green/50 focus:ring-1 focus:ring-pip-green/30 transition-all pip-input-glow'

export const btnClass =
  'w-full py-3 rounded-xl bg-pip-green hover:bg-[#00cc33] text-pip-bg font-medium text-sm transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 pip-glow'

export async function runAsync(setState, apiCall, { successMsg, errorMsg = '操作失败', onSuccess }) {
  setState((p) => ({ ...p, loading: true, result: null }))
  try {
    const res = await apiCall()
    if (res?.code === '0000') {
      setState((p) => ({ ...p, loading: false, result: { type: 'success', msg: successMsg } }))
      onSuccess?.()
    } else {
      setState((p) => ({ ...p, loading: false, result: { type: 'error', msg: res?.info || errorMsg } }))
    }
  } catch {
    setState((p) => ({ ...p, loading: false, result: { type: 'error', msg: '网络请求失败，请检查后端服务是否正常。' } }))
  }
}

export const UPLOAD_ICON = (
  <svg className="w-5 h-5 text-pip-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
  </svg>
)

export const FILE_ICON = (
  <svg className="w-4 h-4 text-pip-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
)

export const REPO_ICON = (
  <svg className="w-4 h-4 text-pip-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
      d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
  </svg>
)
