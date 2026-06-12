import CTAButton from './CTAButton.jsx'

const STAGES = [
  { num: '01', label: ['WEBSITE +', 'FUNNEL'] },
  { num: '02', label: ['META', 'ADS'] },
  { num: '03', label: ['SEO + GOOGLE', 'MAPS'] },
  { num: '04', label: ['CONTENT +', 'SOCIALS'] },
  { num: '05', label: ['AI', 'RECEPTIONIST'] },
  { num: '06', label: ['REVIEW', 'AUTOMATION'] },
  { num: '07', label: ['HIRING', 'SUPPORT'] },
]

/* Static growth chart (no scroll animation). */
const VW = 1300
const VH = 600
const BASE = 470
const NODE_R = 26
const XS = [90, 277, 463, 650, 837, 1023, 1210]
const YS = [430, 374, 318, 260, 200, 140, 80]
const TIP = { x: 1268, y: 55 }

const lineD =
  `M${XS[0]},${YS[0]} ` +
  XS.slice(1).map((x, i) => `L${x},${YS[i + 1]}`).join(' ') +
  ` L${TIP.x},${TIP.y}`
const areaD = `${lineD} L${TIP.x},${BASE} L${XS[0]},${BASE} Z`

export default function SystemDiagram() {
  return (
    <section className="section system" id="system" aria-labelledby="system-h">
      <div className="wrap">
        <h2 className="section-h system__h" id="system-h">
          We Build Your Entire Growth Engine, Done For You, In Just 30 Days
        </h2>

        {/* Desktop / tablet: static growth chart */}
        <div className="system__chart">
          <svg
            className="system__svg"
            viewBox={`0 0 ${VW} ${VH}`}
            role="img"
            aria-label="Growth chart: seven stages stepping upward from Website and Funnel to Hiring Support."
          >
            <defs>
              <linearGradient id="sysFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--verdigris)" stopOpacity="0.30" />
                <stop offset="100%" stopColor="var(--verdigris)" stopOpacity="0" />
              </linearGradient>
            </defs>

            <g aria-hidden="true">
              {[BASE, 330, 200].map((y) => (
                <line key={y} x1={XS[0] - 30} y1={y} x2={TIP.x + 6} y2={y}
                  stroke="var(--asphalt)" strokeOpacity="0.07" strokeWidth="1" />
              ))}
              <text x={XS[0] - 30} y={150} fontFamily="var(--font-mono)" fontSize="15"
                fill="var(--asphalt)" fillOpacity="0.4" letterSpacing="2">REVENUE</text>
            </g>

            <path d={areaD} fill="url(#sysFill)" />
            <path d={lineD} fill="none" stroke="var(--verdigris)" strokeWidth="3.5"
              strokeLinejoin="round" strokeLinecap="round" />
            <path d={`M${TIP.x},${TIP.y} L${TIP.x - 18},${TIP.y + 2} M${TIP.x},${TIP.y} L${TIP.x - 6},${TIP.y + 18}`}
              fill="none" stroke="var(--verdigris)" strokeWidth="3.5" strokeLinecap="round" />

            {STAGES.map((stage, i) => (
              <g key={i}>
                <line x1={XS[i]} y1={YS[i] + NODE_R} x2={XS[i]} y2={BASE}
                  stroke="var(--verdigris)" strokeOpacity="0.4" strokeWidth="1.5" strokeDasharray="3 6" />
                <circle cx={XS[i]} cy={YS[i]} r={NODE_R + 6} fill="var(--limewash)" />
                <circle cx={XS[i]} cy={YS[i]} r={NODE_R} fill="var(--verdigris)" />
                <text x={XS[i]} y={YS[i] + 6} textAnchor="middle"
                  fontFamily="var(--font-mono)" fontSize="17" fill="var(--limewash)">{stage.num}</text>
                <text x={XS[i]} y={BASE + 32} textAnchor="middle" className="chart-label"
                  fontFamily="var(--font-display)" fontWeight="700" fontSize="18" fill="var(--asphalt)">
                  <tspan x={XS[i]} dy="0">{stage.label[0]}</tspan>
                  <tspan x={XS[i]} dy="20">{stage.label[1]}</tspan>
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Mobile: static vertical flow */}
        <ol className="system-steps">
          <span className="steps__rail" aria-hidden="true" />
          {STAGES.map((stage, i) => (
            <li className="step" key={i}>
              <span className="step__node">{stage.num}</span>
              <span className="step__label">{stage.label.join(' ')}</span>
            </li>
          ))}
        </ol>

        <div className="system__cta">
          <CTAButton>Apply For Your Free Audit</CTAButton>
        </div>
      </div>
    </section>
  )
}
