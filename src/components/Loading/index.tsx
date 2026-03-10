import { useEffect, useState } from 'react'
import { useLoading } from '../../context/LoadingContext'

export default function Loading() {
  const { isLoading, setLoading } = useLoading()
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setFadeOut(true), 1500)
    const t2 = setTimeout(() => setLoading(false), 2000)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [setLoading])

  if (!isLoading) return null

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg transition-opacity duration-500"
      style={{ opacity: fadeOut ? 0 : 1 }}
    >
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <div className="absolute inset-0 rounded-full border-2 border-t-primary border-r-accent animate-spin" />
        </div>
        <span className="font-display text-muted text-sm tracking-widest uppercase">
          Loading
        </span>
      </div>
    </div>
  )
}
