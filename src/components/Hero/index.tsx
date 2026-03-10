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
      {/* 3D canvas — full section behind text */}
      <div className="absolute inset-0" style={{ zIndex: 1 }}>
        <Suspense fallback={null}>
          <NeuralNetwork />
        </Suspense>
      </div>

      {/* Text content */}
      <div className="relative max-w-7xl mx-auto px-6 pt-24 pb-16" style={{ zIndex: 2 }}>
        <div className="max-w-2xl">
          <p className="font-body text-muted text-sm tracking-widest uppercase mb-4">
            {t('hero.greeting')}
          </p>
          <h1 className="font-display font-bold text-6xl sm:text-8xl text-white leading-none mb-4">
            {t('hero.name')}
          </h1>
          <div className="flex items-center gap-3 mb-10">
            <div className="h-px w-12 bg-primary" />
            <p className="font-body text-accent text-lg font-medium">
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
        <div className="w-px h-12 bg-gradient-to-b from-white/20 to-transparent" />
        <span className="text-muted text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}
