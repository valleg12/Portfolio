import { useTranslation } from 'react-i18next'

const BASE = import.meta.env.BASE_URL

export default function FrameBuste() {
  const { t } = useTranslation()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      maxWidth: 520,
      width: '100%',
    }}>
      {/* Glass card */}
      <div style={{
        width: '100%',
        background: 'rgba(15,10,5,0.7)',
        border: '1px solid rgba(245,158,11,0.25)',
        borderRadius: 20,
        padding: '2.5rem 2rem',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 80px rgba(245,158,11,0.08), 0 0 0 1px rgba(245,158,11,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Photo */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: '50%',
          overflow: 'hidden',
          border: '2px solid rgba(245,158,11,0.5)',
          boxShadow: '0 0 30px rgba(245,158,11,0.2)',
          marginBottom: '1.5rem',
          flexShrink: 0,
        }}>
          <img
            src={`${BASE}PHOTO.jpg`}
            alt="Victorien Alleg"
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top center' }}
          />
        </div>

        <h1 style={{
          color: 'white',
          fontFamily: 'var(--font-display, Space Grotesk, sans-serif)',
          fontSize: '1.8rem',
          fontWeight: 700,
          marginBottom: '0.25rem',
          textAlign: 'center',
          letterSpacing: '-0.02em',
        }}>
          Victorien Alleg
        </h1>

        <p style={{
          color: '#f59e0b',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          fontSize: '0.85rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          marginBottom: '1.25rem',
          textAlign: 'center',
        }}>
          AI Architect · Sport Business
        </p>

        <div style={{
          width: 40,
          height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.6), transparent)',
          marginBottom: '1.25rem',
        }} />

        <p style={{
          color: '#d1c5b0',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          fontSize: '0.88rem',
          lineHeight: 1.75,
          textAlign: 'center',
          marginBottom: '1.5rem',
        }}>
          {t('about.bio')}
        </p>

        {/* Education */}
        <div style={{ width: '100%', marginBottom: '1.5rem' }}>
          {[
            { title: t('about.msc'), place: t('about.mscLocation') },
            { title: t('about.master'), place: t('about.masterLocation') },
          ].map(edu => (
            <div key={edu.title} style={{
              display: 'flex',
              gap: '0.75rem',
              marginBottom: '0.625rem',
              padding: '0.75rem 1rem',
              borderRadius: 10,
              border: '1px solid rgba(245,158,11,0.15)',
              background: 'rgba(245,158,11,0.05)',
            }}>
              <div style={{ width: 2, borderRadius: 2, background: 'rgba(245,158,11,0.6)', flexShrink: 0 }} />
              <div>
                <p style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '0.82rem', fontFamily: 'var(--font-display)', marginBottom: 2 }}>{edu.title}</p>
                <p style={{ color: '#9d8f7a', fontSize: '0.74rem', fontFamily: 'var(--font-body)' }}>{edu.place}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div style={{ display: 'flex', gap: '0.625rem', marginBottom: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'Email', href: 'mailto:victorienalleg@gmail.com' },
            { label: 'LinkedIn', href: 'https://linkedin.com/in/victorien-alleg' },
            { label: 'GitHub', href: 'https://github.com/valleg12' },
          ].map(link => (
            <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer"
              style={{
                padding: '7px 18px',
                borderRadius: 8,
                border: '1px solid rgba(245,158,11,0.3)',
                color: '#fde68a',
                fontFamily: 'var(--font-body)',
                fontSize: '0.82rem',
                textDecoration: 'none',
                background: 'rgba(245,158,11,0.07)',
                letterSpacing: '0.02em',
              }}>
              {link.label}
            </a>
          ))}
        </div>

        <a href={`${BASE}CV_Victorien_Alleg.pdf`} download
          style={{
            padding: '10px 32px',
            borderRadius: 8,
            background: 'linear-gradient(135deg, rgba(245,158,11,0.9), rgba(217,119,6,0.9))',
            color: '#0a0805',
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '0.85rem',
            textDecoration: 'none',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(245,158,11,0.3)',
          }}>
          {t('room.cv')} ↓
        </a>
      </div>
    </div>
  )
}
