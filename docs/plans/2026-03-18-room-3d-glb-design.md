# Room 3D GLB Design

**Date:** 2026-03-18
**Branch:** main
**Status:** Approved — ready for implementation

## Goal

Replace the ROOM.png CSS background + SVG hotspot overlay with a full R3F 3D scene using two Meshy AI GLB models. All interactive zones become invisible 3D meshes on the real objects.

## GLB Assets

| File | Description |
|------|-------------|
| `Meshy_AI_Desk_0318135816_texture.glb` | Full room: wooden walls (L-shape), neon sign, arc lamp, daybed, round desk, iMac, chess set, bookshelf. Has a rectangular window hole in the back wall. No floor. |
| `Meshy_AI_Tiny_Classical_Bust_0318140023_texture.glb` | High-quality classical marble bust replacement. |

Both files copied from `~/Desktop/3D/` to `public/`.

## Architecture

### Canvas setup
`Room/index.tsx` wraps a full-screen R3F `<Canvas>` (position:fixed, inset:0, z-index:10) instead of the CSS background div + SVG overlay.
GSAP zoom and FrameOverlay/BackButton remain unchanged.

### Scene components

**`RoomModel`**
- `useGLTF` with Draco decoder
- Hides the bad bust mesh by name lookup (`scene.traverse`)
- Casts/receives shadows disabled (performance)

**`BustModel`**
- Loads bust GLB via `useGLTF`
- Positioned/scaled to sit on the desk pedestal between iMac and bookshelf
- Fine-tuned during implementation via dev overlay

**`WindowPlane`**
- Large `<Plane>` mesh behind the room geometry, textured with `ROOM.png` (or cropped Bernabéu view)
- Positioned so the Bernabéu view aligns with the window hole
- Glass pane: second `<mesh>` in front, `MeshPhysicalMaterial` (roughness=0, transmission=0.05, metalness=0.1) for subtle reflection

**`HotspotMesh`**
- Invisible `<mesh>` (boxGeometry, `visible={false}`) on each interactive object
- `onPointerEnter/Leave`: show/hide tooltip `<Html>` (same dark pill style as current SVG tooltip)
- `onClick`: calls `handleZoneClick(frame)` which triggers GSAP zoom + goTo
- On hover: `<Outlines>` from `@react-three/postprocessing` around the mesh

**Camera**
- `PerspectiveCamera` fov=45, position calibrated to match the GLB isometric-ish view
- Mouse parallax: slight camera rotation (±0.04 rad) on mousemove via `useFrame`

**Lighting**
- `<ambientLight>` intensity=0.4
- `<pointLight>` warm (0xffa060) near the arc lamp position
- `<pointLight>` cool blue near the window for atmosphere

### Hotspot zones

| frame | object | geometry type |
|-------|--------|---------------|
| neon | neon sign on left wall | box |
| bernabeu | window glass plane | plane |
| lab | wall area between window & bookshelf | plane |
| buste | bust GLB bounding box | box |
| iMac | iMac screen area | box |
| bibliotheque | bookshelf | box |
| hobbies | chess pieces area on desk | box |

### Files changed

| File | Action |
|------|--------|
| `src/components/Room/index.tsx` | Replace CSS div+SVG with Canvas |
| `src/components/Room/RoomScene.tsx` | New — lights, camera, all models + hotspots |
| `src/components/Room/RoomModel.tsx` | New — desk GLB loader |
| `src/components/Room/BustModel.tsx` | New — bust GLB loader + positioning |
| `src/components/Room/WindowPlane.tsx` | New — Bernabéu bg + glass pane |
| `src/components/Room/HotspotMesh.tsx` | New — reusable invisible clickable mesh |
| `src/components/Room/RoomSVGZones.tsx` | Deleted |
| `src/components/Room/RoomBackground.tsx` | Deleted |
| `public/desk.glb` | Copied from Desktop/3D/ |
| `public/bust.glb` | Copied from Desktop/3D/ |

## What does NOT change

- `FrameOverlay.tsx`, `BackButton.tsx`, `RoomContext.tsx`
- All frame components (`FrameNeon`, `FrameBernabeu`, etc.)
- GSAP zoom-in / zoom-out animation
- i18n labels

## Performance constraints

- Draco compression on both GLBs via `useGLTF` + `DRACOLoader`
- No shadow maps
- No CubeCamera reflections (static MeshPhysicalMaterial only)
- Target: 60fps on mid-range hardware
