import { useTranslation } from 'react-i18next'

const SPORT_IDS = ['sportech', 'getstaty', 'novarena']

export default function FrameBernabeu() {
  const { t } = useTranslation()
  const projects = (t('projects.items', { returnObjects: true }) as any[]).filter((p: any) => SPORT_IDS.includes(p.id))

  return (
    <div style={{ maxWidth: 760, width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{
          color: '#60a5fa',
          fontFamily: 'var(--font-body, Inter, sans-serif)',
          fontSize: '0.72rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          marginBottom: 8,
        }}>
          ⚡ Santiago Bernabéu · Madrid
        </p>
        <h2 style={{
          color: 'white',
          fontFamily: 'var(--font-display, Space Grotesk, sans-serif)',
          fontSize: '2rem',
          fontWeight: 700,
          letterSpacing: '-0.02em',
          marginBottom: 8,
        }}>
          Sport Projects
        </h2>
        <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #3b82f6, transparent)', margin: '0 auto' }} />
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {projects.map((p: any) => (
          <div key={p.id} style={{
            padding: '1.5rem',
            borderRadius: 16,
            border: '1px solid rgba(59,130,246,0.2)',
            background: 'rgba(15,25,50,0.6)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 0 40px rgba(59,130,246,0.05)',
          }}>
            <h3 style={{
              color: 'white',
              fontFamily: 'var(--font-display)',
              fontWeight: 600,
              fontSize: '1rem',
              marginBottom: '0.625rem',
            }}>{p.title}</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: '0.75rem' }}>
              {p.tags.map((tag: string) => (
                <span key={tag} style={{
                  fontSize: 10,
                  padding: '2px 10px',
                  borderRadius: 20,
                  border: '1px solid rgba(96,165,250,0.3)',
                  color: '#93c5fd',
                  fontFamily: 'var(--font-body)',
                  background: 'rgba(59,130,246,0.1)',
                  letterSpacing: '0.04em',
                }}>{tag}</span>
              ))}
            </div>
            <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body)', fontSize: '0.85rem', lineHeight: 1.65 }}>{p.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
