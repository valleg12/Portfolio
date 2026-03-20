import { useState } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import { RoomProvider } from './context/RoomContext'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import Room from './components/Room'
import DoorScene from './components/DoorScene'

export type Scene = 'door' | 'room'

export default function App() {
  const [scene, setScene] = useState<Scene>('door')

  return (
    <LoadingProvider>
      <RoomProvider>
        <Loading />
        {scene === 'room' && <Navbar />}
        {scene === 'door'
          ? <DoorScene onEnter={() => setScene('room')} />
          : <Room />
        }
      </RoomProvider>
    </LoadingProvider>
  )
}
