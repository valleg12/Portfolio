import { useState, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import type { FrameId } from '../../context/RoomContext'

// Debug: set true to see all zone outlines without hovering
const DEBUG_ALL = false

// ─── Zone definitions ─────────────────────────────────────────────────────────
// Camera [0,0,7] fov=60 — visible world at z=0: x∈[-4.68,4.68] y∈[-4.04,4.04]
// Formula: world_x = (px/800 - 0.5) × 9.35
//          world_y = (0.5 - py/670) × 8.08
// All positions measured pixel-precisely from ROOM.png screenshot (800×670)
//
//  Zone             px_x   px_y   px_w  px_h   → what it covers
//  neon/Skills      0-140  0-630              → left wall wooden panel
//  bernabeu/Window  162-488 65-568            → large stadium window
//  lab/Whiteboard   488-573 65-430            → wall right of window
//  buste/About      597-630 402-456           → classical bust on desk
//  iMac/TechProj    645-762 352-462           → iMac screen
//  biblio/Education 762-800 0-630             → right wall panel
//  hobbies          588-680 455-510           → desk hobbies area
const ZONES: Array<{
  frame: FrameId
  color: string
  position: [number, number, number]
  size: [number, number, number]
  labelOffset: [number, number, number]
}> = [
  // Left wall panel (Skills)
  { frame: 'neon',         color: '#6366f1', position: [-3.86,  0.25, 0], size: [1.50, 6.80, 0.01], labelOffset: [0.9,  3.8, 0] },
  // Stadium window (Sport Projects)
  { frame: 'bernabeu',     color: '#3b82f6', position: [-0.88,  0.23, 0], size: [3.81, 6.07, 0.01], labelOffset: [0,    3.5, 0] },
  // Wall right of window (Lab)
  { frame: 'lab',          color: '#22c55e', position: [ 1.52,  1.06, 0], size: [0.99, 4.41, 0.01], labelOffset: [0,    2.5, 0] },
  // Classical bust (About me)
  { frame: 'buste',        color: '#f59e0b', position: [ 2.50, -1.13, 0], size: [0.65, 1.20, 0.01], labelOffset: [0.5,  0.75, 0] },
  // iMac screen (Tech Projects)
  { frame: 'iMac',         color: '#22d3ee', position: [ 3.54, -0.87, 0], size: [1.37, 1.33, 0.01], labelOffset: [0,    0.85, 0] },
  // Right wall panel (Education)
  { frame: 'bibliotheque', color: '#f97316', position: [ 4.02,  0.25, 0], size: [0.85, 6.80, 0.01], labelOffset: [-0.6, 3.8, 0] },
  // Desk hobbies area
  { frame: 'hobbies',      color: '#f43f5e', position: [ 2.75, -1.78, 0], size: [1.05, 0.70, 0.01], labelOffset: [0,    0.55, 0] },
]

// ─── Simple rectangle outline geometry ───────────────────────────────────────
function makeRectGeo(w: number, h: number): THREE.BufferGeometry {
  const hw = w / 2, hh = h / 2
  const pts = new Float32Array([
    -hw, -hh, 0,  hw, -hh, 0,   // bottom
     hw, -hh, 0,  hw,  hh, 0,   // right
     hw,  hh, 0, -hw,  hh, 0,   // top
    -hw,  hh, 0, -hw, -hh, 0,   // left
  ])
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return geo
}

// ─── Single zone ─────────────────────────────────────────────────────────────
interface ZoneProps {
  frame: FrameId
  color: string
  position: [number, number, number]
  size: [number, number, number]
  labelOffset: [number, number, number]
  onClick: (frame: FrameId) => void
}

function HotspotZone({ frame, color, position, size, labelOffset, onClick }: ZoneProps) {
  const { t } = useTranslation()
  const [hovered, setHovered] = useState(false)
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  const rectGeo = useMemo(
    () => makeRectGeo(size[0], size[1]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size[0], size[1]]
  )

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  const show = hovered || DEBUG_ALL

  return (
    <group position={position}>
      {/* Invisible hit box */}
      <mesh
        visible={false}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onClick(frame)}
      >
        <boxGeometry args={[size[0], size[1], 0.05]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Neon rectangle outline — on hover (or always in debug) */}
      {show && (
        <>
          <lineSegments geometry={rectGeo}>
            <lineBasicMaterial color={color} transparent opacity={0.95} />
          </lineSegments>
          <Html position={labelOffset} center style={{ pointerEvents: 'none' }}>
            <div style={{
              background: 'rgba(0,0,0,0.85)',
              color: 'white',
              fontSize: '0.7rem',
              padding: '3px 10px',
              borderRadius: 5,
              whiteSpace: 'nowrap',
              fontFamily: 'Inter, sans-serif',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              border: `1px solid ${color}60`,
            }}>
              {labels[frame] ?? frame}
            </div>
          </Html>
        </>
      )}
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ onClick }: { onClick: (f: FrameId) => void }) {
  return (
    <>
      {ZONES.map(z => (
        <HotspotZone key={z.frame} {...z} onClick={onClick} />
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.4} intensity={0.9} />
      </EffectComposer>
    </>
  )
}

// ─── Canvas ───────────────────────────────────────────────────────────────────
interface Props {
  onClick: (frame: FrameId) => void
}

export default function RoomHotspotCanvas({ onClick }: Props) {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 20 }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
        camera={{ position: [0, 0, 7], fov: 60 }}
      >
        <Scene onClick={onClick} />
      </Canvas>
    </div>
  )
}
