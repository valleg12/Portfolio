import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomBackground from './RoomBackground'
import RoomSVGZones from './RoomSVGZones'
import FrameOverlay from './FrameOverlay'

// Zone centers for zoom animation (% of viewport)
const ZONE_CENTERS: Record<Exclude<FrameId, 'home'>, { x: number; y: number }> = {
  neon:         { x: 7,  y: 40 },
  bernabeu:     { x: 41, y: 50 },
  lab:          { x: 63, y: 35 },
  buste:        { x: 68, y: 62 },
  iMac:         { x: 77, y: 47 },
  bibliotheque: { x: 91, y: 42 },
  hobbies:      { x: 84, y: 72 },
}

export default function Room() {
  const { activeFrame, goTo, goHome } = useRoom()
  const sceneRef = useRef<HTMLDivElement>(null)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null)

  // Zoom-out when returning home
  useEffect(() => {
    if (activeFrame === 'home' && zoomOrigin && sceneRef.current) {
      gsap.fromTo(
        sceneRef.current,
        { scale: 4, opacity: 0, transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` },
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => setZoomOrigin(null),
        }
      )
    } else if (activeFrame === 'home' && !zoomOrigin && sceneRef.current) {
      gsap.set(sceneRef.current, { scale: 1, opacity: 1, transformOrigin: 'center center' })
    }
  }, [activeFrame])

  function handleZoneClick(frame: FrameId) {
    if (!sceneRef.current) return
    const center = ZONE_CENTERS[frame as Exclude<FrameId, 'home'>]
    if (!center) return
    setZoomOrigin(center)
    gsap.to(sceneRef.current, {
      scale: 5,
      transformOrigin: `${center.x}% ${center.y}%`,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => goTo(frame),
    })
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
        <div ref={sceneRef} style={{ position: 'absolute', inset: 0 }}>
          <RoomBackground />
        </div>
        {activeFrame === 'home' && <RoomSVGZones onClick={handleZoneClick} />}
      </div>
      {activeFrame !== 'home' && <FrameOverlay onBack={goHome} />}
    </>
  )
}
