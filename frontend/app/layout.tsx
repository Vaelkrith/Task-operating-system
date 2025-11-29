import React from "react"
import "../styles/globals.css"
import Providers from "../components/Providers"
import AnimatedBackground from "../components/AnimatedBackground"

export const metadata = {
  title: "Smart Campus Day Optimizer",
  description: "AI-powered schedule optimization for students",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-black text-white">
        <Providers>
          <AnimatedBackground />
          <main className="min-h-screen relative z-10">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}

