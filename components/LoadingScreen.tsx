import { Cloud, Brain } from "lucide-react"
import Link from "next/link"

export function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#e8e8e0] to-[#d8d8d0] dark:from-[#1a2639] dark:to-[#0f172a] transition-all duration-700">
      {/* Logo central stylisé */}
      <div className="relative mb-12">
        {/* Nuages décoratifs */}
        <Cloud className="w-8 h-8 absolute -top-2 -left-4 text-[#1a2639] dark:text-[#e8e8e0] opacity-40" />
        <Cloud className="w-8 h-8 absolute -top-1 -right-3 text-[#1a2639] dark:text-[#e8e8e0] opacity-40" />
        <Cloud className="w-8 h-8 absolute -bottom-2 -left-3 text-[#1a2639] dark:text-[#e8e8e0] opacity-40" />
        {/* Nuage principal */}
        <Cloud className="w-28 h-28 text-[#1a2639] dark:text-[#e8e8e0]" />
        {/* Cerveau centré */}
        <Brain className="w-14 h-14 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black dark:text-white" />
      </div>
      {/* Titre ou slogan (optionnel) */}
      <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-black dark:text-white tracking-tight">Bienvenue</h1>
      {/* Boutons d'entrée */}
      <div className="flex flex-col gap-6 w-full max-w-xs">
        <Link href="/portfolio" className="block w-full text-center rounded-lg px-6 py-4 bg-black/90 dark:bg-white/90 text-white dark:text-black font-semibold text-lg shadow-lg hover:scale-105 hover:bg-black dark:hover:bg-white transition-all duration-200">
          Entre dans la DataZone
        </Link>
        <Link href="/dev" className="block w-full text-center rounded-lg px-6 py-4 bg-white/90 dark:bg-black/90 text-black dark:text-white font-semibold text-lg shadow-lg hover:scale-105 hover:bg-neutral-200 dark:hover:bg-neutral-800 transition-all duration-200 border border-black/10 dark:border-white/10">
          Backstage Tech & Projets
        </Link>
      </div>
    </div>
  )
} 