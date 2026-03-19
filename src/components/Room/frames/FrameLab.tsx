import { useTranslation } from 'react-i18next'

const ACCENT = 'rgba(34, 197, 94,'  // green — lab zone color

export default function FrameLab() {
  const { t } = useTranslation()
  const items = t('lab.items', { returnObjects: true }) as Array<{ icon: string; title: string; desc: string }>
  const cta = t('lab.cta')

  return (
    <div style={{
      width: '100%', maxWidth: 780,
      background: 'rgba(8,8,20,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      padding: '40px 48px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <p style={{ color: '#22c55e', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          ✦ Freelance
        </p>
        <h2 style={{ color: 'white', fontSize: '2rem', fontWeight: 600 }}>
          {t('lab.title')}
        </h2>
      </div>

      {/* 2×3 grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem' }}>
        {items.map(item => (
          <div
            key={item.title}
            style={{
              background: `${ACCENT} 0.06)`,
              border: `1px solid ${ACCENT} 0.15)`,
              borderRadius: 12,
              padding: '1.25rem 1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{item.icon}</span>
              <h3 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: 0 }}>
                {item.title}
              </h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0 }}>
              {item.desc}
            </p>
            <a
              href="mailto:victorienalleg@gmail.com"
              style={{
                marginTop: '0.25rem',
                color: '#22c55e',
                fontSize: '0.78rem',
                fontWeight: 500,
                textDecoration: 'none',
                letterSpacing: '0.02em',
              }}
            >
              {cta}
            </a>
          </div>
        ))}
      </div>
    </div>
  )
}
