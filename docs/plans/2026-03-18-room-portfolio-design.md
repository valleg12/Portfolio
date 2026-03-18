# Room Portfolio Design — "Santiago"
Date: 2026-03-18

## Concept

An immersive 3D room portfolio where the photo of a dark wood-paneled office (with a view of the Santiago Bernabeu stadium) serves as the main scene. The user navigates between interactive elements in the room, each linking to a dedicated portfolio section.

## Visual Approach — Hybrid A+B

- The room photo is layered into **depth planes** (foreground objects, mid objects, back wall, window/stadium)
- **Mouse parallax**: closer layers shift faster than the background — "diorama" effect
- **Zoom transitions**: GSAP camera animation (800ms ease-in-out) into each dedicated frame
- Existing particle system (350 brownian-motion points, `src/components/Background/`) is preserved
- Post-processing: Bloom + subtle vignette (already in place)
- Lighting in frames: warm point lights (ceiling spots) + cool blue from the Bernabeu window

## Language

- **Default: English**
- FR/EN toggle: top-right corner
- i18n keys already exist for both languages (src/i18n/en.json, fr.json)

## Navigation

- **Back arrow** (←) top-left to return from any frame to the main room view
- **Hotspots**: pulsing circles on hover over each interactive object
- **Navbar**: preserved with anchor links to each frame
- **Keyboard**: Escape key also triggers back/return

## Frame Map

### Frame 0 — Home Room
- Full room photo as background with parallax depth layers
- 7 pulsing hotspots overlaid on interactive objects
- Ambient particle system visible

### Frame 1 — Buste (About/Contact)
- Zoom to desk bust
- Card: photo + bio + formation timeline (Eugenia School MSc AI 2024-2026, AMOS Master Sport Management 2021-2023)
- Contact links: email, LinkedIn, GitHub
- CV download button

### Frame 2 — iMac (Tech Projects)
- Zoom to iMac screen
- Projects: Jungle Gather, Carrefour Brand Verification
- 3D cards with tags, description, links

### Frame 3 — Bernabeu Window (Sport Projects)
- Zoom to window with stadium view
- Projects: Sportech, GetStaty, Novarena
- Cards themed around the stadium ambiance (blue glow)

### Frame 4 — Neon (Skills)
- Zoom to neon wall sign
- Physics-based skill balls (Rapier, existing component) — English default
- 12 tools: Python, React, TypeScript, Three.js, SQL, Tableau, scikit-learn, FastAPI, etc.

### Frame 5 — Bibliothèque (Formation)
- Zoom to bookshelf (right wall)
- Each book = one diploma/certification
- Book extraction animation on hover
- Content: MSc AI, Master Sport Management, certifications

### Frame 6 — Lab Tableau (Services)
- Zoom to whiteboard between window and bookshelf
- Title: "Lab" written in handwriting style at top
- Freelance offerings in post-it / handwritten style:
  - AI Architect (autonomous agents, LLM pipelines, API integrations)
  - Business & Data Analyst (dashboards, KPIs, BI, Tableau/Power BI)
  - Sport Analytics (performance, injury prevention, recruitment AI)
  - NLP & Automation (text processing, workflow automation)
  - AI Strategy Consulting (roadmaps, digital transformation)
  - Predictive Modeling (forecasting, recommendation systems)

### Frame 7 — Échiquier + Ballon (Hobbies)
- Zoom to desk chess set + football on floor
- Hobby chips + language progress bars (FR native, EN fluent)
- Light playful animation

## Technical Stack

- **Scene**: Photo layered as depth planes, parallax via mouse events
- **Transitions**: GSAP timeline, camera-like zoom simulation
- **Hotspots**: R3F or CSS absolute-positioned pulsing circles
- **Frame 3D content**: @react-three/fiber + @react-three/drei
- **Physics (Skills)**: @react-three/rapier (existing)
- **Post-processing**: @react-three/postprocessing Bloom (existing)
- **Particles**: Existing Background component preserved

## Deleted / Replaced

- Current scroll-based layout (Hero → Skills → Projects → Services → OffWork → Contact)
- Flip card in Hero (replaced by buste card, no flip)
- French as default language → English as default
