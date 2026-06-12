import { motion, useReducedMotion } from 'framer-motion'

/* Primary conversion CTA. Always scrolls to the qualification form.
   `size="lg"` renders the big, bold variant used under the VSL. */
export default function CTAButton({ children = 'Apply For Your Free Audit', size, className = '' }) {
  const reduce = useReducedMotion()
  const scroll = (e) => {
    e.preventDefault()
    const el = document.querySelector('#apply')
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }
  return (
    <motion.a
      href="#apply"
      onClick={scroll}
      className={`btn btn--cta${size === 'lg' ? ' btn--lg' : ''} ${className}`.trim()}
      whileHover={reduce ? {} : { y: -2, x: -2, boxShadow: '6px 6px 0 var(--asphalt)' }}
      whileTap={reduce ? {} : { y: 2, x: 2, boxShadow: '2px 2px 0 var(--asphalt)' }}
    >
      <span className="btn__arrow">&rarr;</span> {children}
    </motion.a>
  )
}
