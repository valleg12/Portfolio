# Hero + Skills Redesign — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current Hero+About sections with two animated flip cards (identity card + profile card) and replace the unreadable physics balls with a clean tech-skills grid with progress bars.

**Architecture:** Rewrite `src/components/Hero/` (new FlipCard base component + new Hero layout), rewrite `src/components/Skills/index.tsx` (grid layout, no 3D), delete `src/components/About/`, delete `src/components/Hero/NeuralNetwork.tsx`, delete `src/components/Skills/PhysicsBalls.tsx`, update `src/App.tsx`.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, react-icons (SiXxx from react-icons/si), react-i18next, IntersectionObserver (no new deps needed)

---

## Task 1: FlipCard base component

**Files:**
- Create: `src/components/Hero/FlipCard.tsx`

**Step 1: Create `src/components/Hero/FlipCard.tsx`**

```tsx
import { useState, useRef, useCallback, ReactNode } from 'react'

interface FlipCardProps {
  front: ReactNode
  back: ReactNode
  className?: string
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    setTilt({ x: -dy * 7, y: dx * 7 })
  }, [flipped])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const transform = flipped
    ? 'rotateY(180deg)'
    : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`

  return (
    <div
      style={{ perspective: '1200px' }}
      className={`cursor-pointer ${className}`}
      onClick={() => setFlipped((f) => !f)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform,
          transition: flipped
            ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'transform 0.15s ease-out',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Front face */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
          }}
        >
          {front}
        </div>
        {/* Back face */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
          }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
```

**Step 2: Verify no TypeScript errors**

Run: `npm run build`
Expected: ✅ builds cleanly

**Step 3: Commit**

```bash
git add src/components/Hero/FlipCard.tsx
git commit -m "feat: add FlipCard base component with tilt + flip"
```

---

## Task 2: Hero section — two flip cards

**Files:**
- Rewrite: `src/components/Hero/index.tsx`
- Delete: `src/components/Hero/NeuralNetwork.tsx`

**Step 1: Delete NeuralNetwork.tsx** (global Background particles already provide 3D ambiance)

```bash
rm /Users/victorienalleg/portfolio/src/components/Hero/NeuralNetwork.tsx
```

**Step 2: Rewrite `src/components/Hero/index.tsx`**

```tsx
import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Github, Linkedin, Mail, RotateCcw } from 'lucide-react'
import FlipCard from './FlipCard'

const ROLES_FR = ['Modèles prédictifs', 'NLP & Analyse', 'Sport Analytics', 'BI & Dashboards']
const ROLES_EN = ['Predictive models', 'NLP & Analytics', 'Sport Analytics', 'BI & Dashboards']

function useTypewriter(items: string[]) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length)
        setVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(id)
  }, [items.length])

  return { text: items[index], visible }
}

/* ── Shared card shell ───────────────────────────────────── */
function CardShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`w-full h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md
        hover:border-primary/40 transition-colors duration-300 overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}

/* ── Flip hint badge ─────────────────────────────────────── */
function FlipHint({ label }: { label: string }) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-muted/60 text-xs font-body">
      <RotateCcw size={12} />
      {label}
    </div>
  )
}

export default function Hero() {
  const { t, i18n } = useTranslation()
  const roles = i18n.language === 'fr' ? ROLES_FR : ROLES_EN
  const { text: role, visible: roleVisible } = useTypewriter(roles)

  /* ── Left card faces ──────────────────────────────────── */
  const leftFront = (
    <CardShell>
      <div className="relative w-full h-full">
        <img
          src="/PHOTO.jpg"
          alt="Victorien Alleg"
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display font-bold text-3xl text-white leading-tight">
            Victorien<br />Alleg
          </h1>
          <p className="font-body text-accent text-sm mt-1">
            {t('hero.role')}
          </p>
        </div>
        <FlipHint label={t('hero.flip') || 'Retourner'} />
      </div>
    </CardShell>
  )

  const leftBack = (
    <CardShell>
      <div className="flex flex-col h-full p-7 gap-5">
        <h2 className="font-display font-bold text-2xl text-white">
          {t('about.title')}
        </h2>
        <p className="font-body text-muted text-sm leading-relaxed flex-1">
          {t('about.bio')}
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="font-display font-semibold text-white text-xs">{t('about.msc')}</p>
            <p className="font-body text-muted text-xs mt-0.5">{t('about.mscLocation')}</p>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="font-display font-semibold text-white text-xs">{t('about.master')}</p>
            <p className="font-body text-muted text-xs mt-0.5">{t('about.masterLocation')}</p>
          </div>
        </div>
        <a
          href="/CV Victorien ALLEG.pdf"
          download
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 border border-white/15 hover:border-accent/50 text-muted hover:text-white font-display text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
        >
          <Download size={14} />
          {t('hero.cv')}
        </a>
      </div>
    </CardShell>
  )

  /* ── Right card faces ─────────────────────────────────── */
  const rightFront = (
    <CardShell>
      <div className="flex flex-col h-full p-7 justify-between">
        <div>
          <p className="font-body text-muted text-xs tracking-widest uppercase mb-3">
            {t('hero.greeting')}
          </p>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-8">
            {t('hero.name')}
          </h2>
          <div className="h-px w-10 bg-primary mb-6" />
          <p className="font-body text-muted text-sm mb-2">What I do</p>
          <p
            className="font-display font-semibold text-accent text-xl transition-opacity duration-400"
            style={{ opacity: roleVisible ? 1 : 0 }}
          >
            {role}
          </p>
        </div>
        <div>
          <a
            href="#projects"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-display font-medium px-5 py-2.5 rounded-lg transition-all text-sm"
          >
            {t('hero.cta')}
          </a>
        </div>
        <FlipHint label={t('hero.flip') || 'Retourner'} />
      </div>
    </CardShell>
  )

  const rightBack = (
    <CardShell>
      <div className="flex flex-col h-full p-7 justify-between">
        <h2 className="font-display font-bold text-2xl text-white mb-6">
          {t('contact.subtitle')}
        </h2>
        <div className="flex flex-col gap-3 flex-1">
          {[
            {
              icon: <Mail size={18} />,
              label: 'victorienalleg@gmail.com',
              href: 'mailto:victorienalleg@gmail.com',
            },
            {
              icon: <Linkedin size={18} />,
              label: 'linkedin.com/in/victorien-alleg',
              href: 'https://linkedin.com/in/victorien-alleg',
            },
            {
              icon: <Github size={18} />,
              label: 'github.com/victorienalleg',
              href: 'https://github.com/victorienalleg',
            },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-primary/40 hover:bg-primary/5 text-muted hover:text-white transition-all group"
            >
              <span className="text-primary group-hover:text-accent transition-colors shrink-0">
                {link.icon}
              </span>
              <span className="font-body text-xs truncate">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </CardShell>
  )

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10"
      style={{ zIndex: 10 }}
    >
      <div className="w-full max-w-3xl">
        {/* Two cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ height: '520px' }}>
          <FlipCard front={leftFront} back={leftBack} />
          <FlipCard front={rightFront} back={rightBack} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        <span className="text-muted text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}
```

**Step 3: Add missing i18n keys**

In `src/i18n/fr.json`, add inside `"hero"`:
```json
"flip": "Retourner"
```

In `src/i18n/en.json`, add inside `"hero"`:
```json
"flip": "Flip"
```

**Step 4: Verify build**

Run: `npm run build`
Fix any TypeScript errors:
- `transition-colors duration-400` — Tailwind doesn't have `duration-400` by default; replace with `duration-300` or add to tailwind config. Use `duration-[400ms]` as arbitrary value.

**Step 5: Commit**

```bash
git add src/components/Hero/index.tsx src/i18n/fr.json src/i18n/en.json
git commit -m "feat: rewrite hero with two animated flip cards"
```

---

## Task 3: Skills section — tech grid with progress bars

**Files:**
- Rewrite: `src/components/Skills/index.tsx`
- Delete: `src/components/Skills/PhysicsBalls.tsx`

**Step 1: Delete PhysicsBalls.tsx**

```bash
rm /Users/victorienalleg/portfolio/src/components/Skills/PhysicsBalls.tsx
```

**Step 2: Rewrite `src/components/Skills/index.tsx`**

```tsx
import { useRef, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  SiPython, SiPostgresql, SiPandas, SiScikitlearn,
  SiOpenai, SiMicrosoftazure, SiGit, SiNotion,
  SiMicrosoftpowerautomate, SiTableau, SiMicrosoftexcel,
} from 'react-icons/si'
import { TbBrain } from 'react-icons/tb'
import type { IconType } from 'react-icons'

interface TechItem {
  name: string
  icon: IconType
  color: string
  category: 'IA' | 'Data' | 'Business' | 'Tools'
  level: number
}

const TECH_ITEMS: TechItem[] = [
  { name: 'Python',       icon: SiPython,                  color: '#3b82f6', category: 'Data',     level: 85 },
  { name: 'SQL',          icon: SiPostgresql,              color: '#f59e0b', category: 'Data',     level: 80 },
  { name: 'Pandas',       icon: SiPandas,                  color: '#6366f1', category: 'Data',     level: 75 },
  { name: 'Scikit-learn', icon: SiScikitlearn,             color: '#f97316', category: 'IA',       level: 70 },
  { name: 'GPT API',      icon: SiOpenai,                  color: '#10b981', category: 'IA',       level: 90 },
  { name: 'LangChain',    icon: TbBrain,                   color: '#8b5cf6', category: 'IA',       level: 75 },
  { name: 'Power BI',     icon: SiMicrosoftpowerautomate,  color: '#f97316', category: 'Business', level: 85 },
  { name: 'Tableau',      icon: SiTableau,                 color: '#0ea5e9', category: 'Business', level: 80 },
  { name: 'Excel',        icon: SiMicrosoftexcel,          color: '#22c55e', category: 'Business', level: 90 },
  { name: 'Azure',        icon: SiMicrosoftazure,          color: '#0078d4', category: 'Tools',    level: 60 },
  { name: 'Git',          icon: SiGit,                     color: '#f97316', category: 'Tools',    level: 75 },
  { name: 'Notion',       icon: SiNotion,                  color: '#e2e8f0', category: 'Tools',    level: 95 },
]

const CATEGORY_COLORS: Record<string, string> = {
  IA:       'text-accent border-accent/30 bg-accent/10',
  Data:     'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Business: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Tools:    'text-orange-400 border-orange-400/30 bg-orange-400/10',
}

function TechCard({ item, animate }: { item: TechItem; animate: boolean }) {
  const Icon = item.icon
  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <Icon size={28} style={{ color: item.color }} />
        <span className={`text-xs font-body px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[item.category]}`}>
          {item.category}
        </span>
      </div>
      <p className="font-display font-semibold text-white text-sm mb-3">{item.name}</p>
      <div className="h-1 rounded-full bg-white/5">
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{
            width: animate ? `${item.level}%` : '0%',
            transition: animate ? 'width 1s ease-out' : 'none',
          }}
        />
      </div>
      <p className="font-body text-muted text-xs mt-1.5 text-right">{item.level}%</p>
    </div>
  )
}

export default function Skills() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setAnimate(true) },
      { threshold: 0.2 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="skills" className="py-32 relative" style={{ zIndex: 10 }} ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl text-white mb-3">
          {t('skills.title')}
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-primary to-accent mb-14" />

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {TECH_ITEMS.map((item) => (
            <TechCard key={item.name} item={item} animate={animate} />
          ))}
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Verify react-icons exports**

Some icon names may differ. If `SiScikitlearn` or `SiTableau` don't exist, replace with alternatives:
- `SiScikitlearn` → check react-icons docs; if missing use `TbChartDots` from `react-icons/tb`
- `SiTableau` → if missing use `TbChartBar` from `react-icons/tb`
- `SiMicrosoftpowerautomate` → if missing use `TbLayoutDashboard` from `react-icons/tb`
- `SiMicrosoftexcel` → if missing use `TbFileSpreadsheet` from `react-icons/tb`

Build and fix any import errors. The safest fallback for any missing SI icon is a `tb` (tabler) icon.

**Step 4: Verify build**

Run: `npm run build`
Expected: 0 TypeScript errors.

**Step 5: Commit**

```bash
git add src/components/Skills/index.tsx
git commit -m "feat: rewrite skills section as tech cards grid with progress bars"
```

---

## Task 4: Update App.tsx + cleanup

**Files:**
- Modify: `src/App.tsx`
- Delete: `src/components/About/index.tsx`

**Step 1: Delete About component**

```bash
rm -rf /Users/victorienalleg/portfolio/src/components/About
```

**Step 2: Update `src/App.tsx`**

Remove the `About` import and `<About />` usage. The file should become:

```tsx
import { Suspense, lazy } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Services from './components/Services'
import OffWork from './components/OffWork'
import Contact from './components/Contact'

const Background = lazy(() => import('./components/Background'))

export default function App() {
  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <Background />
      </Suspense>
      <Loading />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
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

**Step 3: Verify build**

Run: `npm run build`
Expected: 0 errors. If `noUnusedLocals` fires, fix imports.

**Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: remove About section, update App layout (Hero includes identity card)"
```

---

## Task 5: Final verification + push

**Step 1: Full build**

Run: `npm run build`
Expected: ✅ 0 TypeScript errors, builds cleanly.

**Step 2: Check all sections present**

Verify `src/App.tsx` renders: Hero, Skills, Projects, Services, OffWork, Contact.

**Step 3: Verify deleted files are gone**

```bash
ls src/components/About 2>&1       # should say "No such file"
ls src/components/Hero/NeuralNetwork.tsx 2>&1  # should say "No such file"
ls src/components/Skills/PhysicsBalls.tsx 2>&1 # should say "No such file"
```

**Step 4: Push**

```bash
git push origin feat/3d-redesign
```

**Step 5: Report**

Report final `git log --oneline -8` and build output.
