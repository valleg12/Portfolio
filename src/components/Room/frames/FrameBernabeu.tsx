import { useTranslation } from 'react-i18next'
import SpotlightCard from './SpotlightCard'

const SPORT_IDS = ['sportech', 'getstaty', 'novarena']

const EMOJI_MAP: Record<string, string> = {
  sportech: '🏃',
  getstaty: '⚽',
  novarena: '🏟️',
}

const COLOR_MAP: Record<string, string> = {
  sportech: '#3b82f6',
  getstaty: '#60a5fa',
  novarena: '#93c5fd',
}

export default function FrameBernabeu() {
  const { t } = useTranslation()
  const allProjects = t('projects.items', { returnObjects: true }) as Array<{ id: string; title: string; tags: string[]; description: string }>
  const projects = allProjects.filter(p => SPORT_IDS.includes(p.id))

  return (
    <div style={{
      width: '100%', maxWidth: 680,
      background: 'rgba(8,8,20,0.92)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 16,
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      padding: '40px 48px',
      fontFamily: "'Space Grotesk', sans-serif",
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#3b82f6', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          🏟️ Sport Business
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Sport Projects</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {projects.map(project => {
          const color = COLOR_MAP[project.id] || '#3b82f6'
          const emoji = EMOJI_MAP[project.id] || '🏆'
          return (
            <SpotlightCard
              key={project.id}
              color={color}
              style={{
                background: 'rgba(5,10,30,0.75)',
                border: `1px solid ${color}25`,
                borderRadius: 16,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                padding: '1.5rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <span style={{ fontSize: '2rem', lineHeight: 1, flexShrink: 0 }}>{emoji}</span>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                    {project.title}
                  </h3>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {project.tags.map(tag => (
                      <span key={tag} style={{ fontSize: '0.7rem', padding: '2px 10px', borderRadius: 20, border: `1px solid ${color}40`, color: color, fontFamily: 'var(--font-body)', letterSpacing: '0.04em' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p style={{ color: '#94a3b8', fontSize: '0.85rem', lineHeight: 1.7, fontFamily: 'var(--font-body)' }}>
                    {project.description}
                  </p>
                </div>
              </div>
            </SpotlightCard>
          )
        })}
      </div>
    </div>
  )
}
