'use client'

import Link from 'next/link'
import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { Project } from '@/lib/projects'

interface Props {
  currentProject: Project
  nextProject: Project | null
}

export default function ProjectNav({ currentProject, nextProject }: Props) {
  const navRef      = useRef<HTMLDivElement>(null)
  const backWrapRef = useRef<HTMLDivElement>(null)
  const nextWrapRef = useRef<HTMLDivElement>(null)

  useGSAP((_, contextSafe) => {
    const nav = navRef.current
    if (!nav || !contextSafe) return

    gsap.set(nav, { opacity: 0, y: 20 })
    gsap.to(nav, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 1.5 })

    const setupMagnetic = (wrap: HTMLDivElement) => {
      const xTo = gsap.quickTo(wrap, 'x', { duration: 0.4, ease: 'power3.out' })
      const yTo = gsap.quickTo(wrap, 'y', { duration: 0.4, ease: 'power3.out' })

      const onMove = contextSafe((e: MouseEvent) => {
        const r  = wrap.getBoundingClientRect()
        const cx = r.left + r.width  / 2
        const cy = r.top  + r.height / 2
        xTo((e.clientX - cx) * 0.35)
        yTo((e.clientY - cy) * 0.35)
      })
      const onLeave = contextSafe(() => { xTo(0); yTo(0) })

      wrap.addEventListener('mousemove', onMove as EventListener)
      wrap.addEventListener('mouseleave', onLeave as EventListener)
      return () => {
        wrap.removeEventListener('mousemove', onMove as EventListener)
        wrap.removeEventListener('mouseleave', onLeave as EventListener)
      }
    }

    const cleanups: Array<() => void> = []
    if (backWrapRef.current) cleanups.push(setupMagnetic(backWrapRef.current))
    if (nextWrapRef.current) cleanups.push(setupMagnetic(nextWrapRef.current))

    return () => cleanups.forEach((fn) => fn())
  }, { scope: navRef, revertOnUpdate: true })

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <div
      ref={navRef}
      className="fixed inset-x-0 bottom-0 z-40 grid items-center px-6 py-4 md:px-12 lg:px-24"
      style={{
        gridTemplateColumns: '1fr auto 1fr',
        backgroundColor: 'rgba(8,8,8,0.9)',
        backdropFilter: 'blur(14px)',
        borderTop: '1px solid #1a1a1a',
      }}
    >
      {/* Left: back to all work */}
      <div ref={backWrapRef} className="inline-block justify-self-start">
        <Link
          href="/"
          className="font-mono text-xs tracking-wide text-[#555555] transition-colors duration-200 hover:text-white"
        >
          ← All Work
        </Link>
      </div>

      {/* Center: current project title */}
      <span className="font-mono text-[10px] uppercase tracking-widest text-[#333333]">
        {currentProject.title}
      </span>

      {/* Right: next project */}
      <div className="justify-self-end">
        {nextProject ? (
          <div ref={nextWrapRef} className="inline-block">
            <Link
              href={`/work/${nextProject.slug}`}
              className="font-mono text-xs tracking-wide text-[#555555] transition-colors duration-200 hover:text-white"
            >
              Next →
            </Link>
          </div>
        ) : (
          <span className="font-mono text-xs text-[#222222]">—</span>
        )}
      </div>
    </div>
  )
}
