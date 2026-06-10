import { motion, useReducedMotion } from 'framer-motion'
import Reveal, { staggerParent, staggerChild } from './Reveal.jsx'

const PAINS = [
  'Homeowners call and nobody answers',
  'You gave 20 estimates and closed 4',
  'Slow season is killing your cash flow',
  'Competitors have 200+ Google reviews and you have 30',
  'No time to post on social media',
  'Great work but nobody can find you online',
]

export default function Problem() {
  const reduce = useReducedMotion()
  return (
    <section className="section problem" aria-labelledby="problem-h">
      <div className="wrap">
        <Reveal as="h2" className="section-h" id="problem-h">Sound familiar?</Reveal>
        <motion.ul
          className="pain-grid"
          role="list"
          variants={reduce ? undefined : staggerParent}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          {PAINS.map((text, i) => (
            <motion.li className="pain-card" key={i} variants={reduce ? undefined : staggerChild}>
              <span className="pain-x" aria-hidden="true">&#10005;</span>
              {text}
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
