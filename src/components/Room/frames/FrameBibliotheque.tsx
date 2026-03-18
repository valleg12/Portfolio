import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import SpotlightCard from './SpotlightCard'

const BOOKS = [
  {
    emoji: '🧠',
    color: '#f59e0b',
    titleKey: 'about.msc',
    placeKey: 'about.mscLocation',
    dates: '2024 – 2026',
    details: ['AI Applied to Business', 'LLM & Agents', 'Data Strategy', 'Eugenia School Paris'],
  },
  {
    emoji: '⚽',
    color: '#3b82f6',
    titleKey: 'about.master',
    placeKey: 'about.masterLocation',
    dates: '2021 – 2023',
    details: ['Sport Business', 'Marketing & Events', 'Management', 'AMOS Lille'],
  },
  {
    emoji: '📜',
    color: '#22c55e',
    titleKey: '',
    placeKey: '',
    dates: '2023 – present',
    details: ['DeepLearning.AI', 'Coursera', 'OpenAI', 'Google'],
    staticTitle: 'Certifications & Continuous Learning',
    staticPlace: 'Online · Ongoing',
  },
]

export default function FrameBibliotheque() {
  const { t } = useTranslation()
  const [open, setOpen] = useState<number | null>(0)

  return (
    <div style={{ width: '100%', maxWidth: 640 }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <p style={{ color: '#f97316', fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
          📚 Background · Formation
        </p>
        <h2 style={{ color: 'white', fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700 }}>Education</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {BOOKS.map((book, i) => {
          const title = book.titleKey ? t(book.titleKey) : (book as any).staticTitle
          const place = book.placeKey ? t(book.placeKey) : (book as any).staticPlace
          return (
            <SpotlightCard
              key={i}
              color={book.color}
              style={{
                background: 'rgba(10,8,5,0.75)',
                border: `1px solid ${book.color}30`,
                borderRadius: 14,
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                cursor: 'pointer',
                overflow: 'hidden',
              }}
            >
              {/* Header row — always visible */}
              <div
                onClick={() => setOpen(open === i ? null : i)}
                style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.25rem' }}
              >
                <div style={{ width: 4, alignSelf: 'stretch', borderRadius: 2, background: book.color, flexShrink: 0 }} />
                <span style={{ fontSize: '1.5rem', lineHeight: 1 }}>{book.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#f5f0e8', fontWeight: 600, fontSize: '0.9rem', fontFamily: 'var(--font-display)' }}>
                    {title}
                  </p>
                  <p style={{ color: '#9d8f7a', fontSize: '0.75rem', fontFamily: 'var(--font-body)', marginTop: 2 }}>
                    {book.placeKey ? place : `${place} · ${book.dates}`}
                  </p>
                </div>
                <span style={{ color: book.color, fontSize: '0.85rem', flexShrink: 0, transition: 'transform 0.3s', display: 'block', transform: open === i ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
              </div>

              {/* Expanded details */}
              {open === i && (
                <div style={{ padding: '0 1.25rem 1.1rem 3.5rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {book.details.map(d => (
                    <span key={d} style={{ fontSize: '0.72rem', padding: '2px 10px', borderRadius: 20, border: `1px solid ${book.color}35`, color: book.color, fontFamily: 'var(--font-body)' }}>
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </SpotlightCard>
          )
        })}
      </div>
    </div>
  )
}
