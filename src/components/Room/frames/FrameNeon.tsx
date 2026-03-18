import { useState } from 'react'
import { TECH_ITEMS } from '../../../data/techItems'

const CAT_BG: Record<string, string> = {
  IA:       'rgba(34,211,238,0.12)',
  Data:     'rgba(59,130,246,0.12)',
  Business: 'rgba(16,185,129,0.12)',
  Tools:    'rgba(249,115,22,0.12)',
}

export default function FrameNeon() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div style={{ maxWidth: 820, width: '100%', padding: '1rem' }}>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Skills</h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', marginBottom: '2rem', borderRadius: 2 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))', gap: '1rem' }}>
        {TECH_ITEMS.map(item => {
          const Icon = item.icon
          const isHov = hovered === item.name
          return (
            <div key={item.name}
              onMouseEnter={() => setHovered(item.name)}
              onMouseLeave={() => setHovered(null)}
              style={{ padding: '1rem', borderRadius: 12, border: `1px solid ${isHov ? item.color + '80' : 'rgba(255,255,255,0.08)'}`, background: isHov ? CAT_BG[item.category] : 'rgba(255,255,255,0.02)', transition: 'all 0.2s ease', cursor: 'default' }}>
              <Icon size={26} style={{ color: item.color, marginBottom: 8, display: 'block' }} />
              <p style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontWeight: 600, fontSize: '0.82rem', marginBottom: 8 }}>{item.name}</p>
              <div style={{ height: 3, borderRadius: 4, background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', borderRadius: 4, width: `${item.level}%`, background: `linear-gradient(90deg, #6366f1, ${item.color})` }} />
              </div>
              <p style={{ color: '#94a3b8', fontSize: '0.7rem', fontFamily: 'var(--font-body, Inter, sans-serif)', marginTop: 3, textAlign: 'right' }}>{item.level}%</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
