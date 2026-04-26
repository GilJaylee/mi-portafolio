'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from '@/lib/gsap'

export default function Preloader() {
  const [count, setCount] = useState(0)
  const [hidden, setHidden] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)
  const wipeRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obj = { val: 0 }

    gsap.to(obj, {
      val: 100,
      duration: 2,
      ease: 'power2.inOut',
      onUpdate() {
        setCount(Math.round(obj.val))
      },
      onComplete() {
        gsap.to(counterRef.current, {
          opacity: 0,
          duration: 0.3,
          ease: 'power2.in',
          onComplete() {
            gsap.to(wipeRef.current, {
              clipPath: 'inset(100% 0 0 0)',
              duration: 0.9,
              ease: 'power4.inOut',
              onComplete() {
                window.dispatchEvent(new Event('preloader:done'))
                setHidden(true)
              }
            })
          }
        })
      }
    })
  }, [])

  if (hidden) return null

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#080808',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div
        ref={wipeRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#080808',
          clipPath: 'inset(0 0 0 0)',
        }}
      />
      <div
        ref={counterRef}
        style={{
          position: 'relative',
          zIndex: 1,
          fontSize: 'clamp(4rem, 12vw, 10rem)',
          fontWeight: 200,
          color: '#f0ede6',
          letterSpacing: '-0.04em',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {count}
      </div>
    </div>
  )
}
