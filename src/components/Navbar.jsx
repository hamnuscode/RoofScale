import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'

const LINKS = [
  { href: '#system', label: 'The System' },
  { href: '#roi', label: 'The Math' },
  { href: '#proof', label: 'Results' },
]

function RoofMark() {
  return (
    <span className="nav__mark" aria-hidden="true">
      <svg width="26" height="20" viewBox="0 0 26 20" fill="none">
        <polyline points="1,18 13,3 25,18" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const reduce = useReducedMotion()
  const { scrollY } = useScroll()
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const onHome = pathname === '/'

  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > 48
    setScrolled((prev) => (prev !== next ? next : prev))
  })

  const handleAnchor = (e, href) => {
    e.preventDefault()
    if (onHome) {
      const el = document.querySelector(href)
      if (el) el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
    } else {
      // off the landing page: route home, then ScrollManager handles the hash.
      navigate(`/${href}`)
    }
  }

  const handleBrand = (e) => {
    e.preventDefault()
    if (onHome) window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    else navigate('/')
  }

  return (
    <motion.nav
      className="nav"
      initial={false}
      animate={{
        height: scrolled ? 'var(--nav-h-shrunk)' : 'var(--nav-h)',
        backgroundColor: scrolled ? 'rgba(242,239,230,0.92)' : 'rgba(242,239,230,0)',
        boxShadow: scrolled ? '0 6px 24px -16px rgba(32,33,28,0.6)' : '0 0 0 rgba(0,0,0,0)',
        backdropFilter: scrolled ? 'blur(10px)' : 'blur(0px)',
        borderBottom: scrolled ? '1px solid rgba(32,33,28,0.08)' : '1px solid rgba(32,33,28,0)',
      }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
    >
      <a href={onHome ? '#top' : '/'} className="nav__brand" onClick={handleBrand}>
        <RoofMark />
        RoofScale
      </a>

      <ul className="nav__links">
        {LINKS.map((l) => (
          <li key={l.href}>
            <a className="nav__link" href={l.href} onClick={(e) => handleAnchor(e, l.href)}>
              {l.label}
            </a>
          </li>
        ))}
      </ul>

      <motion.a
        href="#apply"
        className="btn btn--cta btn--sm nav__cta"
        onClick={(e) => handleAnchor(e, '#apply')}
        whileHover={reduce ? {} : { y: -2 }}
        whileTap={reduce ? {} : { y: 1 }}
      >
        Apply Now
      </motion.a>
    </motion.nav>
  )
}
