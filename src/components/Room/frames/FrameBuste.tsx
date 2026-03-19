import { useTranslation } from 'react-i18next'
import SpotlightCard from './SpotlightCard'
import { Github, Linkedin, Mail } from 'lucide-react'

const BASE = import.meta.env.BASE_URL

const CARD_STYLE = {
  background: 'rgba(15,10,5,0.75)',
  border: '1px solid rgba(245,158,11,0.2)',
  borderRadius: 16,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
}

export default function FrameBuste() {
  const { t } = useTranslation()

  return (
    <div style={{
      width: '100%', maxWidth: 560,
      background: 'rgba(8,8,20,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      padding: '40px 48px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          width: 100, height: 100, borderRadius: '50%', overflow: 'hidden', margin: '0 auto 1rem',
          border: '2px solid rgba(245,158,11,0.5)',
          boxShadow: '0 0 30px rgba(245,158,11,0.25)',
        }}>
          <img src={`${BASE}PHOTO.jpg`} alt="Victorien Alleg" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        </div>
        <h1 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>
          Victorien Alleg
        </h1>
        <p style={{ color: '#f59e0b', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          AI Architect · Sport Business
        </p>
      </div>

      {/* Bio card */}
      <SpotlightCard color="#f59e0b" style={{ ...CARD_STYLE, padding: '1.5rem', marginBottom: '1rem' }}>
        <p style={{ color: '#d1c5b0', fontFamily: 'var(--font-body)', fontSize: '0.9rem', lineHeight: 1.8, textAlign: 'center' }}>
          {t('about.bio')}
        </p>
      </SpotlightCard>

      {/* Education */}
      {[
        { emoji: '🧠', title: t('about.msc'), place: t('about.mscLocation'), color: '#f59e0b' },
        { emoji: '⚽', title: t('about.master'), place: t('about.masterLocation'), color: '#3b82f6' },
      ].map(edu => (
        <SpotlightCard key={edu.title} color={edu.color} style={{ ...CARD_STYLE, padding: '1rem 1.25rem', marginBottom: '0.625rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '1.5rem' }}>{edu.emoji}</span>
          <div>
            <p style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-display)', marginBottom: 2 }}>{edu.title}</p>
            <p style={{ color: '#9d8f7a', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}>{edu.place}</p>
          </div>
        </SpotlightCard>
      ))}

      {/* Contact + CV */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        {[
          { label: 'GitHub', href: 'https://github.com/valleg12', icon: <Github size={14} /> },
          { label: 'LinkedIn', href: 'https://linkedin.com/in/victorien-alleg', icon: <Linkedin size={14} /> },
          { label: 'Email', href: 'mailto:victorienalleg@gmail.com', icon: <Mail size={14} /> },
        ].map(link => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '8px 18px', borderRadius: 8, border: '1px solid rgba(245,158,11,0.3)', color: '#fde68a', fontFamily: 'var(--font-body)', fontSize: '0.82rem', textDecoration: 'none', background: 'rgba(245,158,11,0.07)', transition: 'background 0.2s' }}>
            {link.icon} {link.label}
          </a>
        ))}
        <a href={`${BASE}CV_Victorien_Alleg.pdf`} download
          style={{ padding: '8px 24px', borderRadius: 8, background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: '#0a0805', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.82rem', textDecoration: 'none', letterSpacing: '0.04em' }}>
          {t('room.cv')} ↓
        </a>
      </div>
    </div>
  )
}
