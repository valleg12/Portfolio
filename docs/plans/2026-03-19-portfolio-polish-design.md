# Portfolio Polish — Design Doc
**Date:** 2026-03-19
**Status:** Approved by Victorien

---

## Phase 1 — Polish (next session, priority)

### 1. Language default
- Switch default from `fr` → `en` in i18n config (`src/i18n/index.ts` or `i18next` init)
- Navbar toggle: shows `FR` when in EN, shows `EN` when in FR (already correct logic)

### 2. Typography — single font system
- **Remove Caveat entirely** (used in FrameLab)
- **Only Space Grotesk** throughout (already loaded as `font-display`)
- 3 sizes max: `text-sm` (labels), `text-base` (body), `text-2xl+` (headings)
- All frame components: audit and unify

### 3. Hover — remove visible boxes
- **Remove** `radial-gradient` background on hotspot hover
- **Remove** `boxShadow` on hotspot hover
- Keep only: `cursor: pointer`
- Add: a **cursor spotlight** — a warm radial glow that follows the mouse position (not tied to zones), `mixBlendMode: screen`, very subtle (opacity ~0.08). This gives depth without revealing clickable zones explicitly.

### 4. 3D tilt — reduce intensity
- `rotY = nx * 12` → `nx * 4`
- `rotX = -ny * 8` → `-ny * 3`
- `perspective(900px)` → `perspective(1400px)` (more subtle)
- `scale(1.04)` → `scale(1.02)`

### 5. "Explore" hint
- Fixed element bottom-center: `"Click on objects to explore"`
- Font: Space Grotesk, `text-xs`, `text-white/40`
- Appears after 1.5s, fades out on first `mousemove` over a hotspot (never returns)
- Subtle `animate-pulse` opacity (0.3 → 0.5)

### 6. Frames — unified dark glass design
All 7 frames must share:
```
background: rgba(8, 8, 20, 0.92)
border: 1px solid rgba(255,255,255,0.08)
border-radius: 16px
backdrop-filter: blur(24px)
padding: 40px 48px
font-family: Space Grotesk
```
- Headers: `text-white`, `font-semibold`, `text-2xl`
- Body: `text-white/70`, `text-base`
- Accent tags/badges: use zone color (indigo, cyan, green, amber, orange, rose)

### 7. FrameLab — rewrite (Freelance / whiteboard)
Replace Caveat font. Content from whiteboard photo:
```
6 freelance offers (EN):
1. AI Strategy & Integration — From data audit to production deployment
2. Predictive Analytics — Custom ML models for business forecasting
3. Process Automation — n8n / Make / custom pipelines
4. Sports Data & Performance — Statistical models for clubs & agencies
5. Product Design (AI-first) — Wireframes to prototype with AI embedded
6. Training & Workshops — Hands-on AI for non-technical teams
```
Layout: 2×3 grid of cards, each with icon + title + 1-line description + "Let's talk →" CTA

### 8. Content — all EN by default
Audit all frame components:
- `FrameBuste`, `FrameIMac`, `FrameBernabeu`, `FrameNeon`, `FrameBibliotheque`, `FrameHobbies`
- Move all hardcoded FR text to `src/i18n/en.json` (EN) and `src/i18n/fr.json` (FR)
- Use `useTranslation()` consistently

---

## Phase 2 — Door Scene (separate session)

### Concept
- **Scene 1 (Door):** Full black background, centered wooden door, "Victorien Alleg" engraved nameplate, warm light glow underneath the door
- **Interaction:** Click/hover → door handle glows → click → CSS 3D `rotateY(-100deg)` door swing open → crossfade to Room scene
- **Tech:** Pure CSS + React state, no Three.js needed
- **Door design:** CSS only (dark wood grain via gradient, metal handle, frame molding) OR a generated PNG

### Architecture change
```
App.tsx
  ├── DoorScene (scene === 'door')  ← new component
  └── RoomScene (scene === 'room')  ← current Room component
```
- `AppContext` or local state: `scene: 'door' | 'room'`
- Door → Room transition: door swings open, Room fades in behind it

---

## Files to touch (Phase 1)

| File | Change |
|------|--------|
| `src/i18n/index.ts` | `lng: 'en'` |
| `src/i18n/en.json` | Add all EN strings |
| `src/i18n/fr.json` | Mirror in FR |
| `src/components/Room/index.tsx` | Reduce tilt, remove hover glow, add explore hint, cursor spotlight |
| `src/components/Room/FrameOverlay.tsx` | Unified frame wrapper styles |
| `src/components/Room/frames/FrameLab.tsx` | Rewrite — no Caveat, 2×3 grid |
| `src/components/Room/frames/Frame*.tsx` | Audit typo + EN strings |
| `src/index.css` | Remove any Caveat import |
| `index.html` | Remove Caveat Google Font if present |
