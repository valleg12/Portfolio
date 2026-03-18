import { useState } from 'react'

const BOOKS = [
  {
    title: 'MSc AI Applied to Business',
    school: 'Eugenia School, Paris',
    years: '2024 – 2026',
    color: '#f59e0b',
    emoji: '🧠',
    desc: 'Machine learning, LLM engineering, AI strategy, data science applied to business contexts. Hands-on projects with real companies.',
  },
  {
    title: 'Master Management Organisations Sportives',
    school: 'AMOS Sport Business School, Lille',
    years: '2021 – 2023',
    color: '#60a5fa',
    emoji: '⚽',
    desc: 'Sports marketing, event management, sports analytics, business development in sports industry.',
  },
  {
    title: 'Certifications & Continuous Learning',
    school: 'Online · Ongoing',
    years: '2023 – present',
    color: '#34d399',
    emoji: '📜',
    desc: 'DeepLearning.AI, LangChain, Azure AI Fundamentals, Prompt Engineering, Power BI — continuous self-improvement.',
  },
]

export default function FrameBibliotheque() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ maxWidth: 680, width: '100%' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <p style={{ color: '#f59e0b', fontFamily: 'var(--font-body)', fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
          📚 Background · Formation
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Education</h2>
        <div style={{ height: 1, width: 80, background: 'linear-gradient(90deg, transparent, #f59e0b, transparent)', margin: '0 auto' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {BOOKS.map((book, i) => (
          <div key={book.title} onClick={() => setOpen(open === i ? null : i)}
            style={{
              cursor: 'pointer',
              borderRadius: 14,
              border: `1px solid ${open === i ? book.color + '40' : 'rgba(255,255,255,0.07)'}`,
              background: open === i ? `rgba(15,10,5,0.7)` : 'rgba(255,255,255,0.02)',
              backdropFilter: 'blur(12px)',
              overflow: 'hidden',
              transition: 'all 0.3s ease',
              boxShadow: open === i ? `0 0 30px ${book.color}15` : 'none',
            }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.25rem', borderLeft: `3px solid ${book.color}` }}>
              <span style={{ fontSize: 24, flexShrink: 0 }}>{book.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: '0.9rem', marginBottom: 2 }}>{book.title}</p>
                <p style={{ color: '#9d8f7a', fontFamily: 'var(--font-body)', fontSize: '0.74rem' }}>{book.school} · {book.years}</p>
              </div>
              <span style={{ color: book.color, fontSize: 16, transition: 'transform 0.3s', transform: open === i ? 'rotate(90deg)' : 'none', flexShrink: 0, opacity: 0.8 }}>›</span>
            </div>
            {open === i && (
              <div style={{ padding: '0 1.25rem 1rem 4.25rem' }}>
                <p style={{ color: '#b0a090', fontFamily: 'var(--font-body)', fontSize: '0.84rem', lineHeight: 1.7 }}>{book.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
