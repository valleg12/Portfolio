import { useTranslation } from 'react-i18next'

const SPORT_IDS = ['sportech', 'getstaty', 'novarena']

export default function FrameBernabeu() {
  const { t } = useTranslation()
  const projects = (t('projects.items', { returnObjects: true }) as any[]).filter((p: any) => SPORT_IDS.includes(p.id))

  return (
    <div style={{ maxWidth: 750, width: '100%', padding: '1rem' }}>
      <p style={{ color: '#60a5fa', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.78rem', letterSpacing: 3, textTransform: 'uppercase', marginBottom: 4 }}>Santiago Bernabéu · Madrid</p>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Sport Projects</h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#3b82f6,#60a5fa)', marginBottom: '2rem', borderRadius: 2 }} />
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        {projects.map((p: any) => (
          <div key={p.id} style={{ padding: '1.25rem 1.5rem', borderRadius: 14, border: '1px solid rgba(59,130,246,0.25)', background: 'rgba(30,58,95,0.3)', backdropFilter: 'blur(8px)' }}>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontWeight: 600, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{p.title}</h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {p.tags.map((tag: string) => (
                <span key={tag} style={{ fontSize: 11, padding: '2px 10px', borderRadius: 20, border: '1px solid rgba(96,165,250,0.35)', color: '#93c5fd', fontFamily: 'var(--font-body, Inter, sans-serif)', background: 'rgba(59,130,246,0.1)' }}>{tag}</span>
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.88rem', lineHeight: 1.6 }}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
