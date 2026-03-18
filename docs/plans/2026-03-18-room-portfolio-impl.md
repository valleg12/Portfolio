# Room Portfolio "Santiago" — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the scroll-based portfolio with an immersive 3D parallax room scene where each object is a clickable hotspot that zooms into a dedicated full-quality frame.

**Architecture:** Photo of the room is split into CSS depth layers with mouse-driven parallax. Clicking a hotspot triggers a GSAP zoom animation that reveals a styled full-screen frame component. A global RoomContext manages which frame is active. The existing particle Background, Navbar, and i18n infrastructure are preserved.

**Tech Stack:** React 18 + TypeScript, GSAP + @gsap/react, Tailwind CSS, @react-three/fiber + drei + postprocessing (for frame content), react-i18next (EN default), existing Background particles component.

**Note on PhysicsBalls:** No PhysicsBalls component exists in the codebase. Skills is a tech grid (`src/components/Skills/index.tsx`). The skills frame will reuse the TechCard grid with a new wrapper.

---

### Task 1: RoomContext — global frame state

**Files:**
- Create: `src/context/RoomContext.tsx`

**Step 1: Create the context**

```tsx
// src/context/RoomContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

export type FrameId = 'home' | 'buste' | 'iMac' | 'bernabeu' | 'neon' | 'bibliotheque' | 'lab' | 'hobbies'

interface RoomContextValue {
  activeFrame: FrameId
  goTo: (frame: FrameId) => void
  goHome: () => void
}

const RoomContext = createContext<RoomContextValue | null>(null)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [activeFrame, setActiveFrame] = useState<FrameId>('home')
  const goTo = (frame: FrameId) => setActiveFrame(frame)
  const goHome = () => setActiveFrame('home')
  return (
    <RoomContext.Provider value={{ activeFrame, goTo, goHome }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const ctx = useContext(RoomContext)
  if (!ctx) throw new Error('useRoom must be used inside RoomProvider')
  return ctx
}
```

**Step 2: Verify it compiles**

Run: `~/.nvm/versions/node/v22.11.0/bin/node node_modules/.bin/tsc --noEmit`
Expected: no errors

**Step 3: Commit**

```bash
git add src/context/RoomContext.tsx
git commit -m "feat: add RoomContext for frame navigation"
```

---

### Task 2: i18n — switch default to English, add Lab keys

**Files:**
- Modify: `src/i18n/index.ts` (or wherever i18n is initialized)
- Modify: `src/i18n/en.json`
- Modify: `src/i18n/fr.json`

**Step 1: Find the i18n init file**

```bash
grep -r "lng:" src/i18n/
```

**Step 2: Change default language**

Find the `lng:` option in the i18next init config and change `'fr'` to `'en'`.

**Step 3: Add Lab/services keys to en.json**

Add to `src/i18n/en.json` under a new `"lab"` key:

```json
"lab": {
  "title": "Lab",
  "subtitle": "What I build",
  "items": [
    {
      "icon": "🧠",
      "title": "AI Architect",
      "desc": "Design and deploy autonomous AI agents, LLM pipelines, and API integrations at scale."
    },
    {
      "icon": "📊",
      "title": "Business & Data Analyst",
      "desc": "Transform raw data into strategic decisions — dashboards, KPIs, Power BI, Tableau."
    },
    {
      "icon": "⚽",
      "title": "Sport Analytics",
      "desc": "AI-driven athlete performance, injury prevention, scouting, and fan engagement systems."
    },
    {
      "icon": "🤖",
      "title": "AI Automation",
      "desc": "Automate workflows with AI — email, document processing, CRM, scheduling agents."
    },
    {
      "icon": "🔮",
      "title": "Predictive Modeling",
      "desc": "Forecasting, recommendation systems, and classification models tailored to your business."
    },
    {
      "icon": "🗺️",
      "title": "AI Strategy",
      "desc": "Roadmaps, AI audits, and digital transformation consulting for startups and SMBs."
    }
  ]
},
"room": {
  "back": "Back",
  "cv": "Download CV",
  "contact": "Get in touch",
  "hotspot": {
    "buste": "About me",
    "iMac": "Tech projects",
    "bernabeu": "Sport projects",
    "neon": "Skills",
    "bibliotheque": "Education",
    "lab": "Lab",
    "hobbies": "Hobbies"
  }
}
```

**Step 4: Mirror the same keys in fr.json**

```json
"lab": {
  "title": "Lab",
  "subtitle": "Ce que je construis",
  "items": [
    { "icon": "🧠", "title": "Architecte IA", "desc": "Conception et déploiement d'agents IA autonomes, pipelines LLM et intégrations API." },
    { "icon": "📊", "title": "Business & Data Analyst", "desc": "Transformer la donnée en décisions stratégiques — dashboards, KPIs, Power BI, Tableau." },
    { "icon": "⚽", "title": "Sport Analytics", "desc": "Performance athlètes, prévention blessures, recrutement IA et engagement fans." },
    { "icon": "🤖", "title": "Automatisation IA", "desc": "Automatiser vos workflows — emails, documents, CRM, agents de planification." },
    { "icon": "🔮", "title": "Modélisation Prédictive", "desc": "Prévisions, systèmes de recommandation et modèles de classification sur mesure." },
    { "icon": "🗺️", "title": "Stratégie IA", "desc": "Roadmaps, audits IA et conseil en transformation digitale pour startups et PME." }
  ]
},
"room": {
  "back": "Retour",
  "cv": "Télécharger le CV",
  "contact": "Me contacter",
  "hotspot": {
    "buste": "À propos",
    "iMac": "Projets tech",
    "bernabeu": "Projets sport",
    "neon": "Compétences",
    "bibliotheque": "Formation",
    "lab": "Lab",
    "hobbies": "Loisirs"
  }
}
```

**Step 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: set EN default, add lab & room i18n keys"
```

---

### Task 3: App.tsx — wire RoomProvider, remove scroll sections

**Files:**
- Modify: `src/App.tsx`
- Create: `src/components/Room/index.tsx` (stub)

**Step 1: Create Room stub**

```tsx
// src/components/Room/index.tsx
export default function Room() {
  return <div style={{ width: '100vw', height: '100vh', background: '#050510' }} />
}
```

**Step 2: Rewrite App.tsx**

```tsx
// src/App.tsx
import { Suspense, lazy } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import { RoomProvider } from './context/RoomContext'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Room from './components/Room'

const Background = lazy(() => import('./components/Background'))

export default function App() {
  return (
    <LoadingProvider>
      <RoomProvider>
        <Suspense fallback={null}>
          <Background />
        </Suspense>
        <Loading />
        <Navbar />
        <Room />
      </RoomProvider>
    </LoadingProvider>
  )
}
```

**Step 3: Verify in browser**

Run: `~/.nvm/versions/node/v22.11.0/bin/npm run dev`
Expected: dark screen with particles, navbar visible, no scroll sections.

**Step 4: Commit**

```bash
git add src/App.tsx src/components/Room/index.tsx
git commit -m "feat: wire RoomProvider, stub Room component"
```

---

### Task 4: Frame 0 — Parallax room background with hotspots

**Files:**
- Modify: `src/components/Room/index.tsx`
- Create: `src/components/Room/Hotspot.tsx`
- Create: `src/components/Room/RoomBackground.tsx`
- Add: `public/PHOTO.jpg` (already present)

**Step 1: Create RoomBackground with depth layers**

The photo is split conceptually into 3 CSS layers with different `transform: translate` offsets driven by mouse position. Each layer is an absolutely positioned `<div>` with the same background image but different `background-position` deltas to simulate depth.

```tsx
// src/components/Room/RoomBackground.tsx
import { useEffect, useRef } from 'react'

const BASE = import.meta.env.BASE_URL

// depth layers: [zIndex, parallaxStrength, scale]
const LAYERS = [
  { id: 'far',  strength: 0.008, scale: 1.06 },   // back wall + window
  { id: 'mid',  strength: 0.018, scale: 1.08 },   // furniture
  { id: 'near', strength: 0.030, scale: 1.10 },   // desk foreground
]

export default function RoomBackground() {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      LAYERS.forEach((layer, i) => {
        const el = refs.current[i]
        if (!el) return
        el.style.transform = `translate(${-dx * layer.strength}px, ${-dy * layer.strength}px)`
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {LAYERS.map((layer, i) => (
        <div
          key={layer.id}
          ref={el => { refs.current[i] = el }}
          style={{
            position: 'absolute',
            inset: `-5%`,
            backgroundImage: `url(${BASE}PHOTO.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: 'translate(0px, 0px)',
            transition: 'transform 0.12s ease-out',
            scale: String(layer.scale),
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
```

**Step 2: Create Hotspot component**

A pulsing circle positioned absolutely over each interactive object. Tooltip label on hover.

```tsx
// src/components/Room/Hotspot.tsx
import { useState } from 'react'
import { useRoom, FrameId } from '../../context/RoomContext'

interface HotspotProps {
  frame: FrameId
  label: string
  // position as % of viewport width/height
  x: number
  y: number
}

export default function Hotspot({ frame, label, x, y }: HotspotProps) {
  const { goTo } = useRoom()
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={() => goTo(frame)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'absolute',
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        zIndex: 20,
      }}
      aria-label={label}
    >
      {/* Outer ring pulse */}
      <span
        style={{
          display: 'block',
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '2px solid rgba(99,102,241,0.8)',
          animation: 'hotspot-pulse 2s ease-in-out infinite',
          position: 'relative',
        }}
      >
        {/* Inner dot */}
        <span
          style={{
            position: 'absolute',
            inset: '30%',
            borderRadius: '50%',
            background: '#6366f1',
            boxShadow: '0 0 8px #6366f1',
          }}
        />
      </span>
      {/* Label */}
      {hovered && (
        <span
          style={{
            position: 'absolute',
            top: '110%',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(5,5,16,0.9)',
            color: '#e2e8f0',
            fontSize: 12,
            padding: '4px 10px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            border: '1px solid rgba(99,102,241,0.3)',
            fontFamily: 'var(--font-body, Inter, sans-serif)',
          }}
        >
          {label}
        </span>
      )}
    </button>
  )
}
```

**Step 3: Add hotspot-pulse keyframes to index.css**

In `src/index.css`, add:
```css
@keyframes hotspot-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(99,102,241,0.4); }
  50%       { box-shadow: 0 0 0 12px rgba(99,102,241,0); }
}
```

**Step 4: Hotspot coordinates**

Measured against the photo composition (adjust after visual check):

| Frame | Object | x% | y% |
|---|---|---|---|
| buste | Bust on desk | 62 | 68 |
| iMac | iMac screen | 72 | 52 |
| bernabeu | Window/stadium | 48 | 40 |
| neon | Neon sign left wall | 13 | 42 |
| bibliotheque | Bookshelf right | 88 | 45 |
| lab | Whiteboard (add between window+shelf) | 72 | 35 |
| hobbies | Chess + ball area | 80 | 80 |

**Step 5: Wire Room/index.tsx**

```tsx
// src/components/Room/index.tsx
import { useTranslation } from 'react-i18next'
import { useRoom } from '../../context/RoomContext'
import RoomBackground from './RoomBackground'
import Hotspot from './Hotspot'
import FrameOverlay from './FrameOverlay'

export default function Room() {
  const { activeFrame } = useRoom()
  const { t } = useTranslation()
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 10 }}>
      <RoomBackground />

      {/* Hotspots — only visible on home frame */}
      {activeFrame === 'home' && (
        <>
          <Hotspot frame="buste"        label={labels.buste}        x={62} y={68} />
          <Hotspot frame="iMac"         label={labels.iMac}         x={72} y={52} />
          <Hotspot frame="bernabeu"     label={labels.bernabeu}     x={48} y={40} />
          <Hotspot frame="neon"         label={labels.neon}         x={13} y={42} />
          <Hotspot frame="bibliotheque" label={labels.bibliotheque} x={88} y={45} />
          <Hotspot frame="lab"          label={labels.lab}          x={72} y={35} />
          <Hotspot frame="hobbies"      label={labels.hobbies}      x={80} y={80} />
        </>
      )}

      {/* Frame overlay */}
      <FrameOverlay />
    </div>
  )
}
```

**Step 6: Verify hotspots visible and pulsing in browser**

Expected: 7 pulsing circles overlaid on the room photo. Hover shows label. No FrameOverlay yet (stub it as null).

**Step 7: Commit**

```bash
git add src/components/Room/ src/index.css
git commit -m "feat: parallax room background + hotspots"
```

---

### Task 5: FrameOverlay — animated zoom transition container

**Files:**
- Create: `src/components/Room/FrameOverlay.tsx`
- Create: `src/components/Room/BackButton.tsx`

**Step 1: BackButton**

```tsx
// src/components/Room/BackButton.tsx
import { useRoom } from '../../context/RoomContext'
import { useTranslation } from 'react-i18next'

export default function BackButton() {
  const { goHome } = useRoom()
  const { t } = useTranslation()

  return (
    <button
      onClick={goHome}
      style={{
        position: 'fixed',
        top: 24,
        left: 24,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(5,5,16,0.7)',
        border: '1px solid rgba(99,102,241,0.3)',
        color: '#e2e8f0',
        borderRadius: 8,
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'var(--font-body, Inter, sans-serif)',
        backdropFilter: 'blur(8px)',
      }}
      aria-label={t('room.back')}
    >
      ← {t('room.back')}
    </button>
  )
}
```

**Step 2: FrameOverlay with GSAP fade+scale animation**

```tsx
// src/components/Room/FrameOverlay.tsx
import { useEffect, useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { useRoom } from '../../context/RoomContext'
import BackButton from './BackButton'
import FrameBuste from './frames/FrameBuste'
import FrameIMac from './frames/FrameIMac'
import FrameBernabeu from './frames/FrameBernabeu'
import FrameNeon from './frames/FrameNeon'
import FrameBibliotheque from './frames/FrameBibliotheque'
import FrameLab from './frames/FrameLab'
import FrameHobbies from './frames/FrameHobbies'

const FRAME_COMPONENTS = {
  buste:        <FrameBuste />,
  iMac:         <FrameIMac />,
  bernabeu:     <FrameBernabeu />,
  neon:         <FrameNeon />,
  bibliotheque: <FrameBibliotheque />,
  lab:          <FrameLab />,
  hobbies:      <FrameHobbies />,
}

export default function FrameOverlay() {
  const { activeFrame, goHome } = useRoom()
  const overlayRef = useRef<HTMLDivElement>(null)
  const isHome = activeFrame === 'home'

  // Keyboard Escape → go home
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') goHome() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [goHome])

  useGSAP(() => {
    if (!overlayRef.current) return
    if (!isHome) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0, scale: 0.96 },
        { opacity: 1, scale: 1, duration: 0.5, ease: 'power2.out' }
      )
    }
  }, [activeFrame])

  if (isHome) return null

  return (
    <>
      <BackButton />
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 50,
          background: 'rgba(5,5,16,0.92)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflowY: 'auto',
        }}
      >
        {FRAME_COMPONENTS[activeFrame as keyof typeof FRAME_COMPONENTS]}
      </div>
    </>
  )
}
```

**Step 3: Create stub frames (all frames as stubs first)**

Create each file with a placeholder so TypeScript doesn't error:

```tsx
// src/components/Room/frames/FrameBuste.tsx
export default function FrameBuste() { return <div style={{color:'white'}}>Buste Frame</div> }

// src/components/Room/frames/FrameIMac.tsx
export default function FrameIMac() { return <div style={{color:'white'}}>iMac Frame</div> }

// src/components/Room/frames/FrameBernabeu.tsx
export default function FrameBernabeu() { return <div style={{color:'white'}}>Bernabeu Frame</div> }

// src/components/Room/frames/FrameNeon.tsx
export default function FrameNeon() { return <div style={{color:'white'}}>Neon Frame</div> }

// src/components/Room/frames/FrameBibliotheque.tsx
export default function FrameBibliotheque() { return <div style={{color:'white'}}>Bibliothèque Frame</div> }

// src/components/Room/frames/FrameLab.tsx
export default function FrameLab() { return <div style={{color:'white'}}>Lab Frame</div> }

// src/components/Room/frames/FrameHobbies.tsx
export default function FrameHobbies() { return <div style={{color:'white'}}>Hobbies Frame</div> }
```

**Step 4: Verify navigation works end-to-end**

- Click a hotspot → overlay appears with placeholder text
- Press Escape or click ← → returns to room
- Expected: smooth fade+scale animation in, instant return

**Step 5: Commit**

```bash
git add src/components/Room/
git commit -m "feat: FrameOverlay with GSAP zoom-in animation and back navigation"
```

---

### Task 6: Frame 1 — Buste (About / Contact / CV)

**Files:**
- Modify: `src/components/Room/frames/FrameBuste.tsx`

**Step 1: Implement FrameBuste**

```tsx
// src/components/Room/frames/FrameBuste.tsx
import { useTranslation } from 'react-i18next'

const BASE = import.meta.env.BASE_URL

export default function FrameBuste() {
  const { t } = useTranslation()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: 560,
      width: '100%',
      padding: '2rem',
    }}>
      {/* Photo */}
      <div style={{
        width: 140,
        height: 140,
        borderRadius: '50%',
        overflow: 'hidden',
        border: '3px solid rgba(99,102,241,0.6)',
        boxShadow: '0 0 40px rgba(99,102,241,0.3)',
        marginBottom: '1.5rem',
        flexShrink: 0,
      }}>
        <img
          src={`${BASE}PHOTO.jpg`}
          alt="Victorien Alleg"
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
        />
      </div>

      {/* Name + title */}
      <h1 style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', textAlign: 'center' }}>
        Victorien Alleg
      </h1>
      <p style={{ color: '#22d3ee', fontFamily: 'var(--font-body, Inter)', fontSize: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        AI & Sport Business · MSc Eugenia School Paris
      </p>

      {/* Bio */}
      <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body, Inter)', fontSize: '0.9rem', lineHeight: 1.7, textAlign: 'center', marginBottom: '1.5rem' }}>
        {t('about.bio')}
      </p>

      {/* Education timeline */}
      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        {[
          { title: t('about.msc'), place: t('about.mscLocation'), accent: '#6366f1' },
          { title: t('about.master'), place: t('about.masterLocation'), accent: '#22d3ee' },
        ].map(edu => (
          <div key={edu.title} style={{
            display: 'flex',
            gap: '1rem',
            marginBottom: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: 10,
            border: `1px solid ${edu.accent}33`,
            background: `${edu.accent}0d`,
          }}>
            <div style={{ width: 3, borderRadius: 4, background: edu.accent, flexShrink: 0 }} />
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-display)' }}>{edu.title}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'var(--font-body)' }}>{edu.place}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact links */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Email', href: 'mailto:victorienalleg@gmail.com' },
          { label: 'LinkedIn', href: 'https://linkedin.com/in/victorien-alleg' },
          { label: 'GitHub', href: 'https://github.com/valleg12' },
        ].map(link => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '8px 20px',
              borderRadius: 8,
              border: '1px solid rgba(99,102,241,0.4)',
              color: '#e2e8f0',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              textDecoration: 'none',
              background: 'rgba(99,102,241,0.08)',
              transition: 'background 0.2s',
            }}
          >
            {link.label}
          </a>
        ))}
      </div>

      {/* CV Download */}
      <a
        href={`${BASE}CV_Victorien_Alleg.pdf`}
        download
        style={{
          padding: '10px 28px',
          borderRadius: 8,
          background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
          color: 'white',
          fontFamily: 'var(--font-display)',
          fontWeight: 600,
          fontSize: '0.9rem',
          textDecoration: 'none',
          boxShadow: '0 0 20px rgba(99,102,241,0.4)',
        }}
      >
        {t('room.cv')} ↓
      </a>
    </div>
  )
}
```

**Note:** Place the CV PDF at `public/CV_Victorien_Alleg.pdf`. If not available yet, the button renders but download will 404 — acceptable for now.

**Step 2: Verify visually**

Click buste hotspot → card appears with photo, bio, education, contact links, CV button.

**Step 3: Commit**

```bash
git add src/components/Room/frames/FrameBuste.tsx
git commit -m "feat: FrameBuste — about, education, contact card"
```

---

### Task 7: Frame 2 — iMac (Tech Projects)

**Files:**
- Modify: `src/components/Room/frames/FrameIMac.tsx`

**Step 1: Implement FrameIMac**

Reuse the project data from `src/i18n/en.json` (projects.items). Filter to tech projects: Jungle Gather + Carrefour.

```tsx
// src/components/Room/frames/FrameIMac.tsx
import { useTranslation } from 'react-i18next'

const TECH_PROJECT_IDS = ['jungle-gather', 'carrefour']

export default function FrameIMac() {
  const { t } = useTranslation()
  const projects = (t('projects.items', { returnObjects: true }) as any[])
    .filter(p => TECH_PROJECT_IDS.includes(p.id))

  return (
    <div style={{ maxWidth: 700, width: '100%', padding: '2rem' }}>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Tech Projects
      </h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', marginBottom: '2rem', borderRadius: 2 }} />

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {projects.map((p: any) => (
          <div key={p.id} style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 14,
            border: '1px solid rgba(99,102,241,0.2)',
            background: 'rgba(99,102,241,0.06)',
            backdropFilter: 'blur(8px)',
          }}>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {p.title}
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {p.tags.map((tag: string) => (
                <span key={tag} style={{
                  fontSize: 11,
                  padding: '2px 10px',
                  borderRadius: 20,
                  border: '1px solid rgba(34,211,238,0.3)',
                  color: '#22d3ee',
                  fontFamily: 'var(--font-body)',
                  background: 'rgba(34,211,238,0.08)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Room/frames/FrameIMac.tsx
git commit -m "feat: FrameIMac — tech projects (Jungle Gather, Carrefour)"
```

---

### Task 8: Frame 3 — Bernabeu (Sport Projects)

**Files:**
- Modify: `src/components/Room/frames/FrameBernabeu.tsx`

**Step 1: Implement FrameBernabeu**

Filter sport projects: Sportech, GetStaty, Novarena. Blue Bernabeu theme (`#1e3a5f` accents).

```tsx
// src/components/Room/frames/FrameBernabeu.tsx
import { useTranslation } from 'react-i18next'

const SPORT_PROJECT_IDS = ['sportech', 'getstaty', 'novarena']

export default function FrameBernabeu() {
  const { t } = useTranslation()
  const projects = (t('projects.items', { returnObjects: true }) as any[])
    .filter(p => SPORT_PROJECT_IDS.includes(p.id))

  return (
    <div style={{ maxWidth: 750, width: '100%', padding: '2rem' }}>
      {/* Header with stadium vibe */}
      <div style={{ marginBottom: '2rem' }}>
        <p style={{ color: '#60a5fa', fontFamily: 'var(--font-body)', fontSize: '0.8rem', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>
          Santiago Bernabéu · Madrid
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          Sport Projects
        </h2>
        <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', borderRadius: 2 }} />
      </div>

      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {projects.map((p: any) => (
          <div key={p.id} style={{
            padding: '1.25rem 1.5rem',
            borderRadius: 14,
            border: '1px solid rgba(59,130,246,0.25)',
            background: 'rgba(30,58,95,0.3)',
            backdropFilter: 'blur(8px)',
          }}>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
              {p.title}
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {p.tags.map((tag: string) => (
                <span key={tag} style={{
                  fontSize: 11,
                  padding: '2px 10px',
                  borderRadius: 20,
                  border: '1px solid rgba(96,165,250,0.35)',
                  color: '#93c5fd',
                  fontFamily: 'var(--font-body)',
                  background: 'rgba(59,130,246,0.1)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              {p.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Room/frames/FrameBernabeu.tsx
git commit -m "feat: FrameBernabeu — sport projects with Bernabeu theme"
```

---

### Task 9: Frame 4 — Neon (Skills)

**Files:**
- Modify: `src/components/Room/frames/FrameNeon.tsx`

**Step 1: Lift TechItems data to shared constant**

Move `TECH_ITEMS` array from `src/components/Skills/index.tsx` to `src/data/techItems.ts` so it can be reused by both.

```ts
// src/data/techItems.ts
import {
  SiPython, SiPostgresql, SiPandas, SiScikitlearn, SiOpenai, SiGit, SiNotion,
} from 'react-icons/si'
import { TbBrain, TbBrandAzure, TbLayoutDashboard, TbChartBar, TbFileSpreadsheet } from 'react-icons/tb'
import type { IconType } from 'react-icons'

export interface TechItem {
  name: string; icon: IconType; color: string; category: 'IA'|'Data'|'Business'|'Tools'; level: number
}

export const TECH_ITEMS: TechItem[] = [
  { name: 'Python',       icon: SiPython,         color: '#3b82f6', category: 'Data',     level: 85 },
  { name: 'SQL',          icon: SiPostgresql,      color: '#f59e0b', category: 'Data',     level: 80 },
  { name: 'Pandas',       icon: SiPandas,          color: '#6366f1', category: 'Data',     level: 75 },
  { name: 'Scikit-learn', icon: SiScikitlearn,     color: '#f97316', category: 'IA',       level: 70 },
  { name: 'GPT API',      icon: SiOpenai,          color: '#10b981', category: 'IA',       level: 90 },
  { name: 'LangChain',    icon: TbBrain,           color: '#8b5cf6', category: 'IA',       level: 75 },
  { name: 'Power BI',     icon: TbLayoutDashboard, color: '#f97316', category: 'Business', level: 85 },
  { name: 'Tableau',      icon: TbChartBar,        color: '#0ea5e9', category: 'Business', level: 80 },
  { name: 'Excel/Sheets', icon: TbFileSpreadsheet, color: '#22c55e', category: 'Business', level: 90 },
  { name: 'Azure',        icon: TbBrandAzure,      color: '#0078d4', category: 'Tools',    level: 60 },
  { name: 'Git',          icon: SiGit,             color: '#f97316', category: 'Tools',    level: 75 },
  { name: 'Notion',       icon: SiNotion,          color: '#e2e8f0', category: 'Tools',    level: 95 },
]
```

Update `src/components/Skills/index.tsx` to import from `src/data/techItems.ts` (remove the local definition, add the import).

**Step 2: Implement FrameNeon**

```tsx
// src/components/Room/frames/FrameNeon.tsx
import { useState } from 'react'
import { TECH_ITEMS } from '../../../data/techItems'

const CATEGORY_COLORS: Record<string, string> = {
  IA:       'rgba(34,211,238,0.15)',
  Data:     'rgba(59,130,246,0.15)',
  Business: 'rgba(16,185,129,0.15)',
  Tools:    'rgba(249,115,22,0.15)',
}

export default function FrameNeon() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 800, width: '100%', padding: '2rem' }}>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Skills
      </h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', marginBottom: '2rem', borderRadius: 2 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '1rem' }}>
        {TECH_ITEMS.map(item => {
          const Icon = item.icon
          const isHovered = hovered === item.name
          return (
            <div
              key={item.name}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '1rem',
                borderRadius: 12,
                border: `1px solid ${isHovered ? item.color + '80' : 'rgba(255,255,255,0.08)'}`,
                background: isHovered ? CATEGORY_COLORS[item.category] : 'rgba(255,255,255,0.02)',
                transition: 'all 0.2s ease',
                cursor: 'default',
              }}
            >
              <Icon size={28} style={{ color: item.color, marginBottom: 8, display: 'block' }} />
              <p style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem', marginBottom: 8 }}>{item.name}</p>
              <div style={{ height: 3, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{
                  height: '100%',
                  borderRadius: 4,
                  width: `${item.level}%`,
                  background: `linear-gradient(90deg, #6366f1, ${item.color})`,
                  transition: 'width 0.8s ease-out',
                }} />
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.72rem', fontFamily: 'var(--font-body)', marginTop: 4, textAlign: 'right' }}>{item.level}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/data/techItems.ts src/components/Skills/index.tsx src/components/Room/frames/FrameNeon.tsx
git commit -m "feat: FrameNeon — skills grid, extract TechItems to shared data"
```

---

### Task 10: Frame 5 — Bibliothèque (Formation)

**Files:**
- Modify: `src/components/Room/frames/FrameBibliotheque.tsx`

**Step 1: Define formation data**

```ts
const BOOKS = [
  {
    title: 'MSc AI Applied to Business',
    school: 'Eugenia School, Paris',
    years: '2024 – 2026',
    color: '#6366f1',
    emoji: '🧠',
    desc: 'Machine learning, LLM engineering, AI strategy, data science applied to business contexts.',
  },
  {
    title: 'Master Management Organisations Sportives',
    school: 'AMOS Sport Business School, Lille',
    years: '2021 – 2023',
    color: '#22d3ee',
    emoji: '⚽',
    desc: 'Sports marketing, event management, sports analytics, business development in sports.',
  },
  {
    title: 'Certifications & Continuous Learning',
    school: 'Online · Ongoing',
    years: '2023 – present',
    color: '#10b981',
    emoji: '📜',
    desc: 'DeepLearning.AI, LangChain, Azure AI, Prompt Engineering, Power BI — active self-learning.',
  },
]
```

**Step 2: Implement FrameBibliotheque**

Visual metaphor: each formation is a "book spine" card. On hover the card slides out like a book being pulled from a shelf.

```tsx
// src/components/Room/frames/FrameBibliotheque.tsx
import { useState } from 'react'

const BOOKS = [ /* data from step 1 */ ]

export default function FrameBibliotheque() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ maxWidth: 700, width: '100%', padding: '2rem' }}>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Education
      </h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', marginBottom: '2rem', borderRadius: 2 }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {BOOKS.map((book, i) => (
          <div
            key={book.title}
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              cursor: 'pointer',
              borderRadius: 12,
              border: `1px solid ${book.color}33`,
              background: open === i ? `${book.color}12` : 'rgba(255,255,255,0.02)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
            }}
          >
            {/* Spine (always visible) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem 1.25rem',
              borderLeft: `4px solid ${book.color}`,
            }}>
              <span style={{ fontSize: 28 }}>{book.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.95rem' }}>{book.title}</p>
                <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>{book.school} · {book.years}</p>
              </div>
              <span style={{ color: book.color, fontSize: 20, transition: 'transform 0.3s', transform: open === i ? 'rotate(90deg)' : 'none' }}>›</span>
            </div>
            {/* Expanded content */}
            {open === i && (
              <div style={{ padding: '0 1.25rem 1rem 4.25rem' }}>
                <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.7 }}>{book.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/Room/frames/FrameBibliotheque.tsx
git commit -m "feat: FrameBibliotheque — education books with expand animation"
```

---

### Task 11: Frame 6 — Lab (Whiteboard / Services)

**Files:**
- Modify: `src/components/Room/frames/FrameLab.tsx`

**Step 1: Implement FrameLab**

Whiteboard aesthetic: off-white/cream background, handwriting-style font (use `cursive` CSS fallback or Google Font `Caveat`). Services as sticky-note cards.

Add Caveat font to `index.html`:
```html
<link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet">
```

```tsx
// src/components/Room/frames/FrameLab.tsx
import { useTranslation } from 'react-i18next'

export default function FrameLab() {
  const { t } = useTranslation()
  const items = t('lab.items', { returnObjects: true }) as any[]

  return (
    <div style={{ maxWidth: 800, width: '100%', padding: '2rem' }}>
      {/* Whiteboard container */}
      <div style={{
        background: 'rgba(240,240,235,0.06)',
        border: '2px solid rgba(240,240,235,0.15)',
        borderRadius: 16,
        padding: '2rem',
        backdropFilter: 'blur(4px)',
        boxShadow: '0 0 60px rgba(255,255,255,0.03)',
      }}>
        {/* Title written on whiteboard */}
        <h2 style={{
          fontFamily: '"Caveat", cursive',
          fontSize: '2.5rem',
          color: 'rgba(255,255,255,0.85)',
          marginBottom: '0.25rem',
          borderBottom: '2px solid rgba(255,255,255,0.1)',
          paddingBottom: '0.75rem',
          marginBottom: '1.5rem',
        }}>
          Lab ✦
        </h2>
        <p style={{
          fontFamily: '"Caveat", cursive',
          fontSize: '1.1rem',
          color: '#94a3b8',
          marginBottom: '2rem',
        }}>
          {t('lab.subtitle')}
        </p>

        {/* Service items as post-its */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {items.map((item: any, i: number) => {
            const hues = ['#6366f1', '#22d3ee', '#10b981', '#f97316', '#8b5cf6', '#f59e0b']
            const color = hues[i % hues.length]
            return (
              <div key={item.title} style={{
                padding: '1rem',
                borderRadius: 8,
                background: `${color}12`,
                border: `1px solid ${color}33`,
                position: 'relative',
              }}>
                <span style={{ fontSize: 24, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                <p style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: '1.1rem',
                  color: 'white',
                  fontWeight: 600,
                  marginBottom: 6,
                }}>
                  {item.title}
                </p>
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.78rem',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                }}>
                  {item.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Room/frames/FrameLab.tsx index.html
git commit -m "feat: FrameLab — whiteboard services with Caveat handwriting font"
```

---

### Task 12: Frame 7 — Hobbies

**Files:**
- Modify: `src/components/Room/frames/FrameHobbies.tsx`

**Step 1: Implement FrameHobbies**

```tsx
// src/components/Room/frames/FrameHobbies.tsx
import { useTranslation } from 'react-i18next'

export default function FrameHobbies() {
  const { t } = useTranslation()
  const hobbies = t('offwork.items', { returnObjects: true }) as string[]
  const languages = t('languages.items', { returnObjects: true }) as any[]

  return (
    <div style={{ maxWidth: 600, width: '100%', padding: '2rem' }}>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Off Work
      </h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', marginBottom: '2rem', borderRadius: 2 }} />

      {/* Hobby chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {hobbies.map((h: string) => (
          <span key={h} style={{
            padding: '8px 20px',
            borderRadius: 40,
            border: '1px solid rgba(99,102,241,0.35)',
            color: '#e2e8f0',
            fontFamily: 'var(--font-body)',
            fontSize: '0.9rem',
            background: 'rgba(99,102,241,0.08)',
          }}>
            {h}
          </span>
        ))}
      </div>

      {/* Language bars */}
      <h3 style={{ color: '#94a3b8', fontFamily: 'var(--font-display)', fontSize: '0.8rem', letterSpacing: 2, textTransform: 'uppercase', marginBottom: '1rem' }}>
        {t('languages.title')}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {languages.map((lang: any) => (
          <div key={lang.lang}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'white', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}>{lang.lang}</span>
              <span style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '0.78rem' }}>{lang.level}</span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{
                height: '100%',
                borderRadius: 4,
                width: `${lang.pct}%`,
                background: 'linear-gradient(90deg, #6366f1, #22d3ee)',
              }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add src/components/Room/frames/FrameHobbies.tsx
git commit -m "feat: FrameHobbies — hobby chips and language bars"
```

---

### Task 13: Navbar update

**Files:**
- Modify: `src/components/Navbar/index.tsx`

**Step 1: Replace scroll anchors with frame navigation**

The Navbar currently uses `<a href="#section">` scroll anchors. Replace with buttons that call `goTo()` from `useRoom()`.

Update nav items to match the 7 frames:
- About → `buste`
- Skills → `neon`
- Projects → show sub-menu or cycle between `iMac` / `bernabeu` (simplest: link to `iMac` as "Tech" and `bernabeu` as "Sport")
- Lab → `lab`
- Contact → `buste` (contact is on the buste card)

Read the existing Navbar first, then update the link click handlers.

**Step 2: Update FR/EN toggle position**

Ensure the language toggle is **top-right**. In the existing Navbar, confirm the toggle button renders at the right end of the nav. If the nav is left-aligned, add `margin-left: auto` to push the toggle right.

**Step 3: Commit**

```bash
git add src/components/Navbar/index.tsx
git commit -m "feat: update Navbar to use RoomContext frame navigation"
```

---

### Task 14: Polish — hotspot position fine-tuning & final deploy

**Files:**
- Modify: `src/components/Room/index.tsx` (hotspot coordinates)

**Step 1: Visual QA checklist**

Run dev server and verify each frame:
- [ ] Frame 0: Parallax works on mouse move, 7 hotspots visible and pulsing
- [ ] Frame 1 (Buste): Photo, bio, education, contact links, CV button all render
- [ ] Frame 2 (iMac): Jungle Gather + Carrefour cards
- [ ] Frame 3 (Bernabeu): 3 sport project cards, blue theme
- [ ] Frame 4 (Neon): 12 tech cards with progress bars
- [ ] Frame 5 (Bibliothèque): 3 books expandable
- [ ] Frame 6 (Lab): Whiteboard with 6 service post-its in Caveat font
- [ ] Frame 7 (Hobbies): Hobby chips + language bars
- [ ] Back arrow (←) top-left works from all frames
- [ ] Escape key returns to room
- [ ] FR/EN toggle works and content switches language
- [ ] English is default language on first load
- [ ] Particles still visible through overlays
- [ ] Background preserved (fixed canvas z-index 0)

**Step 2: Adjust hotspot x/y coordinates**

Fine-tune based on visual inspection. The photo composition:
- Neon sign: far left wall (~10-15% x, ~38-45% y)
- Window/Bernabeu: center (~45-50% x, ~35-45% y)
- iMac: right-center desk (~68-75% x, ~48-55% y)
- Buste: right desk foreground (~60-65% x, ~65-72% y)
- Chess: right side desk (~78-85% x, ~72-80% y)
- Bookshelf: far right (~86-92% x, ~40-50% y)
- Lab (whiteboard, between window + shelf): (~70-75% x, ~30-38% y)

**Step 3: Build and deploy**

```bash
~/.nvm/versions/node/v22.11.0/bin/npm run build
git add -A
git commit -m "feat: complete room portfolio — all 7 frames implemented"
git push origin main
```

Expected: GitHub Actions deploys to GitHub Pages within ~2 minutes.

---

## Quick Reference

| Component | Path |
|---|---|
| Room context | `src/context/RoomContext.tsx` |
| Room root | `src/components/Room/index.tsx` |
| Parallax background | `src/components/Room/RoomBackground.tsx` |
| Hotspot | `src/components/Room/Hotspot.tsx` |
| Frame overlay + transitions | `src/components/Room/FrameOverlay.tsx` |
| Back button | `src/components/Room/BackButton.tsx` |
| Frame: About/Contact | `src/components/Room/frames/FrameBuste.tsx` |
| Frame: Tech Projects | `src/components/Room/frames/FrameIMac.tsx` |
| Frame: Sport Projects | `src/components/Room/frames/FrameBernabeu.tsx` |
| Frame: Skills | `src/components/Room/frames/FrameNeon.tsx` |
| Frame: Education | `src/components/Room/frames/FrameBibliotheque.tsx` |
| Frame: Lab/Services | `src/components/Room/frames/FrameLab.tsx` |
| Frame: Hobbies | `src/components/Room/frames/FrameHobbies.tsx` |
| Shared tech data | `src/data/techItems.ts` |
| i18n EN | `src/i18n/en.json` |
| i18n FR | `src/i18n/fr.json` |
