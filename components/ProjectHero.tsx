'use client'

import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap'
import type { Project } from '@/lib/projects'

interface Props {
  project: Project
}

export default function ProjectHero({ project }: Props) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(timer)
  }, [])

  const heroRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!ready) return

    const split = SplitText.create('.project-title', { type: 'chars' })

    gsap.timeline()
      .from(split.chars, {
        y: 80,
        rotateX: 90,
        opacity: 0,
        duration: 0.8,
        stagger: 0.025,
        ease: 'power4.out',
        transformOrigin: '0% 50% -50px',
      })

    return () => split.revert()
  }, { scope: heroRef, dependencies: [ready] })

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <section
      ref={heroRef}
      className="relative flex h-screen flex-col overflow-hidden"
      style={{ background: '#080808', minHeight: '100vh' }}
    >
      {/* Top-left: category */}
      <div className="px-6 pt-10 md:px-12 lg:px-24">
        <span className="font-mono text-xs uppercase tracking-widest text-[#555555]">
          {project.category}
        </span>
      </div>

      {/* Center: title */}
      <div className="flex flex-1 items-center px-6 md:px-12 lg:px-24">
        <h1
          suppressHydrationWarning
          className="project-title font-light leading-[1.05] text-white"
          style={{ fontSize: 'clamp(2rem, 5vw, 4.5rem)', fontWeight: 300, letterSpacing: '-0.02em' }}
        >
          {project.title}
        </h1>
      </div>

      {/* Bottom bar: role + year left, scroll hint right */}
      <div className="flex items-end justify-between px-6 pb-10 md:px-12 lg:px-24">
        <div className="space-y-1">
          <p className="font-mono text-xs text-[#555555]">{project.role}</p>
          <p className="font-mono text-xs text-[#333333]">{project.year}</p>
        </div>
        <span className="font-mono text-xs text-[#333333]">Scroll to explore ↓</span>
      </div>
    </section>
  )
}
