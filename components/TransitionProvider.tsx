'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { gsap } from '@/lib/gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
  const pathname   = usePathname()
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
    const overlay = overlayRef.current
    if (!overlay) return

    gsap.fromTo(
      overlay,
      { opacity: 1 },
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power2.out',
        delay: 0.15,
        onComplete: () => { overlay.style.pointerEvents = 'none' },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill())
      ScrollTrigger.clearScrollMemory?.()
    }
  }, [pathname])

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          background: '#080808',
          zIndex: 100,
          opacity: 1,
          pointerEvents: 'none',
        }}
      />
      {children}
    </>
  )
}
