'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'
import { gsap, ScrollTrigger } from '@/lib/gsap'

declare global {
  interface Window { __lenis?: Lenis }
}

export function useLenis() {
  const pathname = usePathname()

  useEffect(() => {
    const lenis = new Lenis()
    lenis.scrollTo(0, { immediate: true })
    window.__lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const raf = (time: number) => { lenis.raf(time * 1000) }
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenis.destroy()
      delete window.__lenis
      gsap.ticker.remove(raf)
    }
  }, [pathname])
}
