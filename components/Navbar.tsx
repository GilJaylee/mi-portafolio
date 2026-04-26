'use client'

import Link from 'next/link'
import { useRef } from 'react'
import { usePathname } from 'next/navigation'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

const NAV_LINKS = [
  { label: 'Work',    id: 'work'    },
  { label: 'About',   id: 'about'   },
  { label: 'Skills',  id: 'skills'  },
  { label: 'Contact', id: 'contact' },
]

function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el) return
  if (window.__lenis) window.__lenis.scrollTo(el)
  else el.scrollIntoView({ behavior: 'smooth' })
}

export default function Navbar() {
  const navRef    = useRef<HTMLElement>(null)
  const pathname  = usePathname()
  const isProject = pathname.startsWith('/work/')

  useGSAP(() => {
    const nav = navRef.current
    if (!nav) return

    gsap.set(nav, { y: '-100%' })

    ScrollTrigger.create({
      start: 100,
      end: 'max',
      onLeaveBack: () => {
        gsap.to(nav, { y: '-100%', duration: 0.3, ease: 'power3.in', overwrite: true })
      },
      onUpdate(self) {
        if (self.direction === -1) {
          gsap.to(nav, { y: '0%',    duration: 0.4, ease: 'power3.out', overwrite: true })
        } else {
          gsap.to(nav, { y: '-100%', duration: 0.3, ease: 'power3.in',  overwrite: true })
        }
      },
    })
  })

  return (
    <header
      ref={navRef}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 backdrop-blur-md md:px-12"
      style={{ backgroundColor: 'rgba(8, 8, 8, 0.75)' }}
    >
      <Link href="/" className="font-mono text-sm tracking-widest text-white">
        GE
      </Link>

      <nav className="flex items-center gap-8">
        {isProject ? (
          <Link
            href="/"
            className="text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
          >
            ← All Work
          </Link>
        ) : (
          NAV_LINKS.map(({ label, id }) => (
            <button
              key={label}
              onClick={() => scrollToSection(id)}
              className="group relative text-sm text-zinc-400 transition-colors duration-200 hover:text-white"
            >
              {label}
              <span
                aria-hidden="true"
                className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover:scale-x-100"
              />
            </button>
          ))
        )}
      </nav>
    </header>
  )
}
