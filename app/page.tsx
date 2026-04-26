'use client'

import { usePathname } from 'next/navigation'
import Hero from '@/components/Hero'
import Work from '@/components/Work'
import Skills from '@/components/Skills'
import About from '@/components/About'
import Contact from '@/components/Contact'

export default function Home() {
  const pathname = usePathname()

  return (
    <main style={{ background: 'revert' }}>
      <Hero />
      <Work key={pathname} />
      <Skills />
      <About />
      <Contact />
    </main>
  )
}
