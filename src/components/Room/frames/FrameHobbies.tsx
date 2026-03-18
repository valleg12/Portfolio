import { useTranslation } from 'react-i18next'

export default function FrameHobbies() {
  const { t } = useTranslation()
  const hobbies = t('offwork.items', { returnObjects: true }) as string[]
  const languages = t('languages.items', { returnObjects: true }) as Array<{ lang: string; level: string; pct: number }>

  return (
    <div style={{ maxWidth: 580, width: '100%' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#f59e0b', fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          ♟ Off the Clock
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Hobbies</h2>
        <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)', margin: '0 auto' }} />
      </div>

      {/* Hobby chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.625rem', marginBottom: '2.5rem', justifyContent: 'center' }}>
        {hobbies.map((h: string) => (
          <span key={h} style={{
            padding: '8px 18px',
            borderRadius: 40,
            border: '1px solid rgba(245,158,11,0.25)',
            color: '#fde68a',
            fontFamily: 'var(--font-body)',
            fontSize: '0.88rem',
            background: 'rgba(245,158,11,0.07)',
            backdropFilter: 'blur(8px)',
          }}>
            {h}
          </span>
        ))}
      </div>

      {/* Language section */}
      <div style={{
        padding: '1.5rem',
        borderRadius: 14,
        border: '1px solid rgba(255,255,255,0.07)',
        background: 'rgba(255,255,255,0.02)',
        backdropFilter: 'blur(12px)',
      }}>
        <p style={{ color: '#9d8f7a', fontFamily: 'var(--font-display)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
          {t('languages.title')}
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {languages.map((lang) => (
            <div key={lang.lang}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ color: '#f5f0e8', fontFamily: 'var(--font-body)', fontSize: '0.88rem' }}>{lang.lang}</span>
                <span style={{ color: '#9d8f7a', fontFamily: 'var(--font-body)', fontSize: '0.76rem' }}>{lang.level}</span>
              </div>
              <div style={{ height: 3, borderRadius: 3, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', borderRadius: 3, width: `${lang.pct}%`, background: 'linear-gradient(90deg, #f59e0b, #fde68a)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
