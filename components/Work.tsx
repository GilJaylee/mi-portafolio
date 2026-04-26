'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const projects = [
  { number: '01', title: 'IBM — AI & Automation',         category: 'Product Management',     year: '2025–Present', slug: 'ibm-ai-automation'    },
  { number: '02', title: 'Freelance Web Development',     category: 'Web Development',        year: '2023–Present', slug: 'freelance-web-dev'    },
  { number: '03', title: 'Software Engineering Projects', category: 'Academic & Engineering', year: '2023–Present', slug: 'software-engineering' },
]

export default function Work() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const cards = containerRef.current?.querySelectorAll('.project-card')
    if (!cards) return

    const cleanups: (() => void)[] = []

    cards.forEach((card) => {
      const bg    = card.querySelector('.hover-bg')      as HTMLElement
      const title = card.querySelector('.project-title') as HTMLElement
      const arrow = card.querySelector('.project-arrow') as HTMLElement

      if (!bg || !title) return

      gsap.set(bg,    { scaleX: 0, transformOrigin: 'left center' })
      gsap.set(arrow, { opacity: 0, x: -10 })

      const onEnter = () => {
        gsap.killTweensOf([bg, title, arrow])
        gsap.to(bg,    { scaleX: 1, duration: 0.4, ease: 'power3.out', transformOrigin: 'left center' })
        gsap.to(title, { color: '#080808', duration: 0.3 })
        if (arrow) gsap.to(arrow, { opacity: 1, x: 0, duration: 0.3 })
      }

      const onLeave = () => {
        gsap.killTweensOf([bg, title, arrow])
        gsap.to(bg,    { scaleX: 0, duration: 0.35, ease: 'power3.in', transformOrigin: 'right center' })
        gsap.to(title, { color: '#f0ede6', duration: 0.3 })
        if (arrow) gsap.to(arrow, { opacity: 0, x: -10, duration: 0.3 })
      }

      card.addEventListener('mouseenter', onEnter)
      card.addEventListener('mouseleave', onLeave)
      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter)
        card.removeEventListener('mouseleave', onLeave)
      })
    })

    const cardEls = gsap.utils.toArray<HTMLElement>(
      containerRef.current?.querySelectorAll('.project-card') ?? []
    )

    ScrollTrigger.batch(cardEls, {
      onEnter: (elements) => {
        gsap.from(elements, {
          y: 60,
          opacity: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
        })
      },
      start: 'top 85%',
      once: true,
    })

    ScrollTrigger.refresh()

    setTimeout(() => {
      const stuckCards = containerRef.current?.querySelectorAll('.project-card')
      stuckCards?.forEach((card) => {
        const el = card as HTMLElement
        if (el.style.opacity === '0' || el.style.opacity === '') return
      })
    }, 2000)

    return () => {
      cleanups.forEach((fn) => fn())
      ScrollTrigger.getAll()
        .filter((t) => t.trigger instanceof Element && t.trigger.classList.contains('project-card'))
        .forEach((t) => t.kill())
    }
  }, { scope: containerRef, revertOnUpdate: true })

  return (
    <section ref={containerRef} id="work" style={{ background: 'revert' }} className="px-6 py-32 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">

        <div className="mb-20 flex items-end justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[#555555]">
            Selected Work
          </h2>
          <span className="font-mono text-xs text-[#555555]">(2023–2025)</span>
        </div>

        <div className="border-b border-[#1f1f1f]">
          {projects.map((project) => (
            <Link key={project.number} href={`/work/${project.slug}`} className="block">
              <article
                className="project-card relative flex cursor-pointer items-center gap-6 overflow-hidden border-t border-[#1f1f1f] py-8 md:gap-10"
              >

                {/* Hover background — scaleX animated by GSAP */}
                <div
                  className="hover-bg"
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: '#f0ede6',
                    zIndex: 0,
                    pointerEvents: 'none',
                  }}
                />

                <span
                  className="relative z-10 w-10 shrink-0 font-mono text-xs"
                  style={{ color: '#555555' }}
                >
                  {project.number}
                </span>

                <h3
                  className="project-title relative z-10 flex-1 text-xl font-bold leading-none md:text-2xl"
                  style={{ color: '#f0ede6' }}
                >
                  {project.title}
                </h3>

                <div className="relative z-10 hidden items-center gap-8 md:flex">
                  <span className="text-sm"        style={{ color: '#555555' }}>{project.category}</span>
                  <span className="font-mono text-xs" style={{ color: '#555555' }}>{project.year}</span>
                  <span className="project-arrow"  style={{ color: '#000000' }}>→</span>
                </div>

              </article>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
