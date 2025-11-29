'use client'

import React from 'react'
import { CheckCircle2, Coffee, BookOpen, Clock } from 'lucide-react'

export default function ScheduleTable({ schedule }: { schedule: any }) {
  if (!schedule) return (
    <div className="text-center py-8">
      <p className="text-white/60">No schedule available</p>
    </div>
  )

  const blocks = schedule.blocks || []
  if (blocks.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No blocks in schedule</p>
      </div>
    )
  }

  const getBlockColor = (type: string) => {
    switch (type) {
      case 'task': return 'from-blue-600/30 to-blue-600/10'
      case 'break': return 'from-green-600/30 to-green-600/10'
      case 'class': return 'from-purple-600/30 to-purple-600/10'
      default: return 'from-cyan-600/30 to-cyan-600/10'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'task': return <CheckCircle2 className="w-5 h-5" />
      case 'break': return <Coffee className="w-5 h-5" />
      case 'class': return <BookOpen className="w-5 h-5" />
      default: return <Clock className="w-5 h-5" />
    }
  }

  const getAccentColor = (type: string) => {
    switch (type) {
      case 'task': return 'from-blue-500 to-blue-300'
      case 'break': return 'from-green-500 to-green-300'
      case 'class': return 'from-purple-500 to-purple-300'
      default: return 'from-cyan-500 to-cyan-300'
    }
  }

  return (
    <div className="space-y-4">
      {blocks.map((b: any, i: number) => (
        <div
          key={i}
          className="glass border-l-4 border-gradient p-4 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 group animate-fade-in-up"
          style={{
            borderLeftColor: ['#3b82f6', '#10b981', '#a855f7', '#06b6d4'][
              ['task', 'break', 'class'].indexOf(b.type) + 1 || 0
            ],
            animationFillMode: 'forwards',
            opacity: 0,
            animationDelay: `${i * 100}ms`
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${getBlockColor(b.type)} group-hover:scale-110 transition-transform`}>
                <div className={`text-transparent bg-clip-text bg-gradient-to-r ${getAccentColor(b.type)}`}>
                  {getTypeIcon(b.type)}
                </div>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white group-hover:text-cyan-300 transition-colors">
                  {b.title}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-white/60 text-sm">
                  <Clock className="w-4 h-4" />
                  <span>{b.start} - {b.end}</span>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold badge-premium capitalize`}>
                {b.type}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}