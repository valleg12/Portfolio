import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Download, Github, Linkedin, Mail, RotateCcw } from 'lucide-react'
import FlipCard from './FlipCard'

const ROLES_FR = ['Modèles prédictifs', 'NLP & Analyse', 'Sport Analytics', 'BI & Dashboards']
const ROLES_EN = ['Predictive models', 'NLP & Analytics', 'Sport Analytics', 'BI & Dashboards']

function useTypewriter(items: string[]) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const id = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % items.length)
        setVisible(true)
      }, 400)
    }, 3000)
    return () => clearInterval(id)
  }, [items.length])

  return { text: items[index], visible }
}

/* ── Shared card shell ───────────────────────────────────── */
function CardShell({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`w-full h-full rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-md
        hover:border-primary/40 transition-colors duration-300 overflow-hidden ${className}`}
    >
      {children}
    </div>
  )
}

/* ── Flip hint badge ─────────────────────────────────────── */
function FlipHint({ label }: { label: string }) {
  return (
    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 text-muted/60 text-xs font-body">
      <RotateCcw size={12} />
      {label}
    </div>
  )
}

export default function Hero() {
  const { t, i18n } = useTranslation()
  const roles = i18n.language === 'fr' ? ROLES_FR : ROLES_EN
  const { text: role, visible: roleVisible } = useTypewriter(roles)

  /* ── Left card faces ──────────────────────────────────── */
  const leftFront = (
    <CardShell>
      <div className="relative w-full h-full">
        <img
          src="/PHOTO.jpg"
          alt="Victorien Alleg"
          className="w-full h-full object-cover object-top"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/90 via-bg/20 to-transparent" />
        {/* Name overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <h1 className="font-display font-bold text-3xl text-white leading-tight">
            Victorien<br />Alleg
          </h1>
          <p className="font-body text-accent text-sm mt-1">
            {t('hero.role')}
          </p>
        </div>
        <FlipHint label={t('hero.flip') || 'Retourner'} />
      </div>
    </CardShell>
  )

  const leftBack = (
    <CardShell>
      <div className="flex flex-col h-full p-7 gap-5">
        <h2 className="font-display font-bold text-2xl text-white">
          {t('about.title')}
        </h2>
        <p className="font-body text-muted text-sm leading-relaxed flex-1">
          {t('about.bio')}
        </p>
        <div className="space-y-3">
          <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="font-display font-semibold text-white text-xs">{t('about.msc')}</p>
            <p className="font-body text-muted text-xs mt-0.5">{t('about.mscLocation')}</p>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-white/[0.02]">
            <p className="font-display font-semibold text-white text-xs">{t('about.master')}</p>
            <p className="font-body text-muted text-xs mt-0.5">{t('about.masterLocation')}</p>
          </div>
        </div>
        <a
          href="/CV Victorien ALLEG.pdf"
          download
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 border border-white/15 hover:border-accent/50 text-muted hover:text-white font-display text-sm font-medium px-4 py-2.5 rounded-lg transition-all"
        >
          <Download size={14} />
          {t('hero.cv')}
        </a>
      </div>
    </CardShell>
  )

  /* ── Right card faces ─────────────────────────────────── */
  const rightFront = (
    <CardShell>
      <div className="flex flex-col h-full p-7 justify-between">
        <div>
          <p className="font-body text-muted text-xs tracking-widest uppercase mb-3">
            {t('hero.greeting')}
          </p>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-8">
            {t('hero.name')}
          </h2>
          <div className="h-px w-10 bg-primary mb-6" />
          <p className="font-body text-muted text-sm mb-2">What I do</p>
          <p
            className="font-display font-semibold text-accent text-xl transition-opacity duration-[400ms]"
            style={{ opacity: roleVisible ? 1 : 0 }}
          >
            {role}
          </p>
        </div>
        <div>
          <a
            href="#projects"
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/80 text-white font-display font-medium px-5 py-2.5 rounded-lg transition-all text-sm"
          >
            {t('hero.cta')}
          </a>
        </div>
        <FlipHint label={t('hero.flip') || 'Retourner'} />
      </div>
    </CardShell>
  )

  const rightBack = (
    <CardShell>
      <div className="flex flex-col h-full p-7 justify-between">
        <h2 className="font-display font-bold text-2xl text-white mb-6">
          {t('contact.subtitle')}
        </h2>
        <div className="flex flex-col gap-3 flex-1">
          {[
            {
              icon: <Mail size={18} />,
              label: 'victorienalleg@gmail.com',
              href: 'mailto:victorienalleg@gmail.com',
            },
            {
              icon: <Linkedin size={18} />,
              label: 'linkedin.com/in/victorien-alleg',
              href: 'https://linkedin.com/in/victorien-alleg',
            },
            {
              icon: <Github size={18} />,
              label: 'github.com/victorienalleg',
              href: 'https://github.com/victorienalleg',
            },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="flex items-center gap-3 p-3 rounded-xl border border-white/[0.06] hover:border-primary/40 hover:bg-primary/5 text-muted hover:text-white transition-all group"
            >
              <span className="text-primary group-hover:text-accent transition-colors shrink-0">
                {link.icon}
              </span>
              <span className="font-body text-xs truncate">{link.label}</span>
            </a>
          ))}
        </div>
      </div>
    </CardShell>
  )

  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 pb-10"
      style={{ zIndex: 10 }}
    >
      <div className="w-full max-w-3xl">
        {/* Two cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6" style={{ height: '520px' }}>
          <FlipCard front={leftFront} back={leftBack} />
          <FlipCard front={rightFront} back={rightBack} />
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent animate-pulse" />
        <span className="text-muted text-xs tracking-widest uppercase">Scroll</span>
      </div>
    </section>
  )
}
