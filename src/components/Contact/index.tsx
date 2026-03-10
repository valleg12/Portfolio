import { useTranslation } from 'react-i18next'
import { Mail, Linkedin, Github, ArrowUpRight } from 'lucide-react'

export default function Contact() {
  const { t } = useTranslation()

  const links = [
    {
      icon: <Mail size={22} />,
      label: t('contact.email'),
      href: `mailto:${t('contact.email')}`,
    },
    {
      icon: <Linkedin size={22} />,
      label: t('contact.linkedin'),
      href: 'https://linkedin.com/in/victorien-alleg',
    },
    {
      icon: <Github size={22} />,
      label: t('contact.github'),
      href: 'https://github.com/victorienalleg',
    },
  ]

  return (
    <section id="contact" className="py-32 relative" style={{ zIndex: 10 }}>
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="font-display font-bold text-5xl sm:text-7xl text-white mb-4">
          {t('contact.title')}
        </h2>
        <p className="font-body text-muted text-xl mb-16">
          {t('contact.subtitle')}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('http') ? '_blank' : undefined}
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-4 rounded-xl border border-white/10 hover:border-primary/40 bg-white/[0.02] hover:bg-primary/5 text-muted hover:text-white transition-all duration-300 min-w-[220px] justify-center"
            >
              <span className="text-primary group-hover:text-accent transition-colors">{link.icon}</span>
              <span className="font-body text-sm">{link.label}</span>
              <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-32 pt-8 border-t border-white/5 text-center">
        <p className="font-body text-muted text-xs">
          © {new Date().getFullYear()} Victorien Alleg · Built with React + Three.js
        </p>
      </div>
    </section>
  )
}
