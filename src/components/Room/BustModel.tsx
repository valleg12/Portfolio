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
  // Desk surface ≈ Y -0.85 (world). Bust half-height at scale 0.5 = 0.475.
  // Center Y = -0.85 + 0.475 = -0.375. X=1.8 puts bust between iMac and shelf.
  position = [1.8, -0.35, -0.8],
  scale    = 0.5,
  rotation = [0,    0.4,  0],   // slight Y rotation to face viewer
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
