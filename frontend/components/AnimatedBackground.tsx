"use client"

import { useEffect, useRef } from "react"

type Particle = {
  update(): unknown
  draw(ctx: CanvasRenderingContext2D, particleColor: string): unknown
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  opacity: number
}

export default function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1

    const setSize = () => {
      dpr = window.devicePixelRatio || 1
      canvas.width = Math.round(window.innerWidth * dpr)
      canvas.height = Math.round(window.innerHeight * dpr)
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    setSize()

    const particles: Particle[] = []

    class P {
      x = Math.random() * window.innerWidth
      y = Math.random() * window.innerHeight
      vx = (Math.random() - 0.5) * 0.6
      vy = (Math.random() - 0.5) * 0.6
      radius = Math.random() * 2 + 0.6
      opacity = Math.random() * 0.5 + 0.15

      update() {
        this.x += this.vx
        this.y += this.vy
        if (this.x < -10) this.x = window.innerWidth + 10
        if (this.x > window.innerWidth + 10) this.x = -10
        if (this.y < -10) this.y = window.innerHeight + 10
        if (this.y > window.innerHeight + 10) this.y = -10
      }

      draw(ctx: CanvasRenderingContext2D, color: string) {
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // create a modest number of particles for performance
    const PARTICLE_COUNT = Math.max(28, Math.floor(window.innerWidth / 60))
    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new P())

    // theme-aware colors
    const getColors = (isDark: boolean) => {
      if (isDark) {
        return {
          particleRgb: "125,211,252",
          particle: "rgba(125, 211, 252, 0.95)", // sky/cyan
          lineRgb: "163,148,255",
          canvasOpacity: 0.22,
        }
      }
      return {
        particleRgb: "34,211,238",
        particle: "rgba(34, 211, 238, 0.95)", // teal-like for light mode
        lineRgb: "99,102,241",
        canvasOpacity: 0.18,
      }
    }

    const isDark = () => {
      try {
        return document.documentElement.classList.contains("dark") || window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches
      } catch {
        return true
      }
    }

    let { particle: particleColor, lineRgb, particleRgb, canvasOpacity } = getColors(isDark())

    // Observe theme class changes on <html> so background updates when theme toggles
    const observer = new MutationObserver(() => {
      const colors = getColors(isDark())
      particleColor = colors.particle
      particleRgb = colors.particleRgb
      lineRgb = colors.lineRgb
      canvasOpacity = colors.canvasOpacity
      if (canvas) canvas.style.opacity = String(canvasOpacity)
    })

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] })

    if (canvas) canvas.style.opacity = String(canvasOpacity)

    let animationId = 0

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // draw subtle radial gradient backdrop
      const grad = ctx.createLinearGradient(0, 0, window.innerWidth, window.innerHeight)
      if (isDark()) {
        grad.addColorStop(0, "rgba(16, 24, 40, 0.0)")
        grad.addColorStop(1, "rgba(7, 11, 19, 0.03)")
      } else {
        grad.addColorStop(0, "rgba(255,255,255,0.0)")
        grad.addColorStop(1, "rgba(245,247,250,0.02)")
      }
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight)

      // particles with halo/glow
      particles.forEach((p) => {
        p.update()

        // glow
        const glowR = p.radius * 8
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
        grad.addColorStop(0, `rgba(${particleRgb}, ${Math.min(0.35, p.opacity)})`)
        grad.addColorStop(0.4, `rgba(${particleRgb}, ${Math.min(0.12, p.opacity * 0.6)})`)
        grad.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = grad
        ctx.beginPath()
        ctx.arc(p.x, p.y, glowR, 0, Math.PI * 2)
        ctx.fill()

        // core particle
        p.draw(ctx, particleColor)
      })

      // connections
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i]
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const max = 140
          if (dist < max) {
            const alpha = (1 - dist / max) * 0.18
            ctx.strokeStyle = `rgba(${lineRgb}, ${alpha})`
            ctx.lineWidth = 0.8
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    const handleResize = () => {
      setSize()
      // re-populate particle positions proportionally
      // (simple approach: keep count but reposition inside bounds)
      particles.forEach((p) => {
        if (p.x > window.innerWidth) p.x = Math.random() * window.innerWidth
        if (p.y > window.innerHeight) p.y = Math.random() * window.innerHeight
      })
    }

    window.addEventListener("resize", handleResize)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", handleResize)
      observer.disconnect()
    }
  }, [])

  // keep canvas behind UI but above page background so it's visible
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{mixBlendMode: 'screen'}} />
}
