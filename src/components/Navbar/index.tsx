import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Github, Linkedin } from 'lucide-react'

const NAV_LINKS = ['about', 'skills', 'projects', 'services', 'contact'] as const

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const toggleLang = () =>
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled ? 'bg-bg/80 backdrop-blur-md border-b border-white/5' : ''
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <a
          href="#hero"
          className="font-display font-semibold text-white tracking-tight hover:text-primary transition-colors"
        >
          VA<span className="text-primary">.</span>
        </a>

        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="font-body text-sm text-muted hover:text-white transition-colors"
            >
              {t(`nav.${key}`)}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/victorienalleg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-muted hover:text-white transition-colors"
          >
            <Github size={18} />
          </a>
          <a
            href="https://linkedin.com/in/victorien-alleg"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-muted hover:text-white transition-colors"
          >
            <Linkedin size={18} />
          </a>
          <button
            onClick={toggleLang}
            className="font-display font-medium text-xs border border-white/10 rounded-md px-3 py-1.5 text-muted hover:text-white hover:border-primary/50 transition-all"
          >
            {i18n.language === 'fr' ? 'EN' : 'FR'}
          </button>
        </div>
      </div>
    </nav>
  )
}
