import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Sparkles } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'

const VERDIGRIS = '#2E6E5E'
const VERDIGRIS_DK = '#245849'
const ASPHALT = '#20211C'
const PATINA = '#DCE5DD'
const LIMEWASH = '#F2EFE6'

/* One pitched gable slope. Two of them meet at a ridge to form a roof. */
function Slope({ side, color }) {
  return (
    <RoundedBox
      args={[2.6, 0.22, 1.8]}
      radius={0.06}
      smoothness={4}
      position={[side * 0.9, -0.12, 0]}
      rotation={[0, 0, side * -0.52]}
    >
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.18} />
    </RoundedBox>
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

function Roof({ reduce }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current && !reduce) ref.current.rotation.y += delta * 0.25
  })
  return (
    <group ref={ref} rotation={[0, -0.4, 0]}>
      <Slope side={-1} color={VERDIGRIS} />
      <Slope side={1} color={VERDIGRIS} />
      {/* ridge beam along the peak */}
      <RoundedBox args={[0.2, 0.2, 1.95]} radius={0.05} smoothness={3} position={[0, 1.02, 0]}>
        <meshStandardMaterial color={ASPHALT} roughness={0.6} />
      </RoundedBox>
    </group>
  )
}

function Scene({ reduce }) {
  return (
    <>
      <Float speed={reduce ? 0 : 1.1} rotationIntensity={reduce ? 0 : 0.25} floatIntensity={reduce ? 0 : 0.7}>
        <Roof reduce={reduce} />
      </Float>

      <Shingle position={[-2.6, 1.6, 0.4]} color={PATINA} speed={1.5} />
      <Shingle position={[2.7, 1.0, -0.5]} color={LIMEWASH} speed={1.1} />
      <Shingle position={[2.3, -1.4, 0.7]} color={PATINA} speed={1.7} />
      <Shingle position={[-2.4, -0.9, -0.3]} color={VERDIGRIS_DK} speed={1.3} />
      <Shingle position={[0.3, 2.5, -0.7]} color={PATINA} speed={1.9} />

      <Sparkles count={42} scale={[9, 6, 5]} size={2.4} speed={reduce ? 0 : 0.3} opacity={0.5} color={VERDIGRIS} />
    </>
  )
}

export default function Hero3D() {
  const reduce = useReducedMotion()
  return (
    <Canvas
      camera={{ position: [0, 0.3, 7.6], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduce ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={[LIMEWASH, ASPHALT, 0.55]} />
      <directionalLight position={[5, 8, 5]} intensity={1.45} />
      <directionalLight position={[-6, 2, -3]} intensity={0.4} color={VERDIGRIS} />
      <pointLight position={[-4, 3, 4]} intensity={0.5} color={VERDIGRIS} />
      <Scene reduce={reduce} />
    </Canvas>
  )
}
