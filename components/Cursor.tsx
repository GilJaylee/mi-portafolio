'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)

  useGSAP((_, contextSafe) => {
    const dot = dotRef.current
    if (!dot || !contextSafe) return

    gsap.set(dot, { xPercent: -50, yPercent: -50 })

    const xTo = gsap.quickTo(dot, 'x', { duration: 0.6, ease: 'power3' })
    const yTo = gsap.quickTo(dot, 'y', { duration: 0.6, ease: 'power3' })

    const onMove = contextSafe((e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    })

    const onEnter = contextSafe((e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) {
        gsap.to(dot, { scale: 5, duration: 0.25, ease: 'power2.out' })
      }
    })

    const onLeave = contextSafe((e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) {
        gsap.to(dot, { scale: 1, duration: 0.25, ease: 'power2.out' })
      }
    })

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onEnter)
    document.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onEnter)
      document.removeEventListener('mouseout', onLeave)
    }
  })

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: '#fff',
        mixBlendMode: 'difference',
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      }}
    />
  )
}
