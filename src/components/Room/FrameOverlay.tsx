import { useEffect, useRef, ReactElement } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import BackButton from './BackButton'
import FrameBuste from './frames/FrameBuste'
import FrameIMac from './frames/FrameIMac'
import FrameBernabeu from './frames/FrameBernabeu'
import FrameNeon from './frames/FrameNeon'
import FrameBibliotheque from './frames/FrameBibliotheque'
import FrameLab from './frames/FrameLab'
import FrameHobbies from './frames/FrameHobbies'

const BASE = import.meta.env.BASE_URL

const FRAME_COMPONENTS: Record<Exclude<FrameId, 'home'>, ReactElement> = {
  buste:        <FrameBuste />,
  iMac:         <FrameIMac />,
  bernabeu:     <FrameBernabeu />,
  neon:         <FrameNeon />,
  bibliotheque: <FrameBibliotheque />,
  lab:          <FrameLab />,
  hobbies:      <FrameHobbies />,
}

interface FrameOverlayProps {
  onBack: () => void
}

export default function FrameOverlay({ onBack }: FrameOverlayProps) {
  const { activeFrame } = useRoom()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleBack() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Animate in
  useGSAP(() => {
    if (!overlayRef.current) return
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' }
    )
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, { dependencies: [activeFrame] })

  function handleBack() {
    if (!overlayRef.current) { onBack(); return }
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onBack,
    })
  }

  return (
    <>
      <BackButton onBack={handleBack} />
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          padding: '80px 24px 40px',
        }}
      >
        {/* Blurred room background */}
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${BASE}ROOM.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(16px) brightness(0.35)',
          transform: 'scale(1.04)',
          zIndex: -1,
        }} />
        <div ref={contentRef} style={{ width: '100%', maxWidth: 800, position: 'relative' }}>
          {FRAME_COMPONENTS[activeFrame as Exclude<FrameId, 'home'>]}
        </div>
      </div>
    </>
  )
}
