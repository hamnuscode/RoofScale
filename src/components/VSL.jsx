import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'

/* VSL sits ABOVE the form on purpose: warming the visitor with video first
   converts much better than sending cold traffic straight to a form.
   Do not move it below the form. */
export default function VSL() {
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()

  return (
    <section className="section vsl" aria-labelledby="vsl-cap">
      <div className="wrap wrap--narrow">
        <Reveal className="video">
          <div className="video__frame">
            {playing ? (
              // Swap this iframe src for your real VSL (YouTube/Wistia/Vimeo).
              <iframe
                title="RoofScale sales video"
                src="about:blank"
                style={{ width: '100%', height: '100%', border: 0 }}
                allow="autoplay; fullscreen"
              />
            ) : (
              <button className="video__poster" type="button" onClick={() => setPlaying(true)} aria-label="Play the video">
                <p className="video__poster-text">
                  "Most roofers are losing 3 to 5 jobs a week and don't even know it. Here's why..."
                </p>
                <motion.span
                  className="video__play"
                  whileHover={reduce ? {} : { scale: 1.1 }}
                  whileTap={reduce ? {} : { scale: 0.94 }}
                  aria-hidden="true"
                >
                  <svg viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="48" fill="var(--verdigris)" />
                    <polygon points="40,32 40,68 70,50" fill="var(--limewash)" />
                  </svg>
                </motion.span>
              </button>
            )}
          </div>
          <p className="video__caption" id="vsl-cap">2 to 4 minutes. Watch this before you apply.</p>
        </Reveal>
      </div>
    </section>
  )
}
