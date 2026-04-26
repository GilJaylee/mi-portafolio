export const dynamic = 'force-dynamic'

import type { Metadata } from 'next'
import { DM_Sans, DM_Mono } from 'next/font/google'
import Cursor from '@/components/Cursor'
import Navbar from '@/components/Navbar'
import ParticleBackground from '@/components/ParticleBackground'
import Preloader from '@/components/Preloader'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import TransitionProvider from '@/components/TransitionProvider'
import './globals.css'

const dmSans = DM_Sans({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const dmMono = DM_Mono({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-dm-mono',
})

export const metadata: Metadata = {
  title: 'Portfolio — Gilberto Emmanuel',
  description: 'Creative developer & designer based in Mexico City.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`} style={{ background: '#080808' }}>
      <body style={{ background: '#080808', minHeight: '100vh' }}>
        <ParticleBackground />
        <Preloader />
        <Cursor />
        <Navbar />
        <TransitionProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </TransitionProvider>
      </body>
    </html>
  )
}
