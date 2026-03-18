import { useState } from 'react'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'

interface HotspotProps {
  frame: FrameId
  label: string
  x: number  // % of viewport width
  y: number  // % of viewport height
}

export default function Hotspot({ frame, label, x, y }: HotspotProps) {
  const { goTo } = useRoom()
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => goTo(frame)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        zIndex: 20,
        padding: 0,
      }}
      aria-label={label}
    >
      <span
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(99,102,241,0.8)',
          animation: 'hotspot-pulse 2s ease-in-out infinite',
          position: 'relative',
          background: 'rgba(99,102,241,0.1)',
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            background: '#6366f1',
            boxShadow: '0 0 8px #6366f1',
            display: 'block',
          }}
        />
      </span>
      {hovered && (
        <span
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(5,5,16,0.9)',
            color: '#e2e8f0',
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            border: '1px solid rgba(99,102,241,0.3)',
            fontFamily: 'Inter, sans-serif',
            pointerEvents: 'none',
          }}
        >
          {label}
        </span>
      )}
    </button>
  )
}
