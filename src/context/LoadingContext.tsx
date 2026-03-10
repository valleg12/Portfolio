import { createContext, useContext, useState, type ReactNode } from 'react'

interface LoadingContextType {
  isLoading: boolean
  setLoading: (v: boolean) => void
}

const LoadingContext = createContext<LoadingContextType>({
  isLoading: true,
  setLoading: () => {},
})

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(true)
  return (
    <LoadingContext.Provider value={{ isLoading, setLoading }}>
      {children}
    </LoadingContext.Provider>
  )
}

export const useLoading = () => useContext(LoadingContext)
