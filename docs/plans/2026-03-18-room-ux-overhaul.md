# Room UX Overhaul Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace floating dot hotspots with glowing object-contour zones, add cinematic zoom-in/zoom-out frame transitions, clean up the navbar, and polish the room background visibility.

**Architecture:** HotspotZone components are transparent positioned divs that illuminate the outline of physical room objects on hover. Clicking triggers a GSAP scale-toward-origin animation on the room scene, then the frame content fades in. Clicking ← reverses: frame fades out, scene zooms back from origin.

**Tech Stack:** React 18 + TypeScript, GSAP + @gsap/react, Vite (BASE_URL for public assets), react-i18next

---

## Task 1: Fix RoomBackground — Reduce zoom, show full room

**Files:**
- Modify: `src/components/Room/RoomBackground.tsx`

**What:** The 3-layer parallax uses scale 1.06–1.10 and `inset: '-5%'`, severely cropping the photo. Reduce to show the full room including the left lamp.

**Step 1: Replace LAYERS and layout**

```tsx
// src/components/Room/RoomBackground.tsx
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

**Step 2: Verify** — preview should show more of the room (lamp visible left, no excessive crop)

**Step 3: Commit**
```bash
git add src/components/Room/RoomBackground.tsx
git commit -m "fix: reduce parallax zoom to show full room"
```

---

## Task 2: Clean Navbar — Remove nav links and GitHub/LinkedIn

**Files:**
- Modify: `src/components/Navbar/index.tsx`

**What:** Remove the NAV_ITEMS section entirely. Remove GitHub and LinkedIn links. Keep only VA. logo and FR/EN toggle.

**Step 1: Rewrite Navbar**

```tsx
// src/components/Navbar/index.tsx
import { useTranslation } from 'react-i18next'
import { useRoom } from '../../context/RoomContext'

export default function Navbar() {
  const { i18n } = useTranslation()
  const { goHome } = useRoom()

  const toggleLang = () =>
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={goHome}
          className="font-display font-semibold text-white tracking-tight hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
        >
          VA<span className="text-primary">.</span>
        </button>
        <button
          onClick={toggleLang}
          className="font-display font-medium text-xs border border-white/10 rounded-md px-3 py-1.5 text-muted hover:text-white hover:border-primary/50 transition-all"
        >
          {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>
    </nav>
  )
}
```

**Step 2: Commit**
```bash
git add src/components/Navbar/index.tsx
git commit -m "feat: strip navbar to VA logo + lang toggle only"
```

---

## Task 3: Redesign BackButton — Arrow only, no text

**Files:**
- Modify: `src/components/Room/BackButton.tsx`

**What:** Replace "← Back" text button with a clean circular arrow-only button, positioned top-left.

**Step 1: Rewrite BackButton**

```tsx
// src/components/Room/BackButton.tsx
import { useRoom } from '../../context/RoomContext'

interface BackButtonProps {
  onBack: () => void
}

export default function BackButton({ onBack }: BackButtonProps) {
  return (
    <button
      onClick={onBack}
      aria-label="Go back to room"
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 200,
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border-color 0.2s, background 0.2s',
        lineHeight: 1,
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.7)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)'
      }}
    >
      ←
    </button>
  )
}
```

Note: BackButton now takes an `onBack` prop (not using useRoom directly) — the exit animation will be triggered in FrameOverlay.

**Step 2: Commit**
```bash
git add src/components/Room/BackButton.tsx
git commit -m "feat: back button is now circular arrow-only"
```

---

## Task 4: New HotspotZone component — Glowing object contours

**Files:**
- Create: `src/components/Room/HotspotZone.tsx`
- Delete: `src/components/Room/Hotspot.tsx` (to be replaced)

**What:** Instead of a floating circle at (x%, y%), each zone is a transparent div sized and positioned to overlay the actual physical object in the room photo. On hover: glowing colored border traces the object outline.

**Step 1: Create HotspotZone.tsx**

```tsx
// src/components/Room/HotspotZone.tsx
import { useState } from 'react'
import type { FrameId } from '../../context/RoomContext'

export interface HotspotZoneDef {
  frame: FrameId
  key: string
  label: string
  // Position: center of zone as % of viewport
  x: number
  y: number
  // Size as % of viewport
  w: number
  h: number
  // Glow color (hex)
  color: string
  // Shape (default: 'rect')
  shape?: 'rect' | 'oval'
  // Border radius override (px, default 8)
  radius?: number
}

interface HotspotZoneProps extends HotspotZoneDef {
  onClick: () => void
}

export default function HotspotZone({
  label, x, y, w, h, color, shape = 'rect', radius = 8, onClick,
}: HotspotZoneProps) {
  const [hovered, setHovered] = useState(false)
  const br = shape === 'oval' ? '50%' : `${radius}px`

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={label}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${x - w / 2}%`,
        top: `${y - h / 2}%`,
        width: `${w}%`,
        height: `${h}%`,
        borderRadius: br,
        background: hovered ? `${color}10` : 'transparent',
        border: hovered ? `2px solid ${color}` : '2px solid transparent',
        boxShadow: hovered
          ? `0 0 0 1px ${color}30, 0 0 24px ${color}80, 0 0 48px ${color}40`
          : 'none',
        cursor: 'pointer',
        zIndex: 20,
        transition: 'border-color 0.25s, box-shadow 0.25s, background 0.25s',
      }}
    >
      {hovered && (
        <span style={{
          position: 'absolute',
          bottom: 'calc(100% + 8px)',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.85)',
          color: 'white',
          fontSize: '0.75rem',
          padding: '4px 12px',
          borderRadius: 6,
          whiteSpace: 'nowrap',
          fontFamily: 'Inter, sans-serif',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          pointerEvents: 'none',
          border: `1px solid ${color}50`,
        }}>
          {label}
        </span>
      )}
    </div>
  )
}
```

**Step 2: Commit**
```bash
git add src/components/Room/HotspotZone.tsx
git commit -m "feat: HotspotZone component with glowing object contour on hover"
```

---

## Task 5: Zoom animation system — Room/index.tsx overhaul

**Files:**
- Modify: `src/components/Room/index.tsx`
- Modify: `src/components/Room/FrameOverlay.tsx`

**What:**
- Room/index.tsx: wraps RoomBackground in a `sceneRef` div. On hotspot click, GSAP zooms scene toward the click origin (scale → 5, opacity → 0), then calls `goTo`. When returning home, scene animates from scale(4) back to scale(1).
- FrameOverlay: on back click, fades out content then calls `goHome`.

**Step 1: Update Room/index.tsx**

```tsx
// src/components/Room/index.tsx
import { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { useTranslation } from 'react-i18next'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import RoomBackground from './RoomBackground'
import HotspotZone from './HotspotZone'
import type { HotspotZoneDef } from './HotspotZone'
import FrameOverlay from './FrameOverlay'

// Zones calibrated for 2806×1536 room photo on 1920×1080 viewport
// x/y = center %, w/h = size % of viewport
const ZONES: HotspotZoneDef[] = [
  {
    frame: 'neon',
    key: 'neon',
    label: 'Skills',
    x: 7, y: 40, w: 8, h: 55,
    color: '#6366f1',
    radius: 4,
  },
  {
    frame: 'bernabeu',
    key: 'bernabeu',
    label: 'Sport Projects',
    x: 41, y: 50, w: 33, h: 85,
    color: '#3b82f6',
    radius: 4,
  },
  {
    frame: 'lab',
    key: 'lab',
    label: 'Lab',
    x: 63, y: 35, w: 8, h: 40,
    color: '#22c55e',
    radius: 4,
  },
  {
    frame: 'buste',
    key: 'buste',
    label: 'About',
    x: 68, y: 62, w: 5, h: 14,
    color: '#f59e0b',
    shape: 'oval',
  },
  {
    frame: 'iMac',
    key: 'iMac',
    label: 'Tech Projects',
    x: 77, y: 47, w: 11, h: 25,
    color: '#22d3ee',
    radius: 6,
  },
  {
    frame: 'bibliotheque',
    key: 'bibliotheque',
    label: 'Education',
    x: 91, y: 42, w: 8, h: 55,
    color: '#f97316',
    radius: 4,
  },
  {
    frame: 'hobbies',
    key: 'hobbies',
    label: 'Hobbies',
    x: 84, y: 72, w: 10, h: 18,
    color: '#f43f5e',
    radius: 8,
  },
]

export default function Room() {
  const { activeFrame, goTo, goHome } = useRoom()
  const { t } = useTranslation()
  const sceneRef = useRef<HTMLDivElement>(null)
  const [zoomOrigin, setZoomOrigin] = useState<{ x: number; y: number } | null>(null)
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  // Zoom-out when returning home
  useEffect(() => {
    if (activeFrame === 'home' && zoomOrigin && sceneRef.current) {
      gsap.fromTo(
        sceneRef.current,
        { scale: 4, opacity: 0, transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%` },
        {
          scale: 1,
          opacity: 1,
          duration: 0.55,
          ease: 'power2.out',
          onComplete: () => setZoomOrigin(null),
        }
      )
    } else if (activeFrame === 'home' && !zoomOrigin && sceneRef.current) {
      // Direct navigation (logo click etc.) — just ensure scene is visible
      gsap.set(sceneRef.current, { scale: 1, opacity: 1 })
    }
  }, [activeFrame])

  function handleHotspotClick(zone: HotspotZoneDef) {
    if (!sceneRef.current) return
    setZoomOrigin({ x: zone.x, y: zone.y })
    gsap.to(sceneRef.current, {
      scale: 5,
      transformOrigin: `${zone.x}% ${zone.y}%`,
      opacity: 0,
      duration: 0.45,
      ease: 'power2.in',
      onComplete: () => goTo(zone.frame),
    })
  }

  function handleBack() {
    goHome()
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      <div ref={sceneRef} style={{ position: 'absolute', inset: 0 }}>
        <RoomBackground />
      </div>
      {activeFrame === 'home' && ZONES.map(zone => (
        <HotspotZone
          key={zone.frame}
          {...zone}
          label={labels[zone.key] ?? zone.label}
          onClick={() => handleHotspotClick(zone)}
        />
      ))}
      {activeFrame !== 'home' && <FrameOverlay onBack={handleBack} />}
    </div>
  )
}
```

**Step 2: Update FrameOverlay.tsx to accept onBack prop and animate exit**

```tsx
// src/components/Room/FrameOverlay.tsx
import { useEffect, useRef, ReactElement } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRoom } from '../../context/RoomContext'
import type { FrameId } from '../../context/RoomContext'
import BackButton from './BackButton'
import FrameBuste from './frames/FrameBuste'
import FrameIMac from './frames/FrameIMac'
import FrameBernabeu from './frames/FrameBernabeu'
import FrameNeon from './frames/FrameNeon'
import FrameBibliotheque from './frames/FrameBibliotheque'
import FrameLab from './frames/FrameLab'
import FrameHobbies from './frames/FrameHobbies'

const BASE = import.meta.env.BASE_URL

const FRAME_COMPONENTS: Record<Exclude<FrameId, 'home'>, ReactElement> = {
  buste:        <FrameBuste />,
  iMac:         <FrameIMac />,
  bernabeu:     <FrameBernabeu />,
  neon:         <FrameNeon />,
  bibliotheque: <FrameBibliotheque />,
  lab:          <FrameLab />,
  hobbies:      <FrameHobbies />,
}

interface FrameOverlayProps {
  onBack: () => void
}

export default function FrameOverlay({ onBack }: FrameOverlayProps) {
  const { activeFrame } = useRoom()
  const overlayRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') handleBack() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  // Animate in
  useGSAP(() => {
    if (!overlayRef.current) return
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' }
    )
    if (contentRef.current) {
      gsap.fromTo(
        contentRef.current,
        { opacity: 0, y: 20, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.45, ease: 'power2.out', delay: 0.1 }
      )
    }
  }, { dependencies: [activeFrame] })

  function handleBack() {
    if (!overlayRef.current) { onBack(); return }
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: onBack,
    })
  }

  return (
    <>
      <BackButton onBack={handleBack} />
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
          padding: '80px 24px 40px',
        }}
      >
        {/* Blurred room background — less dark than before */}
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: `url(${BASE}ROOM.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(16px) brightness(0.35)',
          transform: 'scale(1.04)',
          zIndex: -1,
        }} />
        <div ref={contentRef} style={{ width: '100%', maxWidth: 800, position: 'relative' }}>
          {FRAME_COMPONENTS[activeFrame as Exclude<FrameId, 'home'>]}
        </div>
      </div>
    </>
  )
}
```

**Step 3: Verify animations work** — click a hotspot, see zoom-in → frame → click ←, see zoom-out to room.

**Step 4: Commit**
```bash
git add src/components/Room/index.tsx src/components/Room/FrameOverlay.tsx
git commit -m "feat: cinematic zoom-in/out frame transitions via GSAP"
```

---

## Task 6: Remove hotspot-pulse keyframe from index.css

**Files:**
- Modify: `src/index.css`

**Step 1: Remove the `@keyframes hotspot-pulse` block** (lines 39–42). It's no longer used.

**Step 2: Commit**
```bash
git add src/index.css
git commit -m "chore: remove unused hotspot-pulse keyframe"
```

---

## Task 7: Verify zone positions in browser

**What:** The ZONES defined in Task 5 are estimates. After seeing the preview, fine-tune each zone's x/y/w/h values so the glowing outline matches the actual object in the photo.

Checklist of objects to verify:
- [ ] Lamp (neon/Skills) — left side of room, tall narrow zone
- [ ] Bernabeu window — center rectangle
- [ ] Lab — wall to right of window
- [ ] Buste — small oval on desk
- [ ] iMac screen — right desk
- [ ] Bookshelf — far right (may need scroll or zone moved left)
- [ ] Hobbies — chess/ball on desk

**Step 1:** Take preview screenshot, compare zone glow positions to actual objects.

**Step 2:** Adjust `x, y, w, h` values in `ZONES` array in `src/components/Room/index.tsx` to match.

**Step 3: Commit**
```bash
git add src/components/Room/index.tsx
git commit -m "fix: calibrate hotspot zone positions to match room objects"
```

---

## Task 8: Frame polish — Fix content overflow + improve backgrounds

**Files:**
- Modify: All frame files in `src/components/Room/frames/`

**What:** Fix the content-above-viewport issue (title scrolled out). Improve frame backgrounds to feel more premium. Each frame should open centered with its title visible.

**Step 1:** In each frame, remove fixed `maxWidth: 520` and instead let the `FrameOverlay` container handle width. Add scrollable inner content where needed.

**Step 2:** Raise blur `brightness` from 0.25 → 0.35 in FrameOverlay background (already done in Task 5).

**Step 3:** Remove the `overflowY: 'auto'` from FrameOverlay and instead add it to each frame's inner scrollable area, so the frame header stays visible.

**Step 4: Commit**
```bash
git add src/components/Room/frames/*.tsx
git commit -m "fix: frame content starts visible, improved backgrounds"
```
