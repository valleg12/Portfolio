# Victorien Alleg — Portfolio

Portfolio immersif : une pièce de travail que l'on **traverse au scroll**, chaque objet ouvrant un **univers dédié**. Site statique (aucune dépendance à builder).

**Live :** https://valleg12.github.io/Portfolio/

## Stack
- HTML / CSS / vanilla JS — un seul fichier `index.html`
- [Three.js](https://threejs.org/) — profondeur 2.5D de la pièce (depth map)
- [GSAP](https://gsap.com/) + ScrollTrigger — caméra cinématique au scroll
- [Lenis](https://lenis.studiofreight.com/) — smooth scroll
- Fonts : Fraunces, Plus Jakarta Sans, JetBrains Mono

## Fichiers
- `index.html` — le site complet
- `ROOM.png` — rendu de la pièce · `depth.png` — carte de profondeur (MiDaS)
- `bernabeu.png` — vue stade (univers sport, à venir)

Déploiement automatique sur GitHub Pages via `.github/workflows/deploy.yml`.
