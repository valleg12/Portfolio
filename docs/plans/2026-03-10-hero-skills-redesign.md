# Hero + Skills Redesign — Design Document
*Date: 2026-03-10*

## Problem
- Hero section has no photo, feels impersonal
- About section is redundant and separate from Hero
- Skills physics balls are visually impressive but illegible (tool names hard to read, dark spheres on dark background)

## Solution

### Hero Section — Two Side-by-Side Flip Cards (replaces Hero + About)

**Layout:** Two equal-width cards in a flex row, centered vertically in the viewport. Neural network 3D background remains.

**Left card — Identity**
- Face front: Photo (`/PHOTO.jpg`) as full cover image, name overlay at bottom, title "IA & Sport Business" as subtitle
- Face back: Short bio text + 2 education entries (Eugenia School MSc AI, AMOS Master Sports Mgmt) + CV download button
- Flip trigger: click

**Right card — Profile**
- Face front: Large "What I do" heading + animated typewriter cycling through roles (`Modèles prédictifs`, `NLP & Analyse`, `Sport Analytics`, `BI & Dashboards`)
- Face back: Social/contact links (GitHub, LinkedIn, email) each as a styled row with icon + hover animation
- Flip trigger: click

**Card styling:**
- CSS 3D perspective transform (`rotateY(180deg)`)
- Border: `border-primary/30` with glow on hover → `border-accent/50`
- Background: `bg-white/[0.03]` with `backdrop-blur`
- Mouse tilt: subtle `rotateX` / `rotateY` based on mouse position (max ±8deg)
- Dimensions: ~380×520px each, gap-8

**Removes:** `src/components/About/` directory entirely

---

### Skills Section — Tech Cards Grid (replaces PhysicsBalls)

**Layout:** Responsive grid — 4 columns desktop, 2 columns mobile

**Each card contains:**
- Colored icon (emoji or react-icons)
- Tool name (font-display, white)
- Category chip (`IA` / `Data` / `Business` / `Tools`)
- Animated progress bar (width set on scroll-enter, gradient from primary to accent)

**Tools & levels:**
| Tool | Category | Level |
|------|----------|-------|
| Python | Data | 85% |
| SQL | Data | 80% |
| Pandas | Data | 75% |
| Scikit-learn | IA | 70% |
| GPT API | IA | 90% |
| LangChain | IA | 75% |
| Power BI | Business | 85% |
| Tableau | Business | 80% |
| Excel/Sheets | Business | 90% |
| Git | Tools | 75% |
| Azure | Tools | 60% |
| Notion | Tools | 95% |

**Animation:** GSAP stagger fade+slideUp on IntersectionObserver trigger

**Removes:** `src/components/Skills/PhysicsBalls.tsx` (3D physics), keeps `src/components/Skills/index.tsx` (rewritten)

---

## Files Changed

| Action | File |
|--------|------|
| Rewrite | `src/components/Hero/index.tsx` |
| Create | `src/components/Hero/FlipCard.tsx` |
| Delete | `src/components/Hero/NeuralNetwork.tsx` → keep as lazy background only via Background component (already global) |
| Delete | `src/components/About/index.tsx` |
| Rewrite | `src/components/Skills/index.tsx` |
| Delete | `src/components/Skills/PhysicsBalls.tsx` |
| Update | `src/App.tsx` — remove `<About />`, keep `<Skills />` |

---

## Notes
- The global Background particle canvas stays unchanged (already handles the 3D ambient)
- NeuralNetwork.tsx can be removed since the global background provides the 3D atmosphere
- Keep all other sections: Projects, Services, OffWork, Contact
