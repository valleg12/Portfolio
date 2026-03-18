import { useEffect, useRef } from 'react'

const BASE = import.meta.env.BASE_URL

const LAYERS = [
  { id: 'far',  strength: 0.008, scale: 1.06 },
  { id: 'mid',  strength: 0.018, scale: 1.08 },
  { id: 'near', strength: 0.030, scale: 1.10 },
]

export default function RoomBackground() {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      LAYERS.forEach((layer, i) => {
        const el = refs.current[i]
        if (!el) return
        el.style.transform = `translate(${-dx * layer.strength}px, ${-dy * layer.strength}px) scale(${layer.scale})`
      })
    }
    window.addEventListener('mousemove', handleMouseMove)
    // Set initial scale
    LAYERS.forEach((layer, i) => {
      const el = refs.current[i]
      if (el) el.style.transform = `translate(0px, 0px) scale(${layer.scale})`
    })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      {LAYERS.map((layer, i) => (
        <div
          key={layer.id}
          ref={el => { refs.current[i] = el }}
          style={{
            position: 'absolute',
            inset: '-5%',
            backgroundImage: `url(${BASE}ROOM.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate(0px, 0px) scale(${layer.scale})`,
            transition: 'transform 0.12s ease-out',
            willChange: 'transform',
          }}
        />
      ))}
    </div>
  )
}
