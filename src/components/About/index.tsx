import { useTranslation } from 'react-i18next'
import { GraduationCap } from 'lucide-react'

export default function About() {
  const { t } = useTranslation()

  return (
    <section id="about" className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Photo */}
          <div className="relative flex justify-center">
            <div className="relative w-64 h-64 lg:w-80 lg:h-80">
              <div className="absolute inset-0 rounded-2xl border border-primary/30 rotate-3" />
              <div className="absolute inset-0 rounded-2xl border border-accent/20 -rotate-2" />
              <img
                src="/PHOTO.jpg"
                alt="Victorien Alleg"
                className="relative w-full h-full object-cover rounded-2xl grayscale hover:grayscale-0 transition-all duration-500"
              />
              <div className="absolute -inset-4 rounded-3xl bg-primary/5 blur-xl -z-10" />
            </div>
          </div>

          {/* Text */}
          <div>
            <h2 className="font-display font-bold text-4xl text-white mb-6">
              {t('about.title')}
            </h2>
            <p className="font-body text-muted text-lg leading-relaxed mb-10">
              {t('about.bio')}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <GraduationCap className="text-accent mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-display font-semibold text-white text-sm">{t('about.msc')}</p>
                  <p className="font-body text-muted text-xs mt-0.5">{t('about.mscLocation')}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl border border-white/5 bg-white/[0.02]">
                <GraduationCap className="text-primary mt-1 shrink-0" size={20} />
                <div>
                  <p className="font-display font-semibold text-white text-sm">{t('about.master')}</p>
                  <p className="font-body text-muted text-xs mt-0.5">{t('about.masterLocation')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
