"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import api from "../../lib/api"
import Link from "next/link"
import ScheduleTable from "../../components/ScheduleTable"

export default function ScheduleHistory() {
  const [schedules, setSchedules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    
    async function load() {
      try {
        const res = await api.get('/user/schedules')
        setSchedules(res.data?.schedules || [])
      } catch (err: any) {
        setError(err?.response?.data?.detail || 'Failed to load schedules')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin mb-4">
            <svg className="w-12 h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-600 dark:text-gray-400">Loading schedules...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 dark:from-green-900 dark:to-blue-900 text-white py-12 mb-8">
        <div className="container">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-2">Schedule History</h1>
              <p className="text-green-100">View and manage your generated schedules</p>
            </div>
            <Link href="/optimizer" className="btn-primary">
              + Create New
            </Link>
          </div>
        </div>
      </div>

      <div className="container pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {schedules.length === 0 ? (
          <div className="card">
            <div className="card-body py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-3xl mb-4">
                📋
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50 mb-2">No Schedules Yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first optimized schedule to get started</p>
              <Link href="/optimizer" className="btn-primary">
                Create Your First Schedule
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {schedules.map((s: any) => (
              <div key={s._id || s.id} className="card hover:shadow-lg transition-shadow">
                <div
                  className="card-body cursor-pointer"
                  onClick={() => setExpandedId(expandedId === (s._id || s.id) ? null : (s._id || s.id))}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-2xl">📅</span>
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                            {s.blocks?.length || 0} Time Blocks
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Created {new Date(s.created_at || Date.now()).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className="badge badge-primary">{s.agent_logs?.length || 0} agent steps</span>
                      <svg className={`w-5 h-5 text-gray-400 transition-transform ${expandedId === (s._id || s.id) ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    </div>
                  </div>
                </div>

                {expandedId === (s._id || s.id) && (
                  <div className="border-t border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">Schedule Details</h4>
                    <ScheduleTable schedule={s} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
