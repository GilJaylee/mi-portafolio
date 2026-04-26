'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap'
import type { Project } from '@/lib/projects'

interface Props {
  project: Project
}

export default function ProjectHero({ project }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const heroRef     = useRef<HTMLElement>(null)
  const titleRef    = useRef<HTMLHeadingElement>(null)
  const categoryRef = useRef<HTMLSpanElement>(null)
  const metaRef     = useRef<HTMLDivElement>(null)
  const hintRef     = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    const titleEl    = titleRef.current
    const categoryEl = categoryRef.current
    const metaEl     = metaRef.current
    const hintEl     = hintRef.current
    const heroEl     = heroRef.current
    if (!titleEl || !categoryEl || !metaEl || !hintEl || !heroEl) return

    const split = new SplitText(titleEl, { type: 'chars' })

    gsap.set(titleEl, { perspective: 1000 })

    // Initial states
    gsap.set(split.chars, { y: 80, rotateX: 90, opacity: 0, transformOrigin: '50% 100%' })
    gsap.set([categoryEl, metaEl, hintEl], { opacity: 0 })

    const tl = gsap.timeline({ delay: 0.15 })

    tl.to(categoryEl, { opacity: 1, duration: 0.5, ease: 'power2.out' })

    tl.to(
      split.chars,
      { y: 0, rotateX: 0, opacity: 1, stagger: 0.025, duration: 1, ease: 'power4.out' },
      '-=0.2',
    )

    tl.to(
      [metaEl, hintEl],
      { opacity: 1, stagger: 0.1, duration: 0.6, ease: 'power2.out' },
      '-=0.4',
    )

    // Parallax: title drifts at 0.4 speed on scroll
    gsap.to(titleEl, {
      y: '40vh',
      ease: 'none',
      scrollTrigger: {
        trigger: heroEl,
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => { split.revert() }
  }, { scope: heroRef, revertOnUpdate: true })

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#080808' }} />

  return (
    <section
      ref={heroRef}
      className="relative flex h-screen flex-col overflow-hidden bg-[#080808]"
    >
      {/* Top-left: category */}
      <div className="px-6 pt-10 md:px-12 lg:px-24">
        <span
          ref={categoryRef}
          className="font-mono text-xs uppercase tracking-widest text-[#555555]"
        >
          {project.category}
        </span>
      </div>

      {/* Center: title */}
      <div className="flex flex-1 items-center px-6 md:px-12 lg:px-24">
        <h1
          ref={titleRef}
          className="font-light leading-[1.05] text-white"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 300, letterSpacing: '-0.02em' }}
        >
          {project.title}
        </h1>
      </div>

      {/* Bottom bar: role + year left, scroll hint right */}
      <div
        ref={metaRef}
        className="flex items-end justify-between px-6 pb-10 md:px-12 lg:px-24"
      >
        <div className="space-y-1">
          <p className="font-mono text-xs text-[#555555]">{project.role}</p>
          <p className="font-mono text-xs text-[#333333]">{project.year}</p>
        </div>

        <span
          ref={hintRef}
          className="font-mono text-xs text-[#333333]"
        >
          Scroll to explore ↓
        </span>
      </div>
    </section>
  )
}
