'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Calendar, BarChart3, Sparkles } from 'lucide-react'
import React from 'react'

const features = [
  {
    icon: Zap,
    title: 'AI-Powered',
    description: 'Advanced algorithms that adapt to your study style and preferences',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Optimized schedules with intelligent break placement and transitions',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Track productivity metrics and improve performance over time',
    color: 'from-purple-500 to-pink-500',
  },
]

// A small utility component for staggered fade-in animations
const AnimatedItem = ({
  children,
  delay,
  className,
}: {
  children: React.ReactNode
  delay: number
  className?: string
}) => (
  <div
    className={`animate-fade-in-up ${className}`}
    style={{ animationFillMode: 'forwards', opacity: 0, animationDelay: `${delay}ms` }}
  >
    {children}
  </div>
)

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black relative overflow-hidden flex flex-col">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <div className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-blob-1" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-blob-2" />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 relative">
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <AnimatedItem delay={200} className="mb-8 flex justify-center">
            <div className="badge-premium">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Agents</span>
            </div>
          </AnimatedItem>

          <AnimatedItem delay={300}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="gradient-text">Optimize Your</span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                Campus Day
              </span>
            </h1>
          </AnimatedItem>

          <AnimatedItem delay={400}>
            <p className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light">
              AI-powered schedule generation that adapts to your classes, goals, and study preferences.{' '}
              <span className="text-white font-semibold">Make every moment count.</span>
            </p>
          </AnimatedItem>

          <AnimatedItem delay={500} className="flex flex-col md:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="btn-premium flex items-center justify-center gap-2 group px-8 py-4 text-lg"
            >
              <span>Get Started Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform duration-300" />
            </Link>
            <Link
              href="/optimizer"
              className="btn-premium-secondary flex items-center justify-center gap-2 px-8 py-4 text-lg"
            >
              <span>Try Demo</span>
              <Sparkles className="w-5 h-5" />
            </Link>
          </AnimatedItem>

          <AnimatedItem delay={600} className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">
            {features.map((feature, idx) => (
              <div key={idx} className="card-premium group">
                <div className="mb-4 flex justify-center">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} shadow-2xl shadow-blue-500/20`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </AnimatedItem>

          <AnimatedItem delay={700} className="grid grid-cols-3 gap-6 mt-20 max-w-2xl mx-auto">
            {[
              { label: 'Students', value: '10K+' },
              { label: 'Schedules', value: '50K+' },
              { label: 'Hours Saved', value: '100K+' },
            ].map((stat, idx) => (
              <div key={idx} className="glass p-6 rounded-2xl text-center hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300">
                <div className="text-3xl font-black gradient-text mb-1">{stat.value}</div>
                <div className="text-sm text-white/60">{stat.label}</div>
              </div>
            ))}
          </AnimatedItem>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="relative py-20 px-4 animate-fade-in-up" style={{ animationFillMode: 'forwards', opacity: 0, animationDelay: '800ms' }}>
        <div className="max-w-4xl mx-auto">
          <div className="glass p-12 rounded-3xl text-center border border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 hover:shadow-2xl hover:shadow-purple-500/20">
            <h2 className="text-4xl md:text-5xl font-black mb-4 gradient-text">
              Ready to Transform Your Schedule?
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already optimizing their academic workflow with SmartCampus.
            </p>
            <Link href="/signup" className="btn-premium px-8 py-4 text-lg inline-flex items-center gap-2 group">
              <span>Start for Free</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}