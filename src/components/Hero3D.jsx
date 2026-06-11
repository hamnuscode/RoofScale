import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, RoundedBox, Sparkles } from '@react-three/drei'
import { useReducedMotion } from 'framer-motion'

const VERDIGRIS = '#2E6E5E'
const VERDIGRIS_DK = '#245849'
const ASPHALT = '#20211C'
const PATINA = '#DCE5DD'
const LIMEWASH = '#F2EFE6'

function Window({ position, ry = 0 }) {
  return (
    <mesh position={position} rotation={[0, ry, 0]}>
      <boxGeometry args={[0.46, 0.46, 0.04]} />
      <meshStandardMaterial color={VERDIGRIS} roughness={0.35} metalness={0.25} />
    </mesh>
  )
}

/* A detailed little house: walls, hip roof, ridge cap, door, four windows, chimney. */
function House({ position = [0, 0, 0], scale = 1, body = LIMEWASH, roof = VERDIGRIS }) {
  return (
    <group position={position} scale={scale}>
      {/* walls (base sits at y=0) */}
      <RoundedBox args={[2.4, 1.4, 2.4]} radius={0.05} smoothness={4} position={[0, 0.7, 0]}>
        <meshStandardMaterial color={body} roughness={0.7} metalness={0.05} />
      </RoundedBox>

      {/* faceted hip roof */}
      <mesh position={[0, 2.18, 0]} rotation={[0, Math.PI / 4, 0]}>
        <coneGeometry args={[2.02, 1.55, 4]} />
        <meshStandardMaterial color={roof} roughness={0.4} metalness={0.32} flatShading />
      </mesh>
      {/* ridge cap */}
      <mesh position={[0, 2.96, 0]}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshStandardMaterial color={ASPHALT} roughness={0.5} />
      </mesh>

      {/* chimney */}
      <mesh position={[0.62, 2.25, 0.62]}>
        <boxGeometry args={[0.3, 0.85, 0.3]} />
        <meshStandardMaterial color={ASPHALT} roughness={0.6} />
      </mesh>
      <mesh position={[0.62, 2.7, 0.62]}>
        <boxGeometry args={[0.4, 0.12, 0.4]} />
        <meshStandardMaterial color={VERDIGRIS_DK} roughness={0.5} />
      </mesh>

      {/* door (front) */}
      <mesh position={[-0.42, 0.45, 1.205]}>
        <boxGeometry args={[0.52, 0.9, 0.05]} />
        <meshStandardMaterial color={ASPHALT} roughness={0.5} />
      </mesh>
      {/* windows on every wall so it reads well while spinning */}
      <Window position={[0.55, 0.85, 1.205]} />
      <Window position={[0, 0.85, -1.205]} ry={Math.PI} />
      <Window position={[1.205, 0.85, 0]} ry={Math.PI / 2} />
      <Window position={[-1.205, 0.85, 0]} ry={-Math.PI / 2} />
    </group>
  )
}

function Tree({ position = [0, 0, 0], scale = 1 }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.12, 0.16, 0.9, 8]} />
        <meshStandardMaterial color={ASPHALT} roughness={0.8} />
      </mesh>
      <mesh position={[0, 1.35, 0]}>
        <coneGeometry args={[0.62, 1.3, 12]} />
        <meshStandardMaterial color={VERDIGRIS_DK} roughness={0.6} flatShading />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <coneGeometry args={[0.44, 0.95, 12]} />
        <meshStandardMaterial color={VERDIGRIS} roughness={0.6} flatShading />
      </mesh>
    </group>
  )
}

function Shingle({ position, color, speed }) {
  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1.3}>
      <RoundedBox args={[0.55, 0.12, 0.42]} radius={0.04} smoothness={3} position={position}>
        <meshStandardMaterial color={color} roughness={0.45} metalness={0.2} />
      </RoundedBox>
    </Float>
  )
}

function Town({ reduce }) {
  const ref = useRef(null)
  useFrame((_, delta) => {
    if (ref.current && !reduce) ref.current.rotation.y += delta * 0.2
  })
  return (
    <group ref={ref} position={[0, -1.55, 0]} scale={0.68}>
      {/* circular base platform (replaces the old hard shadow) */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[5.3, 5.5, 0.4, 64]} />
        <meshStandardMaterial color={PATINA} roughness={0.85} metalness={0.04} />
      </mesh>
      <mesh position={[0, -0.42, 0]}>
        <cylinderGeometry args={[5.55, 5.7, 0.18, 64]} />
        <meshStandardMaterial color={VERDIGRIS} roughness={0.7} metalness={0.1} />
      </mesh>

      <House position={[0.2, 0, 0]} scale={1} body={LIMEWASH} roof={VERDIGRIS} />
      <House position={[-3.4, 0, 0.8]} scale={0.72} body={PATINA} roof={VERDIGRIS_DK} />
      <House position={[3.2, 0, -0.7]} scale={0.62} body={LIMEWASH} roof={VERDIGRIS} />

      <Tree position={[-3.6, 0, -1.7]} scale={0.95} />
      <Tree position={[3.9, 0, 1.3]} scale={0.7} />
      <Tree position={[1.6, 0, 2.6]} scale={0.55} />
    </group>
  )
}

export default function Hero3D() {
  const reduce = useReducedMotion()
  return (
    <Canvas
      camera={{ position: [0, 1.1, 13], fov: 36 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduce ? 'demand' : 'always'}
      style={{ background: 'transparent' }}
    >
      <ambientLight intensity={0.7} />
      <hemisphereLight args={[LIMEWASH, ASPHALT, 0.55]} />
      <directionalLight position={[6, 9, 5]} intensity={1.4} />
      <directionalLight position={[-6, 3, -3]} intensity={0.4} color={VERDIGRIS} />
      <pointLight position={[-4, 4, 5]} intensity={0.5} color={VERDIGRIS} />

      <Float speed={reduce ? 0 : 1} rotationIntensity={reduce ? 0 : 0.18} floatIntensity={reduce ? 0 : 0.5}>
        <Town reduce={reduce} />
      </Float>

      <Shingle position={[-4.4, 2.4, -0.4]} color={PATINA} speed={1.5} />
      <Shingle position={[4.6, 1.8, -0.8]} color={LIMEWASH} speed={1.1} />
      <Shingle position={[4.0, -1.8, 0.4]} color={PATINA} speed={1.7} />
      <Shingle position={[-4.2, -1.2, -0.6]} color={VERDIGRIS_DK} speed={1.3} />
      <Shingle position={[0.6, 3.4, -1.0]} color={PATINA} speed={1.9} />

      <Sparkles count={46} scale={[12, 8, 6]} size={2.4} speed={reduce ? 0 : 0.3} opacity={0.5} color={VERDIGRIS} />
    </Canvas>
  )
}
