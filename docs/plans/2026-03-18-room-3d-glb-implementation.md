# Room 3D GLB Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace ROOM.png CSS background + SVG hotspot overlay with a full R3F 3D scene using two Meshy AI GLBs, with a Bernabéu window plane and invisible 3D hotspot meshes.

**Architecture:** `Room/index.tsx` wraps an R3F `<Canvas>` full-screen. `RoomScene` assembles the desk GLB, bust GLB (positioned on pedestal), a background plane with ROOM.png through the window hole, a glass pane mesh, and invisible clickable box meshes per zone. GSAP zoom and FrameOverlay remain completely unchanged.

**Tech Stack:** @react-three/fiber, @react-three/drei (useGLTF, Html, PerspectiveCamera), three.js MeshPhysicalMaterial, GSAP (unchanged), react-i18next (unchanged)

---

### Task 1: Copy GLB assets to public/

**Files:**
- Create: `public/desk.glb`
- Create: `public/bust.glb`

**Step 1: Copy GLBs into public/**

```bash
cp ~/Desktop/3D/Meshy_AI_Desk_0318135816_texture.glb public/desk.glb
cp ~/Desktop/3D/Meshy_AI_Tiny_Classical_Bust_0318140023_texture.glb public/bust.glb
```

**Step 2: Verify**

```bash
ls -lh public/desk.glb public/bust.glb
```
Expected: `~15M public/desk.glb` and `~19M public/bust.glb`

**Step 3: Add to .gitignore (GLBs are large — don't commit them to git)**

Add to `.gitignore`:
```
public/desk.glb
public/bust.glb
```

**Step 4: Commit .gitignore update**

```bash
git add .gitignore
git commit -m "chore: ignore large GLB assets from git"
```

---

### Task 2: Inspect GLB structure (mesh names + bounding box)

This step identifies the mesh name of the bad bust in the desk GLB and calibrates the scene scale.

**Files:**
- Modify: `src/components/Room/RoomScene.tsx` (temporary debug code, removed in Task 7)

**Step 1: Create a temporary debug scene**

Create `src/components/Room/RoomScene.tsx` with:

```tsx
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL

export default function RoomScene() {
  const desk = useGLTF(`${BASE}desk.glb`)
  const bust = useGLTF(`${BASE}bust.glb`)

  useEffect(() => {
    console.group('=== DESK GLB MESHES ===')
    desk.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const bb = new THREE.Box3().setFromObject(mesh)
        console.log(mesh.name, '| center:', bb.getCenter(new THREE.Vector3()), '| size:', bb.getSize(new THREE.Vector3()))
      }
    })
    console.groupEnd()

    const deskBB = new THREE.Box3().setFromObject(desk.scene)
    console.log('DESK TOTAL BOUNDS:', deskBB.getCenter(new THREE.Vector3()), deskBB.getSize(new THREE.Vector3()))

    console.group('=== BUST GLB MESHES ===')
    bust.scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        const mesh = obj as THREE.Mesh
        const bb = new THREE.Box3().setFromObject(mesh)
        console.log(mesh.name, bb.getCenter(new THREE.Vector3()), bb.getSize(new THREE.Vector3()))
      }
    })
    console.groupEnd()
  }, [desk.scene, bust.scene])

  return (
    <>
      <ambientLight intensity={0.8} />
      <primitive object={desk.scene} />
    </>
  )
}
```

**Step 2: Create a minimal Room/index.tsx with Canvas**

Replace `src/components/Room/index.tsx` with:

```tsx
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { useRoom } from '../../context/RoomContext'
import RoomScene from './RoomScene'
import FrameOverlay from './FrameOverlay'

export default function Room() {
  const { activeFrame, goHome } = useRoom()

  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
        <Canvas camera={{ position: [0, 3, 8], fov: 45 }}>
          <Suspense fallback={null}>
            <RoomScene />
          </Suspense>
        </Canvas>
      </div>
      {activeFrame !== 'home' && <FrameOverlay onBack={goHome} />}
    </>
  )
}
```

**Step 3: Start dev server and open browser console**

```bash
~/.nvm/versions/node/v22.11.0/bin/npm run dev
```

Open `http://localhost:5173`. In DevTools console, read the logged mesh names and coordinates.

**Step 4: Record findings** — note down:
- Name of the bust mesh in the desk GLB (look for names containing "bust", "statue", "head", or similar)
- Total scene bounding box size (this tells you the scene scale, e.g., the desk might be 5 units wide)
- Approximate Y coordinate of the desk surface (where bust should sit)
- Approximate XZ position of the window hole in the wall

These values will be used in all subsequent tasks. Write them as constants at the top of RoomScene.tsx.

---

### Task 3: Create HotspotMesh component

**Files:**
- Create: `src/components/Room/HotspotMesh.tsx`

**Step 1: Write the component**

```tsx
import { useRef, useState } from 'react'
import { Html } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import type { FrameId } from '../../context/RoomContext'
import type { ThreeEvent } from '@react-three/fiber'

interface Props {
  frame: FrameId
  i18nKey: string
  fallbackLabel: string
  color: string
  position: [number, number, number]
  size: [number, number, number]
  onClick: (frame: FrameId) => void
}

export default function HotspotMesh({
  frame, i18nKey, fallbackLabel, color, position, size, onClick,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const { t } = useTranslation()
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  function handlePointerEnter(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }

  function handlePointerLeave() {
    setHovered(false)
    document.body.style.cursor = 'auto'
  }

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    onClick(frame)
  }

  return (
    <mesh
      position={position}
      visible={false}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} />

      {hovered && (
        <Html
          center
          position={[0, size[1] / 2 + 0.15, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.88)',
            color: 'white',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '4px 14px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            border: `1px solid ${color}55`,
          }}>
            {labels[i18nKey] ?? fallbackLabel}
          </div>
        </Html>
      )}
    </mesh>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Room/HotspotMesh.tsx
git commit -m "feat: add HotspotMesh 3D clickable zone component"
```

---

### Task 4: Create WindowPlane component

**Files:**
- Create: `src/components/Room/WindowPlane.tsx`

**Step 1: Write the component**

The `position` and `scale` props will be calibrated in Task 7. Start with placeholder values.

```tsx
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL

interface Props {
  /** World position of the background plane [x, y, z] */
  position?: [number, number, number]
  /** Scale of the background plane */
  scale?: [number, number, number]
}

export default function WindowPlane({
  position = [0, 2, -5],
  scale = [10, 6, 1],
}: Props) {
  const texture = useTexture(`${BASE}ROOM.png`)
  // Ensure correct aspect ratio
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <group>
      {/* Background image plane (Bernabéu view) */}
      <mesh position={position} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Glass pane — slightly in front of background */}
      <mesh position={[position[0], position[1], position[2] + 0.05]} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          roughness={0}
          metalness={0.1}
          transmission={0.05}
          transparent
          opacity={0.18}
          color="#aaccff"
        />
      </mesh>
    </group>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Room/WindowPlane.tsx
git commit -m "feat: add WindowPlane component with Bernabéu texture + glass"
```

---

### Task 5: Create RoomModel component

**Files:**
- Create: `src/components/Room/RoomModel.tsx`

This hides the bad bust mesh in the desk GLB. Replace `'bust_mesh_name_here'` with the actual name found in Task 2.

**Step 1: Write the component**

```tsx
import { useGLTF } from '@react-three/drei'
import { useEffect } from 'react'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL

/** Mesh name(s) in the desk GLB that should be hidden (the bad bust).
 *  Update with the actual name(s) found from Task 2 console output. */
const HIDDEN_MESHES = ['bust_mesh_name_here']

export default function RoomModel() {
  const { scene } = useGLTF(`${BASE}desk.glb`)

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh && HIDDEN_MESHES.includes(obj.name)) {
        obj.visible = false
      }
    })
  }, [scene])

  return <primitive object={scene} />
}

useGLTF.preload(`${import.meta.env.BASE_URL}desk.glb`)
```

**Step 2: Commit**

```bash
git add src/components/Room/RoomModel.tsx
git commit -m "feat: add RoomModel desk GLB loader"
```

---

### Task 6: Create BustModel component

**Files:**
- Create: `src/components/Room/BustModel.tsx`

The `position` and `scale` will be calibrated in Task 7. Start with placeholder values.

**Step 1: Write the component**

```tsx
import { useGLTF } from '@react-three/drei'

const BASE = import.meta.env.BASE_URL

interface Props {
  position?: [number, number, number]
  scale?: number
  rotation?: [number, number, number]
}

export default function BustModel({
  position = [0, 0, 0],
  scale = 1,
  rotation = [0, 0, 0],
}: Props) {
  const { scene } = useGLTF(`${BASE}bust.glb`)

  return (
    <primitive
      object={scene.clone()}
      position={position}
      scale={scale}
      rotation={rotation}
    />
  )
}

useGLTF.preload(`${import.meta.env.BASE_URL}bust.glb`)
```

Note: `scene.clone()` prevents the bust from disappearing if the desk GLB is reused, since both reference the same THREE.js scene graph.

**Step 2: Commit**

```bash
git add src/components/Room/BustModel.tsx
git commit -m "feat: add BustModel GLB loader"
```

---

### Task 7: Assemble RoomScene and calibrate positions

**Files:**
- Modify: `src/components/Room/RoomScene.tsx`

This is the main assembly step. Replace the debug version from Task 2 with the production scene.

**Step 1: Write the full RoomScene**

Using the bounding box info from Task 2, fill in the `// CALIBRATE` comments:

```tsx
import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { PerspectiveCamera } from '@react-three/drei'
import * as THREE from 'three'
import RoomModel from './RoomModel'
import BustModel from './BustModel'
import WindowPlane from './WindowPlane'
import HotspotMesh from './HotspotMesh'
import type { FrameId } from '../../context/RoomContext'

// ── CALIBRATION CONSTANTS ────────────────────────────────────────────────────
// Fill these in from the console output in Task 2.
// All values are in Three.js world units (same coordinate system as the GLB).

const CAM_POS: [number, number, number]    = [0, 3, 8]    // CALIBRATE
const CAM_TARGET: [number, number, number] = [0, 1, 0]    // CALIBRATE

const BUST_POS: [number, number, number]   = [0, 0, 0]    // CALIBRATE
const BUST_SCALE                           = 0.3           // CALIBRATE
const BUST_ROT: [number, number, number]   = [0, 0, 0]    // CALIBRATE

const WIN_POS: [number, number, number]    = [0, 2, -5]   // CALIBRATE
const WIN_SCALE: [number, number, number]  = [10, 6, 1]   // CALIBRATE

// Hotspot zones — position = center of the object in world space, size = [w, h, d]
const ZONES: {
  frame: FrameId
  i18nKey: string
  label: string
  color: string
  position: [number, number, number]
  size: [number, number, number]
}[] = [
  { frame: 'neon',         i18nKey: 'neon',         label: 'Skills',         color: '#6366f1', position: [-3, 2, 0],   size: [1, 1.5, 0.5] },  // CALIBRATE
  { frame: 'bernabeu',     i18nKey: 'bernabeu',     label: 'Sport Projects', color: '#3b82f6', position: [0, 2, -4.8], size: [3, 3, 0.1]   },  // CALIBRATE
  { frame: 'lab',          i18nKey: 'lab',          label: 'Lab',            color: '#22c55e', position: [1.5, 2.5, -2],size: [1.5, 1.5, 0.3]},// CALIBRATE
  { frame: 'buste',        i18nKey: 'buste',        label: 'About',          color: '#f59e0b', position: [0, 1, 0],    size: [0.6, 1.2, 0.6]},  // CALIBRATE
  { frame: 'iMac',         i18nKey: 'iMac',         label: 'Tech Projects',  color: '#22d3ee', position: [0.5, 1.2, 0],size: [0.9, 0.8, 0.1]},  // CALIBRATE
  { frame: 'bibliotheque', i18nKey: 'bibliotheque', label: 'Education',      color: '#f97316', position: [3, 1.5, 0],  size: [1.5, 2, 1]   },   // CALIBRATE
  { frame: 'hobbies',      i18nKey: 'hobbies',      label: 'Hobbies',        color: '#f43f5e', position: [1, 1, 0.5],  size: [1.5, 0.5, 1] },   // CALIBRATE
]
// ─────────────────────────────────────────────────────────────────────────────

interface Props {
  onZoneClick: (frame: FrameId) => void
}

export default function RoomScene({ onZoneClick }: Props) {
  const camRef = useRef<THREE.PerspectiveCamera>(null)
  const mouse = useRef({ x: 0, y: 0 })

  // Subtle mouse parallax
  if (typeof window !== 'undefined') {
    window.onmousemove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
  }

  useFrame(() => {
    if (!camRef.current) return
    camRef.current.position.x = CAM_POS[0] + mouse.current.x * 0.3
    camRef.current.position.y = CAM_POS[1] - mouse.current.y * 0.15
    camRef.current.lookAt(...CAM_TARGET)
  })

  return (
    <>
      <PerspectiveCamera
        ref={camRef}
        makeDefault
        position={CAM_POS}
        fov={45}
      />

      {/* Lighting */}
      <ambientLight intensity={0.45} />
      <pointLight position={[-4, 3, 2]} intensity={1.2} color="#ffa060" />   {/* arc lamp */}
      <pointLight position={[0, 3, -3]} intensity={0.6} color="#aaccff" />   {/* window */}

      {/* 3D models */}
      <RoomModel />
      <BustModel position={BUST_POS} scale={BUST_SCALE} rotation={BUST_ROT} />

      {/* Window background + glass */}
      <WindowPlane position={WIN_POS} scale={WIN_SCALE} />

      {/* Interactive hotspots */}
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
```

**Step 2: Update Room/index.tsx to pass onZoneClick and restore GSAP zoom**

Replace the temporary index.tsx from Task 2 with the full version:

```tsx
import { useRef, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import gsap from 'gsap'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomScene from './RoomScene'
import FrameOverlay from './FrameOverlay'

// Zoom-out origins as viewport %, calibrated to 3D camera view.
// These match the screen position of each object with the camera at CAM_POS.
// Update after visual calibration in Task 7.
const ZONE_CENTERS: Record<Exclude<FrameId, 'home'>, { x: number; y: number }> = {
  neon:         { x: 19, y: 44 },
  bernabeu:     { x: 39, y: 47 },
  lab:          { x: 70, y: 23 },
  buste:        { x: 57, y: 53 },
  iMac:         { x: 63, y: 42 },
  bibliotheque: { x: 91, y: 41 },
  hobbies:      { x: 79, y: 60 },
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
        { scale: 1, opacity: 1, duration: 0.55, ease: 'power2.out', onComplete: () => setZoomOrigin(null) }
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
      <div ref={sceneRef} style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
        <Canvas gl={{ antialias: true, alpha: false }} style={{ background: '#050510' }}>
          <Suspense fallback={null}>
            {activeFrame === 'home' && <RoomScene onZoneClick={handleZoneClick} />}
          </Suspense>
        </Canvas>
      </div>
      {activeFrame !== 'home' && <FrameOverlay onBack={goHome} />}
    </>
  )
}
```

**Step 3: Visual calibration — camera angle**

Open the browser. The desk GLB should appear. The initial camera at `[0, 3, 8]` fov=45 is a starting point.

To calibrate the camera to match the original ROOM.png isometric view:
- The room should be viewed from the **upper-left-front**
- Left wall on the left, back wall straight ahead
- Adjust `CAM_POS` in `RoomScene.tsx` iteratively

Common target values to try: `[-2, 4, 8]`, `[-3, 5, 10]`. Use the preview_screenshot tool to check.

**Step 4: Visual calibration — bust position**

The bust should sit on the pedestal between the iMac and the bookshelf on the desk.
- Set `BUST_POS` to the XZ center of the pedestal (use values from Task 2 console)
- Start with `BUST_SCALE = 0.3` and adjust until it looks right
- The Y position should be the desk surface Y + half the bust height

**Step 5: Visual calibration — window background**

The ROOM.png background plane needs to show the Bernabéu stadium through the window hole:
- Position the plane behind the back wall of the GLB (lower Z than the wall)
- Scale it so the stadium portion fills the window hole
- Since ROOM.png is the full room, the stadium is roughly in the center-left of the image

**Step 6: Visual calibration — hotspot positions**

Make hotspot meshes temporarily visible by changing `visible={false}` to `visible={true}` in HotspotMesh:
```tsx
<mesh position={position} visible={true} ...>
  <meshBasicMaterial color={color} transparent opacity={0.3} wireframe />
```

Take a screenshot, compare against the objects, adjust each zone's position/size in the ZONES array.

Once all look correct, revert to `visible={false}`.

**Step 7: Commit calibrated scene**

```bash
git add src/components/Room/RoomScene.tsx src/components/Room/index.tsx
git commit -m "feat: assemble full 3D room scene with calibrated positions"
```

---

### Task 8: Fix mouse parallax event listener

The `window.onmousemove` assignment in Task 7 is unsafe (overwrites any other listener). Replace it.

**Files:**
- Modify: `src/components/Room/RoomScene.tsx`

**Step 1: Replace event listener approach**

Remove the `window.onmousemove` assignment from the component body and add a proper `useEffect`:

```tsx
import { useRef, useEffect } from 'react'
// ...

export default function RoomScene({ onZoneClick }: Props) {
  const camRef = useRef<THREE.PerspectiveCamera>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth  - 0.5) * 2
      mouse.current.y = (e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', handler)
    return () => window.removeEventListener('mousemove', handler)
  }, [])

  // ... rest of component unchanged
}
```

**Step 2: Commit**

```bash
git add src/components/Room/RoomScene.tsx
git commit -m "fix: use addEventListener for mouse parallax in RoomScene"
```

---

### Task 9: Remove old files and clean up

**Files:**
- Delete: `src/components/Room/RoomSVGZones.tsx`
- Delete: `src/components/Room/RoomBackground.tsx`

**Step 1: Delete old files**

```bash
git rm src/components/Room/RoomSVGZones.tsx
git rm src/components/Room/RoomBackground.tsx
```

**Step 2: Verify no imports remain**

```bash
grep -r "RoomSVGZones\|RoomBackground" src/
```
Expected: no results.

**Step 3: Commit**

```bash
git commit -m "chore: remove old SVG overlay and CSS background files"
```

---

### Task 10: Update memory and final verification

**Step 1: Build and check for errors**

```bash
~/.nvm/versions/node/v22.11.0/bin/npm run build
```
Expected: `✓ built in Xs` with no TypeScript errors.

**Step 2: Visual check in browser**

Open `http://localhost:5173`. Verify:
- [ ] 3D room renders with correct perspective
- [ ] Hovering over each zone shows the correct tooltip label
- [ ] Clicking a zone triggers the GSAP zoom-in and opens FrameOverlay
- [ ] Back button returns to the 3D room with zoom-out animation
- [ ] Bust GLB is visible at the correct position
- [ ] ROOM.png Bernabéu view shows through the window hole
- [ ] Glass reflection visible on the window pane
- [ ] Mouse movement causes subtle camera parallax

**Step 3: Final commit**

```bash
git add -A
git commit -m "feat: replace 2D room with full R3F 3D scene using GLB models"
```

---

## Calibration Reference

When calibrating positions in Task 7, use this approach:
1. Read console output from Task 2 to get exact world coordinates
2. The desk surface Y = top of the desk bounding box
3. The bust pedestal is between the iMac and bookshelf — use their X coordinates as bounds
4. The window hole position = the XZ center of the opening in the back wall
5. For the GSAP zoom origins (ZONE_CENTERS in index.tsx), take a screenshot and measure where each object appears as a % of the viewport

## Key Constraints

- `BASE_URL = import.meta.env.BASE_URL` — use for all asset paths (needed for GitHub Pages `/Portfolio/` base)
- `useGLTF` caches internally — no need for manual caching
- `scene.clone()` in BustModel prevents the bust scene from being shared with desk GLB references
- Mouse parallax amplitude is ±0.3 X and ±0.15 Y — do not exceed or it feels nausea-inducing
- FrameOverlay still uses `url(${BASE}ROOM.png)` as blurred background — ROOM.png stays in public/
