"use client"
import { useState } from "react"
import Link from "next/link"
import { Home, Briefcase } from "lucide-react"

const projects = [
  {
    title: "Projet 1 : Jungle Gather",
    description: "Application web immersive pour la gestion d'équipe et la dynamique sociale en entreprise.\n\nJungle Gather propose un univers pixel-art interactif pour le coworking virtuel, la gestion de planning et la présence (remote/préso), avec avatars mascottes, calendrier avancé, export de listes et une expérience ludique et moderne pour les équipes multi-sites.",
    images: [
      "/images/jungle-gather-1.png",
      "/images/jungle-gather-2.png"
    ],
  },
  {
    title: "Projet 2 : Carrefour IA",
    description: "Système de vérification de marques et d'analyse de propriété pour Carrefour.",
    images: [],
  },
  {
    title: "Projet 3 : Sportech",
    description: `Sportech est une plateforme innovante d'analyse de performance sportive et de gestion de talents basée sur l'intelligence artificielle.\n\nElle permet aux clubs, entraîneurs et recruteurs d'accéder à des tableaux de bord interactifs, des analyses avancées (radar chart, statistiques croisées, scoring de similarité), et des outils de scouting automatisé.\n\nGrâce à l'intégration de données issues de multiples championnats, Sportech offre une vision globale et comparative des joueurs, détecte les profils similaires, anticipe les potentiels et optimise la prise de décision pour le recrutement, la gestion d'équipe et la valorisation des talents.`,
    images: [
      "/images/sportech-1.png",
      "/images/sportech-2.png"
    ],
  },
]

export default function DevPage() {
  const [current, setCurrent] = useState(0)
  const [zoomImg, setZoomImg] = useState<string|null>(null)
  const prev = () => setCurrent((c) => (c === 0 ? projects.length - 1 : c - 1))
  const next = () => setCurrent((c) => (c === projects.length - 1 ? 0 : c + 1))

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e8e8e0] to-[#d8d8d0] dark:from-[#1a2639] dark:to-[#0f172a] px-4 py-12">
      {/* Barre de navigation en haut */}
      <div className="fixed top-4 left-0 w-full flex justify-between items-center px-6 z-20 pointer-events-none">
        <div className="flex gap-3 pointer-events-auto">
          <Link href="/" className="rounded-full bg-white/80 dark:bg-black/60 p-2 shadow hover:scale-110 transition-all flex items-center" title="Accueil">
            <Home className="w-6 h-6 text-black dark:text-white" />
          </Link>
          <Link href="/portfolio" className="rounded-full bg-white/80 dark:bg-black/60 p-2 shadow hover:scale-110 transition-all flex items-center" title="Portfolio">
            <Briefcase className="w-6 h-6 text-black dark:text-white" />
          </Link>
        </div>
      </div>
      <div className="relative w-full max-w-xl flex items-center justify-center">
        {/* Flèche gauche */}
        <button onClick={prev} className="absolute left-0 z-10 p-2 rounded-full bg-white/80 dark:bg-black/60 shadow hover:scale-110 transition-all">
          <span className="text-2xl">◀</span>
        </button>
        {/* Slide projet */}
        <div className="w-full flex flex-col items-center bg-white/90 dark:bg-black/80 rounded-xl shadow-xl p-8 mx-8 min-h-[300px] transition-all duration-300 relative overflow-visible">
          {/* Images décoratives pour Jungle Gather : très grandes, en haut à gauche et en bas à droite */}
          {projects[current].title === "Projet 1 : Jungle Gather" && projects[current].images && projects[current].images.length > 0 && (
            <>
              <img
                src={projects[current].images[0]}
                alt={projects[current].title + ' visuel 1'}
                className="hidden sm:block absolute -top-48 -left-72 w-[420px] h-[260px] object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-black z-0 cursor-zoom-in"
                style={{ boxShadow: '0 16px 64px rgba(0,0,0,0.18)' }}
                onClick={() => setZoomImg(projects[current].images[0])}
              />
              {projects[current].images[1] && (
                <img
                  src={projects[current].images[1]}
                  alt={projects[current].title + ' visuel 2'}
                  className="hidden sm:block absolute -bottom-48 -right-72 w-[420px] h-[260px] object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-black z-0 cursor-zoom-in"
                  style={{ boxShadow: '0 16px 64px rgba(0,0,0,0.18)' }}
                  onClick={() => setZoomImg(projects[current].images[1])}
                />
              )}
            </>
          )}
          {/* Images pour Sportech : même style que Jungle Gather */}
          {projects[current].title === "Projet 3 : Sportech" && projects[current].images && projects[current].images.length > 0 && (
            <>
              <img
                src={projects[current].images[0]}
                alt={projects[current].title + ' visuel 1'}
                className="hidden sm:block absolute -top-32 -left-72 w-[420px] h-[260px] object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-black z-0 cursor-zoom-in"
                style={{ boxShadow: '0 16px 64px rgba(0,0,0,0.18)' }}
                onClick={() => setZoomImg(projects[current].images[0])}
              />
              {projects[current].images[1] && (
                <img
                  src={projects[current].images[1]}
                  alt={projects[current].title + ' visuel 2'}
                  className="hidden sm:block absolute -bottom-24 -right-[24rem] w-[420px] h-[260px] object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-black z-0 cursor-zoom-in"
                  style={{ boxShadow: '0 16px 64px rgba(0,0,0,0.18)' }}
                  onClick={() => setZoomImg(projects[current].images[1])}
                />
              )}
            </>
          )}
          {/* Images pour les autres projets (ex: Carrefour) */}
          {projects[current].title !== "Projet 1 : Jungle Gather" && projects[current].title !== "Projet 3 : Sportech" && projects[current].images && projects[current].images.length > 0 && (
            <>
              <img
                src={projects[current].images[0]}
                alt={projects[current].title + ' visuel 1'}
                className="hidden sm:block absolute -top-32 -left-32 w-80 h-56 object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-black z-0 cursor-zoom-in"
                style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.18)' }}
                onClick={() => setZoomImg(projects[current].images[0])}
              />
              {projects[current].images[1] && (
                <img
                  src={projects[current].images[1]}
                  alt={projects[current].title + ' visuel 2'}
                  className="hidden sm:block absolute -bottom-32 -right-32 w-80 h-56 object-cover rounded-2xl shadow-2xl border-4 border-white dark:border-black z-0 cursor-zoom-in"
                  style={{ boxShadow: '0 12px 48px rgba(0,0,0,0.18)' }}
                  onClick={() => setZoomImg(projects[current].images[1])}
                />
              )}
            </>
          )}
          <h2 className="text-2xl font-semibold mb-4 text-center relative z-10">{projects[current].title}</h2>
          <p className="text-base text-center text-gray-700 dark:text-gray-200 mb-4 whitespace-pre-line relative z-10">{projects[current].description}</p>
        </div>
        {/* Flèche droite */}
        <button onClick={next} className="absolute right-0 z-10 p-2 rounded-full bg-white/80 dark:bg-black/60 shadow hover:scale-110 transition-all">
          <span className="text-2xl">▶</span>
        </button>
      </div>
      <div className="flex gap-2 mt-6">
        {projects.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-3 h-3 rounded-full ${i === current ? 'bg-black dark:bg-white' : 'bg-gray-400 dark:bg-gray-600'} transition-all`}
            aria-label={`Aller au projet ${i+1}`}
          />
        ))}
      </div>
      {/* Zoom image plein écran */}
      {zoomImg && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50" onClick={() => setZoomImg(null)}>
          <img src={zoomImg} alt="Zoom" className="max-w-[90vw] max-h-[90vh] rounded-2xl shadow-2xl border-4 border-white dark:border-black" onClick={e => e.stopPropagation()} />
        </div>
      )}
    </div>
  )
} 