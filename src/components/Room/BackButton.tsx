import { useRoom } from '../../context/RoomContext'
import { useTranslation } from 'react-i18next'

export default function BackButton() {
  const { goHome } = useRoom()
  const { t } = useTranslation()

  return (
    <button
      onClick={goHome}
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(10,8,5,0.75)',
        border: '1px solid rgba(245,158,11,0.4)',
        color: '#fde68a',
        borderRadius: 8,
        padding: '8px 18px',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'var(--font-body, Inter, sans-serif)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        letterSpacing: '0.02em',
      }}
      aria-label={t('room.back')}
    >
      ← {t('room.back')}
    </button>
  )
}
