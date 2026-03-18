import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { FrameId } from '../../context/RoomContext'

interface ZoneDef {
  frame: FrameId
  i18nKey: string
  label: string
  color: string
  // Hit area (viewBox 0 0 100 100, preserveAspectRatio="none")
  hitX: number
  hitY: number
  hitW: number
  hitH: number
  // Tooltip center position (% viewport)
  tipX: number
  tipY: number
}

const ZONES: ZoneDef[] = [
  { frame: 'neon',         i18nKey: 'neon',         label: 'Skills',         color: '#6366f1', hitX: 3,    hitY: 12,  hitW: 8,  hitH: 57, tipX: 7,  tipY: 10 },
  { frame: 'bernabeu',     i18nKey: 'bernabeu',     label: 'Sport Projects', color: '#3b82f6', hitX: 24.5, hitY: 7.5, hitW: 33, hitH: 85, tipX: 41, tipY: 4  },
  { frame: 'lab',          i18nKey: 'lab',           label: 'Lab',            color: '#22c55e', hitX: 59,   hitY: 14,  hitW: 8,  hitH: 42, tipX: 63, tipY: 11 },
  { frame: 'buste',        i18nKey: 'buste',         label: 'About',          color: '#f59e0b', hitX: 65.5, hitY: 54,  hitW: 5,  hitH: 16, tipX: 68, tipY: 50 },
  { frame: 'iMac',         i18nKey: 'iMac',          label: 'Tech Projects',  color: '#22d3ee', hitX: 71.5, hitY: 33,  hitW: 11, hitH: 27, tipX: 77, tipY: 29 },
  { frame: 'bibliotheque', i18nKey: 'bibliotheque',  label: 'Education',      color: '#f97316', hitX: 87,   hitY: 13,  hitW: 8,  hitH: 57, tipX: 91, tipY: 10 },
  { frame: 'hobbies',      i18nKey: 'hobbies',       label: 'Hobbies',        color: '#f43f5e', hitX: 79,   hitY: 62,  hitW: 10, hitH: 20, tipX: 84, tipY: 58 },
]

interface Props {
  onClick: (frame: FrameId) => void
}

function GlowFilter({ id, color }: { id: string; color: string }) {
  return (
    <filter id={id} x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
      <feFlood floodColor={color} floodOpacity="0.9" result="color" />
      <feComposite in="color" in2="blur" operator="in" result="glow1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.4" result="blur2" />
      <feFlood floodColor={color} floodOpacity="1" result="color2" />
      <feComposite in="color2" in2="blur2" operator="in" result="glow2" />
      <feMerge>
        <feMergeNode in="glow1" />
        <feMergeNode in="glow2" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
  )
}

export default function RoomSVGZones({ onClick }: Props) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState<FrameId | null>(null)
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  const hoveredZone = ZONES.find(z => z.frame === hovered)

  function stroke(frame: FrameId, color: string, opacity = 1) {
    return hovered === frame ? `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}` : 'transparent'
  }
  function fill(frame: FrameId, color: string) {
    return hovered === frame ? `${color}12` : 'transparent'
  }
  function filt(frame: FrameId) {
    return hovered === frame ? `url(#glow-${frame})` : undefined
  }

  const sw = 0.45 // stroke width
  const swThin = 0.25

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20, pointerEvents: 'none' }}>
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {ZONES.map(z => <GlowFilter key={z.frame} id={`glow-${z.frame}`} color={z.color} />)}
        </defs>

        {ZONES.map(zone => (
          <g
            key={zone.frame}
            style={{ cursor: 'pointer', pointerEvents: 'all' }}
            onMouseEnter={() => setHovered(zone.frame)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => onClick(zone.frame)}
          >
            {/* Invisible hit area */}
            <rect
              x={zone.hitX} y={zone.hitY}
              width={zone.hitW} height={zone.hitH}
              fill="transparent"
              stroke="transparent"
            />

            {/* Decorative contour shapes — visible only on hover */}
            {zone.frame === 'neon' && (
              // Floor lamp: tall pole + wide shade head
              <g filter={filt('neon')}>
                {/* Shade */}
                <ellipse cx="7" cy="22.5" rx="4.5" ry="2.8" fill={fill('neon', zone.color)} stroke={stroke('neon', zone.color)} strokeWidth={sw} />
                {/* Pole */}
                <rect x="6.55" y="24.5" width="0.9" height="38" rx="0.3" fill={fill('neon', zone.color)} stroke={stroke('neon', zone.color)} strokeWidth={swThin} />
                {/* Base */}
                <rect x="4.5" y="62" width="5" height="1.2" rx="0.5" fill={fill('neon', zone.color)} stroke={stroke('neon', zone.color)} strokeWidth={swThin} />
              </g>
            )}

            {zone.frame === 'bernabeu' && (
              // Window: outer frame + cross mullions
              <g filter={filt('bernabeu')}>
                <rect x="25.5" y="8.5" width="31" height="83" rx="1" fill={fill('bernabeu', zone.color)} stroke={stroke('bernabeu', zone.color)} strokeWidth={sw} />
                {/* Horizontal mullion */}
                <line x1="25.5" y1="50" x2="56.5" y2="50" stroke={stroke('bernabeu', zone.color, 0.5)} strokeWidth={swThin} />
                {/* Vertical mullion */}
                <line x1="41" y1="8.5" x2="41" y2="91.5" stroke={stroke('bernabeu', zone.color, 0.5)} strokeWidth={swThin} />
              </g>
            )}

            {zone.frame === 'lab' && (
              // Whiteboard on wall
              <g filter={filt('lab')}>
                <rect x="59.5" y="15.5" width="7" height="38" rx="0.8" fill={fill('lab', zone.color)} stroke={stroke('lab', zone.color)} strokeWidth={sw} />
              </g>
            )}

            {zone.frame === 'buste' && (
              // Bust sculpture: oval head + neck + shoulders
              <g filter={filt('buste')}>
                {/* Head */}
                <ellipse cx="68" cy="57.5" rx="2.2" ry="3" fill={fill('buste', zone.color)} stroke={stroke('buste', zone.color)} strokeWidth={sw} />
                {/* Neck */}
                <rect x="67.3" y="61.2" width="1.4" height="2.5" fill={fill('buste', zone.color)} stroke={stroke('buste', zone.color)} strokeWidth={swThin} />
                {/* Shoulders */}
                <rect x="65" y="63.5" width="6" height="2.5" rx="1" fill={fill('buste', zone.color)} stroke={stroke('buste', zone.color)} strokeWidth={swThin} />
                {/* Pedestal */}
                <rect x="66" y="66" width="4" height="3" rx="0.3" fill={fill('buste', zone.color)} stroke={stroke('buste', zone.color)} strokeWidth={swThin} />
              </g>
            )}

            {zone.frame === 'iMac' && (
              // iMac: screen + chin + neck + base
              <g filter={filt('iMac')}>
                {/* Screen */}
                <rect x="71.5" y="33.5" width="11" height="14.5" rx="1" fill={fill('iMac', zone.color)} stroke={stroke('iMac', zone.color)} strokeWidth={sw} />
                {/* Chin bar */}
                <rect x="71.5" y="48" width="11" height="2.5" rx="0.3" fill={fill('iMac', zone.color)} stroke={stroke('iMac', zone.color)} strokeWidth={swThin} />
                {/* Neck */}
                <rect x="76.5" y="50.5" width="1" height="3.5" fill={fill('iMac', zone.color)} stroke={stroke('iMac', zone.color)} strokeWidth={swThin} />
                {/* Base */}
                <rect x="73.5" y="54" width="7" height="1.5" rx="0.5" fill={fill('iMac', zone.color)} stroke={stroke('iMac', zone.color)} strokeWidth={swThin} />
              </g>
            )}

            {zone.frame === 'bibliotheque' && (
              // Bookshelf: tall unit with shelf lines
              <g filter={filt('bibliotheque')}>
                <rect x="87.5" y="14.5" width="7" height="56" rx="0.8" fill={fill('bibliotheque', zone.color)} stroke={stroke('bibliotheque', zone.color)} strokeWidth={sw} />
                {/* Shelf dividers */}
                <line x1="87.5" y1="28" x2="94.5" y2="28" stroke={stroke('bibliotheque', zone.color, 0.4)} strokeWidth={swThin} />
                <line x1="87.5" y1="42" x2="94.5" y2="42" stroke={stroke('bibliotheque', zone.color, 0.4)} strokeWidth={swThin} />
                <line x1="87.5" y1="56" x2="94.5" y2="56" stroke={stroke('bibliotheque', zone.color, 0.4)} strokeWidth={swThin} />
              </g>
            )}

            {zone.frame === 'hobbies' && (
              // Hobbies area: rounded rect
              <g filter={filt('hobbies')}>
                <rect x="79.5" y="63" width="9" height="17" rx="2" fill={fill('hobbies', zone.color)} stroke={stroke('hobbies', zone.color)} strokeWidth={sw} />
              </g>
            )}
          </g>
        ))}
      </svg>

      {/* Tooltip */}
      {hoveredZone && (
        <div style={{
          position: 'absolute',
          left: `${hoveredZone.tipX}%`,
          top: `${hoveredZone.tipY}%`,
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
          border: `1px solid ${hoveredZone.color}50`,
          zIndex: 30,
        }}>
          {labels[hoveredZone.i18nKey] ?? hoveredZone.label}
        </div>
      )}
    </div>
  )
}
