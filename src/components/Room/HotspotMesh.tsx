import { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useTranslation } from 'react-i18next'
import type { ThreeEvent } from '@react-three/fiber'
import type { FrameId } from '../../context/RoomContext'

interface Props {
  frame: FrameId
  i18nKey: string
  fallbackLabel: string
  color: string
  position: [number, number, number]
  size: [number, number, number]
  onClick: (frame: FrameId) => void
}

export default function HotspotMesh({
  frame, i18nKey, fallbackLabel, color, position, size, onClick,
}: Props) {
  const [hovered, setHovered] = useState(false)
  const { t } = useTranslation()
  const labels = t('room.hotspot', { returnObjects: true }) as Record<string, string>

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto'
    return () => { document.body.style.cursor = 'auto' }
  }, [hovered])

  function handlePointerEnter(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    setHovered(true)
  }

  function handlePointerLeave(e: ThreeEvent<PointerEvent>) {
    e.stopPropagation()
    setHovered(false)
  }

  function handleClick(e: ThreeEvent<MouseEvent>) {
    e.stopPropagation()
    onClick(frame)
  }

  return (
    <mesh
      position={position}
      visible={false}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      <boxGeometry args={size} />
      <meshBasicMaterial transparent opacity={0} />

      {hovered && (
        <Html
          center
          position={[0, size[1] / 2 + 0.3, 0]}
          style={{ pointerEvents: 'none' }}
        >
          <div style={{
            background: 'rgba(0,0,0,0.88)',
            color: 'white',
            fontSize: '0.72rem',
            fontWeight: 600,
            padding: '4px 14px',
            borderRadius: 6,
            whiteSpace: 'nowrap',
            fontFamily: 'Inter, sans-serif',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            border: `1px solid ${color}55`,
            boxShadow: `0 0 12px ${color}44`,
          }}>
            {labels[i18nKey] ?? fallbackLabel}
          </div>
        </Html>
      )}
    </mesh>
  )
}
