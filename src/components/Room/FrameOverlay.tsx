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

const FRAME_COMPONENTS: Record<Exclude<FrameId, 'home'>, ReactElement> = {
  buste:        <FrameBuste />,
  iMac:         <FrameIMac />,
  bernabeu:     <FrameBernabeu />,
  neon:         <FrameNeon />,
  bibliotheque: <FrameBibliotheque />,
  lab:          <FrameLab />,
  hobbies:      <FrameHobbies />,
}

export default function FrameOverlay() {
  const { activeFrame, goHome } = useRoom()
  const overlayRef = useRef<HTMLDivElement>(null)
  const isHome = activeFrame === 'home'

  // Escape key → go home
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') goHome() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goHome])

  // Animate in when frame changes (not on home)
  useGSAP(() => {
    if (!overlayRef.current || isHome) return
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 0.45, ease: 'power2.out' }
    )
  }, { dependencies: [activeFrame] })

  if (isHome) return null

  return (
    <>
      <BackButton />
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(5,5,16,0.92)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          padding: '80px 24px 40px',
        }}
      >
        {FRAME_COMPONENTS[activeFrame as Exclude<FrameId, 'home'>]}
      </div>
    </>
  )
}
