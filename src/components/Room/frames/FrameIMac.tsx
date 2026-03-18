import { useTranslation } from 'react-i18next'

const TECH_IDS = ['jungle-gather', 'carrefour']

export default function FrameIMac() {
  const { t } = useTranslation()
  const projects = (t('projects.items', { returnObjects: true }) as any[]).filter((p: any) => TECH_IDS.includes(p.id))

  return (
    <div style={{ maxWidth: 700, width: '100%' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#22d3ee', fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          💻 Tech · Code · Build
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Tech Projects</h2>
        <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #22d3ee, transparent)', margin: '0 auto' }} />
      </div>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.map((p: any) => (
          <div key={p.id} style={{
            padding: '1.5rem',
            borderRadius: 16,
            border: '1px solid rgba(34,211,238,0.18)',
            background: 'rgba(5,20,30,0.6)',
            backdropFilter: 'blur(12px)',
          }}>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '1rem', marginBottom: '0.625rem' }}>{p.title}</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {p.tags.map((tag: string) => (
                <span key={tag} style={{ fontSize: 10, padding: '2px 10px', borderRadius: 20, border: '1px solid rgba(34,211,238,0.28)', color: '#67e8f9', fontFamily: 'var(--font-body)', background: 'rgba(34,211,238,0.07)', letterSpacing: '0.04em' }}>{tag}</span>
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.65 }}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
