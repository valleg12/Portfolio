import { useTranslation } from 'react-i18next'

interface LanguageItem {
  lang: string
  level: string
  pct: number
}

export default function OffWork() {
  const { t } = useTranslation()
  const items = t('offwork.items', { returnObjects: true }) as string[]
  const langs = t('languages.items', { returnObjects: true }) as LanguageItem[]

  return (
    <section className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Off Work */}
          <div>
            <h2 className="font-display font-bold text-3xl text-white mb-8">
              {t('offwork.title')}
            </h2>
            <div className="flex flex-wrap gap-3">
              {items.map((item) => (
                <span
                  key={item}
                  className="font-body text-sm px-5 py-2.5 rounded-full border border-white/10 text-muted hover:border-accent/40 hover:text-white transition-all cursor-default"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          {/* Languages */}
          <div>
            <h2 className="font-display font-bold text-3xl text-white mb-8">
              {t('languages.title')}
            </h2>
            <div className="space-y-6">
              {langs.map((lang) => (
                <div key={lang.lang}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-body font-medium text-white">{lang.lang}</span>
                    <span className="font-body text-sm text-muted">{lang.level}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/5">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                      style={{ width: `${lang.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
