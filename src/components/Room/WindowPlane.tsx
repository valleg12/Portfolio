import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

const BASE = import.meta.env.BASE_URL

interface Props {
  /** World position of window background plane [x, y, z] */
  position?: [number, number, number]
  /** World scale [w, h, 1] */
  scale?: [number, number, number]
}

export default function WindowPlane({
  position = [-0.3, 0.4, -3.9],
  scale   = [3.8, 3.0, 1],
}: Props) {
  const texture = useTexture(`${BASE}ROOM.png`)
  texture.colorSpace = THREE.SRGBColorSpace

  // Crop the texture to show only the Bernabéu window area from ROOM.png
  // ROOM.png: 2806×1536px. Window area approx: left=630, top=55, width=940, height=1350
  // UV: left/width = 630/2806 ≈ 0.225, top = 1 - (55+1350)/1536 ≈ 0.085
  texture.repeat.set(940 / 2806, 1350 / 1536)
  texture.offset.set(630 / 2806, 1 - (55 + 1350) / 1536)
  texture.wrapS = THREE.ClampToEdgeWrapping
  texture.wrapT = THREE.ClampToEdgeWrapping

  return (
    <group>
      {/* Bernabéu view */}
      <mesh position={position} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial map={texture} toneMapped={false} />
      </mesh>

      {/* Glass pane slightly in front */}
      <mesh position={[position[0], position[1], position[2] + 0.08]} scale={scale}>
        <planeGeometry args={[1, 1]} />
        <meshPhysicalMaterial
          roughness={0}
          metalness={0.15}
          transparent
          opacity={0.12}
          color="#aaddff"
        />
      </mesh>
    </group>
  )
}
