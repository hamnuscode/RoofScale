import { motion, useReducedMotion } from 'framer-motion'

export default function Hero() {
  const reduce = useReducedMotion()

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
  }
  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 26 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
  }

  const scrollToForm = (e) => {
    e.preventDefault()
    const el = document.querySelector('#apply')
    if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <header className="hero" id="top">
      <svg className="hero__pitch" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <motion.polyline
          points="-50,520 520,180 720,90 920,180 1490,520"
          fill="none"
          stroke="var(--verdigris)"
          strokeWidth="2"
          strokeOpacity="0.18"
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
          We Help Roofing Companies Double Their Revenue In 90 Days Without Hiring More Staff
        </motion.h1>
        <motion.p className="hero__sub" variants={item}>
          We build your entire growth system: website, funnels, SEO, content, automation, and AI tools.
          You close more jobs, spend less, and never miss a lead again.
        </motion.p>
        <motion.div variants={item}>
          <motion.a
            href="#apply"
            className="btn btn--cta"
            onClick={scrollToForm}
            whileHover={reduce ? {} : { y: -2, x: -2, boxShadow: '6px 6px 0 var(--asphalt)' }}
            whileTap={reduce ? {} : { y: 2, x: 2, boxShadow: '2px 2px 0 var(--asphalt)' }}
          >
            <span className="btn__arrow">&rarr;</span> See If Your Business Qualifies
          </motion.a>
        </motion.div>
        <motion.p className="hero__trust" variants={item}>
          Built for roofing crews. No agency jargon, no wasted retainer.
        </motion.p>
      </motion.div>
    </header>
  )
}
