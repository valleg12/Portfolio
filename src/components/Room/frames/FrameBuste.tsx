import { useTranslation } from 'react-i18next'

const BASE = import.meta.env.BASE_URL

export default function FrameBuste() {
  const { t } = useTranslation()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: 560, width: '100%', padding: '1rem' }}>
      {/* Photo */}
      <div style={{ width: 140, height: 140, borderRadius: '50%', overflow: 'hidden', border: '3px solid rgba(99,102,241,0.6)', boxShadow: '0 0 40px rgba(99,102,241,0.3)', marginBottom: '1.5rem', flexShrink: 0 }}>
        <img src={`${BASE}PHOTO.jpg`} alt="Victorien Alleg" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }} />
      </div>

      {/* Name + title */}
      <h1 style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem', textAlign: 'center' }}>
        Victorien Alleg
      </h1>
      <p style={{ color: '#22d3ee', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
        AI Architect · Sport Business · MSc Eugenia School Paris
      </p>

      {/* Bio */}
      <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.9rem', lineHeight: 1.7, textAlign: 'center', marginBottom: '1.5rem' }}>
        {t('about.bio')}
      </p>

      {/* Education timeline */}
      <div style={{ width: '100%', marginBottom: '1.5rem' }}>
        {([
          { title: t('about.msc'), place: t('about.mscLocation'), accent: '#6366f1' },
          { title: t('about.master'), place: t('about.masterLocation'), accent: '#22d3ee' },
        ] as { title: string; place: string; accent: string }[]).map(edu => (
          <div key={edu.title} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.75rem', padding: '0.75rem 1rem', borderRadius: 10, border: `1px solid ${edu.accent}33`, background: `${edu.accent}0d` }}>
            <div style={{ width: 3, borderRadius: 4, background: edu.accent, flexShrink: 0, minHeight: 40 }} />
            <div>
              <p style={{ color: 'white', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', marginBottom: 2 }}>{edu.title}</p>
              <p style={{ color: '#94a3b8', fontSize: '0.78rem', fontFamily: 'var(--font-body, Inter, sans-serif)' }}>{edu.place}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Contact links */}
      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { label: 'Email', href: 'mailto:victorienalleg@gmail.com' },
          { label: 'LinkedIn', href: 'https://linkedin.com/in/victorien-alleg' },
          { label: 'GitHub', href: 'https://github.com/valleg12' },
        ].map(link => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
            style={{ padding: '8px 20px', borderRadius: 8, border: '1px solid rgba(99,102,241,0.35)', color: '#e2e8f0', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.85rem', textDecoration: 'none', background: 'rgba(99,102,241,0.08)' }}>
            {link.label}
          </a>
        ))}
      </div>

      {/* CV Download */}
      <a href={`${BASE}CV_Victorien_Alleg.pdf`} download
        style={{ padding: '10px 28px', borderRadius: 8, background: 'linear-gradient(135deg, #6366f1, #22d3ee)', color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontWeight: 600, fontSize: '0.9rem', textDecoration: 'none', boxShadow: '0 0 20px rgba(99,102,241,0.4)' }}>
        {t('room.cv')} ↓
      </a>
    </div>
  )
}
