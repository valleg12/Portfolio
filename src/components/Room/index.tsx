import { useTranslation } from 'react-i18next'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomBackground from './RoomBackground'
import Hotspot from './Hotspot'

interface HotspotDef {
  frame: FrameId
  key: string
  x: number
  y: number
}

const HOTSPOTS: HotspotDef[] = [
  { frame: 'buste',        key: 'buste',        x: 62, y: 68 },
  { frame: 'iMac',         key: 'iMac',         x: 72, y: 52 },
  { frame: 'bernabeu',     key: 'bernabeu',     x: 48, y: 40 },
  { frame: 'neon',         key: 'neon',         x: 13, y: 42 },
  { frame: 'bibliotheque', key: 'bibliotheque', x: 88, y: 45 },
  { frame: 'lab',          key: 'lab',          x: 72, y: 35 },
  { frame: 'hobbies',      key: 'hobbies',      x: 80, y: 80 },
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
    </div>
  )
}
