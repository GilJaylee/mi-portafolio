'use client'

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin'
import { Flip } from 'gsap/Flip'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, Flip, useGSAP)

if (typeof window !== 'undefined') {
  ;(window as typeof window & { __gsapCleanup: () => void }).__gsapCleanup = () => {
    ScrollTrigger.getAll().forEach((t) => t.kill())
    ScrollTrigger.clearScrollMemory?.()
    window.scrollTo(0, 0)
  }
}

export { gsap, ScrollTrigger, SplitText, ScrambleTextPlugin, Flip }
