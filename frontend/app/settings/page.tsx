"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "../../lib/api"

export default function Settings() {
  const [prefs, setPrefs] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | null>(null)
  const [advanced, setAdvanced] = useState(false)
  const [entries, setEntries] = useState<Array<{key: string; type: string; value: string}>>([])
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) router.push('/login')
  }, [router])

  useEffect(() => {
    // derive entries from prefs for structured editor
    const keys = Object.keys(prefs || {})
    if (keys.length === 0) {
      setEntries([])
      return
    }
    const e = keys.map(k => {
      const v = prefs[k]
      const t = typeof v
      return { key: k, type: t === 'number' ? 'number' : t === 'boolean' ? 'boolean' : 'string', value: String(v) }
    })
    setEntries(e)
  }, [prefs])

  async function save() {
    setMessage("")
    setLoading(true)
    try {
      const payload = { user_id: localStorage.getItem('user_id') || 'anon', prefs }
      await api.post('/user/preferences', payload)
      setMessageType("success")
      setMessage("✓ Preferences saved successfully!")
      setTimeout(() => setMessage(""), 3000)
    } catch (err: any) {
      setMessageType("error")
      setMessage(err?.response?.data?.detail || 'Failed to save preferences')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-900 dark:to-indigo-900 text-white py-12 mb-8">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Settings</h1>
          <p className="text-blue-100">Manage your optimization preferences</p>
        </div>
      </div>

      <div className="container pb-12">
        <div className="max-w-2xl">
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-bold">⚙️ Optimization Preferences</h2>
            </div>

            <div className="card-body space-y-6">
              {message && (
                <div className={`p-4 rounded-lg flex items-start gap-3 ${
                  messageType === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                }`}>
                  <svg className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                    messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                  }`} fill="currentColor" viewBox="0 0 20 20">
                    {messageType === 'success' ? (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    ) : (
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    )}
                  </svg>
                  <span className={messageType === 'success' ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                    {message}
                  </span>
                </div>
              )}

              <div className="form-group">
                <div className="flex items-center justify-between">
                  <label className="form-label">Preferences</label>
                  <div className="flex items-center gap-3">
                    <label className="text-sm text-white/70">Advanced JSON</label>
                    <input type="checkbox" checked={advanced} onChange={e => setAdvanced(e.target.checked)} className="w-4 h-4" />
                  </div>
                </div>

                {!advanced ? (
                  <div className="space-y-3">
                    {entries.map((it, idx) => (
                      <div key={idx} className="grid grid-cols-12 gap-2 items-center">
                        <input className="col-span-4 input-field" value={it.key} onChange={e => {
                          const copy = [...entries]
                          copy[idx].key = e.target.value
                          setEntries(copy)
                        }} />
                        <select className="col-span-3 input-field" value={it.type} onChange={e => {
                          const copy = [...entries]
                          copy[idx].type = e.target.value
                          setEntries(copy)
                        }}>
                          <option value="string">string</option>
                          <option value="number">number</option>
                          <option value="boolean">boolean</option>
                        </select>
                        <input className="col-span-4 input-field" value={it.value} onChange={e => {
                          const copy = [...entries]
                          copy[idx].value = e.target.value
                          setEntries(copy)
                        }} />
                        <button type="button" className="col-span-1 btn-danger" onClick={() => setEntries(entries.filter((_, i) => i !== idx))}>✕</button>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <button type="button" className="btn-secondary" onClick={() => setEntries([...entries, { key: '', type: 'string', value: '' }])}>+ Add Field</button>
                      <button type="button" className="btn-premium-secondary" onClick={() => {
                        // sync entries back to prefs
                        const obj: any = {}
                        entries.forEach(en => {
                          if (!en.key) return
                          if (en.type === 'number') obj[en.key] = Number(en.value)
                          else if (en.type === 'boolean') obj[en.key] = en.value === 'true' || en.value === '1'
                          else obj[en.key] = en.value
                        })
                        setPrefs(obj)
                      }}>Apply</button>
                    </div>
                    <div>
                      <label className="text-xs text-white/60">Preview (read-only)</label>
                      <pre className="bg-black/30 p-3 rounded-md font-mono text-sm mt-2">{JSON.stringify(prefs, null, 2)}</pre>
                    </div>
                  </div>
                ) : (
                  <textarea
                    rows={10}
                    value={JSON.stringify(prefs, null, 2)}
                    onChange={e => {
                      try {
                        setPrefs(JSON.parse(e.target.value))
                      } catch {
                        // allow typing
                      }
                    }}
                    className="input-field font-mono text-sm"
                    placeholder='{"max_study_hours": 8, "break_ratio": 0.2, "preferred_study_style": "balanced"}'
                    disabled={loading}
                  />
                )}
              </div>

              <div className="card-footer justify-between items-center bg-gray-50 dark:bg-gray-800/50 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Auto-saved preferences apply to all future schedules
                </p>
                <button
                  onClick={save}
                  disabled={loading}
                  className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <span className="loading-spinner">⟳</span>}
                  {loading ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </div>
          </div>

          {/* Info Card */}
          <div className="card mt-6">
            <div className="card-body">
              <h3 className="subsection-title">💡 Preference Tips</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-lg">📝</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">Study Style</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Choose between 'balanced', 'intense', or 'relaxed' optimization</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">⏱️</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">Break Ratio</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Control the proportion of breaks (0.0-1.0)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-lg">🎯</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-50">Focus Priority</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Set your learning priorities and constraints</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
