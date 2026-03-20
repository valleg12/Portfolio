import SpotlightCard from './SpotlightCard'

const SKILLS = [
  { name: 'Python',       icon: '🐍', color: '#3b82f6', category: 'AI & Data', level: 90 },
  { name: 'SQL',          icon: '🗄️', color: '#f59e0b', category: 'Data',      level: 85 },
  { name: 'Pandas',       icon: '🐼', color: '#6366f1', category: 'AI & Data', level: 85 },
  { name: 'Scikit-learn', icon: '🔬', color: '#f97316', category: 'AI & Data', level: 80 },
  { name: 'GPT API',      icon: '🤖', color: '#22c55e', category: 'AI',        level: 90 },
  { name: 'LangChain',    icon: '⛓️', color: '#8b5cf6', category: 'AI',        level: 75 },
  { name: 'Power BI',     icon: '📊', color: '#f59e0b', category: 'Business',  level: 85 },
  { name: 'Tableau',      icon: '📈', color: '#22d3ee', category: 'Business',  level: 80 },
  { name: 'Excel/Sheets', icon: '📋', color: '#22c55e', category: 'Business',  level: 90 },
  { name: 'Streamlit',    icon: '⚡', color: '#f43f5e', category: 'Tools',       level: 80 },
  { name: 'Git',          icon: '🔀', color: '#f97316', category: 'Tools',       level: 85 },
  { name: 'Notion',       icon: '📝', color: '#ffffff', category: 'Tools',       level: 90 },
  { name: 'N8N',          icon: '🔁', color: '#ea580c', category: 'Automation',  level: 80 },
  { name: 'Make',         icon: '🔧', color: '#a855f7', category: 'Automation',  level: 75 },
  { name: 'Embeddings',   icon: '🧬', color: '#ec4899', category: 'AI',          level: 75 },
  { name: 'FastAPI',      icon: '🚀', color: '#10b981', category: 'Tools',       level: 75 },
  { name: 'React',        icon: '⚛️', color: '#38bdf8', category: 'Frontend',    level: 70 },
  { name: 'Hugging Face', icon: '🤗', color: '#fbbf24', category: 'AI',          level: 70 },
  { name: 'TypeScript',   icon: '🔷', color: '#3178c6', category: 'Frontend',    level: 80 },
  { name: 'Supabase',     icon: '🗃️', color: '#3ecf8e', category: 'Tools',       level: 75 },
  { name: 'Stable Diff.', icon: '🎨', color: '#e879f9', category: 'AI',          level: 70 },
]

export default function FrameNeon() {
  return (
    <div style={{
      width: '100%', maxWidth: 720,
      background: 'rgba(8,8,20,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      padding: '40px 48px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#6366f1', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          ✦ Tools & Technologies
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Skills</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {SKILLS.map(skill => (
          <SpotlightCard
            key={skill.name}
            color={skill.color}
            style={{
              background: 'rgba(10,8,20,0.75)',
              border: `1px solid ${skill.color}25`,
              borderRadius: 12,
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              padding: '1rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{skill.icon}</span>
              <div>
                <p style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.85rem' }}>{skill.name}</p>
                <p style={{ color: '#6366f180', fontSize: '0.65rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{skill.category}</p>
              </div>
            </div>
            {/* Progress bar */}
            <div style={{ height: 3, borderRadius: 2, background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ height: '100%', width: `${skill.level}%`, borderRadius: 2, background: `linear-gradient(90deg, ${skill.color}80, ${skill.color})`, boxShadow: `0 0 8px ${skill.color}60` }} />
            </div>
            <p style={{ color: '#94a3b8', fontSize: '0.65rem', textAlign: 'right', marginTop: '0.25rem', fontFamily: 'var(--font-body)' }}>{skill.level}%</p>
          </SpotlightCard>
        ))}
      </div>
    </div>
  )
}
