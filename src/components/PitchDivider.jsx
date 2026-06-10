import { motion, useReducedMotion } from 'framer-motion'

/* The recurring roof-pitch (gable) line used between major sections. */
export default function PitchDivider() {
  const reduce = useReducedMotion()
  return (
    <div className="pitch-divider" aria-hidden="true">
      <svg viewBox="0 0 1440 40" preserveAspectRatio="none" focusable="false">
        <motion.polyline
          points="0,38 660,8 720,2 780,8 1440,38"
          fill="none"
          stroke="var(--verdigris)"
          strokeWidth="2"
          initial={reduce ? false : { pathLength: 0, opacity: 0 }}
          whileInView={reduce ? {} : { pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
    </div>
  )
}
