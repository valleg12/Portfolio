import { useTranslation } from 'react-i18next'
import { useRoom } from '../../context/RoomContext'

export default function Navbar() {
  const { i18n } = useTranslation()
  const { goHome } = useRoom()

  const toggleLang = () =>
    i18n.changeLanguage(i18n.language === 'fr' ? 'en' : 'fr')

  return (
    <nav className="fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <button
          onClick={goHome}
          className="font-display font-semibold text-white tracking-tight hover:text-primary transition-colors bg-transparent border-none p-0 cursor-pointer"
        >
          VA<span className="text-primary">.</span>
        </button>
        <button
          onClick={toggleLang}
          className="font-display font-medium text-xs border border-white/10 rounded-md px-3 py-1.5 text-muted hover:text-white hover:border-primary/50 transition-all"
        >
          {i18n.language === 'fr' ? 'EN' : 'FR'}
        </button>
      </div>
    </nav>
  )
}
