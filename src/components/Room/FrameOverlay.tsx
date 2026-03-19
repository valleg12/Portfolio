import { useEffect, useState, ReactElement } from 'react'
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

interface Props {
  onBack: () => void
}

export default function FrameOverlay({ onBack }: Props) {
  const { activeFrame } = useRoom()
  const [visible, setVisible] = useState(false)

  // Fade in on mount
  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true))
    return () => cancelAnimationFrame(t)
  }, [])

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleBack() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleBack() {
    // Fade out this overlay, then trigger Room's zoom-out
    setVisible(false)
    setTimeout(() => onBack(), 250)
  }

  if (!activeFrame || activeFrame === 'home') return null

  return (
    <>
      <BackButton onBack={handleBack} visible={visible} />

      {/* Blurred zoomed-room backdrop */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        backgroundImage: `url(${BASE}ROOM.png)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'blur(24px) brightness(0.2)',
        transform: 'scale(1.1)',
        transition: 'opacity 0.35s ease',
        opacity: visible ? 1 : 0,
      }} />

      {/* Frame content */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 51,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflowY: 'auto',
        padding: '80px 24px 40px',
        transition: 'opacity 0.35s ease, transform 0.35s ease',
        opacity:   visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
      }}>
        <div style={{ width: '100%', maxWidth: 860 }}>
          {FRAME_COMPONENTS[activeFrame]}
        </div>
      </div>
    </>
  )
}
