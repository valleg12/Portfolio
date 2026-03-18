import SpotlightCard from './SpotlightCard'

const HOBBIES = [
  { label: 'Chess ♟️' },
  { label: 'Football ⚽' },
  { label: 'Skiing 🎿' },
  { label: 'Boxing 🥊' },
  { label: 'History 📚' },
  { label: 'Cinema 🎬' },
]

const LANGUAGES = [
  { name: 'French', level: 'Native', pct: 100, color: '#f43f5e' },
  { name: 'English', level: 'Bilingual', pct: 92, color: '#f43f5e' },
  { name: 'Spanish', level: 'Intermediate', pct: 55, color: '#fb7185' },
]

export default function FrameHobbies() {
  return (
    <div style={{ width: '100%', maxWidth: 600 }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#f43f5e', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          ▲ Off The Clock
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Hobbies</h2>
      </div>

      {/* Hobbies grid */}
      <SpotlightCard
        color="#f43f5e"
        style={{
          background: 'rgba(20,5,10,0.75)',
          border: '1px solid rgba(244,63,94,0.2)',
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '1.5rem',
          marginBottom: '1rem',
        }}
      >
        <p style={{ color: '#f43f5e', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem' }}>Interests</p>
        <div style={{ display: 'flex', gap: '0.625rem', flexWrap: 'wrap' }}>
          {HOBBIES.map(h => (
            <span
              key={h.label}
              style={{
                padding: '6px 16px',
                borderRadius: 24,
                border: '1px solid rgba(244,63,94,0.4)',
                color: '#fecdd3',
                fontSize: '0.82rem',
                fontFamily: 'var(--font-body)',
                background: 'rgba(244,63,94,0.08)',
              }}
            >
              {h.label}
            </span>
          ))}
        </div>
      </SpotlightCard>

      {/* Languages */}
      <SpotlightCard
        color="#f43f5e"
        style={{
          background: 'rgba(20,5,10,0.75)',
          border: '1px solid rgba(244,63,94,0.2)',
          borderRadius: 16,
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '1.5rem',
        }}
      >
        <p style={{ color: '#f43f5e', fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>Languages</p>
        {LANGUAGES.map(lang => (
          <div key={lang.name} style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
              <span style={{ color: 'white', fontSize: '0.85rem', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{lang.name}</span>
              <span style={{ color: '#94a3b8', fontSize: '0.75rem', fontFamily: 'var(--font-body)' }}>{lang.level}</span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ height: '100%', width: `${lang.pct}%`, borderRadius: 2, background: `linear-gradient(90deg, ${lang.color}80, ${lang.color})`, boxShadow: `0 0 8px ${lang.color}50` }} />
            </div>
          </div>
        ))}
      </SpotlightCard>
    </div>
  )
}
