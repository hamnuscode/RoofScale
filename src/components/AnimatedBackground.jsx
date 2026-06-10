import { useReducedMotion } from 'framer-motion'

/* Slow-drifting blurred glow orbs. Sits behind a section's content.
   variant: 'dark' (glows on asphalt) | 'light' (subtle on limewash). */
export default function AnimatedBackground({ variant = 'dark' }) {
  const reduce = useReducedMotion()
  return (
    <div className={`aurora aurora--${variant}${reduce ? ' aurora--static' : ''}`} aria-hidden="true">
      <span className="aurora__blob aurora__blob--1" />
      <span className="aurora__blob aurora__blob--2" />
      <span className="aurora__blob aurora__blob--3" />
    </div>
  )
}
