interface BackButtonProps {
  onBack: () => void
  visible?: boolean
}

export default function BackButton({ onBack, visible = true }: BackButtonProps) {
  return (
    <button
      onClick={onBack}
      aria-label="Go back to room"
      style={{
        position: 'fixed',
        top: 20,
        left: 20,
        zIndex: 200,
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.8)',
        pointerEvents: visible ? 'auto' : 'none',
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.15)',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        transition: 'border-color 0.2s, background 0.2s',
        lineHeight: 1,
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.4)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.7)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.15)'
        ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(0,0,0,0.5)'
      }}
    >
      ←
    </button>
  )
}
