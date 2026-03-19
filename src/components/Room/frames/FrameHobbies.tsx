import { useTranslation } from 'react-i18next'
import SpotlightCard from './SpotlightCard'

const LANG_COLORS = ['#f43f5e', '#f43f5e', '#fb7185']

export default function FrameHobbies() {
  const { t } = useTranslation()
  const hobbies = t('offwork.items', { returnObjects: true }) as string[]
  const languages = t('languages.items', { returnObjects: true }) as Array<{ lang: string; level: string; pct: number }>

  return (
    <div style={{
      width: '100%', maxWidth: 600,
      background: 'rgba(8,8,20,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      padding: '40px 48px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#f43f5e', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          ▲ Off The Clock
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 600 }}>Hobbies</h2>
      </div>

      {/* Hobbies grid */}
      <SpotlightCard
        color="#f43f5e"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(244,63,94,0.15)',
          borderRadius: 12,
          padding: '1.5rem',
          marginBottom: '1rem',
        }}
      >
        <p style={{ color: '#f43f5e', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Interests</p>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {hobbies.map(h => (
            <span
              key={h}
              style={{
                padding: '6px 16px',
                borderRadius: 24,
                border: '1px solid rgba(244,63,94,0.4)',
                color: '#fecdd3',
                fontSize: '0.82rem',
                background: 'rgba(244,63,94,0.08)',
              }}
            >
              {h}
            </span>
          ))}
        </div>
      </SpotlightCard>

      {/* Languages */}
      <SpotlightCard
        color="#f43f5e"
        style={{
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(244,63,94,0.15)',
          borderRadius: 12,
          padding: '1.5rem',
        }}
      >
        <p style={{ color: '#f43f5e', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Languages</p>
        {languages.map((lang, i) => {
          const color = LANG_COLORS[i] ?? '#f43f5e'
          return (
            <div key={lang.lang} style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500 }}>{lang.lang}</span>
                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem' }}>{lang.level}</span>
              </div>
              <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: `${lang.pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${color}80, ${color})`, boxShadow: `0 0 8px ${color}50` }} />
              </div>
            </div>
          )
        })}
      </SpotlightCard>
    </div>
  )
}
