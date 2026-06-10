import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'

const VERDIGRIS = '#2E6E5E'
const ASPHALT = '#20211C'
const PATINA = '#DCE5DD'
const LIMEWASH = '#F2EFE6'

function Slope({ side, color }) {
  // side: -1 left, +1 right. Two panels meet at a ridge to form a gable.
  return (
    <RoundedBox
      args={[2.5, 0.22, 1.7]}
      radius={0.06}
      smoothness={4}
      position={[side * 0.86, -0.18, 0]}
      rotation={[0, 0, side * -0.52]}
    >
      <meshStandardMaterial color={color} roughness={0.55} metalness={0.12} />
    </RoundedBox>
  )
}

function Shingle({ position, color, speed }) {
  return (
    <Float speed={speed} rotationIntensity={0.8} floatIntensity={1.1}>
      <RoundedBox args={[0.55, 0.12, 0.42]} radius={0.04} smoothness={3} position={position}>
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.15} />
      </RoundedBox>
    </Float>
  )
}

function RoofScene({ reduce }) {
  const group = useRef(null)

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    if (reduce) {
      g.rotation.set(-0.12, -0.5, 0)
      return
    }
    // gentle idle spin + parallax toward pointer
    const targetY = state.pointer.x * 0.5 - 0.2
    const targetX = -state.pointer.y * 0.32 - 0.1
    g.rotation.y += (targetY - g.rotation.y) * Math.min(1, delta * 2.5)
    g.rotation.x += (targetX - g.rotation.x) * Math.min(1, delta * 2.5)
    g.rotation.y += delta * 0.12
  })

  return (
    <group ref={group} scale={1.05}>
      {/* gable roof */}
      <Slope side={-1} color={VERDIGRIS} />
      <Slope side={1} color={VERDIGRIS} />
      {/* ridge beam */}
      <RoundedBox args={[0.18, 0.18, 1.8]} radius={0.05} smoothness={3} position={[0, 1.0, 0]}>
        <meshStandardMaterial color={ASPHALT} roughness={0.6} />
      </RoundedBox>
      {/* drifting shingles */}
      <Shingle position={[-2.3, 1.5, 0.4]} color={PATINA} speed={1.5} />
      <Shingle position={[2.4, 0.9, -0.6]} color={LIMEWASH} speed={1.1} />
      <Shingle position={[1.9, -1.4, 0.7]} color={PATINA} speed={1.7} />
      <Shingle position={[-2.0, -1.0, -0.3]} color={VERDIGRIS} speed={1.3} />
      <Shingle position={[0.2, 2.1, -0.8]} color={PATINA} speed={1.9} />
    </group>
  )
}

export default function Hero3D() {
  const reduce = useReducedMotion()
  return (
    <Canvas
      camera={{ position: [0, 0.3, 7], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduce ? 'demand' : 'always'}
      eventSource={typeof document !== 'undefined' ? document.documentElement : undefined}
      eventPrefix="client"
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.75} />
      <directionalLight position={[5, 8, 5]} intensity={1.25} />
      <pointLight position={[-5, 2, 3]} intensity={0.6} color={VERDIGRIS} />
      <RoofScene reduce={reduce} />
    </Canvas>
  )
}
