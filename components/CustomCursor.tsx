'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

gsap.registerPlugin(useGSAP)

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)

  useGSAP((_, contextSafe) => {
    const el = cursorRef.current
    if (!el || !contextSafe) return

    gsap.set(el, { xPercent: -50, yPercent: -50 })

    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })

    const onMove = contextSafe((e: MouseEvent) => {
      xTo(e.clientX)
      yTo(e.clientY)
    })

    const onEnter = contextSafe((e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) {
        gsap.to(el, { scale: 5, duration: 0.2, ease: 'power2.out' })
      }
    })

    const onLeave = contextSafe((e: MouseEvent) => {
      if ((e.target as HTMLElement).closest('a, button')) {
        gsap.to(el, { scale: 1, duration: 0.2, ease: 'power2.out' })
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
      ref={cursorRef}
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
