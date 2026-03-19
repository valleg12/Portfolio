import { LoadingProvider } from './context/LoadingContext'
import { RoomProvider } from './context/RoomContext'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Room from './components/Room'

export default function App() {
  return (
    <LoadingProvider>
      <RoomProvider>
        <Loading />
        <Navbar />
        <Room />
      </RoomProvider>
    </LoadingProvider>
  )
}
