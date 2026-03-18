import { useRef, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import gsap from 'gsap'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomScene from './RoomScene'
import FrameOverlay from './FrameOverlay'

// Viewport % position of each zone center (as seen from camera).
// Adjust these after visual calibration.
const ZONE_CENTERS: Record<Exclude<FrameId, 'home'>, { x: number; y: number }> = {
  neon:         { x:  5, y: 40 },  // left wall, edge of viewport
  bernabeu:     { x: 32, y: 42 },  // window center
  lab:          { x: 52, y: 22 },  // back wall upper right of window
  buste:        { x: 57, y: 37 },  // bust sculpture
  iMac:         { x: 50, y: 43 },  // iMac monitor on desk
  bibliotheque: { x: 70, y: 38 },  // bookshelf right side
  hobbies:      { x: 55, y: 55 },  // chess/desk foreground
}

export default function Room() {
  const { activeFrame, goTo, goHome } = useRoom()
  const sceneRef  = useRef<HTMLDivElement>(null)
  const zoomOrigin = useRef<{ x: number; y: number } | null>(null)
  const didZoom = useRef(false)

  // Zoom-out when returning home
  useEffect(() => {
    if (activeFrame === 'home' && zoomOrigin.current && sceneRef.current) {
      gsap.fromTo(
        sceneRef.current,
        { scale: 4, opacity: 0, transformOrigin: `${zoomOrigin.current.x}% ${zoomOrigin.current.y}%` },
        { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out',
          onComplete: () => { zoomOrigin.current = null; didZoom.current = false } }
      )
    } else if (activeFrame === 'home' && !zoomOrigin.current && didZoom.current && sceneRef.current) {
      // Only clear GSAP props after a real zoom cycle, not on initial mount
      gsap.set(sceneRef.current, { clearProps: 'transform,opacity' })
    }
  }, [activeFrame])

  function handleZoneClick(frame: FrameId) {
    if (!sceneRef.current) return
    const center = ZONE_CENTERS[frame as Exclude<FrameId, 'home'>]
    if (!center) return
    zoomOrigin.current = center
    didZoom.current = true
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
      <div
        ref={sceneRef}
        style={{ position: 'fixed', inset: 0, zIndex: 10 }}
      >
        <Canvas
          gl={{ alpha: false, antialias: true }}
          style={{ background: '#0a0806' }}
          camera={{ position: [-0.8, 1.0, 5.0], fov: 62 }}
        >
          <Suspense fallback={null}>
            {activeFrame === 'home' && <RoomScene onZoneClick={handleZoneClick} />}
          </Suspense>
        </Canvas>
      </div>

      {activeFrame !== 'home' && <FrameOverlay onBack={goHome} />}
    </>
  )
}
