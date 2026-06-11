import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Sparkles } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'

const VERDIGRIS = '#2E6E5E'
const VERDIGRIS_DK = '#245849'
const ASPHALT = '#20211C'
const PATINA = '#DCE5DD'
const LIMEWASH = '#F2EFE6'

function House({ reduce }) {
  const ref = useRef(null)
  // Self-rotating — gentle continuous spin, no cursor input.
  useFrame((_, delta) => {
    if (ref.current && !reduce) ref.current.rotation.y += delta * 0.25
  })
  return (
    <group ref={ref} rotation={[0, -0.5, 0]}>
      {/* building */}
      <RoundedBox args={[2.5, 1.35, 2.5]} radius={0.06} smoothness={4} position={[0, -1.05, 0]}>
        <meshStandardMaterial color={LIMEWASH} roughness={0.7} metalness={0.05} />
      </RoundedBox>
      {/* windows (flush, inset) */}
      <mesh position={[-0.55, -1.0, 1.255]}>
        <boxGeometry args={[0.5, 0.5, 0.02]} />
        <meshStandardMaterial color={VERDIGRIS} roughness={0.4} metalness={0.2} />
      </mesh>
      <mesh position={[0.55, -1.0, 1.255]}>
        <boxGeometry args={[0.5, 0.5, 0.02]} />
        <meshStandardMaterial color={VERDIGRIS} roughness={0.4} metalness={0.2} />
      </mesh>
      {/* faceted hip roof (4-sided pyramid) */}
      <mesh position={[0, 0.45, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.12, 1.7, 4]} />
        <meshStandardMaterial color={VERDIGRIS} roughness={0.4} metalness={0.32} flatShading />
      </mesh>
      {/* ridge cap */}
      <mesh position={[0, 1.35, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={ASPHALT} roughness={0.5} />
      </mesh>
    </group>
  )
}

function Shingle({ position, color, speed }) {
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1.3}>
      <RoundedBox args={[0.6, 0.13, 0.46]} radius={0.04} smoothness={3} position={position}>
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
      </RoundedBox>
    </Float>
  )
}

function Scene({ reduce }) {
  return (
    <>
      <Float speed={reduce ? 0 : 1.1} rotationIntensity={reduce ? 0 : 0.25} floatIntensity={reduce ? 0 : 0.6}>
        <House reduce={reduce} />
      </Float>

      {/* shingles bob in place, well clear of the house */}
      <Shingle position={[-3.3, 1.9, -0.4]} color={PATINA} speed={1.5} />
      <Shingle position={[3.4, 1.2, -0.8]} color={LIMEWASH} speed={1.1} />
      <Shingle position={[3.0, -1.6, 0.4]} color={PATINA} speed={1.7} />
      <Shingle position={[-3.1, -1.0, -0.6]} color={VERDIGRIS_DK} speed={1.3} />
      <Shingle position={[0.5, 3.0, -1.0]} color={PATINA} speed={1.9} />

      <Sparkles count={42} scale={[10, 7, 5]} size={2.4} speed={reduce ? 0 : 0.3} opacity={0.5} color={VERDIGRIS} />
    </>
  )
}

export default function Hero3D() {
  const reduce = useReducedMotion()
  return (
    <Canvas
      camera={{ position: [0, 0.6, 8.4], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduce ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.65} />
      <hemisphereLight args={[LIMEWASH, ASPHALT, 0.55]} />
      <directionalLight position={[5, 8, 5]} intensity={1.45} />
      <directionalLight position={[-6, 2, -3]} intensity={0.4} color={VERDIGRIS} />
      <pointLight position={[-4, 3, 4]} intensity={0.5} color={VERDIGRIS} />
      <Scene reduce={reduce} />
    </Canvas>
  )
}
