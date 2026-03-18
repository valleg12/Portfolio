# Room Neon Hotspots Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the SVG zone overlays with a transparent R3F Canvas overlay showing 3D neon wire-cage hotspots (EdgesGeometry + Bloom) on top of the ROOM.png photo background.

**Architecture:** Keep `RoomBackground.tsx` (ROOM.png + parallax) intact. Add `RoomHotspotCanvas.tsx` — a transparent `<Canvas>` positioned absolutely on top. Each clickable zone is an invisible `BoxGeometry` for raycasting + an `EdgesGeometry` lineSegments cage rendered on hover with a neon color. Bloom from `@react-three/postprocessing` makes lines actually glow.

**Tech Stack:** React 18, @react-three/fiber, @react-three/drei (Html), @react-three/postprocessing (Bloom), three.js (EdgesGeometry, BoxGeometry), GSAP (zoom), react-i18next (labels)

---

### Task 1: Restore clean 2D baseline

Restore the state from commit `e48a66e` (ROOM.png + SVG zones working) so we have a clean base to build on.

**Files:**
- Modify: `src/components/Room/index.tsx`
- Restore: `src/components/Room/RoomBackground.tsx`

**Step 1: Restore RoomBackground.tsx**

Create `src/components/Room/RoomBackground.tsx` with this exact content:

```tsx
import { useEffect, useRef } from 'react'

const BASE = import.meta.env.BASE_URL

export default function RoomBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) * 0.006
      const dy = (e.clientY - cy) * 0.006
      ref.current.style.transform = `translate(${-dx}px, ${-dy}px) scale(1.015)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          inset: '-2%',
          backgroundImage: `url(${BASE}ROOM.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          transform: 'translate(0px, 0px) scale(1.015)',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
```

**Step 2: Restore Room/index.tsx to the SVG-era version**

Replace full content of `src/components/Room/index.tsx`:

```tsx
import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomBackground from './RoomBackground'
import RoomHotspotCanvas from './RoomHotspotCanvas'
import FrameOverlay from './FrameOverlay'

const ZONE_CENTERS: Record<Exclude<FrameId, 'home'>, { x: number; y: number }> = {
  neon:         { x: 7,  y: 40 },
  bernabeu:     { x: 41, y: 50 },
  lab:          { x: 63, y: 35 },
  buste:        { x: 68, y: 62 },
  iMac:         { x: 77, y: 47 },
  bibliotheque: { x: 91, y: 42 },
  hobbies:      { x: 84, y: 72 },
}

export default function Room() {
  const { activeFrame, goTo, goHome } = useRoom()
  const sceneRef = useRef<HTMLDivElement>(null)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null)

  useEffect(() => {
    if (activeFrame === 'home' && zoomOrigin && sceneRef.current) {
      gsap.fromTo(
        sceneRef.current,
        { scale: 4, opacity: 0, transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` },
        {
          scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out',
          onComplete: () => setZoomOrigin(null),
        }
      )
    } else if (activeFrame === 'home' && !zoomOrigin && sceneRef.current) {
      gsap.set(sceneRef.current, { scale: 1, opacity: 1, transformOrigin: 'center center' })
    }
  }, [activeFrame])

  function handleZoneClick(frame: FrameId) {
    if (!sceneRef.current) return
    const center = ZONE_CENTERS[frame as Exclude<FrameId, 'home'>]
    if (!center) return
    setZoomOrigin(center)
    gsap.to(sceneRef.current, {
      scale: 5,
      transformOrigin: `${center.x}% ${center.y}%`,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => goTo(frame),
    })
  }

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
        <div ref={sceneRef} style={{ position: 'absolute', inset: 0 }}>
          <RoomBackground />
          {activeFrame === 'home' && <RoomHotspotCanvas onClick={handleZoneClick} />}
        </div>
      </div>
      {activeFrame !== 'home' && <FrameOverlay onBack={goHome} />}
    </>
  )
}
```

**Step 3: Start dev server and verify ROOM.png background shows**

```bash
~/.nvm/versions/node/v22.11.0/bin/node node_modules/.bin/vite --port 5173
```

Expected: http://localhost:5173 shows ROOM.png. `RoomHotspotCanvas` is missing (will create in Task 2), so expect a compile error — that's fine, fix in Task 2.

**Step 4: Commit**

```bash
git add src/components/Room/index.tsx src/components/Room/RoomBackground.tsx
git commit -m "feat: restore ROOM.png background baseline for neon hotspot refactor"
```

---

### Task 2: Create RoomHotspotCanvas with first zone (bernabeu)

Create the transparent R3F Canvas overlay with a single zone to calibrate the camera first.

**Files:**
- Create: `src/components/Room/RoomHotspotCanvas.tsx`

**Step 1: Create RoomHotspotCanvas.tsx**

```tsx
import { useState, useMemo, useRef, useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'
import { useTranslation } from 'react-i18next'
import type { FrameId } from '../../context/RoomContext'

// ─── Zone definitions ────────────────────────────────────────────────────────
// position: [x, y, z] in 3D world space
// size: [width, height, depth] of the bounding box
// Calibrate these values visually against ROOM.png
const ZONES: Array<{
  frame: FrameId
  color: string
  position: [number, number, number]
  size: [number, number, number]
  labelOffset: [number, number, number]  // where Html tooltip anchors
}> = [
  { frame: 'neon',         color: '#6366f1', position: [-4.2, 0.8,  0], size: [0.4, 2.8, 0.4], labelOffset: [0,  1.6, 0] },
  { frame: 'bernabeu',     color: '#3b82f6', position: [-0.8, 0.5,  0], size: [2.8, 2.4, 0.2], labelOffset: [0,  1.4, 0] },
  { frame: 'lab',          color: '#22c55e', position: [ 1.2, 0.8,  0], size: [0.7, 2.0, 0.2], labelOffset: [0,  1.2, 0] },
  { frame: 'buste',        color: '#f59e0b', position: [ 1.8, 0.0,  0], size: [0.6, 1.0, 0.4], labelOffset: [0,  0.6, 0] },
  { frame: 'iMac',         color: '#22d3ee', position: [ 2.4, 0.2,  0], size: [1.0, 1.2, 0.3], labelOffset: [0,  0.8, 0] },
  { frame: 'bibliotheque', color: '#f97316', position: [ 4.0, 0.6,  0], size: [0.7, 2.8, 0.4], labelOffset: [0,  1.6, 0] },
  { frame: 'hobbies',      color: '#f43f5e', position: [ 3.0, -0.8, 0], size: [1.0, 0.6, 0.4], labelOffset: [0,  0.4, 0] },
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
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)),
    [size[0], size[1], size[2]]
  )

  // Cursor change
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
            position={[labelOffset[0], labelOffset[1], labelOffset[2]]}
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
```

**Step 2: Verify dev server compiles**

Check that the component renders without errors. The Canvas is transparent so only the neon cages will be visible on hover.

**Step 3: Commit**

```bash
git add src/components/Room/RoomHotspotCanvas.tsx
git commit -m "feat: add transparent R3F neon hotspot canvas overlay"
```

---

### Task 3: Visual calibration — align boxes to ROOM.png objects

This is the calibration task. Hover over each zone and adjust `ZONES` positions/sizes until each wire cage covers the correct object in the photo.

**Files:**
- Modify: `src/components/Room/RoomHotspotCanvas.tsx` (ZONES array only)

**Calibration guide:**

The camera is at `position: [0, 0, 7]` with `fov: 60`. World-space coordinates map to screen roughly as:
- X = -5 (far left) to +5 (far right)
- Y = -3 (bottom) to +3 (top)

Use this mapping from the old SVG % coordinates:
```
3D x = (svgX% - 50) * 0.12    // 100% span = ~12 world units at z=0
3D y = (50 - svgY%) * 0.06    // 100% span = ~6 world units at z=0
```

Old SVG zones (% coords):
| Zone         | svgX | svgY | svgW | svgH |
|--------------|------|------|------|------|
| neon         | 3    | 12   | 8    | 57   |
| bernabeu     | 24.5 | 7.5  | 33   | 85   |
| lab          | 59   | 14   | 8    | 42   |
| buste        | 65.5 | 54   | 5    | 16   |
| iMac         | 71.5 | 33   | 11   | 27   |
| bibliotheque | 87   | 13   | 8    | 57   |
| hobbies      | 79   | 62   | 10   | 20   |

**Fallback — Approach B (if boxes are hard to align):**

If after 2-3 calibration attempts the boxes don't align well, switch to loading desk.glb to compute bounding boxes:

```tsx
// In RoomHotspotCanvas.tsx, add a debug mode:
import { useGLTF } from '@react-three/drei'
const BASE = import.meta.env.BASE_URL

function DebugBoxes() {
  const { scene } = useGLTF(`${BASE}desk.glb`)
  useEffect(() => {
    scene.traverse(obj => {
      if (obj instanceof THREE.Mesh) {
        const box = new THREE.Box3().setFromObject(obj)
        const size = box.getSize(new THREE.Vector3())
        const center = box.getCenter(new THREE.Vector3())
        console.log(obj.name, { center, size })
      }
    })
  }, [scene])
  return null
}
```

Log the bounding boxes, then use center/size as position/size for each ZONE.

**Step 1: Open dev server and hover each zone**

Check visually: does the neon cage cover the right object?

**Step 2: Adjust ZONES array**

Edit `ZONES` in `RoomHotspotCanvas.tsx` — positions and sizes only. Keep iterating until all 7 zones align.

**Step 3: Commit calibrated positions**

```bash
git add src/components/Room/RoomHotspotCanvas.tsx
git commit -m "feat: calibrate neon hotspot zones to ROOM.png objects"
```

---

### Task 4: Delete dead code from the 3D GLB scene attempt

Remove files that were part of the full 3D scene (now replaced).

**Files:**
- Delete: `src/components/Room/RoomSVGZones.tsx`
- Delete: `src/components/Room/RoomScene.tsx`
- Delete: `src/components/Room/RoomModel.tsx`
- Delete: `src/components/Room/BustModel.tsx`
- Delete: `src/components/Room/WindowPlane.tsx`
- Delete: `src/components/Room/HotspotMesh.tsx`

**Step 1: Delete files**

```bash
git rm src/components/Room/RoomSVGZones.tsx \
       src/components/Room/RoomScene.tsx \
       src/components/Room/RoomModel.tsx \
       src/components/Room/BustModel.tsx \
       src/components/Room/WindowPlane.tsx \
       src/components/Room/HotspotMesh.tsx
```

**Step 2: Verify build compiles cleanly**

```bash
~/.nvm/versions/node/v22.11.0/bin/node node_modules/.bin/vite build 2>&1 | tail -20
```

Expected: no TypeScript or import errors.

**Step 3: Commit**

```bash
git commit -m "chore: remove dead 3D GLB scene components"
```

---

### Task 5: Production build + GitHub Pages deploy

**Files:**
- No code changes

**Step 1: Run production build**

```bash
~/.nvm/versions/node/v22.11.0/bin/node node_modules/.bin/vite build 2>&1 | tail -30
```

Expected: `dist/` folder generated, no errors.

**Step 2: Push to main**

```bash
git push origin main
```

Expected: GitHub Actions CI triggers, deploys to https://valleg12.github.io/Portfolio/

**Step 3: Verify deployed site**

Open https://valleg12.github.io/Portfolio/ and hover each zone — neon wire cages should appear with bloom glow.
