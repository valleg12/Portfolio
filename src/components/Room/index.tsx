import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomBackground from './RoomBackground'
import HotspotZone from './HotspotZone'
import type { HotspotZoneDef } from './HotspotZone'
import FrameOverlay from './FrameOverlay'

// Zones calibrated for 2806×1536 room photo on 1920×1080 viewport
// x/y = center %, w/h = size % of viewport
const ZONES: HotspotZoneDef[] = [
  {
    frame: 'neon',
    i18nKey: 'neon',
    label: 'Skills',
    x: 7, y: 40, w: 8, h: 55,
    color: '#6366f1',
    radius: 4,
  },
  {
    frame: 'bernabeu',
    i18nKey: 'bernabeu',
    label: 'Sport Projects',
    x: 41, y: 50, w: 33, h: 85,
    color: '#3b82f6',
    radius: 4,
  },
  {
    frame: 'lab',
    i18nKey: 'lab',
    label: 'Lab',
    x: 63, y: 35, w: 8, h: 40,
    color: '#22c55e',
    radius: 4,
  },
  {
    frame: 'buste',
    i18nKey: 'buste',
    label: 'About',
    x: 68, y: 62, w: 5, h: 14,
    color: '#f59e0b',
    shape: 'oval',
  },
  {
    frame: 'iMac',
    i18nKey: 'iMac',
    label: 'Tech Projects',
    x: 77, y: 47, w: 11, h: 25,
    color: '#22d3ee',
    radius: 6,
  },
  {
    frame: 'bibliotheque',
    i18nKey: 'bibliotheque',
    label: 'Education',
    x: 91, y: 42, w: 8, h: 55,
    color: '#f97316',
    radius: 4,
  },
  {
    frame: 'hobbies',
    i18nKey: 'hobbies',
    label: 'Hobbies',
    x: 84, y: 72, w: 10, h: 18,
    color: '#f43f5e',
    radius: 8,
  },
]

export default function Room() {
  const { activeFrame, goTo, goHome } = useRoom()
  const { t } = useTranslation()
  const sceneRef = useRef<HTMLDivElement>(null)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null)
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

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

  function handleHotspotClick(zone: HotspotZoneDef) {
    if (!sceneRef.current) return
    setZoomOrigin({ x: zone.x, y: zone.y })
    gsap.to(sceneRef.current, {
      scale: 5,
      transformOrigin: `${zone.x}% ${zone.y}%`,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => goTo(zone.frame),
    })
  }

  function handleBack() {
    goHome()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      <div ref={sceneRef} style={{ position: 'absolute', inset: 0 }}>
        <RoomBackground />
      </div>
      {activeFrame === 'home' && ZONES.map(zone => (
        <HotspotZone
          key={zone.frame}
          {...zone}
          label={labels[zone.i18nKey] ?? zone.label}
          onClick={() => handleHotspotClick(zone)}
        />
      ))}
      {activeFrame !== 'home' && <FrameOverlay onBack={handleBack} />}
    </div>
  )
}
