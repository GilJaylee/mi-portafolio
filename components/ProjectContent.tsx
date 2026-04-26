'use client'

import Image from 'next/image'
import { useRef, useEffect, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import type { Project } from '@/lib/projects'

interface Props {
  project: Project
}

export default function ProjectContent({ project }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const containerRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    const blocks = containerRef.current?.querySelectorAll<HTMLElement>('.animate-block')
    if (!blocks) return

    blocks.forEach((block) => {
      gsap.from(block, {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: { trigger: block, start: 'top 85%', once: true },
      })
    })
  }, { scope: containerRef, revertOnUpdate: true })

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  if (!mounted) return <div style={{ minHeight: '100vh', background: '#080808' }} />

  return (
    <section ref={containerRef} className="bg-[#080808] px-6 py-24 md:px-12 lg:px-24">
      <div className="mx-auto max-w-6xl">

        {/* Metadata strip */}
        <div className="animate-block mb-24 grid grid-cols-1 gap-10 border-t border-[#1f1f1f] pt-12 md:grid-cols-3">
          <div>
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-[#3a3a3a]">
              Role
            </span>
            <p className="text-sm text-[#aaaaaa]">{project.role}</p>
          </div>
          <div>
            <span className="mb-3 block font-mono text-[10px] uppercase tracking-widest text-[#3a3a3a]">
              Year
            </span>
            <p className="text-sm text-[#aaaaaa]">{project.year}</p>
          </div>
          <div>
            <span className="mb-4 block font-mono text-[10px] uppercase tracking-widest text-[#3a3a3a]">
              Tools
            </span>
            <div className="flex flex-wrap gap-2">
              {project.tools.map((tool) => (
                <span
                  key={tool}
                  className="px-3 py-1 font-mono text-xs text-[#888888]"
                  style={{ border: '1px solid #2a2a2a' }}
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="animate-block mb-24 max-w-2xl text-xl leading-relaxed text-[#888888]">
          {project.description}
        </p>

        {/* Sections */}
        <div className="space-y-32">
          {project.sections.map((section, i) => (
            <div key={section.title} className="space-y-12">

              {/* Full-width illustration */}
              {project.images?.[i] && (
                <div
                  className="animate-block w-full overflow-hidden"
                  style={{ border: '1px solid #1f1f1f', backgroundColor: '#080808' }}
                >
                  <Image
                    src={`/images/${project.images[i]}`}
                    alt={section.title}
                    width={1200}
                    height={675}
                    className="w-full h-auto"
                    style={{ filter: 'none' }}
                  />
                </div>
              )}

              {/* Two-column: tiny label left, body right */}
              <div className="animate-block grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr] md:gap-16">
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#444444] md:pt-1">
                  {section.title}
                </span>
                <p className="max-w-2xl text-base leading-relaxed text-[#999999] md:text-lg">
                  {section.body}
                </p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
