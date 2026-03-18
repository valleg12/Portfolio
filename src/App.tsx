import { Suspense, lazy } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import { RoomProvider } from './context/RoomContext'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Room from './components/Room'

const Background = lazy(() => import('./components/Background'))

export default function App() {
  return (
    <LoadingProvider>
      <RoomProvider>
        <Suspense fallback={null}>
          <Background />
        </Suspense>
        <Loading />
        <Navbar />
        <Room />
      </RoomProvider>
    </LoadingProvider>
  )
}
