'use client'

import React, { useState } from 'react'
import { ChevronDown, Search, ListTodo, Clock, CheckCircle } from 'lucide-react'

export default function AgentLogs({ logs }: { logs: any[] }) {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())

  if (!logs || logs.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No agent logs available</p>
      </div>
    )
  }

  const getAgentIcon = (agent: string) => {
    switch (agent.toLowerCase()) {
      case 'extractor': return <Search className="w-5 h-5 text-blue-400" />
      case 'planner': return <ListTodo className="w-5 h-5 text-purple-400" />
      case 'scheduler': return <Clock className="w-5 h-5 text-green-400" />
      case 'validator': return <CheckCircle className="w-5 h-5 text-orange-400" />
      default: return <CheckCircle className="w-5 h-5 text-cyan-400" />
    }
  }

  const getAccentColor = (agent: string) => {
    switch (agent.toLowerCase()) {
      case 'extractor': return 'from-blue-600/30 to-blue-600/10'
      case 'planner': return 'from-purple-600/30 to-purple-600/10'
      case 'scheduler': return 'from-green-600/30 to-green-600/10'
      case 'validator': return 'from-orange-600/30 to-orange-600/10'
      default: return 'from-cyan-600/30 to-cyan-600/10'
    }
  }

  const toggleExpanded = (idx: number) => {
    const newExpanded = new Set(expanded)
    if (newExpanded.has(idx)) {
      newExpanded.delete(idx)
    } else {
      newExpanded.add(idx)
    }
    setExpanded(newExpanded)
  }

  return (
    <div className="space-y-3">
      {logs.map((log, idx) => (
        <div
          key={idx}
          className="timeline-item animate-fade-in-up"
          style={{ animationFillMode: 'forwards', opacity: 0, animationDelay: `${idx * 100}ms` }}
        >
          <div
            className={`glass border-l-4 cursor-pointer group hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1`}
            onClick={() => log.detail && toggleExpanded(idx)}
            style={{
              borderLeftColor: ['#3b82f6', '#a855f7', '#10b981', '#f97316']['extractor planner scheduler validator'.indexOf(log.agent.toLowerCase()) || 0],
            }}
          >
            <div className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${getAccentColor(log.agent)} mt-0.5`}>
                    {getAgentIcon(log.agent)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {log.agent}
                    </h4>
                    <p className="text-sm text-white/70 mt-1">{log.message}</p>
                    
                    <div 
                      className="transition-all duration-500 ease-in-out overflow-hidden"
                      style={{ maxHeight: expanded.has(idx) ? '500px' : '0px' }}
                    >
                      {log.detail && (
                        <div className="mt-3 p-3 bg-black/30 rounded-lg font-mono text-xs text-cyan-300 overflow-auto max-h-48 border border-purple-500/30">
                          {typeof log.detail === 'string'
                            ? log.detail
                            : JSON.stringify(log.detail, null, 2)}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {log.detail && (
                  <button
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleExpanded(idx)
                    }}
                  >
                    <ChevronDown className={`w-5 h-5 text-white/60 transition-transform duration-300 ${expanded.has(idx) ? 'rotate-180' : ''}`} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}