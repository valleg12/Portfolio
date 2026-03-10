import { useState, useRef, useCallback, ReactNode } from 'react'

interface FlipCardProps {
  front: ReactNode
  back: ReactNode
  className?: string
}

export default function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2)
    const dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2)
    setTilt({ x: -dy * 7, y: dx * 7 })
  }, [flipped])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  const transform = flipped
    ? 'rotateY(180deg)'
    : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`

  return (
    <div
      style={{ perspective: '1200px' }}
      className={`cursor-pointer select-none ${className}`}
      onClick={() => setFlipped((f) => !f)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={ref}
    >
      <div
        style={{
          transformStyle: 'preserve-3d',
          transform,
          transition: flipped
            ? 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
            : 'transform 0.15s ease-out',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        {/* Front face */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            position: 'absolute',
            inset: 0,
          }}
        >
          {front}
        </div>
        {/* Back face */}
        <div
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            position: 'absolute',
            inset: 0,
          }}
        >
          {back}
        </div>
      </div>
    </div>
  )
}
