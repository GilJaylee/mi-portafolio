'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const STATS = [
  { label: 'Design',      target: 90 },
  { label: 'Development', target: 85 },
  { label: 'Animation',   target: 95 },
]

const ROW1 = ['Python', 'Next.js', 'React', 'GSAP', 'AI/ML', 'MCP Servers', 'Agile']
const ROW2 = ['Scrum', 'PHP', 'JavaScript', 'Git', 'Figma', 'Node.js', 'TypeScript']


export default function Skills() {
  const containerRef  = useRef<HTMLElement>(null)
  const row1Ref       = useRef<HTMLDivElement>(null)
  const row2Ref       = useRef<HTMLDivElement>(null)
  const wrapper1Ref   = useRef<HTMLDivElement>(null)
  const wrapper2Ref   = useRef<HTMLDivElement>(null)

  useGSAP((_, contextSafe) => {
    const section  = containerRef.current
    const row1     = row1Ref.current
    const row2     = row2Ref.current
    const wrap1    = wrapper1Ref.current
    const wrap2    = wrapper2Ref.current
    if (!section || !row1 || !row2 || !wrap1 || !wrap2 || !contextSafe) return

    // ── Stat counters ──────────────────────────────────────────────────────
    const counterEls  = section.querySelectorAll<HTMLElement>('[data-target]')
    const statsGrid   = section.querySelector('.stats-grid')

    const runCounters = contextSafe(() => {
      counterEls.forEach((el) => {
        const obj = { val: 0 }
        gsap.to(obj, {
          val: Number(el.dataset.target),
          duration: 1.8,
          ease: 'power2.out',
          onUpdate() {
            el.textContent = Math.round(obj.val) + '%'
          },
        })
      })
    })

    if (statsGrid) {
      ScrollTrigger.create({
        trigger: statsGrid,
        start: 'top 78%',
        once: true,
        onEnter: runCounters,
      })
    }

    // ── Marquee ────────────────────────────────────────────────────────────
    // Row 1 goes RIGHT  → xPercent rises from -50 toward 0, wraps back to -50
    // Row 2 goes LEFT   → xPercent falls from  0 toward -50, wraps back to 0
    gsap.set(row1, { xPercent: -50 })
    gsap.set(row2, { xPercent:   0 })

    let x1 = -50
    let x2 =   0

    const speed1 = { val: 1 }
    const speed2 = { val: 1 }

    const STEP = 0.04   // xPercent per frame — tune for desired pace

    const setX1 = gsap.quickSetter(row1, 'xPercent') as (v: number) => void
    const setX2 = gsap.quickSetter(row2, 'xPercent') as (v: number) => void

    const tick = () => {
      x1 += STEP * speed1.val
      if (x1 >= 0) x1 -= 50

      x2 -= STEP * speed2.val
      if (x2 <= -50) x2 += 50

      setX1(x1)
      setX2(x2)
    }

    gsap.ticker.add(tick)

    // Hover → pause the row being hovered
    const onEnter1 = contextSafe(() => gsap.to(speed1, { val: 0, duration: 0.5, ease: 'power2.out' }))
    const onLeave1 = contextSafe(() => gsap.to(speed1, { val: 1, duration: 0.8, ease: 'power2.in'  }))
    const onEnter2 = contextSafe(() => gsap.to(speed2, { val: 0, duration: 0.5, ease: 'power2.out' }))
    const onLeave2 = contextSafe(() => gsap.to(speed2, { val: 1, duration: 0.8, ease: 'power2.in'  }))

    wrap1.addEventListener('mouseenter', onEnter1)
    wrap1.addEventListener('mouseleave', onLeave1)
    wrap2.addEventListener('mouseenter', onEnter2)
    wrap2.addEventListener('mouseleave', onLeave2)

    return () => {
      gsap.ticker.remove(tick)
      wrap1.removeEventListener('mouseenter', onEnter1)
      wrap1.removeEventListener('mouseleave', onLeave1)
      wrap2.removeEventListener('mouseenter', onEnter2)
      wrap2.removeEventListener('mouseleave', onLeave2)
    }
  }, { scope: containerRef, revertOnUpdate: true })

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <section ref={containerRef} id="skills" style={{ background: 'revert' }} className="py-32">

      {/* ── Header + stat counters ─────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-6 md:px-12 lg:px-24">
        <h2
          className="mb-24 text-6xl font-bold leading-none text-white md:text-7xl lg:text-8xl"
        >
          Expertise
        </h2>

        <div className="stats-grid grid grid-cols-1 gap-10 border-t border-zinc-800 pt-12 sm:grid-cols-3">
          {STATS.map((s) => (
            <div key={s.label} className="flex flex-col gap-4">
              <span className="font-mono text-xs uppercase tracking-widest text-zinc-600">
                {s.label}
              </span>
              <span
                className="text-6xl font-bold leading-none text-white md:text-7xl"
                data-target={s.target}
              >
                0%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Marquees ────────────────────────────────────────────────────── */}
      <div className="mt-28 flex flex-col gap-5">

        {/* Row 1 — goes right */}
        <div ref={wrapper1Ref} className="overflow-hidden">
          <div
            ref={row1Ref}
            className="flex w-max"
            style={{ willChange: 'transform' }}
          >
            {[...ROW1, ...ROW1].map((skill, i) => (
              <span
                key={i}
                className="select-none whitespace-nowrap pr-16 text-5xl font-bold text-zinc-800 md:text-6xl"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        {/* Row 2 — goes left */}
        <div ref={wrapper2Ref} className="overflow-hidden">
          <div
            ref={row2Ref}
            className="flex w-max"
            style={{ willChange: 'transform' }}
          >
            {[...ROW2, ...ROW2].map((skill, i) => (
              <span
                key={i}
                className="select-none whitespace-nowrap pr-16 text-5xl font-bold text-zinc-800 md:text-6xl"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
