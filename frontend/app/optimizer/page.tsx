"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "../../lib/api"
import ScheduleTable from "../../components/ScheduleTable"
import AgentLogs from "../../components/AgentLogs"

export default function OptimizerPage() {
  const [classes, setClasses] = useState<Array<{title:string,start:string,end:string}>>([{ title: "Math", start: "09:00", end: "10:00" }])
  const [goals, setGoals] = useState<string[]>(["Finish assignment", "Review notes"])
  const [wakeTime, setWakeTime] = useState<string>("07:00")
  const [availableMinutes, setAvailableMinutes] = useState<number>(240)
  const [studyStyle, setStudyStyle] = useState<string>("balanced")
  const [schedule, setSchedule] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) router.push('/login')
  }, [router])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const payload = {
        user_id: localStorage.getItem('user_id') || 'anon',
        classes: classes,
        goals: goals,
        available_minutes: availableMinutes,
        study_style: studyStyle,
        wake_time: wakeTime,
      }
      const res = await api.post('/optimize', payload)
      setSchedule(res.data?.schedule)
      setLogs(res.data?.agent_logs || [])
    } catch (err: any) {
      setError(err?.response?.data?.detail || err?.message || 'Optimization failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/20 to-black relative overflow-hidden">

      {/* Header Section */}
      <div className="relative py-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-cyan-600/10 to-purple-600/20 blur-3xl -z-10" />
        
        <div className="container animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-black gradient-text mb-3">
            Schedule Optimizer
          </h1>
          <p className="text-xl text-white/60 font-light">
            AI-powered schedule creation tailored to your lifestyle
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container pb-20 px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="card-premium sticky top-24">
              <div className="card-header">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center">
                  ⚙️
                </div>
                <h2 className="text-xl font-bold">Configuration</h2>
              </div>
              <div className="card-body space-y-6">
                {error && (
                  <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-xl text-red-300 text-sm flex items-start gap-3 animate-fade-in">
                    <span className="mt-0.5">⚠️</span>
                    <span>{error}</span>
                  </div>
                )}
                
                <form onSubmit={submit} className="space-y-6">
                  {/* Classes */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <span className="text-cyan-400">📚</span>
                      Classes
                    </label>
                    <div className="space-y-3">
                      {classes.map((c, idx) => (
                        <div key={idx} className="p-4 glass rounded-xl border border-purple-500/30 group hover:border-purple-500/60 transition-all duration-300">
                          <div className="grid grid-cols-1 gap-3 mb-3">
                            <div>
                              <label className="form-label text-xs">Subject Title</label>
                              <input 
                                type="text" 
                                value={c.title} 
                                onChange={e => {
                                  const copy = [...classes]
                                  copy[idx] = { ...copy[idx], title: e.target.value }
                                  setClasses(copy)
                                }} 
                                placeholder="e.g., Mathematics"
                                className="input-premium"
                                disabled={loading}
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="form-label text-xs">Start Time</label>
                              <input 
                                type="time" 
                                value={c.start} 
                                onChange={e => {
                                  const copy = [...classes]
                                  copy[idx] = { ...copy[idx], start: e.target.value }
                                  setClasses(copy)
                                }} 
                                className="input-premium"
                                disabled={loading}
                              />
                            </div>
                            <div>
                              <label className="form-label text-xs">End Time</label>
                              <input 
                                type="time" 
                                value={c.end} 
                                onChange={e => {
                                  const copy = [...classes]
                                  copy[idx] = { ...copy[idx], end: e.target.value }
                                  setClasses(copy)
                                }} 
                                className="input-premium"
                                disabled={loading}
                              />
                            </div>
                          </div>
                          <button 
                            type="button" 
                            onClick={() => setClasses(classes.filter((_, i) => i !== idx))}
                            className="btn-danger w-full mt-3"
                            disabled={loading}
                          >
                            Remove Class
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => setClasses([...classes, { title: "", start: "09:00", end: "10:00" }])}
                        className="btn-secondary w-full"
                        disabled={loading}
                      >
                        + Add Class
                      </button>
                      <p className="text-xs text-white/50">Add your classes with start/end times</p>
                    </div>
                  </div>

                  {/* Goals */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <span className="text-cyan-400">🎯</span>
                      Goals
                    </label>
                    <div className="space-y-2">
                      {goals.map((g, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                          <input 
                            type="text" 
                            value={g} 
                            onChange={e => {
                              const copy = [...goals]
                              copy[idx] = e.target.value
                              setGoals(copy)
                            }} 
                            placeholder="Your goal..."
                            className="input-premium flex-1"
                            disabled={loading}
                          />
                          <button 
                            type="button" 
                            onClick={() => setGoals(goals.filter((_, i) => i !== idx))}
                            className="btn-danger"
                            disabled={loading}
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <button 
                        type="button" 
                        onClick={() => setGoals([...goals, ""]) }
                        className="btn-secondary w-full"
                        disabled={loading}
                      >
                        + Add Goal
                      </button>
                      <p className="text-xs text-white/50">Define actionable study goals</p>
                    </div>
                  </div>
                  
                  {/* Wake Time */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <span>⏰</span>
                      Wake Time
                    </label>
                    <input
                      type="time"
                      value={wakeTime}
                      onChange={e => setWakeTime(e.target.value)}
                      className="input-premium"
                      disabled={loading}
                    />
                  </div>
                  
                  {/* Available Minutes */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <span>⏱️</span>
                      Available Minutes
                    </label>
                    <input
                      type="number"
                      value={availableMinutes}
                      onChange={e => setAvailableMinutes(Number(e.target.value))}
                      className="input-premium"
                      min="30"
                      max="1440"
                      disabled={loading}
                    />
                    <p className="text-xs text-white/50 mt-1">{Math.floor(availableMinutes / 60)}h {availableMinutes % 60}m</p>
                  </div>
                  
                  {/* Study Style */}
                  <div className="form-group">
                    <label className="form-label flex items-center gap-2">
                      <span>🧠</span>
                      Study Style
                    </label>
                    <select
                      value={studyStyle}
                      onChange={e => setStudyStyle(e.target.value)}
                      className="input-premium"
                      disabled={loading}
                    >
                      <option value="balanced">🎯 Balanced</option>
                      <option value="intense">⚡ Intense</option>
                      <option value="relaxed">😌 Relaxed</option>
                    </select>
                  </div>
                  
                  {/* Generate Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full font-bold py-4 text-lg flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 group"
                  >
                    <span className={loading ? "animate-spin-slow" : ""}>✨</span>
                    <span>{loading ? "Optimizing..." : "Generate Schedule"}</span>
                  </button>
                </form>
              </div>
            </div>
          </div>
          
          {/* Results Panel */}
          <div className="lg:col-span-2 space-y-8">
            {/* Schedule */}
            <div className="card-premium animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="card-header">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  📅
                </div>
                <h2 className="text-xl font-bold">Your Optimized Schedule</h2>
              </div>
              <div className="card-body">
                {schedule ? (
                  <ScheduleTable schedule={schedule} />
                ) : (
                  <div className="py-16 text-center">
                    <div className="text-6xl mb-4 animate-float">📆</div>
                    <p className="text-white/50 text-lg">Configure your preferences and click "Generate Schedule"</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Agent Logs */}
            <div className="card-premium animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="card-header">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center">
                  ⚡
                </div>
                <h2 className="text-xl font-bold">AI Agent Pipeline</h2>
              </div>
              <div className="card-body">
                {logs.length > 0 ? (
                  <AgentLogs logs={logs} />
                ) : (
                  <div className="py-16 text-center">
                    <div className="text-6xl mb-4 animate-float">🤖</div>
                    <p className="text-white/50 text-lg">Agent logs will appear here after optimization</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
