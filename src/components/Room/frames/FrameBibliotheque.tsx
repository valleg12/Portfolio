import { useState } from 'react'

const BOOKS = [
  {
    title: 'MSc AI Applied to Business',
    school: 'Eugenia School, Paris',
    years: '2024 – 2026',
    color: '#6366f1',
    emoji: '🧠',
    desc: 'Machine learning, LLM engineering, AI strategy, data science applied to business contexts. Hands-on projects with real companies.',
  },
  {
    title: 'Master Management Organisations Sportives',
    school: 'AMOS Sport Business School, Lille',
    years: '2021 – 2023',
    color: '#22d3ee',
    emoji: '⚽',
    desc: 'Sports marketing, event management, sports analytics, business development in sports industry.',
  },
  {
    title: 'Certifications & Continuous Learning',
    school: 'Online · Ongoing',
    years: '2023 – present',
    color: '#10b981',
    emoji: '📜',
    desc: 'DeepLearning.AI, LangChain, Azure AI Fundamentals, Prompt Engineering, Power BI — continuous self-improvement.',
  },
]

export default function FrameBibliotheque() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <div style={{ maxWidth: 680, width: '100%', padding: '1rem' }}>
      <h2 style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Education</h2>
      <div style={{ height: 2, width: 60, background: 'linear-gradient(90deg,#6366f1,#22d3ee)', marginBottom: '2rem', borderRadius: 2 }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {BOOKS.map((book, i) => (
          <div key={book.title} onClick={() => setOpen(open === i ? null : i)}
            style={{ cursor: 'pointer', borderRadius: 12, border: `1px solid ${book.color}33`, background: open === i ? `${book.color}10` : 'rgba(255,255,255,0.02)', overflow: 'hidden', transition: 'all 0.3s ease' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem', borderLeft: `4px solid ${book.color}` }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{book.emoji}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: 'white', fontFamily: 'var(--font-display, Space Grotesk, sans-serif)', fontWeight: 600, fontSize: '0.92rem', marginBottom: 2 }}>{book.title}</p>
                <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.76rem' }}>{book.school} · {book.years}</p>
              </div>
              <span style={{ color: book.color, fontSize: 18, transition: 'transform 0.3s', transform: open === i ? 'rotate(90deg)' : 'none', flexShrink: 0 }}>›</span>
            </div>
            {open === i && (
              <div style={{ padding: '0 1.25rem 1rem 4.5rem' }}>
                <p style={{ color: '#94a3b8', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: '0.84rem', lineHeight: 1.7 }}>{book.desc}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
