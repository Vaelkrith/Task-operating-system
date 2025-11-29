'use client'

import Link from 'next/link'
import { ArrowRight, Zap, Calendar, BarChart3, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Home() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: 'easeOut' },
    },
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-900/10 to-black relative overflow-hidden flex flex-col">

      {/* Animated Background Elements */}
      <div className="fixed inset-0 -z-10 pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      {/* Hero Section */}
      <section className="flex-1 flex items-center justify-center px-4 py-20 relative">
        <motion.div
          className="max-w-5xl mx-auto text-center relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Badge */}
          <motion.div variants={itemVariants} className="mb-8 flex justify-center">
            <div className="badge-premium">
              <Sparkles className="w-4 h-4" />
              <span>Powered by Advanced AI Agents</span>
            </div>
          </motion.div>

          {/* Hero Title */}
          <motion.div variants={itemVariants}>
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 leading-tight">
              <span className="gradient-text">
                Optimize Your
              </span>
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400">
                Campus Day
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-xl md:text-2xl text-white/60 mb-12 max-w-2xl mx-auto leading-relaxed font-light"
          >
            AI-powered schedule generation that adapts to your classes, goals, and study preferences. 
            <span className="text-white font-semibold"> Make every moment count.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col md:flex-row gap-4 justify-center mb-16"
          >
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
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20"
          >
            {features.map((feature, idx) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={idx}
                  className="card-premium group"
                  whileHover={{ y: -8 }}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                >
                  <div className="mb-4 flex justify-center">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${feature.color} shadow-2xl shadow-blue-500/20`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-cyan-400 transition-colors">{feature.title}</h3>
                  <p className="text-white/60 text-sm leading-relaxed group-hover:text-white/80 transition-colors">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-6 mt-20 max-w-2xl mx-auto"
          >
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
          </motion.div>
        </motion.div>
      </section>

      {/* Footer CTA */}
      <motion.section 
        className="relative py-20 px-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
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
      </motion.section>
    </div>
  )
}
