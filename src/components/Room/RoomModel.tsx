import { useGLTF } from '@react-three/drei'

const BASE = import.meta.env.BASE_URL

export default function RoomModel() {
  const { scene } = useGLTF(`${BASE}desk.glb`)
  return <primitive object={scene} scale={5} />
}

useGLTF.preload(`${import.meta.env.BASE_URL}desk.glb`)
