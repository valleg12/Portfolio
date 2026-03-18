import { useGLTF } from '@react-three/drei'

const BASE = import.meta.env.BASE_URL

export default function RoomModel() {
  const { scene } = useGLTF(`${BASE}desk.glb`)
  // Single mesh — nothing to hide. Scale=5 brings it to room-filling size.
  return <primitive object={scene} scale={5} />
}

useGLTF.preload(`${import.meta.env.BASE_URL}desk.glb`)
