import { useState } from 'react'
import type { FrameId } from '../../context/RoomContext'

export interface HotspotZoneDef {
  frame: FrameId
  key: string
  label: string
  // Position: center of zone as % of viewport
  x: number
  y: number
  // Size as % of viewport
  w: number
  h: number
  // Glow color (hex)
  color: string
  // Shape (default: 'rect')
  shape?: 'rect' | 'oval'
  // Border radius override (px, default 8)
  radius?: number
}

interface HotspotZoneProps extends HotspotZoneDef {
  onClick: () => void
}

export default function HotspotZone({
  label, x, y, w, h, color, shape = 'rect', radius = 8, onClick,
}: HotspotZoneProps) {
  const [hovered, setHovered] = useState(false)
  const br = shape === 'oval' ? '50%' : `${radius}px`

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${x - w / 2}%`,
        top: `${y - h / 2}%`,
        width: `${w}%`,
        height: `${h}%`,
        borderRadius: br,
        background: hovered ? `${color}10` : 'transparent',
        border: hovered ? `2px solid ${color}` : '2px solid transparent',
        boxShadow: hovered
          ? `0 0 0 1px ${color}30, 0 0 24px ${color}80, 0 0 48px ${color}40`
          : 'none',
        cursor: 'pointer',
        zIndex: 20,
        transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
      }}
    >
      {hovered && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          fontSize: '0.75rem',
          padding: '4px 12px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          border: `1px solid ${color}50`,
        }}>
          {label}
        </span>
      )}
    </div>
  )
}
