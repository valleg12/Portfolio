import { useEffect, useRef } from 'react'

const BASE = import.meta.env.BASE_URL

export default function RoomBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!ref.current) return
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      const dx = (e.clientX - cx) * 0.006
      const dy = (e.clientY - cy) * 0.006
      ref.current.style.transform = `translate(${-dx}px, ${-dy}px) scale(1.015)`
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
      <div
        ref={ref}
        style={{
          position: 'absolute',
          inset: '-2%',
          backgroundImage: `url(${BASE}ROOM.png)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          transform: 'translate(0px, 0px) scale(1.015)',
          transition: 'transform 0.15s ease-out',
          willChange: 'transform',
        }}
      />
    </div>
  )
}
