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

      <div className="w-full h-[60vh]">
        <Suspense fallback={
          <div className="w-full h-full flex items-center justify-center text-muted font-body text-sm">
            Loading 3D...
          </div>
        }>
          <PhysicsBalls isActive={isActive} />
        </Suspense>
      </div>

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
