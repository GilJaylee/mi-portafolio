'use client'

import { useRef, useEffect } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const EMAIL   = 'gilberto.emmanuel@hotmail.com'

const SOCIALS = [
  { label: 'GitHub',   href: 'https://github.com/GilJaylee' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/gilberto-perez-888a4b290/' },   // ← replace with your LinkedIn URL
]

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null)
  const btnRef       = useRef<HTMLAnchorElement>(null)

  useGSAP((_, contextSafe) => {
    const section = containerRef.current
    const btn = btnRef.current
    if (!section || !btn || !contextSafe) return

    // ── Email: ScrambleText when entering viewport ───────────────────────
    const emailEl = section.querySelector<HTMLElement>('.contact-email')
    if (emailEl) {
      ScrollTrigger.create({
        trigger: emailEl,
        start: 'top 80%',
        once: true,
        onEnter: contextSafe(() => {
          gsap.to(emailEl, {
            duration: 2,
            scrambleText: {
              text: EMAIL,
              chars: 'lowerCase',
              speed: 0.35,
              delimiter: '',
            },
            ease: 'none',
          })
        }),
      })
    }

    // ── Social links: SVG underline draws on hover ────────────────────────
    //   stroke-dashoffset: totalLen  →  line invisible
    //   stroke-dashoffset: 0        →  line fully drawn (left → right)
    const socialEls  = section.querySelectorAll<HTMLAnchorElement>('.social-link')
    const cleanupFns: Array<() => void> = []

    socialEls.forEach((link) => {
      const svg  = link.querySelector<SVGSVGElement>('svg')
      const line = link.querySelector<SVGLineElement>('line')
      if (!svg || !line) return

      // Read the rendered width AFTER mount; set x2 to that pixel value
      const totalLen = svg.getBoundingClientRect().width

      line.setAttribute('x2', String(totalLen))
      gsap.set(svg,  { opacity: 1 })
      gsap.set(line, { strokeDasharray: totalLen, strokeDashoffset: totalLen })

      const onEnter = contextSafe(() => {
        gsap.to(line, { strokeDashoffset: 0,        duration: 0.5,  ease: 'power3.out' })
      })
      const onLeave = contextSafe(() => {
        gsap.to(line, { strokeDashoffset: totalLen, duration: 0.35, ease: 'power3.in'  })
      })

      link.addEventListener('mouseenter', onEnter)
      link.addEventListener('mouseleave', onLeave)
      cleanupFns.push(() => {
        link.removeEventListener('mouseenter', onEnter)
        link.removeEventListener('mouseleave', onLeave)
      })
    })

    // ── Magnetic button ───────────────────────────────────────────────────
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' })

    const THRESHOLD = 120  // proximity radius in px
    const STRENGTH  = 0.32 // fraction of offset applied to the button

    const onMove = contextSafe((e: MouseEvent) => {
      const r  = btn.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width  / 2)
      const dy = e.clientY - (r.top  + r.height / 2)

      if (Math.hypot(dx, dy) < THRESHOLD) {
        xTo(dx * STRENGTH)
        yTo(dy * STRENGTH)
      } else {
        xTo(0)
        yTo(0)
      }
    })

    const onSectionLeave = contextSafe(() => {
      xTo(0)
      yTo(0)
    })

    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onSectionLeave)

    return () => {
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onSectionLeave)
      cleanupFns.forEach((fn) => fn())
    }
  }, { scope: containerRef, revertOnUpdate: true })

  useEffect(() => {
    return () => { ScrollTrigger.getAll().forEach((t) => t.kill()) }
  }, [])

  return (
    <section
      ref={containerRef}
      id="contact"
      style={{ background: 'revert' }}
      className="relative flex h-screen flex-col items-center justify-center overflow-hidden px-6 md:px-12"
    >
      <div className="mx-auto w-full max-w-5xl">

        {/* Label */}
        <p className="mb-10 font-mono text-xs uppercase tracking-widest text-zinc-600">
          Get in touch
        </p>

        {/* Email — ScrambleText populates the visible text */}
        <a
          href={`mailto:${EMAIL}`}
          className="contact-email mb-20 block font-bold leading-none tracking-tight text-white transition-opacity duration-300 hover:opacity-60"
          style={{
            fontSize: 'clamp(1.75rem, 4.5vw, 4rem)',
          }}
        >
          {/* intentionally blank — ScrambleText writes the address */}
          &nbsp;
        </a>

        {/* Social links with SVG draw-on-hover underline */}
        <div className="flex items-center gap-12">
          {SOCIALS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link text-sm text-zinc-500 transition-colors duration-200 hover:text-white"
            >
              {label}
              {/* SVG starts invisible (opacity:0); GSAP sets up dashes and reveals it */}
              <svg
                width="100%"
                height="2"
                aria-hidden="true"
                style={{ display: 'block', marginTop: 6, opacity: 0, overflow: 'visible' }}
              >
                <line
                  x1="0" y1="1"
                  x2="0" y2="1"   /* x2 updated by GSAP after mount */
                  stroke="currentColor"
                  strokeWidth="1"
                />
              </svg>
            </a>
          ))}
        </div>

        {/* CTA — magnetic on proximity */}
        <div className="mt-24">
          <a
            ref={btnRef}
            href={`mailto:${EMAIL}`}
            className="cta-btn inline-block rounded-full border border-zinc-700 px-10 py-5 font-mono text-xs uppercase tracking-widest text-zinc-400 transition-colors duration-300 hover:border-white hover:text-white"
          >
            Let&apos;s work together
          </a>
        </div>

      </div>
    </section>
  )
}
