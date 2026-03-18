import { useState } from 'react'
import { TECH_ITEMS } from '../../../data/techItems'

const CAT_COLORS: Record<string, string> = {
  IA: '#a78bfa', Data: '#60a5fa', Business: '#34d399', Tools: '#fb923c',
}

export default function FrameNeon() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 860, width: '100%' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#a78bfa', fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          ✦ Tools & Technologies
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Skills</h2>
        <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #6366f1, transparent)', margin: '0 auto' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.875rem' }}>
        {TECH_ITEMS.map(item => {
          const Icon = item.icon
          const isHov = hovered === item.name
          const catColor = CAT_COLORS[item.category] || '#94a3b8'
          return (
            <div key={item.name}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              style={{
                padding: '1rem',
                borderRadius: 12,
                border: `1px solid ${isHov ? catColor + '60' : 'rgba(255,255,255,0.06)'}`,
                background: isHov ? `${catColor}12` : 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(8px)',
                transition: 'all 0.2s ease',
                cursor: 'default',
                boxShadow: isHov ? `0 0 20px ${catColor}20` : 'none',
              }}>
              <Icon size={24} style={{ color: isHov ? catColor : item.color, marginBottom: 8, display: 'block', transition: 'color 0.2s' }} />
              <p style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.8rem', marginBottom: 8 }}>{item.name}</p>
              <div style={{ height: 2, borderRadius: 2, background: 'rgba(255,255,255,0.06)' }}>
                <div style={{ height: '100%', borderRadius: 2, width: `${item.level}%`, background: `linear-gradient(90deg, #6366f1, ${catColor})`, transition: 'width 0.6s ease' }} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
