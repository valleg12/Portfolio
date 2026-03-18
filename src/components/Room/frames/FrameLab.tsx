import { useTranslation } from 'react-i18next'

const ACCENT_COLORS = ['#6366f1', '#22d3ee', '#10b981', '#f97316', '#8b5cf6', '#f59e0b']

export default function FrameLab() {
  const { t } = useTranslation()
  const items = t('lab.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>

  return (
    <div style={{ maxWidth: 820, width: '100%', padding: '1rem' }}>
      <div style={{ background: 'rgba(240,240,235,0.04)', border: '2px solid rgba(240,240,235,0.12)', borderRadius: 16, padding: '2rem', backdropFilter: 'blur(4px)', boxShadow: '0 0 60px rgba(255,255,255,0.02)' }}>
        <h2 style={{ fontFamily: '"Caveat", cursive', fontSize: '2.4rem', color: 'rgba(255,255,255,0.88)', paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '0.5rem' }}>
          Lab ✦
        </h2>
        <p style={{ fontFamily: '"Caveat", cursive', fontSize: '1.1rem', color: '#94a3b8', marginBottom: '1.75rem' }}>
          {t('lab.subtitle')}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))', gap: '1rem' }}>
          {items.map((item, i) => {
            const color = ACCENT_COLORS[i % ACCENT_COLORS.length]
            return (
              <div key={item.title} style={{ padding: '1rem', borderRadius: 10, background: `${color}10`, border: `1px solid ${color}30` }}>
                <span style={{ fontSize: 22, display: 'block', marginBottom: 8 }}>{item.icon}</span>
                <p style={{ fontFamily: '"Caveat", cursive', fontSize: '1.15rem', color: 'white', fontWeight: 600, marginBottom: 6 }}>{item.title}</p>
                <p style={{ fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.77rem', color: '#94a3b8', lineHeight: 1.55 }}>{item.desc}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
