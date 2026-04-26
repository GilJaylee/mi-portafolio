'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const nameRef      = useRef<HTMLHeadingElement>(null)
  const subtitleRef  = useRef<HTMLParagraphElement>(null)
  const [ready, setReady] = useState(false)

  // ── Signal when preloader is done ────────────────────────────────────────
  useEffect(() => {
    const onDone = () => setReady(true)
    window.addEventListener('preloader:done', onDone)
    return () => window.removeEventListener('preloader:done', onDone)
  }, [])

  // ── Text animation — runs once preloader is done ──────────────────────────
  useGSAP(() => {
    if (!ready) return

    const name     = nameRef.current
    const subtitle = subtitleRef.current
    const section  = containerRef.current
    if (!name || !subtitle || !section) return

    gsap.set(section, { opacity: 0 })
    gsap.set(name,    { perspective: 600 })

    const split = SplitText.create(name, { type: 'chars' })
    gsap.set(split.chars, { opacity: 0, y: -100, rotateX: 90, transformOrigin: '50% 50% -40px' })
    gsap.set([subtitle, '.scroll-indicator'], { opacity: 0 })

    gsap.set(section, { opacity: 1 })

    gsap
      .timeline()
      .to(split.chars, {
        y: 0, rotateX: 0, opacity: 1,
        duration: 1.1, stagger: 0.04, ease: 'power4.out',
      })
      .to(subtitle, {
        opacity: 1, duration: 1.6,
        scrambleText: { text: 'Engineer & AI Product Manager', chars: 'lowerCase', speed: 0.45, delimiter: '' },
        ease: 'none',
      }, '-=0.5')
      .to('.scroll-indicator', { opacity: 1, duration: 0.7, ease: 'power2.out' }, '-=0.9')

    return () => split.revert()
  }, { scope: containerRef, dependencies: [ready] })

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{ background: 'revert' }}
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* ── Text content ────────────────────────────────────────────────── */}
      <div className="relative z-10 text-center">
        <h1
          ref={nameRef}
          className="hero-name mb-6 leading-none tracking-tight text-white"
          style={{ fontFamily: 'var(--font-system)', fontSize: 'clamp(5rem, 14vw, 12rem)', fontWeight: 700 }}
        >
          Gilberto Emmanuel
        </h1>

        <p
          ref={subtitleRef}
          className="hero-subtitle min-h-[1.5em] text-base tracking-wide text-zinc-400 sm:text-lg md:text-xl"
        >
          {/* ScrambleText writes the content */}
        </p>
      </div>

      {/* ── Scroll indicator ────────────────────────────────────────────── */}
      <div className="scroll-indicator absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-600">Scroll</span>
        <div className="h-14 w-px bg-gradient-to-b from-zinc-600 to-transparent" />
      </div>
    </section>
  )
}
