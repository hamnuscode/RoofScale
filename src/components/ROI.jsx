import Reveal from './Reveal.jsx'
import AnimatedBackground from './AnimatedBackground.jsx'

const ROWS = [
  { label: 'Average roofing job', value: '$8,000 to $12,000' },
  { label: 'Jobs lost per week to slow response + weak online presence + no follow up', value: '3 to 5' },
]

export default function ROI() {
  return (
    <section className="section roi" id="roi" aria-labelledby="roi-h">
      <AnimatedBackground variant="dark" />
      <div className="wrap wrap--narrow">
        <Reveal as="h2" className="section-h section-h--light" id="roi-h">The Math Is Simple</Reveal>
        <Reveal as="dl" className="estimate">
          {ROWS.map((r, i) => (
            <div className="estimate__row" key={i}>
              <dt>{r.label}</dt>
              <dd className="num">{r.value}</dd>
            </div>
          ))}
          <div className="estimate__row estimate__row--total">
            <dt>Walking out the door, every month</dt>
            <dd className="num">$24,000 to $60,000</dd>
          </div>
        </Reveal>
        <Reveal as="p" className="roi__close" delay={0.1}>
          Our system pays for itself the moment it closes your first extra job.
        </Reveal>
      </div>
    </section>
  )
}
