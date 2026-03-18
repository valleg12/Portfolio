import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import RoomModel from './RoomModel'
import BustModel from './BustModel'
import WindowPlane from './WindowPlane'
import HotspotMesh from './HotspotMesh'
import type { FrameId } from '../../context/RoomContext'

// ── CALIBRATION ─────────────────────────────────────────────────────────────
// camera — fov=62, tilt slightly down to hide open-ceiling black zone
const CAM_POS: [number, number, number]    = [-0.8, 1.0,  5.0]
const CAM_TARGET: [number, number, number] = [ 0.0,  0.2, 0  ]

// window plane — bernabeu.png, 2:1 aspect
const WIN_POS: [number, number, number]    = [-0.4, 0.1, -3.9]
const WIN_SCALE: [number, number, number]  = [4.0,  2.0,  1  ]

// hotspot zones: [x, y, z] center + [w, h, d] size — all in world units (scale=5)
// These are first-pass estimates; calibrate visually after scene loads.
const ZONES: {
  frame: FrameId
  i18nKey: string
  label: string
  color: string
  position: [number, number, number]
  size: [number, number, number]
}[] = [
  // Neon sign — left wall, using z-depth to cover neon visible area
  { frame: 'neon',         i18nKey: 'neon',         label: 'Skills',         color: '#6366f1',
    position: [-2.8, 1.6,  2.0],  size: [0.5, 1.0, 1.5] },
  // Window — back wall center-left
  { frame: 'bernabeu',     i18nKey: 'bernabeu',     label: 'Sport Projects', color: '#3b82f6',
    position: [-0.3, 0.4, -3.7],  size: [3.8, 3.0, 0.2] },
  // Lab — back-right wall area, right of window
  { frame: 'lab',          i18nKey: 'lab',           label: 'Lab',            color: '#22c55e',
    position: [2.2,  1.8, -3.8],  size: [1.8, 1.4, 0.2] },
  // Bust — on pedestal right of iMac
  { frame: 'buste',        i18nKey: 'buste',         label: 'About',          color: '#f59e0b',
    position: [2.0,  1.1, -0.3],  size: [0.9, 1.8, 0.9] },
  // iMac — monitor on round desk
  { frame: 'iMac',         i18nKey: 'iMac',          label: 'Tech Projects',  color: '#22d3ee',
    position: [0.5,  1.0,  0.2],  size: [1.0, 0.9, 0.4] },
  // Bookshelf — right side wall
  { frame: 'bibliotheque', i18nKey: 'bibliotheque',  label: 'Education',      color: '#f97316',
    position: [4.0,  0.8, -1.0],  size: [1.5, 2.4, 2.2] },
  // Hobbies — chess pieces + foreground desk area
  { frame: 'hobbies',      i18nKey: 'hobbies',       label: 'Hobbies',        color: '#f43f5e',
    position: [1.2,  0.6,  1.8],  size: [2.0, 0.5, 1.5] },
]
// ────────────────────────────────────────────────────────────────────────────

interface Props {
  onZoneClick: (frame: FrameId) => void
}

export default function RoomScene({ onZoneClick }: Props) {
  const camRef = useRef<THREE.PerspectiveCamera>(null)
  const mouse  = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  useFrame(() => {
    if (!camRef.current) return
    camRef.current.position.x = CAM_POS[0] + mouse.current.x * 0.25
    camRef.current.position.y = CAM_POS[1] - mouse.current.y * 0.12
    camRef.current.lookAt(...CAM_TARGET)
  })

  return (
    <>
      <PerspectiveCamera ref={camRef} makeDefault position={CAM_POS} fov={62} />

      {/* Lighting */}
      <ambientLight intensity={2.5} />
      <pointLight position={[-3.5, 2.5, 2.5]} intensity={40} color="#ffa060" decay={2} />
      <pointLight position={[-0.3, 1.5, -3.5]} intensity={28} color="#aaccff" decay={2} />
      <pointLight position={[ 3.0, 2.0,  1.0]} intensity={20} color="#fff8f0" decay={2} />

      {/* Models */}
      <RoomModel />
      <BustModel />

      {/* Skybox — large dark box surrounding the entire scene.
          BackSide renders interior faces, filling any gaps in the room model
          (open ceiling, side gaps) with the same deep-brown background color. */}
      <mesh>
        <boxGeometry args={[40, 20, 40]} />
        <meshBasicMaterial color="#0a0806" side={THREE.BackSide} />
      </mesh>

      {/* Occluder: hide Meshy watermark star embedded in floor geometry.
          renderOrder=2 + depthTest=false ensures it paints over the star regardless of depth. */}
      <mesh position={[2.8, -2.2, 1.8]} rotation={[-Math.PI / 2, 0, 0]} renderOrder={2}>
        <planeGeometry args={[4.0, 4.0]} />
        <meshBasicMaterial color="#0c0a12" depthTest={false} />
      </mesh>

      {/* Window background + glass */}
      <WindowPlane position={WIN_POS} scale={WIN_SCALE} />

      {/* Hotspots */}
      {ZONES.map((z) => (
        <HotspotMesh
          key={z.frame}
          frame={z.frame}
          i18nKey={z.i18nKey}
          fallbackLabel={z.label}
          color={z.color}
          position={z.position}
          size={z.size}
          onClick={onZoneClick}
        />
      ))}
    </>
  )
}
