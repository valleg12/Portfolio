# Portfolio 3D Redesign — Design Document
*Date: 2026-03-10*

## Context & Goal

Complete redesign of Victorien Alleg's portfolio with modern 3D visuals inspired by MoncyDev/Portfolio-Website. Move from a static collapsible-sections layout (Next.js) to a fully immersive, scroll-driven 3D experience (Vite + React).

## Decisions

| Topic | Decision |
|-------|----------|
| Framework | Migrate from Next.js 14 → **Vite + React 18 + TypeScript** |
| 3D library | **React Three Fiber (R3F) + Drei + Rapier physics** |
| Animations | **GSAP + ScrollTrigger** |
| Styling | **Tailwind CSS v3** |
| i18n | **react-i18next** (replacing manual translation objects) |
| Hero 3D | Abstract neural network (spheres + glowing edges, mouse-reactive) |
| Approach | Hybrid A+B: persistent 3D background + per-section 3D + scroll narrative |
| Color scheme | Dark (#050510) + indigo (#6366f1) + cyan neon (#22d3ee) |
| Typography | Space Grotesk (display) + Inter (body) |

## Architecture

### Stack

```
Vite + React 18 + TypeScript
├── Three.js + @react-three/fiber (R3F)
├── @react-three/drei
├── @react-three/rapier (physics)
├── @react-three/postprocessing (bloom, N8AO)
├── gsap + @gsap/react (ScrollTrigger)
├── tailwindcss
├── react-i18next
└── lucide-react / react-icons
```

### Section Structure

```
[GLOBAL] Fixed R3F Canvas (background layer)
  → 300 particles, brownian motion, scroll-reactive rotation

1. HERO
   → "Victorien Alleg" — large display typography
   → 3D neural network: spheres connected by glowing lines, mouse-reactive
   → Subtitle: "AI & Sports Business" (animated typewriter)
   → FR/EN toggle + GitHub / LinkedIn / CV links

2. ABOUT
   → Short bio + education (Eugenia School MSc AI, AMOS Master Sports Management)
   → Fade + slide in on scroll

3. SKILLS (3D Tech Stack)
   → Physics balls with tool logos (Python, SQL, GPT APIs, Power BI,
     Tableau, Scikit-learn, LangChain, etc.)
   → Mouse pointer acts as repulsive force (rapier kinematic body)
   → Postprocessing: N8AO ambient occlusion

4. PROJECTS (horizontal pinned scroll)
   → GSAP pin + horizontal translateX
   → 5 cards: Jungle Gather, Carrefour, Sportech, GetStaty, Novarena
   → Each card: image/visual, title, tech tags, expandable description

5. SERVICES
   → AI services for sports business
   → Icon grid with hover animations

6. OFF WORK + LANGUAGES
   → Lightweight: typography + micro-animations

7. CONTACT
   → Email, LinkedIn, GitHub
   → Simple contact form (mailto or EmailJS)
```

### Visual Design

| Token | Value |
|-------|-------|
| Background | `#050510` |
| Primary | `#6366f1` (indigo) |
| Accent | `#22d3ee` (cyan) |
| Text primary | `#f8fafc` |
| Text muted | `#94a3b8` |
| Font display | Space Grotesk |
| Font body | Inter |

### 3D Background Canvas
- Positioned `fixed`, `z-index: 0`, `pointer-events: none`
- R3F Canvas with `alpha: true`, `gl.transparent`
- 300 `Points` (BufferGeometry) with custom shader or PointsMaterial
- Gentle brownian motion + subtle scroll-reactive Y rotation
- Very low perf cost (no physics, no shadows)

### Hero Neural Network
- ~20 spheres as nodes (MeshPhysicalMaterial, indigo/cyan)
- Lines connecting nearest neighbors (LineSegments)
- useFrame lerp to mouse position for organic movement
- Bloom postprocessing on emissive materials

### Skills Physics Balls
- 25–30 RigidBody balls with tech logo textures
- gravity [0,0,0], mouse acts as kinematic BallCollider repulsor
- MeshPhysicalMaterial with texture map + emissive glow
- Environment HDR lighting

### Projects Horizontal Scroll
- `.projects-section` pinned with ScrollTrigger
- `.cards-flex` translateX from 0 to -(totalWidth - viewport)
- 5 project cards with image previews and GSAP entrance

## Content to Preserve

### Identity
- Name: Victorien Alleg
- Role: MSc AI Applied to Business — Eugenia School, Paris (2024–2026)
- Education: Master Management Organisations Sportives — AMOS, Lille (2021–2023)
- Languages: French (native), English (bilingual), Spanish (intermediate)

### Projects
1. Jungle Gather — pixel-art workplace app
2. Carrefour Brand Verification System — AI trademark analysis
3. Sportech — AI sports performance platform
4. GetStaty — football match analytics
5. Novarena — integrated stadium management suite

### Skills
Predictive models, NLP, BI dashboards, AI project management, recommendation systems, sentiment analysis, market research, business process automation

### Off Work
Chess, Football, Skiing, Boxing, History, Cinema

## File Structure (Vite project)

```
portfolio/
├── src/
│   ├── components/
│   │   ├── Background/     ← fixed 3D particle canvas
│   │   ├── Hero/           ← neural network 3D + text
│   │   ├── About/
│   │   ├── Skills/         ← physics balls
│   │   ├── Projects/       ← horizontal scroll
│   │   ├── Services/
│   │   ├── OffWork/
│   │   ├── Contact/
│   │   ├── Navbar/
│   │   └── Loading/
│   ├── context/
│   │   └── LoadingProvider.tsx
│   ├── i18n/
│   │   ├── fr.json
│   │   └── en.json
│   ├── data/
│   │   └── content.ts      ← all static content
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── public/
│   └── images/             ← tool logos, project screenshots
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```
