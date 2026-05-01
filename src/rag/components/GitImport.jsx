import { useCallback } from 'react'
import { analyzeGitRepository } from '../api'
import { runAsync, inputClass, btnClass, REPO_ICON } from '../shared'
import ResultBanner from './ResultBanner'
import ProgressBar from '../../components/ProgressBar'

export default function GitImport({ git, setGit, loadTags }) {
  const updateGit = useCallback((k) => (e) => setGit((p) => ({ ...p, [k]: e.target.value })), [setGit])

  const handleImport = useCallback(async () => {
    const { url, user, token, loading } = git
    const u = url.trim(); const un = user.trim(); const tk = token.trim()
    if (!u || !un || !tk || loading) return
    await runAsync(setGit, () => analyzeGitRepository(u, un, tk), {
      successMsg: 'Git 仓库导入成功',
      onSuccess: () => { setGit((p) => ({ ...p, url: '', user: '', token: '' })); loadTags() },
    })
  }, [git, setGit, loadTags])

  return (
    <div className="space-y-4">
      <label className="block text-pip-text text-sm font-medium pip-glow flex items-center gap-2">
        {REPO_ICON}
        导入 Git 仓库
      </label>

      <input
        type="text"
        value={git.url}
        onChange={updateGit('url')}
        placeholder="仓库地址，如 https://github.com/user/repo.git"
        className={inputClass}
      />
      <div className="flex gap-3">
        <input
          type="text"
          value={git.user}
          onChange={updateGit('user')}
          placeholder="用户名"
          className={`flex-1 ${inputClass}`}
        />
        <input
          type="password"
          value={git.token}
          onChange={updateGit('token')}
          placeholder="Access Token"
          className={`flex-1 ${inputClass}`}
        />
      </div>

      <ResultBanner result={git.result} />

      {git.loading && <ProgressBar label="正在克隆仓库并导入知识库..." />}
      <button
        type="button"
        onClick={handleImport}
        disabled={!git.url.trim() || !git.user.trim() || !git.token.trim() || git.loading}
        className={btnClass}
      >
        {git.loading ? '导入中...' : <>{REPO_ICON}开始导入</>}
      </button>
    </div>
  )
}
