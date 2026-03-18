import SpotlightCard from './SpotlightCard'

const SERVICES = [
  { emoji: '🧠', title: 'AI Architect', desc: 'Design and deploy autonomous AI agents, LLM pipelines, and API integrations at scale.' },
  { emoji: '📊', title: 'Business & Data Analyst', desc: 'Transform raw data into strategic decisions — dashboards, KPIs, Power BI, Tableau.' },
  { emoji: '⚽', title: 'Sport Analytics', desc: 'AI-driven athlete performance, injury prevention, scouting, and fan engagement systems.' },
  { emoji: '🤖', title: 'AI Automation', desc: 'Automate workflows with AI — email, document processing, CRM, scheduling agents.' },
  { emoji: '🔮', title: 'Predictive Modeling', desc: 'ML models for forecasting, classification, and anomaly detection in sports and business.' },
  { emoji: '🎯', title: 'AI Strategy', desc: 'Advise on AI adoption, tooling selection, and data-driven product roadmaps.' },
]

export default function FrameLab() {
  return (
    <div style={{ width: '100%', maxWidth: 720 }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#22c55e', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          🧪 What I Build
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Lab</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.875rem' }}>
        {SERVICES.map(service => (
          <SpotlightCard
            key={service.title}
            color="#22c55e"
            style={{
              background: 'rgba(0,15,8,0.75)',
              border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 14,
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              padding: '1.25rem',
            }}
          >
            <span style={{ fontSize: '1.8rem', lineHeight: 1, display: 'block', marginBottom: '0.75rem' }}>{service.emoji}</span>
            <h3 style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.5rem' }}>
              {service.title}
            </h3>
            <p style={{ color: '#86efac', fontSize: '0.8rem', lineHeight: 1.65, fontFamily: 'var(--font-body)' }}>
              {service.desc}
            </p>
          </SpotlightCard>
        ))}
      </div>
    </div>
  )
}
