import { useState, useMemo, useEffect, useRef } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html, useGLTF } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import type { FrameId } from '../../context/RoomContext'

const BASE = import.meta.env.BASE_URL
const DEBUG_ALL = false

// ─── Zone definitions ─────────────────────────────────────────────────────────
// Camera: [0, 0, 7] fov=60 → world visible at z=0: x∈[-4.68,4.68] y∈[-3.1,3.1]
// Positions calibrated against ROOM.png (backgroundSize:cover)
const ZONES: Array<{
  frame: FrameId
  color: string
  position: [number, number, number]
  size: [number, number, number]
  labelOffset: [number, number, number]
  shape: 'lamp' | 'window' | 'rect' | 'buste' | 'imac' | 'shelf' | 'roundrect'
}> = [
  { frame: 'neon',         color: '#6366f1', position: [-3.74,  0.40, 0], size: [0.75, 4.61, 0.01], labelOffset: [0.6,  2.0,  0], shape: 'lamp'     },
  { frame: 'bernabeu',     color: '#3b82f6', position: [-0.84,  0.00, 0], size: [3.09, 5.80, 0.01], labelOffset: [0,    3.2,  0], shape: 'window'   },
  { frame: 'lab',          color: '#22c55e', position: [ 1.22,  1.21, 0], size: [0.75, 3.39, 0.01], labelOffset: [0,    2.0,  0], shape: 'rect'     },
  { frame: 'buste',        color: '#f59e0b', position: [ 2.48, -1.10, 0], size: [0.60, 1.10, 0.01], labelOffset: [0.5,  0.7,  0], shape: 'buste'    },
  { frame: 'iMac',         color: '#22d3ee', position: [ 3.55, -0.86, 0], size: [1.31, 1.27, 0.01], labelOffset: [0,    0.8,  0], shape: 'imac'     },
  { frame: 'bibliotheque', color: '#f97316', position: [ 3.83,  0.69, 0], size: [0.75, 4.61, 0.01], labelOffset: [-0.5, 2.6,  0], shape: 'shelf'    },
  { frame: 'hobbies',      color: '#f43f5e', position: [ 3.18, -1.78, 0], size: [0.94, 1.00, 0.01], labelOffset: [0,    0.65, 0], shape: 'roundrect'},
]

// ─── Custom shape generators ──────────────────────────────────────────────────
// Each returns a Float32Array of line segment pairs: [x0,y0,z0, x1,y1,z1, ...]
// All coordinates relative to zone center (0,0,0)

function lampShape(w: number, h: number): Float32Array {
  const pts: number[] = []
  const hw = w * 0.5, hh = h * 0.5
  // Arc arm: curves from base up to the lamp head (parametric)
  const armSteps = 20
  const armPts: [number, number][] = []
  for (let i = 0; i <= armSteps; i++) {
    const t = i / armSteps
    // arm sweeps from bottom-center to top, arcing to the left
    const x = Math.sin(t * Math.PI * 0.72) * hw * 1.1 - hw * 0.05
    const y = -hh + t * h * 0.88
    armPts.push([x, y])
  }
  for (let i = 0; i < armPts.length - 1; i++) {
    pts.push(armPts[i][0], armPts[i][1], 0, armPts[i+1][0], armPts[i+1][1], 0)
  }
  // Shade: flat ellipse at top of arm
  const [shadeX, shadeY] = armPts[armPts.length - 1]
  const shadeRx = hw * 1.1, shadeRy = hh * 0.08
  const shadeSteps = 24
  for (let i = 0; i < shadeSteps; i++) {
    const a0 = (2 * Math.PI * i) / shadeSteps
    const a1 = (2 * Math.PI * (i + 1)) / shadeSteps
    pts.push(
      shadeX + Math.cos(a0) * shadeRx, shadeY + Math.sin(a0) * shadeRy, 0,
      shadeX + Math.cos(a1) * shadeRx, shadeY + Math.sin(a1) * shadeRy, 0,
    )
  }
  // Base: small rectangle at bottom
  const bw = hw * 0.8, by = -hh + hh * 0.06
  pts.push(-bw, -hh, 0, bw, -hh, 0)
  pts.push(-bw * 0.6, -hh, 0, -bw * 0.6, by, 0)
  pts.push( bw * 0.6, -hh, 0,  bw * 0.6, by, 0)
  return new Float32Array(pts)
}

function windowShape(w: number, h: number): Float32Array {
  const pts: number[] = []
  const hw = w * 0.5, hh = h * 0.5
  // Outer frame
  pts.push(-hw, -hh, 0,  hw, -hh, 0)
  pts.push( hw, -hh, 0,  hw,  hh, 0)
  pts.push( hw,  hh, 0, -hw,  hh, 0)
  pts.push(-hw,  hh, 0, -hw, -hh, 0)
  // Horizontal mullion
  pts.push(-hw, 0, 0, hw, 0, 0)
  // Vertical mullion
  pts.push(0, -hh, 0, 0, hh, 0)
  // Inner frame (slight inset)
  const inset = Math.min(hw, hh) * 0.06
  pts.push(-hw+inset, -hh+inset, 0,  hw-inset, -hh+inset, 0)
  pts.push( hw-inset, -hh+inset, 0,  hw-inset,  hh-inset, 0)
  pts.push( hw-inset,  hh-inset, 0, -hw+inset,  hh-inset, 0)
  pts.push(-hw+inset,  hh-inset, 0, -hw+inset, -hh+inset, 0)
  return new Float32Array(pts)
}

function rectShape(w: number, h: number): Float32Array {
  const hw = w * 0.5, hh = h * 0.5
  return new Float32Array([
    -hw, -hh, 0,  hw, -hh, 0,
     hw, -hh, 0,  hw,  hh, 0,
     hw,  hh, 0, -hw,  hh, 0,
    -hw,  hh, 0, -hw, -hh, 0,
  ])
}

function busteShape(w: number, h: number): Float32Array {
  const pts: number[] = []
  const hw = w * 0.5, hh = h * 0.5
  // Head: oval at top
  const headRx = hw * 0.7, headRy = hh * 0.32
  const headCy = hh * 0.42
  const headSteps = 24
  for (let i = 0; i < headSteps; i++) {
    const a0 = (2 * Math.PI * i) / headSteps
    const a1 = (2 * Math.PI * (i + 1)) / headSteps
    pts.push(
      Math.cos(a0) * headRx, headCy + Math.sin(a0) * headRy, 0,
      Math.cos(a1) * headRx, headCy + Math.sin(a1) * headRy, 0,
    )
  }
  // Neck
  const neckW = hw * 0.22
  const neckTop = headCy - headRy
  const neckBot = -hh * 0.05
  pts.push(-neckW, neckTop, 0, -neckW, neckBot, 0)
  pts.push( neckW, neckTop, 0,  neckW, neckBot, 0)
  // Shoulders (arch)
  const shoulderSteps = 14
  for (let i = 0; i < shoulderSteps; i++) {
    const t0 = i / shoulderSteps
    const t1 = (i + 1) / shoulderSteps
    const x0 = -hw + t0 * w
    const y0 = neckBot - Math.sin(t0 * Math.PI) * hh * 0.18
    const x1 = -hw + t1 * w
    const y1 = neckBot - Math.sin(t1 * Math.PI) * hh * 0.18
    pts.push(x0, y0, 0, x1, y1, 0)
  }
  // Pedestal
  const pedW = hw * 0.65, pedTop = -hh * 0.35, pedBot = -hh
  pts.push(-pedW, pedTop, 0,  pedW, pedTop, 0)
  pts.push(-pedW, pedTop, 0, -pedW * 0.75, pedBot, 0)
  pts.push( pedW, pedTop, 0,  pedW * 0.75, pedBot, 0)
  pts.push(-pedW * 0.75, pedBot, 0, pedW * 0.75, pedBot, 0)
  return new Float32Array(pts)
}

function iMacShape(w: number, h: number): Float32Array {
  const pts: number[] = []
  const hw = w * 0.5, hh = h * 0.5
  // Screen (top 60%)
  const screenH = h * 0.60
  const screenBot = hh - screenH
  pts.push(-hw, screenBot, 0,  hw, screenBot, 0)
  pts.push( hw, screenBot, 0,  hw, hh, 0)
  pts.push( hw, hh, 0, -hw, hh, 0)
  pts.push(-hw, hh, 0, -hw, screenBot, 0)
  // Chin bar
  const chinH = h * 0.08
  const chinBot = screenBot - chinH
  pts.push(-hw * 0.95, chinBot, 0, hw * 0.95, chinBot, 0)
  pts.push(-hw * 0.95, screenBot, 0, -hw * 0.95, chinBot, 0)
  pts.push( hw * 0.95, screenBot, 0,  hw * 0.95, chinBot, 0)
  // Neck stem
  const neckW = hw * 0.10
  pts.push(-neckW, chinBot, 0, -neckW, -hh + h * 0.17, 0)
  pts.push( neckW, chinBot, 0,  neckW, -hh + h * 0.17, 0)
  // Base
  const baseW = hw * 0.62, baseH = h * 0.10
  pts.push(-baseW, -hh, 0,  baseW, -hh, 0)
  pts.push(-baseW, -hh, 0, -baseW, -hh + baseH, 0)
  pts.push( baseW, -hh, 0,  baseW, -hh + baseH, 0)
  pts.push(-baseW, -hh + baseH, 0, baseW, -hh + baseH, 0)
  return new Float32Array(pts)
}

function shelfShape(w: number, h: number): Float32Array {
  const pts: number[] = []
  const hw = w * 0.5, hh = h * 0.5
  // Outer rect
  pts.push(-hw, -hh, 0,  hw, -hh, 0)
  pts.push( hw, -hh, 0,  hw,  hh, 0)
  pts.push( hw,  hh, 0, -hw,  hh, 0)
  pts.push(-hw,  hh, 0, -hw, -hh, 0)
  // 3 shelf lines
  for (const frac of [0.25, 0.50, 0.75]) {
    const sy = -hh + h * frac
    pts.push(-hw, sy, 0, hw, sy, 0)
  }
  return new Float32Array(pts)
}

function roundRectShape(w: number, h: number): Float32Array {
  const pts: number[] = []
  const hw = w * 0.5, hh = h * 0.5
  const r = Math.min(hw, hh) * 0.35
  const steps = 8
  const corners: Array<{ cx: number; cy: number; a0: number; a1: number }> = [
    { cx:  hw - r, cy:  hh - r, a0: 0,             a1: Math.PI / 2 },
    { cx: -hw + r, cy:  hh - r, a0: Math.PI / 2,   a1: Math.PI },
    { cx: -hw + r, cy: -hh + r, a0: Math.PI,        a1: 3 * Math.PI / 2 },
    { cx:  hw - r, cy: -hh + r, a0: 3 * Math.PI/2, a1: 2 * Math.PI },
  ]
  for (const c of corners) {
    for (let i = 0; i < steps; i++) {
      const a0 = c.a0 + (c.a1 - c.a0) * (i / steps)
      const a1 = c.a0 + (c.a1 - c.a0) * ((i + 1) / steps)
      pts.push(c.cx + Math.cos(a0) * r, c.cy + Math.sin(a0) * r, 0)
      pts.push(c.cx + Math.cos(a1) * r, c.cy + Math.sin(a1) * r, 0)
    }
  }
  pts.push( hw - r,  hh, 0, -(hw - r),  hh, 0)
  pts.push( hw,  hh - r, 0,  hw, -(hh - r), 0)
  pts.push( hw - r, -hh, 0, -(hw - r), -hh, 0)
  pts.push(-hw,  hh - r, 0, -hw, -(hh - r), 0)
  return new Float32Array(pts)
}

function buildShapeGeometry(
  shape: typeof ZONES[number]['shape'],
  w: number, h: number
): THREE.BufferGeometry {
  let pts: Float32Array
  switch (shape) {
    case 'lamp':      pts = lampShape(w, h); break
    case 'window':    pts = windowShape(w, h); break
    case 'rect':      pts = rectShape(w, h); break
    case 'buste':     pts = busteShape(w, h); break
    case 'imac':      pts = iMacShape(w, h); break
    case 'shelf':     pts = shelfShape(w, h); break
    case 'roundrect': pts = roundRectShape(w, h); break
  }
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3))
  return geo
}

// ─── Invisible GLB room — used as the real hit surface ────────────────────────
function RoomMesh({ onHit, onLeave }: {
  onHit: (point: THREE.Vector3) => void
  onLeave: () => void
}) {
  const { scene } = useGLTF(`${BASE}desk.glb`)
  const mesh = useRef<THREE.Mesh>(null)

  // Clone scene and extract the single mesh_0
  const geom = useMemo(() => {
    let found: THREE.BufferGeometry | null = null
    scene.traverse(obj => {
      if ((obj as THREE.Mesh).isMesh && !found) {
        found = (obj as THREE.Mesh).geometry
      }
    })
    return found
  }, [scene])

  if (!geom) return null

  return (
    <mesh
      ref={mesh}
      geometry={geom}
      scale={5}
      visible={false}
      onPointerMove={e => { e.stopPropagation(); onHit(e.point) }}
      onPointerLeave={() => onLeave()}
    >
      <meshBasicMaterial transparent opacity={0} />
    </mesh>
  )
}

// ─── Single HotspotZone visual ────────────────────────────────────────────────
interface ZoneVisualProps {
  frame: FrameId
  color: string
  position: [number, number, number]
  size: [number, number, number]
  labelOffset: [number, number, number]
  shape: typeof ZONES[number]['shape']
  active: boolean
  onClick: (frame: FrameId) => void
}

function ZoneVisual({ frame, color, position, size, labelOffset, shape, active, onClick }: ZoneVisualProps) {
  const { t } = useTranslation()
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  const shapeGeo = useMemo(
    () => buildShapeGeometry(shape, size[0], size[1]),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [shape, size[0], size[1]]
  )

  if (!active && !DEBUG_ALL) return null

  return (
    <group position={position}>
      {/* Neon shape outline */}
      <lineSegments geometry={shapeGeo}>
        <lineBasicMaterial color={color} transparent opacity={0.95} />
      </lineSegments>
      {/* Invisible click target (flat plane) */}
      <mesh visible={false} onClick={() => onClick(frame)}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      {/* Label */}
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
    </group>
  )
}

// ─── Scene ────────────────────────────────────────────────────────────────────
function Scene({ onClick }: { onClick: (f: FrameId) => void }) {
  const [activeZone, setActiveZone] = useState<FrameId | null>(null)
  const { camera } = useThree()

  // When GLB mesh reports a hit point, find which zone it's in
  function handleHit(point: THREE.Vector3) {
    // Project the hit point to NDC using the current camera
    const ndc = point.clone().project(camera)
    // Map NDC to world coords at z=0 plane (for zone matching)
    const halfH = Math.tan((camera as THREE.PerspectiveCamera).fov * 0.5 * Math.PI / 180) *
                  Math.abs(camera.position.z)
    const halfW = halfH * ((camera as THREE.PerspectiveCamera).aspect ?? 1)
    const wx = ndc.x * halfW
    const wy = ndc.y * halfH

    // Find which zone the projected screen position falls within
    let found: FrameId | null = null
    for (const z of ZONES) {
      const [zx, zy] = z.position
      const [sw, sh] = z.size
      if (
        wx >= zx - sw / 2 && wx <= zx + sw / 2 &&
        wy >= zy - sh / 2 && wy <= zy + sh / 2
      ) {
        found = z.frame
        break
      }
    }
    setActiveZone(found)
    document.body.style.cursor = found ? 'pointer' : 'auto'
  }

  function handleLeave() {
    setActiveZone(null)
    document.body.style.cursor = 'auto'
  }

  return (
    <>
      <RoomMesh onHit={handleHit} onLeave={handleLeave} />
      {ZONES.map(z => (
        <ZoneVisual
          key={z.frame}
          {...z}
          active={activeZone === z.frame}
          onClick={onClick}
        />
      ))}
      <EffectComposer>
        <Bloom luminanceThreshold={0.05} luminanceSmoothing={0.4} intensity={0.8} />
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

useGLTF.preload(`${import.meta.env.BASE_URL}desk.glb`)
