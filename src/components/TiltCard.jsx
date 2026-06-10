import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/* Cursor-tracked 3D tilt with a spotlight glow that follows the pointer.
   The parent container must set `perspective`. With prefers-reduced-motion
   the tilt + glow are disabled but the element still animates via any
   framer variants passed through. */
export default function TiltCard({ children, className = '', as = 'div', max = 9, lift = 6, ...rest }) {
  const reduce = useReducedMotion()
  const ref = useRef(null)

  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotateX = useSpring(useTransform(my, [0, 1], [max, -max]), { stiffness: 220, damping: 18 })
  const rotateY = useSpring(useTransform(mx, [0, 1], [-max, max]), { stiffness: 220, damping: 18 })
  const gx = useTransform(mx, (v) => `${v * 100}%`)
  const gy = useTransform(my, (v) => `${v * 100}%`)

  const MotionTag = motion[as] || motion.div

  const handleMove = (e) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const handleLeave = () => { mx.set(0.5); my.set(0.5) }

  if (reduce) {
    return <MotionTag className={className} {...rest}>{children}</MotionTag>
  }

  return (
    <MotionTag
      ref={ref}
      className={`${className} tilt`.trim()}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      whileHover={{ y: -lift }}
      style={{ rotateX, rotateY, '--gx': gx, '--gy': gy, transformStyle: 'preserve-3d' }}
      {...rest}
    >
      {children}
      <span className="tilt-glow" aria-hidden="true" />
    </MotionTag>
  )
}
