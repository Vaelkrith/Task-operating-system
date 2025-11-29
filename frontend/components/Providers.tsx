"use client"
import React from "react"
import { ThemeProvider } from "next-themes"
import Navbar from "./Navbar"

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <div>
        <Navbar />
        {children}
      </div>
    </ThemeProvider>
  )
}
