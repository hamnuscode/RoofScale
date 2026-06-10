import { motion, useReducedMotion } from 'framer-motion'
import AnimatedBackground from './AnimatedBackground.jsx'

function RoofMark() {
  return (
    <span className="nav__mark" aria-hidden="true">
      <svg width="28" height="22" viewBox="0 0 26 20" fill="none">
        <polyline points="1,18 13,3 25,18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function Footer() {
  const reduce = useReducedMotion()
  const year = new Date().getFullYear()

  const jump = (e, href) => {
    const el = document.querySelector(href)
    if (!el) return
    e.preventDefault()
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
  }

  return (
    <footer className="footer">
      <AnimatedBackground variant="dark" />
      <div className="wrap">
        <div className="footer__top">
          <div>
            <span className="footer__brand"><RoofMark /> RoofScale</span>
            <p className="footer__tag">
              The done for you growth system built only for roofing companies. More jobs, more reviews, fewer missed leads.
            </p>
            <motion.a
              href="#apply"
              className="btn btn--cta btn--sm footer__cta"
              onClick={(e) => jump(e, '#apply')}
              whileHover={reduce ? {} : { y: -2 }}
              whileTap={reduce ? {} : { y: 1 }}
            >
              Apply For Your Free Audit
            </motion.a>
          </div>

          <div className="footer__col">
            <h4>Explore</h4>
            <ul>
              <li><a href="#system" onClick={(e) => jump(e, '#system')}>The System</a></li>
              <li><a href="#roi" onClick={(e) => jump(e, '#roi')}>The Math</a></li>
              <li><a href="#proof" onClick={(e) => jump(e, '#proof')}>Results</a></li>
              <li><a href="#apply" onClick={(e) => jump(e, '#apply')}>Apply</a></li>
            </ul>
          </div>

          <div className="footer__col">
            <h4>Get In Touch</h4>
            <ul>
              <li><a href="mailto:hello@roofscale.io">hello@roofscale.io</a></li>
              <li><a href="tel:+18005551234">(800) 555-1234</a></li>
              <li><span>Mon to Fri, 8am to 6pm</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <span>&copy; {year} RoofScale. All rights reserved.</span>
          <span>Results vary. We only partner with roofing companies we believe we can grow.</span>
        </div>
      </div>
    </footer>
  )
}
