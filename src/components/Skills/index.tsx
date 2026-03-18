import { useRef, useState, useEffect, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { TECH_ITEMS, type TechItem } from '../../data/techItems'

const CATEGORY_COLORS: Record<TechItem['category'], string> = {
  IA:       'text-accent border-accent/30 bg-accent/10',
  Data:     'text-blue-400 border-blue-400/30 bg-blue-400/10',
  Business: 'text-emerald-400 border-emerald-400/30 bg-emerald-400/10',
  Tools:    'text-orange-400 border-orange-400/30 bg-orange-400/10',
}

const TechCard = memo(function TechCard({ item, animate }: { item: TechItem; animate: boolean }) {
  const Icon = item.icon
  return (
    <div className="p-5 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-primary/30 hover:bg-white/[0.04] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <Icon size={28} style={{ color: item.color }} />
        <span className={`text-xs font-body px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[item.category]}`}>
          {item.category}
        </span>
      </div>
      <p className="font-display font-semibold text-white text-sm mb-3">{item.name}</p>
      <div
        role="progressbar"
        aria-label={`${item.name} proficiency`}
        aria-valuenow={item.level}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-1 rounded-full bg-white/5"
      >
        <div
          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
          style={{
            width: animate ? `${item.level}%` : '0%',
            transition: animate ? 'width 1s ease-out' : 'none',
          }}
        />
      </div>
      <p className="font-body text-muted text-xs mt-1.5 text-right" aria-hidden="true">{item.level}%</p>
    </div>
  )
})

export default function Skills() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLDivElement>(null)
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(el)
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
