"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

export default function Dashboard() {
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('access_token')
    if (!token) {
      router.push('/login')
      return
    }
    setLoading(false)
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
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  const features = [
    {
      title: "Smart Optimizer",
      description: "Let AI optimize your schedule intelligently",
      icon: "⚡",
      href: "/optimizer",
      color: "from-blue-500 to-blue-600"
    },
    {
      title: "Schedule History",
      description: "View and manage all your generated schedules",
      icon: "📋",
      href: "/schedule-history",
      color: "from-purple-500 to-purple-600"
    },
    {
      title: "Preferences",
      description: "Customize your optimization preferences",
      icon: "⚙️",
      href: "/settings",
      color: "from-green-500 to-green-600"
    }
  ]

  return (
    <>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-900 dark:to-purple-900 text-white py-12">
        <div className="container">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Welcome Back</h1>
          <p className="text-blue-100">Smart Campus Day Optimizer</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-12">
        <div className="mb-12">
          <h2 className="section-title">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <Link key={feature.href} href={feature.href}>
                <div className="card hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                  <div className="card-body">
                    <div className={`inline-flex items-center justify-center w-14 h-14 rounded-lg bg-gradient-to-r ${feature.color} text-white text-2xl mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="subsection-title">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                  </div>
                  <div className="card-footer justify-between items-center">
                    <span className="text-blue-600 dark:text-blue-400 font-semibold">Get Started</span>
                    <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="card-body">
              <h3 className="subsection-title">How It Works</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="badge badge-primary mt-0.5">1</span>
                  <span className="text-gray-700 dark:text-gray-300">Input your tasks, classes, and preferences</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="badge badge-primary mt-0.5">2</span>
                  <span className="text-gray-700 dark:text-gray-300">AI analyzes and optimizes your schedule</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="badge badge-primary mt-0.5">3</span>
                  <span className="text-gray-700 dark:text-gray-300">Get a perfectly balanced daily schedule</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h3 className="subsection-title">Features</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">AI-Powered Optimization</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Smart Break Allocation</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Schedule History</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-gray-700 dark:text-gray-300">Dark Mode Support</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

