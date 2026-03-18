import { useTranslation } from 'react-i18next'

export default function FrameHobbies() {
  const { t } = useTranslation()
  const hobbies = t('offwork.items', { returnObjects: true }) as string[]
  const languages = t('languages.items', { returnObjects: true }) as Array<{ lang: string; level: string; pct: number }>

  return (
    <div style={{ maxWidth: 580, width: '100%', padding: '1rem' }}>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Off Work</h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', marginBottom: '2rem', borderRadius: 2 }} />

      {/* Hobby chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '2.5rem' }}>
        {hobbies.map((h: string) => (
          <span key={h} style={{ padding: '8px 20px', borderRadius: 40, border: '1px solid rgba(99,102,241,0.35)', color: '#e2e8f0', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.88rem', background: 'rgba(99,102,241,0.08)' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Language bars */}
      <h3 style={{ color: '#94a3b8', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontSize: '0.75rem', letterSpacing: 2.5, textTransform: 'uppercase', marginBottom: '1rem' }}>
        {t('languages.title')}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {languages.map((lang) => (
          <div key={lang.lang}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ color: 'white', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.88rem' }}>{lang.lang}</span>
              <span style={{ color: '#94a3b8', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.76rem' }}>{lang.level}</span>
            </div>
            <div style={{ height: 4, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ height: '100%', borderRadius: 4, width: `${lang.pct}%`, background: 'linear-gradient(90deg, #6366f1, #22d3ee)' }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
