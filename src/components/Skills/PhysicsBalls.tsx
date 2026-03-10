import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, Text } from '@react-three/drei'
import {
  Physics,
  RigidBody,
  BallCollider,
  CylinderCollider,
  RapierRigidBody,
} from '@react-three/rapier'
import { EffectComposer, N8AO } from '@react-three/postprocessing'
import * as THREE from 'three'

const TOOLS = [
  { name: 'Python', color: '#3b82f6' },
  { name: 'SQL', color: '#f59e0b' },
  { name: 'GPT API', color: '#10b981' },
  { name: 'LangChain', color: '#8b5cf6' },
  { name: 'Power BI', color: '#f97316' },
  { name: 'Tableau', color: '#0ea5e9' },
  { name: 'Sklearn', color: '#ef4444' },
  { name: 'Pandas', color: '#6366f1' },
  { name: 'Azure', color: '#22d3ee' },
  { name: 'Notion', color: '#e2e8f0' },
  { name: 'Figma', color: '#a855f7' },
  { name: 'Git', color: '#f97316' },
]

const ballConfigs = TOOLS.map((tool) => ({
  ...tool,
  scale: Math.random() * 0.3 + 0.65,
}))

function Ball({
  name,
  color,
  scale,
  isActive,
}: {
  name: string
  color: string
  scale: number
  isActive: boolean
}) {
  const api = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame((_state, delta) => {
    if (!isActive || !api.current) return
    const d = Math.min(0.1, delta)
    const t = api.current.translation()
    api.current.applyImpulse(
      vec.set(t.x, t.y, t.z).normalize().multiply(
        new THREE.Vector3(-40 * d * scale, -100 * d * scale, -40 * d * scale)
      ),
      true
    )
  })

  return (
    <RigidBody
      linearDamping={0.75}
      angularDamping={0.2}
      friction={0.2}
      position={[
        (Math.random() - 0.5) * 15,
        (Math.random() - 0.5) * 15 - 10,
        (Math.random() - 0.5) * 5,
      ]}
      ref={api}
      colliders={false}
    >
      <BallCollider args={[scale]} />
      <CylinderCollider
        rotation={[Math.PI / 2, 0, 0]}
        position={[0, 0, scale * 1.1]}
        args={[scale * 0.15, scale * 0.3]}
      />
      <mesh castShadow scale={scale}>
        <sphereGeometry args={[1, 28, 28]} />
        <meshPhysicalMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.15}
          metalness={0.4}
          roughness={0.7}
          clearcoat={0.3}
        />
      </mesh>
      <Text
        position={[0, 0, scale + 0.01]}
        fontSize={scale * 0.28}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {name}
      </Text>
    </RigidBody>
  )
}

function Pointer({ isActive }: { isActive: boolean }) {
  const ref = useRef<RapierRigidBody>(null)
  const vec = useMemo(() => new THREE.Vector3(), [])

  useFrame(({ pointer, viewport }) => {
    if (!isActive || !ref.current) return
    ref.current.setNextKinematicTranslation(
      vec.lerp(
        new THREE.Vector3(
          (pointer.x * viewport.width) / 2,
          (pointer.y * viewport.height) / 2,
          0
        ),
        0.2
      )
    )
  })

  return (
    <RigidBody position={[0, 0, -50]} type="kinematicPosition" colliders={false} ref={ref}>
      <BallCollider args={[2]} />
    </RigidBody>
  )
}

export default function PhysicsBalls({ isActive }: { isActive: boolean }) {
  return (
    <Canvas
      shadows
      gl={{ alpha: true, antialias: false, stencil: false, depth: false }}
      camera={{ position: [0, 0, 20], fov: 32.5, near: 1, far: 100 }}
      onCreated={(s) => { (s.gl as THREE.WebGLRenderer).toneMappingExposure = 1.5 }}
      style={{ width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.8} />
      <spotLight position={[20, 20, 25]} penumbra={1} angle={0.2} castShadow />
      <directionalLight position={[0, 5, -4]} intensity={2} />
      <Physics gravity={[0, 0, 0]}>
        <Pointer isActive={isActive} />
        {ballConfigs.map((b, i) => (
          <Ball key={i} name={b.name} color={b.color} scale={b.scale} isActive={isActive} />
        ))}
      </Physics>
      <Environment preset="city" environmentIntensity={0.3} />
      <EffectComposer enableNormalPass={false}>
        <N8AO color="#050510" aoRadius={2} intensity={1.2} />
      </EffectComposer>
    </Canvas>
  )
}
