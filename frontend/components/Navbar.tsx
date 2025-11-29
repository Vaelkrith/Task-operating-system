'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Sun, Moon, LogOut } from 'lucide-react'
import { useTheme } from 'next-themes'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('access_token'))
    }
  }, [])

  const logout = () => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_id')
    setToken(null)
    setIsOpen(false)
    router.push('/login')
  }

  const isActive = (href: string) => pathname === href

  const navLinks = token
    ? [
        { href: '/dashboard', label: 'Dashboard' },
        { href: '/optimizer', label: 'Optimizer' },
        { href: '/schedule-history', label: 'History' },
        { href: '/settings', label: 'Settings' },
      ]
    : []

  if (!mounted) return null

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/10 shadow-2xl shadow-purple-500/10">
      <div className="container">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group"
          >
            <div className="text-2xl font-black gradient-text group-hover:scale-110 transition-transform duration-300">
              SmartCampus
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {token && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 font-semibold transition-all duration-300 group ${
                  isActive(link.href)
                    ? 'text-cyan-400'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {link.label}
                {isActive(link.href) ? (
                  <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-purple-500 via-cyan-500 to-purple-500 rounded-full animate-glow-pulse" />
                ) : (
                  <span className="absolute bottom-1 left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-xl hover:bg-white/10 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-yellow-400" />
              ) : (
                <Moon className="w-5 h-5 text-purple-400" />
              )}
            </button>

            {/* Auth Buttons */}
            {token ? (
              <button
                onClick={logout}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-red-500/50"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block px-4 py-2 text-white hover:text-cyan-400 font-semibold transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="hidden md:block btn-premium"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              {isOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t border-white/10 py-4 px-4 space-y-2 animate-slide-up">
            {token && navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  isActive(link.href)
                    ? 'bg-gradient-to-r from-purple-600/40 to-cyan-600/40 text-cyan-400'
                    : 'text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}

            {token && (
              <button
                onClick={() => {
                  logout()
                  setIsOpen(false)
                }}
                className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
