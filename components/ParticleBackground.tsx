'use client'

import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'

const DOT_COUNT    = 80
const CONNECT_DIST = 120
const REPEL_DIST   = 100
const REPEL_FORCE  = 28
const DRIFT_MAX    = 0.15

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number

    const setSize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()

    const onResize = () => setSize()
    window.addEventListener('resize', onResize)

    const dots = Array.from({ length: DOT_COUNT }, () => ({
      bx: 0, by: 0, vx: 0, vy: 0,
      rx: 0, ry: 0,
    }))

    dots.forEach((d) => {
      d.bx = Math.random() * canvas.width
      d.by = Math.random() * canvas.height
      d.vx = (Math.random() - 0.5) * DRIFT_MAX * 2
      d.vy = (Math.random() - 0.5) * DRIFT_MAX * 2
    })

    const rxTos = dots.map((d) => {
      const fn = gsap.quickTo(d, 'rx', { duration: 0.8, ease: 'power2.out' })
      return (v: number) => { fn(v) }
    })
    const ryTos = dots.map((d) => {
      const fn = gsap.quickTo(d, 'ry', { duration: 0.8, ease: 'power2.out' })
      return (v: number) => { fn(v) }
    })

    const tick = () => {
      const w = canvas.width
      const h = canvas.height
      ctx.clearRect(0, 0, w, h)

      for (const d of dots) {
        d.bx += d.vx
        d.by += d.vy
        if (d.bx < 0 || d.bx > w) d.vx *= -1
        if (d.by < 0 || d.by > h) d.vy *= -1
      }

      const px = dots.map((d) => d.bx + d.rx)
      const py = dots.map((d) => d.by + d.ry)

      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx   = px[i] - px[j]
          const dy   = py[i] - py[j]
          const dist = Math.hypot(dx, dy)
          if (dist < CONNECT_DIST) {
            ctx.beginPath()
            ctx.moveTo(px[i], py[i])
            ctx.lineTo(px[j], py[j])
            ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / CONNECT_DIST) * 0.04})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      ctx.fillStyle = 'rgba(255,255,255,0.15)'
      for (let i = 0; i < dots.length; i++) {
        ctx.beginPath()
        ctx.arc(px[i], py[i], 1, 0, Math.PI * 2)
        ctx.fill()
      }

      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      dots.forEach((d, i) => {
        const dx   = (d.bx + d.rx) - e.clientX
        const dy   = (d.by + d.ry) - e.clientY
        const dist = Math.hypot(dx, dy)
        if (dist < REPEL_DIST && dist > 0) {
          const force = ((REPEL_DIST - dist) / REPEL_DIST) * REPEL_FORCE
          rxTos[i]((dx / dist) * force)
          ryTos[i]((dy / dist) * force)
        } else {
          rxTos[i](0)
          ryTos[i](0)
        }
      })
    }

    const onLeave = () => dots.forEach((_, i) => { rxTos[i](0); ryTos[i](0) })

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      dots.forEach((d) => gsap.killTweensOf(d))
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}
