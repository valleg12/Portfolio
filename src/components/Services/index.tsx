import { useTranslation } from 'react-i18next'

interface ServiceItem {
  icon: string
  title: string
  desc: string
}

export default function Services() {
  const { t } = useTranslation()
  const items = t('services.items', { returnObjects: true }) as ServiceItem[]

  return (
    <section id="services" className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display font-bold text-4xl text-white mb-3">
          {t('services.title')}
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-primary to-accent mb-14" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.title}
              className="group p-6 rounded-2xl border border-white/[0.08] bg-white/[0.02] hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
            >
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-display font-semibold text-white text-lg mb-2">
                {item.title}
              </h3>
              <p className="font-body text-muted text-sm leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
