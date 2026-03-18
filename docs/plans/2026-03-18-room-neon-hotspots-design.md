# Room Neon Hotspots — Design Doc
**Date:** 2026-03-18

## Goal

Replace the current SVG zone overlays (ugly glowing rectangles) with **transparent R3F Canvas + 3D neon wire cages** that appear on hover over the correct objects in the ROOM.png photo background.

## Architecture

### What stays
- `RoomBackground.tsx` — ROOM.png as CSS background with mouse parallax. Untouched.
- `FrameOverlay.tsx` + all `frames/` — untouched.
- GSAP zoom in/out logic in `Room/index.tsx` — unchanged.
- `RoomContext`, all frame logic — unchanged.

### What changes
- `RoomSVGZones.tsx` → **replaced** by `RoomHotspotCanvas.tsx` (transparent R3F Canvas overlay)
- `Room/index.tsx` → minor wiring change: import `RoomHotspotCanvas` instead of `RoomSVGZones`

### New component tree
```
Room/index.tsx
  ├── <div ref={sceneRef} fixed inset-0 z-10>
  │     ├── RoomBackground          (ROOM.png + parallax, z-0)
  │     └── RoomHotspotCanvas       (transparent R3F canvas, z-20, pointer-events:all)
  │           └── <Canvas alpha transparent>
  │                 ├── PerspectiveCamera (matched to photo perspective)
  │                 └── HotspotZone × 7 (invisible BoxGeometry + EdgesGeometry on hover)
  └── FrameOverlay (outside sceneRef, above navbar)
```

## R3F Canvas Setup

```tsx
<Canvas
  gl={{ alpha: true, antialias: true }}
  style={{ background: 'transparent', position: 'absolute', inset: 0, zIndex: 20 }}
  camera={{ position: [0, 0, 5], fov: 60 }}
>
```

Camera is fixed (no OrbitControls). FOV and position calibrated to match ROOM.png perspective.

## HotspotZone Component

Each zone has:
1. **Invisible hit mesh** — `BoxGeometry` with `visible={false}`, `onPointerEnter/Leave/Click`
2. **EdgesGeometry overlay** — `lineSegments` with `LineBasicMaterial`, rendered only on hover
3. **Bloom** from `@react-three/postprocessing` — `SelectiveBloom` or global `Bloom` at low intensity

```tsx
function HotspotZone({ position, size, color, frame, onZoneClick }) {
  const [hovered, setHovered] = useState(false)
  const edges = useMemo(() => new EdgesGeometry(new BoxGeometry(...size)), [size])

  return (
    <group position={position}>
      {/* Hit mesh — invisible */}
      <mesh visible={false} onPointerEnter={() => setHovered(true)} onPointerLeave={() => setHovered(false)} onClick={() => onZoneClick(frame)}>
        <boxGeometry args={size} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {/* Neon wire cage — visible only on hover */}
      {hovered && (
        <lineSegments geometry={edges}>
          <lineBasicMaterial color={color} linewidth={1} transparent opacity={0.9} />
        </lineSegments>
      )}
    </group>
  )
}
```

## Zone Definitions (initial estimates, calibrated against ROOM.png)

| Zone         | Color     | Notes |
|--------------|-----------|-------|
| neon         | #6366f1   | Floor lamp left wall |
| bernabeu     | #3b82f6   | Window + Bernabéu view |
| lab          | #22c55e   | Whiteboard on wall |
| buste        | #f59e0b   | Classical bust on desk |
| iMac         | #22d3ee   | iMac screen |
| bibliotheque | #f97316   | Bookshelf right wall |
| hobbies      | #f43f5e   | Hobbies area bottom right |

Initial 3D box positions are estimated from the SVG zone % coordinates mapped to 3D space.
**Fallback:** If manual calibration is difficult, load `desk.glb` in a `useGLTF` call, `traverse` the scene to find bounding boxes per named region, and use those world positions directly.

## Visual Effect

- Line width: **1px** (thin laser / fil fin)
- On hover: edges appear instantly (no animation needed, GSAP zoom handles the drama)
- Bloom: global low-intensity (intensity ~0.4, luminanceThreshold 0.6) so the neon lines actually glow
- Cursor: `pointer` (set via `document.body.style.cursor` in onPointerEnter/Leave)

## Tooltip

Small label appears at top of each zone on hover — same style as current SVG tooltip:
```
background: rgba(0,0,0,0.85)
border: 1px solid {color}50
font: Inter 0.75rem uppercase
```
Rendered via drei `<Html>` inside the HotspotZone group.

## Calibration Strategy

1. First pass: translate SVG % coordinates → 3D positions (x = (% - 50) * scale, y = (50 - %) * scale)
2. Run dev server, visually check each cage aligns with photo object
3. Adjust position/size per zone manually
4. If >2 zones don't align: switch to Approach B (load desk.glb, compute bounding boxes via `THREE.Box3`)

## Files to Create/Modify

| File | Action |
|------|--------|
| `src/components/Room/RoomHotspotCanvas.tsx` | CREATE — R3F Canvas + all 7 HotspotZone meshes |
| `src/components/Room/index.tsx` | MODIFY — swap RoomSVGZones import → RoomHotspotCanvas; restore SVG-era ZONE_CENTERS |
| `src/components/Room/RoomSVGZones.tsx` | DELETE (or keep for reference) |
| `src/components/Room/HotspotMesh.tsx` | DELETE (old 3D-scene version) |
| `src/components/Room/RoomScene.tsx` | DELETE |
| `src/components/Room/RoomModel.tsx` | DELETE |
| `src/components/Room/BustModel.tsx` | DELETE |
| `src/components/Room/WindowPlane.tsx` | DELETE |
| `src/components/Room/RoomBackground.tsx` | RESTORE from git if deleted |
