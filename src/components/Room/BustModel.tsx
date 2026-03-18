import { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import type { Group } from 'three'

const BASE = import.meta.env.BASE_URL

interface Props {
  position?: [number, number, number]
  scale?:    number
  rotation?: [number, number, number]
}

export default function BustModel({
  position = [1.8,  1.3, -0.5],
  scale    = 0.5,
  rotation = [0,    0.3, 0],   // slight Y rotation to face viewer
}: Props) {
  const { scene } = useGLTF(`${BASE}bust.glb`)
  const ref = useRef<Group>(null)

  // clone so it can coexist if desk.glb ever shares the same scene object
  const clonedScene = useRef(scene.clone())

  return (
    <group ref={ref} position={position} scale={scale} rotation={rotation}>
      <primitive object={clonedScene.current} />
    </group>
  )
}

useGLTF.preload(`${import.meta.env.BASE_URL}bust.glb`)
