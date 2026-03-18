import { useTranslation } from 'react-i18next'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomBackground from './RoomBackground'
import Hotspot from './Hotspot'
import FrameOverlay from './FrameOverlay'

interface HotspotDef {
  frame: FrameId
  key: string
  x: number
  y: number
}

// Positions calibrated for 2806×1536 image on a 1920×1080 viewport (background-size: cover)
const HOTSPOTS: HotspotDef[] = [
  { frame: 'neon',         key: 'neon',         x: 9,  y: 33 }, // neon sign left wall
  { frame: 'bernabeu',     key: 'bernabeu',     x: 44, y: 36 }, // window / stadium
  { frame: 'lab',          key: 'lab',          x: 63, y: 26 }, // whiteboard area (wall right of window)
  { frame: 'buste',        key: 'buste',        x: 68, y: 60 }, // bust sculpture on desk
  { frame: 'iMac',         key: 'iMac',         x: 76, y: 46 }, // iMac screen
  { frame: 'bibliotheque', key: 'bibliotheque', x: 90, y: 38 }, // bookshelf far right
  { frame: 'hobbies',      key: 'hobbies',      x: 84, y: 70 }, // chess set + ball
]

export default function Room() {
  const { activeFrame } = useRoom()
  const { t } = useTranslation()
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      <RoomBackground />
      {activeFrame === 'home' && HOTSPOTS.map(h => (
        <Hotspot
          key={h.frame}
          frame={h.frame}
          label={labels[h.key] ?? h.key}
          x={h.x}
          y={h.y}
        />
      ))}
      <FrameOverlay />
    </div>
  )
}
