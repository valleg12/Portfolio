// src/context/RoomContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react'

export type FrameId = 'home' | 'buste' | 'iMac' | 'bernabeu' | 'neon' | 'bibliotheque' | 'lab' | 'hobbies'

interface RoomContextValue {
  activeFrame: FrameId
  goTo: (frame: FrameId) => void
  goHome: () => void
}

const RoomContext = createContext<RoomContextValue | null>(null)

export function RoomProvider({ children }: { children: ReactNode }) {
  const [activeFrame, setActiveFrame] = useState<FrameId>('home')
  const goTo = (frame: FrameId) => setActiveFrame(frame)
  const goHome = () => setActiveFrame('home')
  return (
    <RoomContext.Provider value={{ activeFrame, goTo, goHome }}>
      {children}
    </RoomContext.Provider>
  )
}

export function useRoom() {
  const ctx = useContext(RoomContext)
  if (!ctx) throw new Error('useRoom must be used inside RoomProvider')
  return ctx
}
