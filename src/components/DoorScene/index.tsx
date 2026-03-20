import { useState, useEffect, useCallback } from 'react'

interface Props {
  onEnter: () => void
}

const BASE = import.meta.env.BASE_URL
const DOOR_URL = `${BASE}DOOR.png`

// Door bounds in the original 2528×1692 image (pixels)
const IMG_W = 2528, IMG_H = 1692
const DOOR_LEFT_PX   = 0.375 * IMG_W  // 948
const DOOR_TOP_PX    = 0.185 * IMG_H  // 313
const DOOR_WIDTH_PX  = 0.235 * IMG_W  // 594
const DOOR_HEIGHT_PX = 0.715 * IMG_H  // 1210

function coverRect(vw: number, vh: number) {
  const scale = Math.max(vw / IMG_W, vh / IMG_H)
  const rw = IMG_W * scale, rh = IMG_H * scale
  const ox = (vw - rw) / 2, oy = (vh - rh) / 2
  return {
    left:   ox + DOOR_LEFT_PX * scale,
    top:    oy + DOOR_TOP_PX * scale,
    width:  DOOR_WIDTH_PX * scale,
    height: DOOR_HEIGHT_PX * scale,
    perspX: ox + (DOOR_LEFT_PX + DOOR_WIDTH_PX / 2) * scale,
    perspY: oy + (DOOR_TOP_PX  + DOOR_HEIGHT_PX / 2) * scale,
    // Background slice alignment for door panel
    bgSize: `${IMG_W * scale}px ${IMG_H * scale}px`,
    bgPos:  `${-DOOR_LEFT_PX * scale}px ${-DOOR_TOP_PX * scale}px`,
  }
}

export default function DoorScene({ onEnter }: Props) {
  const [opening, setOpening] = useState(false)
  const [fading,  setFading]  = useState(false)
  const [mounted, setMounted] = useState(false)
  const [rect,    setRect]    = useState(() => coverRect(window.innerWidth, window.innerHeight))
  const [mouse,   setMouse]   = useState({ x: -999, y: -999 })

  const recalc = useCallback(() => {
    setRect(coverRect(window.innerWidth, window.innerHeight))
  }, [])

  useEffect(() => {
    recalc()
    window.addEventListener('resize', recalc)
    requestAnimationFrame(() => setMounted(true))
    return () => window.removeEventListener('resize', recalc)
  }, [recalc])

  function handleClick() {
    if (opening) return
    setOpening(true)
    setTimeout(() => {
      setFading(true)
      setTimeout(() => onEnter(), 700)
    }, 820)
  }

  const { left, top, width, height, perspX, perspY, bgSize, bgPos } = rect

  return (
    <div
      onMouseMove={e => setMouse({ x: e.clientX, y: e.clientY })}
      onMouseLeave={() => setMouse({ x: -999, y: -999 })}
      style={{
        position: 'fixed', inset: 0,
        overflow: 'hidden',
        perspective: '1400px',
        perspectiveOrigin: `${perspX}px ${perspY}px`,
        opacity: !mounted ? 0 : fading ? 0 : 1,
        transform: fading ? 'scale(1.6)' : 'scale(1)',
        transformOrigin: `${perspX}px ${perspY}px`,
        transition: fading
          ? 'opacity 0.7s ease, transform 0.7s ease'
          : 'opacity 0.75s ease',
      }}
    >
      {/* Background scene image */}
      <img
        src={DOOR_URL}
        onLoad={recalc}
        draggable={false}
        style={{
          position: 'absolute', inset: 0,
          width: '100%', height: '100%',
          objectFit: 'cover',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      />

      {/* Cursor spotlight */}
      <div style={{
        position: 'absolute', inset: 0,
        background: mouse.x < 0 ? 'none' : `radial-gradient(circle 340px at ${mouse.x}px ${mouse.y}px, transparent 0%, rgba(0,0,0,0.18) 100%)`,
        pointerEvents: 'none',
        zIndex: 1,
      }} />

      {/* Opaque plate — hides door in bg when panel swings open */}
      <div style={{
        position: 'absolute',
        left, top, width, height,
        background: '#0d0a07',
        pointerEvents: 'none',
        zIndex: 2,
      }} />

      {/* Warm light revealed when door opens */}
      <div style={{
        position: 'absolute',
        left, top, width, height,
        background: 'radial-gradient(ellipse at 50% 40%, rgba(255,220,100,0.4) 0%, rgba(200,140,50,0.15) 50%, transparent 80%)',
        opacity: opening ? 1 : 0,
        transition: 'opacity 0.4s ease 0.3s',
        pointerEvents: 'none',
        zIndex: 3,
      }} />

      {/* Door panel — pixel-accurate slice of DOOR.png, rotates open */}
      <div
        onClick={handleClick}
        style={{
          position: 'absolute',
          left, top, width, height,
          backgroundImage: `url("${DOOR_URL}")`,
          backgroundSize: bgSize,
          backgroundPosition: bgPos,
          backgroundRepeat: 'no-repeat',
          transformOrigin: 'left center',
          transform: opening ? 'rotateY(-108deg)' : 'rotateY(0deg)',
          transition: 'transform 0.85s cubic-bezier(0.4, 0, 0.15, 1)',
          cursor: opening ? 'default' : 'pointer',
          zIndex: 4,
          boxShadow: 'inset 3px 0 8px rgba(0,0,0,0.3)',
        }}
      />

      {/* Cover Gemini ✦ watermark (bottom-right) */}
      <div style={{
        position: 'absolute', right: 0, bottom: 0,
        width: '7%', height: '9%',
        background: 'radial-gradient(ellipse at 85% 85%, #0d0905 30%, transparent 75%)',
        pointerEvents: 'none',
        zIndex: 5,
      }} />

      {/* "Click to enter" hint */}
      <p style={{
        position: 'absolute',
        bottom: '6%', left: '50%',
        transform: 'translateX(-50%)',
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: '0.7rem',
        color: 'rgba(255,255,255,0.28)',
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        opacity: opening ? 0 : 1,
        transition: 'opacity 0.3s ease',
        pointerEvents: 'none',
        zIndex: 6,
      }}>
        Click to enter
      </p>
    </div>
  )
}
