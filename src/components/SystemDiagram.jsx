import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'

const STAGES = [
  { num: '01', label: ['WEBSITE +', 'FUNNEL'] },
  { num: '02', label: ['SEO + GOOGLE', 'MAPS'] },
  { num: '03', label: ['CONTENT +', 'SOCIALS'] },
  { num: '04', label: ['AI', 'RECEPTIONIST'] },
  { num: '05', label: ['REVIEW', 'AUTOMATION'] },
  { num: '06', label: ['HIRING', 'SUPPORT'] },
]

/* Chart geometry (SVG user units) */
const VW = 1200
const VH = 600
const BASE = 470
const NODE_R = 27
const XS = [95, 296, 497, 698, 899, 1100]
const YS = [430, 372, 308, 244, 168, 96]
const TIP = { x: 1158, y: 70 }

const lineD =
  `M${XS[0]},${YS[0]} ` +
  XS.slice(1).map((x, i) => `L${x},${YS[i + 1]}`).join(' ') +
  ` L${TIP.x},${TIP.y}`
const areaD = `${lineD} L${TIP.x},${BASE} L${XS[0]},${BASE} Z`

export default function SystemDiagram() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)

  // The section is taller than the viewport; its inner pins while you scroll
  // through it. Progress 0 -> 1 maps to that pinned scroll distance.
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 30, restDelta: 0.001 })
  // Finish the drawing at 82% of the pin, leaving a beat fully-complete before release.
  const draw = useTransform(smooth, [0, 0.82], [0, 1])

  return (
    <section className="section system" id="system" aria-labelledby="system-h" ref={sectionRef}>
      <div className="system__sticky">
        <div className="wrap">
          <Reveal as="h2" className="section-h" id="system-h">
            We Build Your Entire Growth Engine, Done For You, In 30 Days
          </Reveal>

          {/* Desktop / tablet: scroll-driven growth chart */}
          <div className="system__chart">
            <svg
              className="system__svg"
              viewBox={`0 0 ${VW} ${VH}`}
              role="img"
              aria-label="Ascending growth chart: six stages stepping upward from Website and Funnel to Hiring Support."
            >
              <defs>
                <linearGradient id="sysFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--verdigris)" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="var(--verdigris)" stopOpacity="0" />
                </linearGradient>
                <clipPath id="sysGrow">
                  <motion.rect
                    x="0" y="0" width={VW} height={VH}
                    style={reduce ? undefined : { scaleX: draw, transformBox: 'fill-box', transformOrigin: '0% 50%' }}
                  />
                </clipPath>
              </defs>

              <g className="system__grid" aria-hidden="true">
                {[BASE, 330, 200].map((y) => (
                  <line key={y} x1={XS[0] - 30} y1={y} x2={TIP.x + 6} y2={y}
                    stroke="var(--asphalt)" strokeOpacity="0.07" strokeWidth="1" />
                ))}
                <text x={XS[0] - 30} y={150} fontFamily="var(--font-mono)" fontSize="15"
                  fill="var(--asphalt)" fillOpacity="0.4" letterSpacing="2">REVENUE</text>
              </g>

              <g clipPath="url(#sysGrow)">
                <path d={areaD} fill="url(#sysFill)" />
                <path d={lineD} fill="none" stroke="var(--verdigris)" strokeWidth="3.5"
                  strokeLinejoin="round" strokeLinecap="round" />
                <path d={`M${TIP.x},${TIP.y} L${TIP.x - 18},${TIP.y + 2} M${TIP.x},${TIP.y} L${TIP.x - 6},${TIP.y + 18}`}
                  fill="none" stroke="var(--verdigris)" strokeWidth="3.5" strokeLinecap="round" />
              </g>

              {STAGES.map((stage, i) => (
                <ChartNode key={i} stage={stage} x={XS[i]} y={YS[i]} reduce={reduce} draw={draw} />
              ))}
            </svg>
          </div>
        </div>
      </div>

      {/* Mobile: vertical flow with a rail that fills as you scroll */}
      <ol className="system-steps">
        <span className="steps__rail" aria-hidden="true">
          <motion.span className="steps__fill" style={reduce ? { transform: 'scaleY(1)' } : { scaleY: draw }} />
        </span>
        {STAGES.map((stage, i) => (
          <motion.li
            className="step"
            key={i}
            initial={reduce ? false : { opacity: 0, x: -14 }}
            whileInView={reduce ? {} : { opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '0px 0px -12% 0px' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
          >
            <span className="step__node">{stage.num}</span>
            <span className="step__label">{stage.label.join(' ')}</span>
          </motion.li>
        ))}
      </ol>
    </section>
  )
}

function ChartNode({ stage, x, y, reduce, draw }) {
  const tx = x / VW
  const opacity = useTransform(draw, [tx - 0.06, tx], [0, 1])
  const scale = useTransform(draw, [tx - 0.06, tx + 0.03], [0.4, 1])

  const groupStyle = reduce ? { opacity: 1 } : { opacity }
  const circleStyle = reduce
    ? {}
    : { scale, opacity, transformBox: 'fill-box', transformOrigin: 'center' }

  return (
    <g>
      <motion.line
        x1={x} y1={y + NODE_R} x2={x} y2={BASE}
        stroke="var(--verdigris)" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 6"
        style={groupStyle}
      />
      <motion.circle cx={x} cy={y} r={NODE_R + 6} fill="var(--limewash)" style={groupStyle} />
      <motion.circle cx={x} cy={y} r={NODE_R} fill="var(--verdigris)" style={circleStyle} />
      <motion.text x={x} y={y + 6} textAnchor="middle"
        fontFamily="var(--font-mono)" fontSize="18" fill="var(--limewash)" style={groupStyle}>
        {stage.num}
      </motion.text>
      <motion.text x={x} y={BASE + 32} textAnchor="middle" className="chart-label"
        fontFamily="var(--font-display)" fontWeight="700" fontSize="19" fill="var(--asphalt)" style={groupStyle}>
        <tspan x={x} dy="0">{stage.label[0]}</tspan>
        <tspan x={x} dy="21">{stage.label[1]}</tspan>
      </motion.text>
    </g>
  )
}
