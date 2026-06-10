import { motion, useReducedMotion } from 'framer-motion'
import Reveal, { staggerParent, staggerChild } from './Reveal.jsx'

/* Three greyed "coming soon" slots. Future testimonial format:
   before/after Google review counts ("8 to 23 reviews in 6 weeks"),
   dollar revenue increase, a 60-sec owner video, star rating + name + city.
   Specific beats vague. */
const SLOTS = [0, 1, 2]

export default function SocialProof() {
  const reduce = useReducedMotion()
  return (
    <section className="section proof" id="proof" aria-labelledby="proof-h">
      <div className="wrap">
        <Reveal as="p" className="proof__lead" id="proof-h">
          We're currently working with a small group of roofing companies in the US.
          If accepted, you'll have this system before your competitors do.
        </Reveal>
        <motion.div
          className="proof-grid"
          variants={reduce ? undefined : staggerParent}
          initial={reduce ? false : 'hidden'}
          whileInView={reduce ? undefined : 'show'}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
        >
          {SLOTS.map((i) => (
            <motion.article className="proof-card" key={i} aria-hidden="true" variants={reduce ? undefined : staggerChild}>
              <div className="proof-card__stars">&#9733;&#9733;&#9733;&#9733;&#9733;</div>
              <p className="proof-card__body">Testimonial coming soon</p>
              <p className="proof-card__meta">Owner name &middot; City, ST</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
