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
        top: 24,
        left: 24,
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        background: 'rgba(5,5,16,0.75)',
        border: '1px solid rgba(99,102,241,0.35)',
        color: '#e2e8f0',
        borderRadius: 8,
        padding: '8px 16px',
        cursor: 'pointer',
        fontSize: 14,
        fontFamily: 'Inter, sans-serif',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        transition: 'background 0.2s, border-color 0.2s',
      }}
      aria-label={t('room.back')}
    >
      ← {t('room.back')}
    </button>
  )
}
