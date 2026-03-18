import { useState, useMemo, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import type { FrameId } from '../../context/RoomContext'

// ─── Zone definitions ────────────────────────────────────────────────────────
// position: [x, y, z] in 3D world space  (camera at z=7, fov=60)
// size: [width, height, depth] of the bounding box
// Calibrated against ROOM.png (100vw × 100vh, backgroundSize:cover)
// World coords: x ∈ [-5.5, +5.5], y ∈ [-3.1, +3.1] approx at z=0
const ZONES: Array<{
  frame: FrameId
  color: string
  position: [number, number, number]
  size: [number, number, number]
  labelOffset: [number, number, number]
}> = [
  { frame: 'neon',         color: '#6366f1', position: [-4.5, 0.3,  0], size: [0.5, 3.6, 0.4], labelOffset: [0,  2.0, 0] },
  { frame: 'bernabeu',     color: '#3b82f6', position: [-0.5, 0.2,  0], size: [3.2, 2.8, 0.2], labelOffset: [0,  1.6, 0] },
  { frame: 'lab',          color: '#22c55e', position: [ 1.6, 0.6,  0], size: [0.8, 2.4, 0.2], labelOffset: [0,  1.4, 0] },
  { frame: 'buste',        color: '#f59e0b', position: [ 2.2, -0.2, 0], size: [0.7, 1.2, 0.4], labelOffset: [0,  0.7, 0] },
  { frame: 'iMac',         color: '#22d3ee', position: [ 3.0, 0.1,  0], size: [1.2, 1.4, 0.3], labelOffset: [0,  0.8, 0] },
  { frame: 'bibliotheque', color: '#f97316', position: [ 4.5, 0.3,  0], size: [0.8, 3.2, 0.4], labelOffset: [0,  1.8, 0] },
  { frame: 'hobbies',      color: '#f43f5e', position: [ 3.5, -1.0, 0], size: [1.2, 0.7, 0.4], labelOffset: [0,  0.5, 0] },
]

// ─── Single HotspotZone ───────────────────────────────────────────────────────
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

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(size[0], size[1], size[2])),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [size[0], size[1], size[2]]
  )

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  return (
    <group position={position}>
      {/* Invisible hit mesh */}
      <mesh
        visible={false}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={() => onClick(frame)}
      >
        <boxGeometry args={size} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Neon wire cage — only on hover */}
      {hovered && (
        <>
          <lineSegments geometry={edges}>
            <lineBasicMaterial color={color} transparent opacity={0.95} />
          </lineSegments>
          <Html
            position={labelOffset}
            center
            style={{ pointerEvents: 'none' }}
          >
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
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.4} intensity={0.6} />
      </EffectComposer>
    </>
  )
}

// ─── Canvas wrapper ───────────────────────────────────────────────────────────
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
