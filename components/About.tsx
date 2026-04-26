'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText, ScrollTrigger } from '@/lib/gsap'

export default function About() {
  const containerRef = useRef<HTMLElement>(null)

  useGSAP(
    () => {
      SplitText.create('.about-text', {
        type: 'lines',
        mask: 'lines',
        autoSplit: true,
        onSplit(self) {
          return gsap
            .timeline({
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: '+=1500',
                pin: true,
                scrub: 1,
              },
            })
            .from(self.lines, {
              opacity: 0,
              y: 48,
              stagger: 0.4,
              ease: 'power2.out',
            })
            .from('.about-meta', { opacity: 0, y: 20, duration: 0.3 }, '-=0.2')
        },
      })
    },
    { scope: containerRef, revertOnUpdate: true }
  )

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <section
      ref={containerRef}
      id="about"
      style={{ background: 'revert' }}
      className="flex h-screen flex-col justify-center px-6 md:px-12 lg:px-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <span className="mb-12 block font-mono text-xs uppercase tracking-widest text-zinc-600">
          About
        </span>

        <p className="about-text text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
          I&apos;m a Computer Engineering student at UDG and AI &amp; Automation Product Manager at IBM,
          building at the intersection of technology and strategy. I automate what slows teams down.
        </p>

        <div className="about-meta mt-16 flex gap-16 text-sm">
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-white">IBM</div>
            <div className="text-zinc-500">Currently at</div>
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-semibold text-white">7th</div>
            <div className="text-zinc-500">Semester CUCEI</div>
          </div>
          <div className="space-y-1">
            <div className="text-lg font-semibold text-white">GDL</div>
            <div className="text-zinc-500">Based in</div>
          </div>
        </div>
      </div>
    </section>
  )
}
