import { useSearchParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Footer from '../components/Footer.jsx'

export default function ThankYou() {
  const [params] = useSearchParams()
  const reduce = useReducedMotion()
  const [playing, setPlaying] = useState(false)
  const unqualified = params.get('q') === '0'

  const headline = unqualified
    ? "Thanks, We've Got Your Application"
    : "You're Almost Booked. Watch This Before Your Call."
  const note = unqualified
    ? 'Watch this while our team reviews your application.'
    : '60 to 90 seconds. Watch before your call.'

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
  }
  const item = {
    hidden: reduce ? { opacity: 1 } : { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
  }

  return (
    <>
      <main className="ty">
        <motion.div className="wrap wrap--narrow" variants={container} initial="hidden" animate="show">
          <motion.h1 className="ty__headline" variants={item}>{headline}</motion.h1>

          {/* VSL #2: a short 60 to 90 second video here reduces no-shows after booking. */}
          <motion.p className="ty__note" variants={item}>{note}</motion.p>
          <motion.div className="video" variants={item}>
            <div className="video__frame">
              {playing ? (
                <iframe title="RoofScale pre-call video" src="about:blank"
                  style={{ width: '100%', height: '100%', border: 0 }} allow="autoplay; fullscreen" />
              ) : (
                <button className="video__poster" type="button" onClick={() => setPlaying(true)} aria-label="Play the video">
                  <p className="video__poster-text">Here's exactly what we'll cover on your audit call.</p>
                  <motion.span className="video__play" aria-hidden="true"
                    whileHover={reduce ? {} : { scale: 1.1 }} whileTap={reduce ? {} : { scale: 0.94 }}>
                    <svg viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="48" fill="var(--verdigris)" />
                      <polygon points="40,32 40,68 70,50" fill="var(--limewash)" />
                    </svg>
                  </motion.span>
                </button>
              )}
            </div>
          </motion.div>

          <motion.div className="calendar" variants={item}>
            {/* Calendly/Cal.com embed here */}
            <p>Pick a time that works for you. (Calendar embed loads here.)</p>
          </motion.div>

          <motion.h2 className="section-h" style={{ fontSize: 'clamp(1.5rem,4vw,2.2rem)', marginTop: '3.5rem', marginBottom: 0 }} variants={item}>
            What happens next
          </motion.h2>
          <motion.ol className="next" variants={item}>
            <li>Choose your time slot above and you'll get an instant confirmation by text and email.</li>
            <li>We review your business beforehand so the call is all strategy, no fluff.</li>
            <li>On the call we map your custom 90 day growth plan and show you the numbers.</li>
          </motion.ol>

          <motion.div variants={item}>
            <Link to="/" className="ty__back">&larr; Back to home</Link>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </>
  )
}
