import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL

interface Props {
  position?: [number, number, number]
  scale?: [number, number, number]
}

// bernabeu.png is 1508×754 — aspect ~2:1
// Use it directly as window texture, no UV cropping needed.
export default function WindowPlane({
  position = [-0.4, 0.1, -3.9],
  scale   = [4.0, 2.0, 1],
}: Props) {
  const texture = useTexture(`${BASE}bernabeu.png`)
  texture.colorSpace = THREE.SRGBColorSpace

  return (
    <group>
      {/* Bernabéu view — fills the window opening in the back wall */}
      <mesh position={position} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Glass pane — subtle reflection/refraction overlay */}
      <mesh position={[position[0], position[1], position[2] + 0.06]} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          roughness={0.05}
          metalness={0.1}
          transparent
          opacity={0.10}
          color="#b8d4ff"
        />
      </mesh>
    </group>
  )
}
