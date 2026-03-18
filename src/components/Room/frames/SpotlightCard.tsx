import { useState, useRef, MouseEvent, ReactNode } from 'react'

interface SpotlightCardProps {
  children: ReactNode
  color?: string  // glow color hex, default '#ffffff'
  className?: string
  style?: React.CSSProperties
}

export default function SpotlightCard({ children, color = '#ffffff', className = '', style }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  // Convert hex to rgba for glow
  const r = parseInt(color.slice(1, 3), 16)
  const g = parseInt(color.slice(3, 5), 16)
  const b = parseInt(color.slice(5, 7), 16)

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {/* Spotlight glow */}
      <div
        style={{
          pointerEvents: 'none',
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.3s',
          background: `radial-gradient(280px circle at ${pos.x}px ${pos.y}px, rgba(${r},${g},${b},0.12), transparent 70%)`,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, height: '100%' }}>
        {children}
      </div>
    </div>
  )
}
