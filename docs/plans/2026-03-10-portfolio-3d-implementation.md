# Portfolio 3D Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Completely replace the existing Next.js portfolio with a Vite + React + Three.js immersive 3D portfolio for Victorien Alleg.

**Architecture:** Vite + React 18 + TypeScript with a fixed R3F particle canvas as global background, per-section 3D elements (neural network hero, physics balls for skills, GSAP horizontal scroll for projects), and react-i18next for FR/EN bilingual support.

**Tech Stack:** Vite, React 18, TypeScript, Three.js, @react-three/fiber, @react-three/drei, @react-three/rapier, @react-three/postprocessing, GSAP + ScrollTrigger, Tailwind CSS v3, react-i18next, lucide-react

---

## Important Migration Notes

- We are **replacing** the Next.js project in-place (same git repo, same directory `/Users/victorienalleg/portfolio`)
- Keep: `public/images/` (project screenshots), `public/PHOTO.jpg`
- Remove: `app/`, `pages/`, `components/`, `styles/`, Next.js config files
- Keep: `docs/`, `*.pdf`, `*.png` at root (CV etc.)
- All commits go to a new branch `feat/3d-redesign`

---

## Task 1: Create new branch and scaffold Vite project

**Files:**
- Modify: `package.json`
- Create: `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.node.json`
- Create: `postcss.config.ts`, `tailwind.config.ts`
- Create: `src/main.tsx`, `src/App.tsx`, `src/index.css`, `src/vite-env.d.ts`

**Step 1: Create feature branch**

```bash
git checkout -b feat/3d-redesign
```

**Step 2: Install dependencies (replace package.json)**

Replace the entire content of `package.json` with:

```json
{
  "name": "portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  },
  "dependencies": {
    "@gsap/react": "^2.1.1",
    "@react-three/drei": "^9.120.4",
    "@react-three/fiber": "^8.17.10",
    "@react-three/postprocessing": "^2.16.3",
    "@react-three/rapier": "^1.5.0",
    "@types/three": "^0.168.0",
    "gsap": "^3.12.7",
    "i18next": "^23.16.8",
    "lucide-react": "^0.454.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-i18next": "^13.5.0",
    "react-icons": "^5.3.0",
    "three": "^0.168.0"
  },
  "devDependencies": {
    "@eslint/js": "^9.9.0",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "eslint": "^9.9.0",
    "postcss": "^8.4.47",
    "tailwindcss": "^3.4.14",
    "typescript": "^5.5.3",
    "vite": "^5.4.1"
  }
}
```

**Step 3: Run install**

```bash
cd /Users/victorienalleg/portfolio && npm install
```

Expected: installs cleanly, `node_modules/` updated.

**Step 4: Remove Next.js files**

```bash
rm -rf app components styles pages next.config.js next.config.mjs next-env.d.ts postcss.config.mjs tailwind.config.js tailwind.config.ts tsconfig.json components.json
```

**Step 5: Create `index.html`**

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content="Victorien Alleg — AI & Sports Business Portfolio" />
    <title>Victorien Alleg</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**Step 6: Create `vite.config.ts`**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src',
    },
  },
})
```

**Step 7: Create `tsconfig.json`**

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

**Step 8: Create `tsconfig.app.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"]
}
```

**Step 9: Create `tsconfig.node.json`**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

**Step 10: Create `tailwind.config.ts`**

```typescript
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: '#050510',
        primary: '#6366f1',
        accent: '#22d3ee',
        muted: '#94a3b8',
      },
    },
  },
  plugins: [],
}

export default config
```

**Step 11: Create `postcss.config.ts`**

```typescript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

**Step 12: Create `src/vite-env.d.ts`**

```typescript
/// <reference types="vite/client" />
```

**Step 13: Create `src/index.css`**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  background-color: #050510;
  color: #f8fafc;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;
}

::-webkit-scrollbar {
  width: 4px;
}

::-webkit-scrollbar-track {
  background: #050510;
}

::-webkit-scrollbar-thumb {
  background: #6366f1;
  border-radius: 2px;
}

.font-display {
  font-family: 'Space Grotesk', sans-serif;
}

/* Section base */
section {
  position: relative;
  z-index: 10;
}
```

**Step 14: Create `src/main.tsx`**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './i18n'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

**Step 15: Create minimal `src/App.tsx` (stub)**

```tsx
export default function App() {
  return (
    <div className="bg-bg min-h-screen text-white flex items-center justify-center">
      <h1 className="font-display text-4xl">Portfolio Loading…</h1>
    </div>
  )
}
```

**Step 16: Verify the scaffold builds**

```bash
npm run dev
```

Expected: Vite dev server starts on port 5173, browser shows "Portfolio Loading…" on dark background.

**Step 17: Commit**

```bash
git add -A
git commit -m "feat: migrate to Vite + React scaffold, remove Next.js"
```

---

## Task 2: i18n setup (react-i18next)

**Files:**
- Create: `src/i18n/index.ts`
- Create: `src/i18n/fr.json`
- Create: `src/i18n/en.json`

**Step 1: Create `src/i18n/fr.json`**

```json
{
  "nav": {
    "about": "À propos",
    "skills": "Compétences",
    "projects": "Projets",
    "services": "Services",
    "contact": "Contact"
  },
  "hero": {
    "greeting": "Bonjour, je suis",
    "name": "Victorien Alleg",
    "role": "IA & Sport Business",
    "cta": "Voir mes projets",
    "cv": "Télécharger le CV"
  },
  "about": {
    "title": "À propos",
    "bio": "Étudiant en MSc IA Appliquée aux Affaires à Eugenia School Paris, je combine expertise en intelligence artificielle et passion pour le sport business. Mon approche : transformer les données en décisions stratégiques.",
    "education": "Formation",
    "msc": "MSc AI Applied to Business",
    "mscLocation": "Eugenia School, Paris · 2024–2026",
    "master": "Master Management Organisations Sportives",
    "masterLocation": "AMOS, Lille · 2021–2023"
  },
  "skills": {
    "title": "Compétences",
    "subtitle": "Outils & technologies",
    "items": [
      "Modèles prédictifs",
      "Business Intelligence",
      "NLP & Analyse de texte",
      "Automatisation IA",
      "Dashboards interactifs",
      "Gestion de projets IA",
      "Analyse de sentiment",
      "Systèmes de recommandation"
    ]
  },
  "projects": {
    "title": "Projets",
    "items": [
      {
        "id": "jungle-gather",
        "title": "Jungle Gather",
        "tags": ["React", "TypeScript", "Pixel Art"],
        "description": "Application web immersive inspirée de Gather pour la dynamique sociale et le planning en entreprise multi-sites. Interface pixel-art, calendrier interactif, gestion de présence remote/préso."
      },
      {
        "id": "carrefour",
        "title": "Carrefour Brand Verification",
        "tags": ["Python", "NLP", "AI", "Geniathon"],
        "description": "Système sophistiqué de vérification de propriété de marques utilisant l'IA pour analyser et valider les relations entre marques et propriétaires. Calcul de score de confiance et traitement parallèle."
      },
      {
        "id": "sportech",
        "title": "Sportech",
        "tags": ["Data Science", "ML", "Sport Analytics"],
        "description": "Solution IA pour optimiser la performance sportive, prévenir les blessures et faciliter le recrutement. Tableaux de bord décisionnels et prédictions basées sur la data science."
      },
      {
        "id": "getstaty",
        "title": "GetStaty",
        "tags": ["API", "Python", "Football Analytics"],
        "description": "Analyse dynamique de matchs et de joueurs pour les championnats de football. Intégration d'API sportives, classement des top performers et statistiques détaillées."
      },
      {
        "id": "novarena",
        "title": "Novarena",
        "tags": ["SaaS", "Cloud", "Stadium Management"],
        "description": "Suite intégrée de gestion intelligente pour stades modernes : performance & analytics, gestion des spectateurs, des talents et business & sponsoring. Architecture cloud-native multi-région."
      }
    ]
  },
  "services": {
    "title": "Services IA pour le Sport Business",
    "items": [
      { "icon": "🏃", "title": "Performance Athlètes", "desc": "Analyse prédictive des performances et prévention des blessures" },
      { "icon": "🏟️", "title": "Gestion d'Événements", "desc": "Optimisation opérationnelle des événements sportifs" },
      { "icon": "🎯", "title": "Marketing Fans", "desc": "Engagement personnalisé et marketing data-driven" },
      { "icon": "💰", "title": "Pricing Dynamique", "desc": "Stratégies de billetterie et revenue optimization" },
      { "icon": "🔍", "title": "Scouting IA", "desc": "Recrutement de talents augmenté par l'intelligence artificielle" },
      { "icon": "📊", "title": "Business Intelligence", "desc": "Tableaux de bord et KPIs pour décisions stratégiques" }
    ]
  },
  "offwork": {
    "title": "Off Work",
    "items": ["Échecs ♟️", "Football ⚽", "Ski 🎿", "Boxe 🥊", "Histoire 📚", "Cinéma 🎬"]
  },
  "languages": {
    "title": "Langues",
    "items": [
      { "lang": "Français", "level": "Natif", "pct": 100 },
      { "lang": "Anglais", "level": "Bilingue", "pct": 95 },
      { "lang": "Espagnol", "level": "Intermédiaire", "pct": 55 }
    ]
  },
  "contact": {
    "title": "Contact",
    "subtitle": "Travaillons ensemble",
    "email": "victorienalleg@gmail.com",
    "linkedin": "linkedin.com/in/victorien-alleg",
    "github": "github.com/victorienalleg"
  }
}
```

**Step 2: Create `src/i18n/en.json`**

```json
{
  "nav": {
    "about": "About",
    "skills": "Skills",
    "projects": "Projects",
    "services": "Services",
    "contact": "Contact"
  },
  "hero": {
    "greeting": "Hello, I'm",
    "name": "Victorien Alleg",
    "role": "AI & Sports Business",
    "cta": "View my work",
    "cv": "Download CV"
  },
  "about": {
    "title": "About",
    "bio": "MSc AI Applied to Business student at Eugenia School Paris, I combine artificial intelligence expertise with a passion for sports business. My approach: turning data into strategic decisions.",
    "education": "Education",
    "msc": "MSc AI Applied to Business",
    "mscLocation": "Eugenia School, Paris · 2024–2026",
    "master": "Master Sports Organisation Management",
    "masterLocation": "AMOS, Lille · 2021–2023"
  },
  "skills": {
    "title": "Skills",
    "subtitle": "Tools & technologies",
    "items": [
      "Predictive models",
      "Business Intelligence",
      "NLP & Text analysis",
      "AI automation",
      "Interactive dashboards",
      "AI project management",
      "Sentiment analysis",
      "Recommendation systems"
    ]
  },
  "projects": {
    "title": "Projects",
    "items": [
      {
        "id": "jungle-gather",
        "title": "Jungle Gather",
        "tags": ["React", "TypeScript", "Pixel Art"],
        "description": "Immersive web app inspired by Gather for social dynamics and planning in multi-site companies. Pixel-art interface, interactive calendar, remote/office attendance management."
      },
      {
        "id": "carrefour",
        "title": "Carrefour Brand Verification",
        "tags": ["Python", "NLP", "AI", "Geniathon"],
        "description": "Sophisticated trademark ownership verification system using AI to analyze and validate brand-owner relationships. Confidence score computation and parallel processing."
      },
      {
        "id": "sportech",
        "title": "Sportech",
        "tags": ["Data Science", "ML", "Sport Analytics"],
        "description": "AI solution to optimize athletic performance, prevent injuries and facilitate recruitment. Decision dashboards and data-science-based predictions."
      },
      {
        "id": "getstaty",
        "title": "GetStaty",
        "tags": ["API", "Python", "Football Analytics"],
        "description": "Dynamic match and player analysis for football leagues. Sports API integration, top performer rankings and detailed statistics."
      },
      {
        "id": "novarena",
        "title": "Novarena",
        "tags": ["SaaS", "Cloud", "Stadium Management"],
        "description": "Integrated intelligent management suite for modern stadiums: performance & analytics, fan management, talent management, and business & sponsoring. Multi-region cloud-native architecture."
      }
    ]
  },
  "services": {
    "title": "AI Services for Sports Business",
    "items": [
      { "icon": "🏃", "title": "Athlete Performance", "desc": "Predictive performance analysis and injury prevention" },
      { "icon": "🏟️", "title": "Event Management", "desc": "Operational optimization of sports events" },
      { "icon": "🎯", "title": "Fan Marketing", "desc": "Personalized engagement and data-driven marketing" },
      { "icon": "💰", "title": "Dynamic Pricing", "desc": "Ticketing strategies and revenue optimization" },
      { "icon": "🔍", "title": "AI Scouting", "desc": "AI-powered talent recruitment and assessment" },
      { "icon": "📊", "title": "Business Intelligence", "desc": "Dashboards and KPIs for strategic decisions" }
    ]
  },
  "offwork": {
    "title": "Off Work",
    "items": ["Chess ♟️", "Football ⚽", "Skiing 🎿", "Boxing 🥊", "History 📚", "Cinema 🎬"]
  },
  "languages": {
    "title": "Languages",
    "items": [
      { "lang": "French", "level": "Native", "pct": 100 },
      { "lang": "English", "level": "Bilingual", "pct": 95 },
      { "lang": "Spanish", "level": "Intermediate", "pct": 55 }
    ]
  },
  "contact": {
    "title": "Contact",
    "subtitle": "Let's work together",
    "email": "victorienalleg@gmail.com",
    "linkedin": "linkedin.com/in/victorien-alleg",
    "github": "github.com/victorienalleg"
  }
}
```

**Step 3: Create `src/i18n/index.ts`**

```typescript
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import fr from './fr.json'
import en from './en.json'

i18n.use(initReactI18next).init({
  resources: {
    fr: { translation: fr },
    en: { translation: en },
  },
  lng: 'fr',
  fallbackLng: 'fr',
  interpolation: { escapeValue: false },
})

export default i18n
```

**Step 4: Verify by importing in App.tsx**

Add `import { useTranslation } from 'react-i18next'` to App.tsx stub and log `t('hero.name')`. Check console shows "Victorien Alleg".

**Step 5: Commit**

```bash
git add src/i18n src/main.tsx
git commit -m "feat: add react-i18next with FR/EN content"
```

---

## Task 3: Global 3D Background (particle canvas)

**Files:**
- Create: `src/components/Background/index.tsx`

**Step 1: Create `src/components/Background/index.tsx`**

```tsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Particles() {
  const ref = useRef<THREE.Points>(null)
  const scrollY = useRef(0)

  const [positions, sizes] = useMemo(() => {
    const count = 350
    const pos = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15
      sz[i] = Math.random() * 2 + 0.5
    }
    return [pos, sz]
  }, [])

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.getElapsedTime()
    ref.current.rotation.y = t * 0.02 + scrollY.current * 0.0005
    ref.current.rotation.x = Math.sin(t * 0.01) * 0.05
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#6366f1"
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  )
}

export default function Background() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{ alpha: true, antialias: false }}
        style={{ background: 'transparent' }}
      >
        <Particles />
      </Canvas>
    </div>
  )
}
```

**Step 2: Add to App.tsx**

```tsx
import Background from './components/Background'

export default function App() {
  return (
    <>
      <Background />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="font-display text-4xl text-white p-8">Portfolio</h1>
      </div>
    </>
  )
}
```

**Step 3: Verify in browser**

Run `npm run dev`. Expect: dark background with softly rotating indigo particles visible.

**Step 4: Commit**

```bash
git add src/components/Background
git commit -m "feat: add global 3D particle background canvas"
```

---

## Task 4: Loading Screen

**Files:**
- Create: `src/context/LoadingContext.tsx`
- Create: `src/components/Loading/index.tsx`

**Step 1: Create `src/context/LoadingContext.tsx`**

```tsx
import { createContext, useContext, useState, ReactNode } from 'react'

interface LoadingContextType {
  isLoading: boolean
  setLoading: (v: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setLoading: () => {},
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(true)
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
```

**Step 2: Create `src/components/Loading/index.tsx`**

```tsx
import { useEffect } from 'react'
import { useLoading } from '../../context/LoadingContext'

export default function Loading() {
  const { isLoading, setLoading } = useLoading()

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(timer)
  }, [setLoading])

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg"
      style={{ transition: 'opacity 0.5s', opacity: isLoading ? 1 : 0 }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div
            className="absolute inset-0 rounded-full border-2 border-t-primary border-r-accent animate-spin"
          />
        </div>
        <span className="font-display text-muted text-sm tracking-widest uppercase">
          Loading
        </span>
      </div>
    </div>
  )
}
```

**Step 3: Wrap App with provider**

```tsx
import { LoadingProvider } from './context/LoadingContext'
import Background from './components/Background'
import Loading from './components/Loading'

export default function App() {
  return (
    <LoadingProvider>
      <Background />
      <Loading />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <h1 className="font-display text-4xl text-white p-8">Victorien Alleg</h1>
      </div>
    </LoadingProvider>
  )
}
```

**Step 4: Verify**

Reload page — loading spinner shows for ~1.8s then disappears.

**Step 5: Commit**

```bash
git add src/context src/components/Loading
git commit -m "feat: add loading screen with spinner"
```

---

## Task 5: Navbar

**Files:**
- Create: `src/components/Navbar/index.tsx`

**Step 1: Create `src/components/Navbar/index.tsx`**

```tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Github, Linkedin } from 'lucide-react'

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggle = () => i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')

  const links = ['about', 'skills', 'projects', 'services', 'contact'] as const

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a href="#hero" className="font-display font-semibold text-white tracking-tight">
          VA<span className="text-primary">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {links.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="text-muted hover:text-white transition-colors text-sm font-body"
            >
              {t(`nav.${key}`)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/victorienalleg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/victorien-alleg"
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-white transition-colors"
          >
            <Linkedin size={18} />
          </a>
          <button
            onClick={toggle}
            className="text-xs font-display font-medium border border-white/10 rounded-md px-3 py-1.5 text-muted hover:text-white hover:border-primary/50 transition-all"
          >
            {i18n.language === 'fr' ? 'EN' : 'FR'}
          </button>
        </div>
      </div>
    </nav>
  )
}
```

**Step 2: Add Navbar to App.tsx**

Import and place `<Navbar />` above the content div.

**Step 3: Verify**

Navbar appears fixed at top. Language toggle changes FR/EN. Scrolling makes navbar translucent.

**Step 4: Commit**

```bash
git add src/components/Navbar
git commit -m "feat: add navbar with lang toggle and social links"
```

---

## Task 6: Hero Section (Neural Network 3D)

**Files:**
- Create: `src/components/Hero/NeuralNetwork.tsx`
- Create: `src/components/Hero/index.tsx`

**Step 1: Create `src/components/Hero/NeuralNetwork.tsx`**

```tsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const NODE_COUNT = 18
const CONNECT_DIST = 2.8

function Nodes() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  const nodes = useMemo(() => {
    return Array.from({ length: NODE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3
      ),
      speed: Math.random() * 0.3 + 0.1,
      phase: Math.random() * Math.PI * 2,
    }))
  }, [])

  const edges = useMemo(() => {
    const lines: [number, number][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < CONNECT_DIST) {
          lines.push([i, j])
        }
      }
    }
    return lines
  }, [nodes])

  const linePositions = useMemo(() => {
    const arr = new Float32Array(edges.length * 6)
    edges.forEach(([i, j], idx) => {
      arr[idx * 6] = nodes[i].position.x
      arr[idx * 6 + 1] = nodes[i].position.y
      arr[idx * 6 + 2] = nodes[i].position.z
      arr[idx * 6 + 3] = nodes[j].position.x
      arr[idx * 6 + 4] = nodes[j].position.y
      arr[idx * 6 + 5] = nodes[j].position.z
    })
    return arr
  }, [edges, nodes])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = pointer.x * 0.3 + Math.sin(t * 0.1) * 0.05
    groupRef.current.rotation.x = -pointer.y * 0.15
  })

  return (
    <group ref={groupRef}>
      {/* Edge lines */}
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.25} />
      </lineSegments>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.08, 12, 12]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#22d3ee' : '#6366f1'}
            emissive={i % 3 === 0 ? '#22d3ee' : '#6366f1'}
            emissiveIntensity={1.5}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function NeuralNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
      <pointLight position={[-5, -3, -2]} intensity={0.5} color="#22d3ee" />
      <Nodes />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} intensity={0.8} levels={6} />
      </EffectComposer>
    </Canvas>
  )
}
```

**Step 2: Create `src/components/Hero/index.tsx`**

```tsx
import { Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'
import { ArrowDown, Download } from 'lucide-react'

const NeuralNetwork = lazy(() => import('./NeuralNetwork'))

export default function Hero() {
  const { t } = useTranslation()

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center"
      style={{ zIndex: 10 }}
    >
      {/* 3D canvas behind text */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Suspense fallback={null}>
          <NeuralNetwork />
        </Suspense>
      </div>

      {/* Text content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16" style={{ zIndex: 2 }}>
        <div className="max-w-2xl">
          <p className="font-body text-muted text-sm tracking-widest uppercase mb-4 animate-fade-in">
            {t('hero.greeting')}
          </p>
          <h1 className="font-display font-bold text-5xl sm:text-7xl text-white leading-none mb-4">
            {t('hero.name')}
          </h1>
          <div className="flex items-center gap-3 mb-8">
            <div className="h-px w-12 bg-primary" />
            <p className="font-body text-accent text-lg">
              {t('hero.role')}
            </p>
          </div>

          <div className="flex flex-wrap gap-4">
            <a
              href="#projects"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-display font-medium px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              {t('hero.cta')}
              <ArrowDown size={16} />
            </a>
            <a
              href="/CV Victorien ALLEG.pdf"
              download
              className="inline-flex items-center gap-2 border border-white/15 hover:border-accent/50 text-muted hover:text-white font-display font-medium px-6 py-3 rounded-lg transition-all hover:scale-105"
            >
              {t('hero.cv')}
              <Download size={16} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2" style={{ zIndex: 2 }}>
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        <span className="text-muted text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}
```

**Step 3: Update App.tsx to include sections**

```tsx
import { Suspense, lazy } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import Background from './components/Background'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Hero from './components/Hero'

export default function App() {
  return (
    <LoadingProvider>
      <Background />
      <Loading />
      <Navbar />
      <main>
        <Hero />
      </main>
    </LoadingProvider>
  )
}
```

**Step 4: Verify**

Browser shows: hero text on the left, glowing neural network nodes behind. Mouse moves the network. Bloom glow visible.

**Step 5: Commit**

```bash
git add src/components/Hero
git commit -m "feat: add hero section with 3D neural network and bloom"
```

---

## Task 7: About Section

**Files:**
- Create: `src/components/About/index.tsx`

**Step 1: Create `src/components/About/index.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { GraduationCap } from 'lucide-react'

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photo + decorative */}
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-2xl border border-primary/30 rotate-3" />
              <div className="absolute inset-0 rounded-2xl border border-accent/20 -rotate-2" />
              <img
                src="/PHOTO.jpg"
                alt="Victorien Alleg"
                className="relative w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
              />
              {/* Glow */}
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-xl -z-10" />
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="font-display font-bold text-4xl text-white mb-6">
              {t('about.title')}
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed mb-10">
              {t('about.bio')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/2">
                <GraduationCap className="text-accent mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-display font-semibold text-white text-sm">{t('about.msc')}</p>
                  <p className="font-body text-muted text-xs mt-0.5">{t('about.mscLocation')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/2">
                <GraduationCap className="text-primary mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-display font-semibold text-white text-sm">{t('about.master')}</p>
                  <p className="font-body text-muted text-xs mt-0.5">{t('about.masterLocation')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to App.tsx**

Import and place `<About />` after `<Hero />`.

**Step 3: Commit**

```bash
git add src/components/About
git commit -m "feat: add about section with photo and education cards"
```

---

## Task 8: Skills Section (Physics Balls)

**Files:**
- Create: `src/components/Skills/PhysicsBalls.tsx`
- Create: `src/components/Skills/index.tsx`
- Add: `public/images/tools/` — tool logos (see note below)

**Note on logos:** Use simple colored sphere materials with text labels instead of image textures initially, so the section works without external assets. The logo texture approach can be added later.

**Step 1: Create `src/components/Skills/PhysicsBalls.tsx`**

```tsx
import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Text } from '@react-three/drei'
import {
  Physics,
  RigidBody,
  BallCollider,
  CylinderCollider,
  RapierRigidBody,
} from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import * as THREE from 'three'

const TOOLS = [
  { name: 'Python', color: '#3b82f6' },
  { name: 'SQL', color: '#f59e0b' },
  { name: 'GPT API', color: '#10b981' },
  { name: 'LangChain', color: '#8b5cf6' },
  { name: 'Power BI', color: '#f97316' },
  { name: 'Tableau', color: '#0ea5e9' },
  { name: 'Sklearn', color: '#ef4444' },
  { name: 'Pandas', color: '#6366f1' },
  { name: 'Azure', color: '#0078d4' },
  { name: 'Notion', color: '#ffffff' },
  { name: 'Figma', color: '#a855f7' },
  { name: 'Git', color: '#f97316' },
]

const balls = TOOLS.map((tool) => ({
  ...tool,
  scale: Math.random() * 0.3 + 0.65,
}))

function Ball({
  tool,
  scale,
  isActive,
  vec = new THREE.Vector3(),
}: {
  tool: { name: string; color: string }
  scale: number
  isActive: boolean
  vec?: THREE.Vector3
}) {
  const api = useRef<RapierRigidBody>(null)

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return
    delta = Math.min(0.1, delta)
    api.current.applyImpulse(
      vec
        .copy(api.current.translation() as THREE.Vector3)
        .normalize()
        .multiply(new THREE.Vector3(-40 * delta * scale, -100 * delta * scale, -40 * delta * scale)),
      true
    )
  })

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.2}
      friction={0.2}
      position={[
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15 - 10,
        (Math.random() - 0.5) * 5,
      ]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, scale * 1.1]}
        args={[scale * 0.15, scale * 0.3]}
      />
      <mesh castShadow scale={scale}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshPhysicalMaterial
          color={tool.color}
          emissive={tool.color}
          emissiveIntensity={0.15}
          metalness={0.4}
          roughness={0.7}
          clearcoat={0.3}
        />
      </mesh>
      <Text
        position={[0, 0, scale + 0.01]}
        fontSize={scale * 0.25}
        color="white"
        anchorX="center"
        anchorY="middle"
        font="https://fonts.gstatic.com/s/spacegrotesk/v16/V8mDoQDjQSkFtoMM3T6r8E7mF71Q-gozuEnvyBbqnu25.woff2"
      >
        {tool.name}
      </Text>
    </RigidBody>
  )
}

function Pointer({ isActive, vec = new THREE.Vector3() }: { isActive: boolean; vec?: THREE.Vector3 }) {
  const ref = useRef<RapierRigidBody>(null)

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return
    ref.current.setNextKinematicTranslation(
      vec.lerp(
        new THREE.Vector3(
          (pointer.x * viewport.width) / 2,
          (pointer.y * viewport.height) / 2,
          0
        ),
        0.2
      )
    )
  })

  return (
    <RigidBody position={[0, 0, -50]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[2]} />
    </RigidBody>
  )
}

export default function PhysicsBalls({ isActive }: { isActive: boolean }) {
  return (
    <Canvas
      shadows
      gl={{ alpha: true, antialias: false, stencil: false, depth: false }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
      onCreated={(s) => ((s.gl as THREE.WebGLRenderer).toneMappingExposure = 1.5)}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.8} />
      <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} castShadow />
      <directionalLight position={[0, 5, -4]} intensity={2} />
      <Physics gravity={[0, 0, 0]}>
        <Pointer isActive={isActive} />
        {balls.map((b, i) => (
          <Ball key={i} tool={b} scale={b.scale} isActive={isActive} />
        ))}
      </Physics>
      <Environment preset="city" environmentIntensity={0.3} />
      <EffectComposer enableNormalPass={false}>
        <N8AO color="#050510" aoRadius={2} intensity={1.2} />
      </EffectComposer>
    </Canvas>
  )
}
```

**Step 2: Create `src/components/Skills/index.tsx`**

```tsx
import { useRef, useState, useEffect, Suspense, lazy } from 'react'
import { useTranslation } from 'react-i18next'

const PhysicsBalls = lazy(() => import('./PhysicsBalls'))

export default function Skills() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.3 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const items = t('skills.items', { returnObjects: true }) as string[]

  return (
    <section id="skills" className="py-24 relative" style={{ zIndex: 10 }} ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 mb-12">
        <h2 className="font-display font-bold text-4xl text-white mb-3">
          {t('skills.title')}
        </h2>
        <p className="font-body text-muted">{t('skills.subtitle')}</p>
      </div>

      {/* Physics balls */}
      <div className="w-full h-[60vh]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center text-muted">Loading 3D…</div>}>
          <PhysicsBalls isActive={isActive} />
        </Suspense>
      </div>

      {/* Skills list chips */}
      <div className="max-w-7xl mx-auto px-6 mt-12 flex flex-wrap gap-3">
        {items.map((item) => (
          <span
            key={item}
            className="font-body text-sm px-4 py-2 rounded-full border border-white/10 text-muted hover:border-primary/50 hover:text-white transition-all"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  )
}
```

**Step 3: Add Skills to App.tsx main**

**Step 4: Verify**

Section appears on scroll. Physics balls float, mouse pushes them. Tool names visible on spheres.

**Step 5: Commit**

```bash
git add src/components/Skills
git commit -m "feat: add skills section with physics balls (rapier)"
```

---

## Task 9: Projects Section (Horizontal Scroll + GSAP)

**Files:**
- Create: `src/components/Projects/ProjectCard.tsx`
- Create: `src/components/Projects/index.tsx`

**Step 1: Install GSAP**

GSAP is already in package.json. Verify `node_modules/gsap` exists.

**Step 2: Create `src/components/Projects/ProjectCard.tsx`**

```tsx
import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Project {
  id: string
  title: string
  tags: string[]
  description: string
}

const PROJECT_IMAGES: Record<string, string> = {
  'jungle-gather': '/images/jungle-gather-1.png',
  'sportech': '/images/sportech-1.png',
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const img = PROJECT_IMAGES[project.id]

  return (
    <div
      className="work-box flex-shrink-0 w-[340px] sm:w-[420px] border border-white/8 rounded-2xl overflow-hidden bg-white/2 backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group"
    >
      {/* Image / placeholder */}
      <div className="h-52 bg-gradient-to-br from-primary/10 to-accent/5 relative overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl font-bold text-white/10">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="font-display text-xs text-muted border border-white/10 rounded-full px-3 py-1 bg-bg/60 backdrop-blur-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-bold text-xl text-white mb-3">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-body px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className={`font-body text-muted text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {project.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-white transition-colors"
        >
          {expanded ? <><ChevronUp size={14} /> Voir moins</> : <><ChevronDown size={14} /> Voir plus</>}
        </button>
      </div>
    </div>
  )
}
```

**Step 3: Create `src/components/Projects/index.tsx`**

```tsx
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './ProjectCard'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: string
  title: string
  tags: string[]
  description: string
}

export default function Projects() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const flexRef = useRef<HTMLDivElement>(null)

  const projects = t('projects.items', { returnObjects: true }) as Project[]

  useGSAP(() => {
    if (!sectionRef.current || !flexRef.current) return

    const totalWidth = flexRef.current.scrollWidth
    const viewportWidth = sectionRef.current.getBoundingClientRect().width
    const translateX = totalWidth - viewportWidth + 64 // 64px for padding

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    })

    tl.to(flexRef.current, { x: -translateX, ease: 'none' })

    return () => {
      tl.kill()
    }
  }, [projects])

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-8">
        <h2 className="font-display font-bold text-4xl text-white mb-2">
          {t('projects.title')}
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-primary to-accent mb-10" />
      </div>

      <div
        ref={flexRef}
        className="flex gap-6 px-8 pb-16"
        style={{ width: 'max-content' }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
```

**Step 4: Add Projects to App.tsx**

**Step 5: Verify**

Horizontal scroll works: scrolling down pans cards left. Project images visible for Jungle Gather and Sportech.

**Step 6: Commit**

```bash
git add src/components/Projects
git commit -m "feat: add projects section with GSAP horizontal scroll"
```

---

## Task 10: Services Section

**Files:**
- Create: `src/components/Services/index.tsx`

**Step 1: Create `src/components/Services/index.tsx`**

```tsx
import { useTranslation } from 'react-i18next'

interface ServiceItem {
  icon: string
  title: string
  desc: string
}

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true }) as ServiceItem[]

  return (
    <section id="services" className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl text-white mb-3">
          {t('services.title')}
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-primary to-accent mb-14" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-2xl border border-white/8 bg-white/2 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">
                {item.title}
              </h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add Services to App.tsx**

**Step 3: Commit**

```bash
git add src/components/Services
git commit -m "feat: add services section with service cards"
```

---

## Task 11: Off Work + Languages Section

**Files:**
- Create: `src/components/OffWork/index.tsx`

**Step 1: Create `src/components/OffWork/index.tsx`**

```tsx
import { useTranslation } from 'react-i18next'

interface LanguageItem {
  lang: string
  level: string
  pct: number
}

export default function OffWork() {
  const { t } = useTranslation()
  const items = t('offwork.items', { returnObjects: true }) as string[]
  const langs = t('languages.items', { returnObjects: true }) as LanguageItem[]

  return (
    <section className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Off Work */}
          <div>
            <h2 className="font-display font-bold text-3xl text-white mb-8">
              {t('offwork.title')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {items.map((item) => (
                <span
                  key={item}
                  className="font-body text-sm px-5 py-2.5 rounded-full border border-white/10 text-muted hover:border-accent/40 hover:text-white transition-all cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="font-display font-bold text-3xl text-white mb-8">
              {t('languages.title')}
            </h2>
            <div className="space-y-6">
              {langs.map((lang) => (
                <div key={lang.lang}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body font-medium text-white">{lang.lang}</span>
                    <span className="font-body text-sm text-muted">{lang.level}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${lang.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Add to App.tsx**

**Step 3: Commit**

```bash
git add src/components/OffWork
git commit -m "feat: add off work and languages section"
```

---

## Task 12: Contact Section

**Files:**
- Create: `src/components/Contact/index.tsx`

**Step 1: Create `src/components/Contact/index.tsx`**

```tsx
import { useTranslation } from 'react-i18next'
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react'

export default function Contact() {
  const { t } = useTranslation()

  const links = [
    {
      icon: <Mail size={22} />,
      label: t('contact.email'),
      href: `mailto:${t('contact.email')}`,
    },
    {
      icon: <Linkedin size={22} />,
      label: t('contact.linkedin'),
      href: 'https://linkedin.com/in/victorien-alleg',
    },
    {
      icon: <Github size={22} />,
      label: t('contact.github'),
      href: 'https://github.com/victorienalleg',
    },
  ]

  return (
    <section id="contact" className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-5xl sm:text-7xl text-white mb-4">
          {t('contact.title')}
        </h2>
        <p className="font-body text-muted text-xl mb-16">
          {t('contact.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-4 rounded-xl border border-white/10 hover:border-primary/40 bg-white/2 hover:bg-primary/5 text-muted hover:text-white transition-all duration-300 min-w-[220px] justify-center"
            >
              <span className="text-primary group-hover:text-accent transition-colors">{link.icon}</span>
              <span className="font-body text-sm">{link.label}</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-32 pt-8 border-t border-white/5 text-center">
        <p className="font-body text-muted text-xs">
          © {new Date().getFullYear()} Victorien Alleg · Built with React + Three.js
        </p>
      </div>
    </section>
  )
}
```

**Step 2: Add Contact to App.tsx (final)**

Complete App.tsx:

```tsx
import { Suspense } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import Background from './components/Background'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Services from './components/Services'
import OffWork from './components/OffWork'
import Contact from './components/Contact'

export default function App() {
  return (
    <LoadingProvider>
      <Background />
      <Loading />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Services />
        <OffWork />
        <Contact />
      </main>
    </LoadingProvider>
  )
}
```

**Step 3: Commit**

```bash
git add src/components/Contact src/App.tsx
git commit -m "feat: add contact section and complete App layout"
```

---

## Task 13: Build verification and polish

**Step 1: Run TypeScript build**

```bash
npm run build
```

Expected: builds cleanly with no TS errors. If errors exist, fix them before continuing.

**Step 2: Fix any TypeScript errors**

Common issues:
- Unused imports → remove them
- `noUnusedLocals` violations → remove unused variables
- `t()` return type assertions → already handled with `{ returnObjects: true } as X`

**Step 3: Test both languages**

In browser, toggle FR ↔ EN. All text updates. No missing translation keys.

**Step 4: Test horizontal scroll**

Scroll through Projects section. Cards pan horizontally. GSAP pin works correctly.

**Step 5: Test physics balls**

Navigate to Skills section. Balls appear and respond to mouse movement.

**Step 6: Add GSAP `@gsap/react` import if not working**

If ScrollTrigger doesn't work, ensure `gsap.registerPlugin(ScrollTrigger)` is called at module level.

**Step 7: Final commit**

```bash
git add -A
git commit -m "feat: complete 3D portfolio redesign - all sections built"
```

---

## Task 14: Merge to main

**Step 1: Check build one final time**

```bash
npm run build
```

**Step 2: Merge**

```bash
git checkout main
git merge feat/3d-redesign
```

**Step 3: Final verification**

```bash
npm run dev
```

Visit all sections, verify 3D elements, test FR/EN, test horizontal scroll.
