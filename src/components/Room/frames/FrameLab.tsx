// Whiteboard frame — 6 freelance offers written in Caveat (handwriting font)

const SERVICES = [
  {
    title: 'AI Architect',
    desc: 'Agents autonomes, pipelines LLM, intégrations API — de l\'idée au déploiement.',
    color: '#4ade80',
    underline: '#166534',
  },
  {
    title: 'Business & Data Analyst',
    desc: 'Transformer la donnée brute en décisions stratégiques — dashboards, KPIs, Power BI.',
    color: '#60a5fa',
    underline: '#1e3a5f',
  },
  {
    title: 'Sport Analytics',
    desc: 'Performance athlète, détection de talents, scouting et engagement supporter par l\'IA.',
    color: '#f97316',
    underline: '#7c2d12',
  },
  {
    title: 'AI Automation',
    desc: 'Automatiser les workflows : email, documents, CRM, planification — agents IA sur-mesure.',
    color: '#a78bfa',
    underline: '#3b0764',
  },
  {
    title: 'Predictive Modeling',
    desc: 'Modèles ML pour la prévision, classification et détection d\'anomalies business & sport.',
    color: '#fb7185',
    underline: '#881337',
  },
  {
    title: 'AI Strategy & Advisory',
    desc: 'Accompagnement à l\'adoption IA, choix d\'outils, roadmap produit data-driven.',
    color: '#fbbf24',
    underline: '#78350f',
  },
]

export default function FrameLab() {
  return (
    <div style={{
      width: '100%',
      maxWidth: 780,
      background: 'rgba(248, 250, 252, 0.06)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.12)',
      borderRadius: 18,
      padding: '2.5rem 2rem',
    }}>
      {/* Whiteboard header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{
          fontFamily: "'Caveat', cursive",
          fontSize: '2.4rem',
          fontWeight: 600,
          color: '#f8fafc',
          letterSpacing: '0.02em',
        }}>
          Victorien Alleg — Freelance
        </h2>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.15)', borderRadius: 1, margin: '0.75rem 0 0' }} />
      </div>

      {/* Service cards — handwriting style */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem 2rem' }}>
        {SERVICES.map((s) => (
          <div key={s.title} style={{ padding: '0.25rem 0' }}>
            <h3 style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.35rem',
              fontWeight: 600,
              color: s.color,
              marginBottom: '0.3rem',
              borderBottom: `2px solid ${s.underline}`,
              paddingBottom: '0.2rem',
              letterSpacing: '0.01em',
            }}>
              {s.title}
            </h3>
            <p style={{
              fontFamily: "'Caveat', cursive",
              fontSize: '1.05rem',
              color: 'rgba(255,255,255,0.72)',
              lineHeight: 1.55,
            }}>
              {s.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{ marginTop: '2rem', textAlign: 'center' }}>
        <a
          href="mailto:victorienalleg@gmail.com"
          style={{
            fontFamily: "'Caveat', cursive",
            fontSize: '1.15rem',
            color: '#4ade80',
            textDecoration: 'none',
            borderBottom: '1px dashed #4ade80',
            paddingBottom: 2,
          }}
        >
          victorienalleg@gmail.com
        </a>
      </div>
    </div>
  )
}
