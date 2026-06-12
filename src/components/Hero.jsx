import { motion, useReducedMotion } from 'framer-motion'
import CTAButton from './CTAButton.jsx'

export default function Hero() {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.08 } },
  }
  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <header className="hero" id="top">
      <svg className="hero__pitch" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <motion.polyline
          points="-50,540 460,260 720,150 980,260 1490,540"
          fill="none"
          stroke="var(--verdigris)"
          strokeWidth="2"
          strokeOpacity="0.14"
          initial={reduce ? false : { pathLength: 0 }}
          animate={reduce ? {} : { pathLength: 1 }}
          transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        />
      </svg>

      <motion.div className="hero__inner wrap" variants={container} initial="hidden" animate="show">
        <motion.p className="eyebrow" variants={item}>
          For Roofing Companies Doing 4+ Jobs/Month
        </motion.p>
        <motion.h1 className="hero__headline" variants={item}>
          Increase Your Roofing Revenue By Up To 30% In 90 Days
        </motion.h1>
        <motion.p className="hero__sub" variants={item}>
          We build your full growth setup. Website, funnels, SEO, content, automation, and AI tools.
          You close more jobs, spend less, and stop missing leads.
        </motion.p>
        <motion.div className="hero__actions" variants={item}>
          <CTAButton>See If Your Business Qualifies</CTAButton>
        </motion.div>
        <motion.p className="hero__trust" variants={item}>
          Built for roofing crews. No agency jargon, no wasted retainer.
        </motion.p>
      </motion.div>
    </header>
  )
}
