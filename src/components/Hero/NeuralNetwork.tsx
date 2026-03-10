import { useRef, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

const NODE_COUNT = 18
const CONNECT_DIST = 2.8

function Nodes() {
  const groupRef = useRef<THREE.Group>(null)
  const { pointer } = useThree()

  const nodes = useMemo(() => {
    return Array.from({ length: NODE_COUNT }, () => ({
      position: new THREE.Vector3(
        (Math.random() - 0.5) * 7,
        (Math.random() - 0.5) * 5,
        (Math.random() - 0.5) * 3
      ),
    }))
  }, [])

  const linePositions = useMemo(() => {
    const pairs: [number, number][] = []
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].position.distanceTo(nodes[j].position) < CONNECT_DIST) {
          pairs.push([i, j])
        }
      }
    }
    const arr = new Float32Array(pairs.length * 6)
    pairs.forEach(([i, j], idx) => {
      arr[idx * 6]     = nodes[i].position.x
      arr[idx * 6 + 1] = nodes[i].position.y
      arr[idx * 6 + 2] = nodes[i].position.z
      arr[idx * 6 + 3] = nodes[j].position.x
      arr[idx * 6 + 4] = nodes[j].position.y
      arr[idx * 6 + 5] = nodes[j].position.z
    })
    return arr
  }, [nodes])

  const lineGeo = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3))
    return geo
  }, [linePositions])

  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = pointer.x * 0.3 + Math.sin(t * 0.1) * 0.05
    groupRef.current.rotation.x = -pointer.y * 0.15
  })

  return (
    <group ref={groupRef}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial color="#6366f1" transparent opacity={0.3} />
      </lineSegments>
      {nodes.map((node, i) => (
        <mesh key={i} position={node.position}>
          <sphereGeometry args={[0.09, 12, 12]} />
          <meshStandardMaterial
            color={i % 3 === 0 ? '#22d3ee' : '#6366f1'}
            emissive={i % 3 === 0 ? '#22d3ee' : '#6366f1'}
            emissiveIntensity={1.8}
            roughness={0.2}
            metalness={0.8}
          />
        </mesh>
      ))}
    </group>
  )
}

export default function NeuralNetwork() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 55 }}
      gl={{ alpha: true, antialias: true }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.3} />
      <pointLight position={[5, 5, 5]} intensity={1} color="#6366f1" />
      <pointLight position={[-5, -3, -2]} intensity={0.5} color="#22d3ee" />
      <Nodes />
      <EffectComposer>
        <Bloom luminanceThreshold={0.1} intensity={0.8} levels={6} />
      </EffectComposer>
    </Canvas>
  )
}
