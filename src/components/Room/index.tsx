import { useRef, useState, useEffect, useCallback } from 'react'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import FrameOverlay from './FrameOverlay'

const BASE = import.meta.env.BASE_URL

const IMG_W  = 2804
const IMG_H  = 1536
const ASPECT = IMG_W / IMG_H // ≈ 1.826

const HOTSPOTS: {
  frame: Exclude<FrameId, 'home'>
  left: number; top: number; width: number; height: number
  color: string; label: string
  zoom?: number  // optional per-zone scale factor
}[] = [
  { frame: 'neon',         left:  1, top: 20, width: 15, height: 40, color: '99, 102, 241',  label: 'Skills',    zoom: 4   },
  { frame: 'bernabeu',     left: 19, top:  7, width: 40, height: 80, color: '59, 130, 246',  label: 'Sport',     zoom: 3.5 },
  { frame: 'lab',          left: 59, top: 14, width: 22, height: 52, color: '34, 197, 94',   label: 'Freelance', zoom: 4   },
  { frame: 'buste',        left: 60, top: 50, width:  8, height: 20, color: '245, 158, 11',  label: 'Contact',   zoom: 5   },
  { frame: 'iMac',         left: 68, top: 50, width: 14, height: 22, color: '34, 211, 238',  label: 'Projets',   zoom: 4.5 },
  { frame: 'bibliotheque', left: 82, top: 12, width: 18, height: 46, color: '249, 115, 22',  label: 'Formation', zoom: 4   },
  { frame: 'hobbies',      left: 82, top: 54, width: 18, height: 26, color: '244, 63, 94',   label: 'Hobbies',   zoom: 4.5 },
]

type Phase = 'home' | 'zooming-in' | 'frame' | 'zooming-out'

export default function Room() {
  const { activeFrame, goTo, goHome } = useRoom()

  // 3D tilt
  const wrapperRef  = useRef<HTMLDivElement>(null)
  const sceneRef    = useRef<HTMLDivElement>(null)
  const rafRef      = useRef<number>(0)
  const targetRot   = useRef({ x: 0, y: 0 })
  const currentRot  = useRef({ x: 0, y: 0 })

  // Zoom state
  const [phase, setPhase]           = useState<Phase>('home')
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 })
  const [zoomScale, setZoomScale]   = useState(4)
  const phaseRef = useRef<Phase>('home')
  const [hovered, setHovered]       = useState<string | null>(null)

  // Keep phaseRef in sync
  useEffect(() => { phaseRef.current = phase }, [phase])

  // RAF loop — tilt only when phase is 'home'
  useEffect(() => {
    let alive = true
    function tick() {
      if (!alive || !sceneRef.current) return
      if (phaseRef.current === 'home') {
        const cur = currentRot.current
        const tgt = targetRot.current
        cur.x += (tgt.x - cur.x) * 0.06
        cur.y += (tgt.y - cur.y) * 0.06
        sceneRef.current.style.transform =
          `perspective(1200px) rotateY(${cur.y.toFixed(3)}deg) rotateX(${cur.x.toFixed(3)}deg) scale(1.02)`
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => { alive = false; cancelAnimationFrame(rafRef.current) }
  }, [])

  const onMouseMove = useCallback((e: MouseEvent) => {
    if (phaseRef.current !== 'home') return
    const el = wrapperRef.current
    if (!el) return
    const r  = el.getBoundingClientRect()
    const nx = (e.clientX - r.left) / r.width  - 0.5
    const ny = (e.clientY - r.top)  / r.height - 0.5
    targetRot.current = { x: -ny * 8, y: nx * 10 }
  }, [])

  const onMouseLeave = useCallback(() => {
    targetRot.current = { x: 0, y: 0 }
    setHovered(null)
  }, [])

  useEffect(() => {
    const el = wrapperRef.current
    if (!el) return
    el.addEventListener('mousemove', onMouseMove)
    el.addEventListener('mouseleave', onMouseLeave)
    return () => {
      el.removeEventListener('mousemove', onMouseMove)
      el.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [onMouseMove, onMouseLeave])

  // Trigger the zoom-in transform after React paints the new transformOrigin
  useEffect(() => {
    if (!sceneRef.current) return
    if (phase === 'zooming-in') {
      // rAF ensures the new transformOrigin is applied before we start the CSS transition
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (sceneRef.current)
            sceneRef.current.style.transform = `perspective(1200px) scale(${zoomScale})`
        })
      })
    } else if (phase === 'zooming-out') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (sceneRef.current)
            sceneRef.current.style.transform = `perspective(1200px) rotateY(0deg) rotateX(0deg) scale(1.02)`
        })
      })
    }
  }, [phase, zoomScale])

  // Click a hotspot → zoom in → show frame
  function handleHotspotClick(z: typeof HOTSPOTS[0]) {
    if (phase !== 'home') return
    const cx = z.left  + z.width  / 2
    const cy = z.top   + z.height / 2
    setZoomOrigin({ x: cx, y: cy })
    setZoomScale(z.zoom ?? 4)
    targetRot.current = { x: 0, y: 0 }   // reset tilt smoothly
    setPhase('zooming-in')
    // After zoom-in animation (650ms): reveal frame
    setTimeout(() => {
      goTo(z.frame)
      setPhase('frame')
    }, 650)
  }

  // Back → hide frame → zoom out → home
  function handleBack() {
    if (phase !== 'frame') return
    goHome()                           // unmount FrameOverlay
    setPhase('zooming-out')
    setTimeout(() => {
      currentRot.current = { x: 0, y: 0 }
      setPhase('home')
    }, 650)
  }

  // ── Derived scene styles ────────────────────────────────────────────────
  const isAnimating = phase === 'zooming-in' || phase === 'zooming-out'
  const isZoomed    = phase === 'zooming-in' || phase === 'frame'

  return (
    <>
      <div
        ref={wrapperRef}
        style={{
          position: 'fixed', inset: 0, zIndex: 10,
          background: '#050510',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          ref={sceneRef}
          style={{
            position: 'relative',
            width:  `min(100vw, calc(100vh * ${ASPECT}))`,
            height: `min(100vh, calc(100vw / ${ASPECT}))`,
            transformStyle: 'preserve-3d',
            willChange: 'transform',
            // Enable CSS transition only during zoom animations
            transition: isAnimating
              ? 'transform 0.65s cubic-bezier(0.4, 0, 0.2, 1)'
              : 'none',
            // Anchor the zoom to the clicked hotspot center
            transformOrigin: isZoomed || isAnimating
              ? `${zoomOrigin.x}% ${zoomOrigin.y}%`
              : '50% 50%',
          }}
        >
          {/* Room image */}
          <div
            style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${BASE}ROOM.png)`,
              backgroundSize: '100% 100%',
              backgroundRepeat: 'no-repeat',
            }}
          />

          {/* Vignette */}
          <div
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse 85% 80% at 50% 55%,
                transparent 40%,
                rgba(5,5,16,0.45) 75%,
                rgba(5,5,16,0.75) 100%)`,
              pointerEvents: 'none',
            }}
          />

          {/* Cover Gemini ✦ watermark */}
          <div
            style={{
              position: 'absolute', right: 0, bottom: 0,
              width: '14%', height: '18%',
              background: 'radial-gradient(ellipse at 85% 85%, rgba(8,8,20,0.98) 20%, rgba(8,8,20,0.7) 55%, transparent 80%)',
              pointerEvents: 'none',
            }}
          />

          {/* Hotspot zones — only visible at home */}
          {phase === 'home' && HOTSPOTS.map(z => (
            <div
              key={z.frame}
              title={z.label}
              onClick={() => handleHotspotClick(z)}
              onMouseEnter={() => setHovered(z.frame)}
              onMouseLeave={() => setHovered(null)}
              style={{
                position: 'absolute',
                left:   `${z.left}%`,
                top:    `${z.top}%`,
                width:  `${z.width}%`,
                height: `${z.height}%`,
                cursor: 'pointer',
                borderRadius: 6,
                background: hovered === z.frame
                  ? `radial-gradient(ellipse at center, rgba(${z.color}, 0.22) 0%, rgba(${z.color}, 0.06) 50%, transparent 75%)`
                  : 'transparent',
                boxShadow: hovered === z.frame
                  ? `inset 0 0 30px rgba(${z.color}, 0.12)`
                  : 'none',
                transition: 'background 0.35s ease, box-shadow 0.35s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Frame content — shown while zoomed in */}
      {activeFrame !== 'home' && <FrameOverlay onBack={handleBack} />}
    </>
  )
}
