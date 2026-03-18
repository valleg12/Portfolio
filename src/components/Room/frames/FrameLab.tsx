import { useTranslation } from 'react-i18next'

const COLORS = ['#f59e0b', '#22d3ee', '#34d399', '#f97316', '#a78bfa', '#60a5fa']

export default function FrameLab() {
  const { t } = useTranslation()
  const items = t('lab.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>

  return (
    <div style={{ maxWidth: 840, width: '100%' }}>
      {/* Whiteboard */}
      <div style={{
        background: 'rgba(245,240,230,0.04)',
        border: '1.5px solid rgba(245,240,230,0.12)',
        borderRadius: 18,
        padding: '2rem 2rem 2.5rem',
        backdropFilter: 'blur(8px)',
        boxShadow: '0 0 80px rgba(255,255,255,0.03), inset 0 1px 0 rgba(255,255,255,0.05)',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ marginBottom: '1.75rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 style={{
            fontFamily: '"Caveat", cursive',
            fontSize: '2.6rem',
            color: 'rgba(255,255,255,0.9)',
            lineHeight: 1,
            marginBottom: 4,
          }}>
            Lab ✦
          </h2>
          <p style={{
            fontFamily: '"Caveat", cursive',
            fontSize: '1.15rem',
            color: 'rgba(255,255,255,0.4)',
          }}>
            {t('lab.subtitle')}
          </p>
        </div>

        {/* Service items */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1rem' }}>
          {items.map((item, i) => {
            const color = COLORS[i % COLORS.length]
            return (
              <div key={item.title} style={{
                padding: '1.1rem',
                borderRadius: 10,
                background: `${color}0e`,
                border: `1px solid ${color}28`,
              }}>
                <span style={{ fontSize: 20, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                <p style={{
                  fontFamily: '"Caveat", cursive',
                  fontSize: '1.15rem',
                  color: 'white',
                  fontWeight: 600,
                  marginBottom: 6,
                  lineHeight: 1.2,
                }}>{item.title}</p>
                <p style={{
                  fontFamily: 'var(--font-body, Inter, sans-serif)',
                  fontSize: '0.76rem',
                  color: '#9d9080',
                  lineHeight: 1.6,
                }}>{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
