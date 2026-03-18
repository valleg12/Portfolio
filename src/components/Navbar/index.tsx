import { useTranslation } from 'react-i18next'
import { Github, Linkedin } from 'lucide-react'
import { useRoom, FrameId } from '../../context/RoomContext'

type NavItem = {
  key: 'about' | 'skills' | 'projects' | 'services' | 'contact'
  frame: FrameId
}

const NAV_ITEMS: NavItem[] = [
  { key: 'about',    frame: 'buste' },
  { key: 'skills',   frame: 'neon'  },
  { key: 'projects', frame: 'iMac'  },
  { key: 'services', frame: 'lab'   },
  { key: 'contact',  frame: 'buste' },
]

export default function Navbar() {
  const { t, i18n } = useTranslation()
  const { goTo, goHome } = useRoom()

  const toggleLang = () =>
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={goHome}
          className="font-display font-semibold text-white tracking-tight hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
        >
          VA<span className="text-primary">.</span>
        </button>

        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map(({ key, frame }) => (
            <button
              key={key}
              onClick={() => goTo(frame)}
              className="font-body text-sm text-muted hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer"
            >
              {t(`nav.${key}`)}
            </button>
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
