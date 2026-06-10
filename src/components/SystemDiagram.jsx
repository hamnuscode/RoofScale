import { motion, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'

const STAGES = [
  'Website + Funnel',
  'SEO + Google Maps',
  'Content + Socials',
  'AI Receptionist',
  'Review Automation',
  'Hiring Support',
]

export default function SystemDiagram() {
  const reduce = useReducedMotion()

  const list = {
    hidden: {},
    show: { transition: { staggerChildren: 0.13, delayChildren: 0.35 } },
  }
  const node = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 30, scale: 0.7 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 260, damping: 18 } },
  }

  return (
    <section className="section system" id="system" aria-labelledby="system-h">
      <div className="wrap">
        <Reveal as="h2" className="section-h" id="system-h">
          We Build Your Entire Growth Engine, Done For You, In 30 Days
        </Reveal>

        <motion.ol
          className="roofline"
          role="list"
          aria-label="Six-stage growth system, ascending in order"
          variants={reduce ? undefined : list}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, amount: 0.4 }}
        >
          <svg className="roofline__slope" viewBox="0 0 1200 360" preserveAspectRatio="none" aria-hidden="true">
            <motion.polyline
              points="40,330 250,270 460,210 690,150 910,90 1160,30"
              fill="none"
              stroke="var(--verdigris)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              initial={reduce ? false : { pathLength: 0 }}
              whileInView={reduce ? {} : { pathLength: 1 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          {STAGES.map((label, i) => (
            <motion.li className="stage" key={i} style={{ '--i': i }} variants={reduce ? undefined : node}>
              <span className="stage__node">{String(i + 1).padStart(2, '0')}</span>
              <span className="stage__label">{label}</span>
            </motion.li>
          ))}
        </motion.ol>
      </div>
    </section>
  )
}
