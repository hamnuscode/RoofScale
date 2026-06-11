import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Reveal from './Reveal.jsx'
import Objections from './Objections.jsx'
import { isQualified, sendLead } from '../lib/webhook.js'

const JOB_OPTIONS = [
  { value: '1-3', label: '1 to 3' },
  { value: '4-8', label: '4 to 8' },
  { value: '9-15', label: '9 to 15' },
  { value: '16+', label: '16+' },
]
const CHALLENGES = ['Missed calls/leads', 'Low close rate', 'Not enough leads', 'Weak online presence', 'No reviews', 'Hiring']

const EMPTY = {
  fullName: '', businessName: '', phone: '', location: '',
  jobsPerMonth: '', challenges: [], isOwner: '', budget: '',
}

export default function ApplyForm() {
  const navigate = useNavigate()
  const reduce = useReducedMotion()
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const fieldRefs = useRef({})

  const setField = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    setErrors((e) => (e[name] ? { ...e, [name]: undefined } : e))
  }
  const toggleChallenge = (value) => {
    setValues((v) => {
      const has = v.challenges.includes(value)
      return { ...v, challenges: has ? v.challenges.filter((c) => c !== value) : [...v.challenges, value] }
    })
    setErrors((e) => (e.challenges ? { ...e, challenges: undefined } : e))
  }
  const registerRef = (name) => (el) => { if (el) fieldRefs.current[name] = el }

  const validate = () => {
    const e = {}
    if (!values.fullName.trim()) e.fullName = 'Please enter your full name.'
    if (!values.businessName.trim()) e.businessName = 'Please enter your business name.'
    const digits = values.phone.replace(/[^0-9]/g, '')
    if (!values.phone.trim()) e.phone = 'Please enter your phone number.'
    else if (digits.length < 10) e.phone = 'Enter a valid phone number (at least 10 digits).'
    if (!values.location.trim()) e.location = 'Please enter your city and state.'
    if (!values.jobsPerMonth) e.jobsPerMonth = 'Please choose how many jobs you do per month.'
    if (values.challenges.length === 0) e.challenges = 'Pick at least one challenge.'
    if (!values.isOwner) e.isOwner = 'Please let us know if you are the decision maker.'
    if (!values.budget) e.budget = 'Please select an answer.'
    return e
  }

  const handleSubmit = (ev) => {
    ev.preventDefault()
    const e = validate()
    setErrors(e)
    const firstKey = Object.keys(e)[0]
    if (firstKey) {
      const ref = fieldRefs.current[firstKey]
      if (ref && ref.focus) ref.focus()
      return
    }
    const answers = { ...values }
    const qualified = isQualified(answers)
    sendLead({ qualified, submittedAt: new Date().toISOString(), answers })
    navigate(`/thank-you?q=${qualified ? '1' : '0'}`)
  }

  return (
    <section className="section apply" id="apply" aria-labelledby="apply-h">
      <div className="wrap wrap--narrow">
        <Reveal as="h2" className="apply-h" id="apply-h">
          Apply For Your Free Growth Audit
        </Reveal>
        <Reveal as="p" className="apply-sub" delay={0.05}>
          Limited spots. Takes about 60 seconds, and there's no obligation.
        </Reveal>

        <Reveal as="form" className="form-card" onSubmit={handleSubmit} noValidate>
          <div className="field-row">
            <Text name="fullName" label="Full name" autoComplete="name"
              value={values.fullName} onChange={setField} error={errors.fullName} registerRef={registerRef} />
            <Text name="businessName" label="Business name" autoComplete="organization"
              value={values.businessName} onChange={setField} error={errors.businessName} registerRef={registerRef} />
          </div>
          <div className="field-row">
            <Text name="phone" label="Phone number" type="tel" inputMode="tel" autoComplete="tel"
              value={values.phone} onChange={setField} error={errors.phone} registerRef={registerRef} />
            <Text name="location" label="City / State" autoComplete="address-level2"
              value={values.location} onChange={setField} error={errors.location} registerRef={registerRef} />
          </div>

          <ChipGroup
            legend="How many jobs/month on average?"
            options={JOB_OPTIONS}
            value={values.jobsPerMonth}
            onSelect={(v) => setField('jobsPerMonth', v)}
            error={errors.jobsPerMonth}
            registerRef={registerRef('jobsPerMonth')}
            reduce={reduce}
          />
          <ChipGroup
            legend="Biggest challenge right now?"
            options={CHALLENGES}
            multi
            value={values.challenges}
            onSelect={toggleChallenge}
            error={errors.challenges}
            registerRef={registerRef('challenges')}
            reduce={reduce}
          />
          <ChipGroup
            legend="Are you the owner and decision maker?"
            options={['Yes', 'No']}
            value={values.isOwner}
            onSelect={(v) => setField('isOwner', v)}
            error={errors.isOwner}
            registerRef={registerRef('isOwner')}
            reduce={reduce}
          />
          <ChipGroup
            legend="Can you invest $1,500 to $3,000/month if we show you a clear plan?"
            options={['Yes', 'No', 'Maybe']}
            value={values.budget}
            onSelect={(v) => setField('budget', v)}
            error={errors.budget}
            registerRef={registerRef('budget')}
            reduce={reduce}
          />

          <motion.button
            type="submit"
            className="btn btn--cta btn--full form-card__submit"
            whileHover={reduce ? {} : { y: -2, x: -2, boxShadow: '6px 6px 0 var(--asphalt)' }}
            whileTap={reduce ? {} : { y: 2, x: 2, boxShadow: '2px 2px 0 var(--asphalt)' }}
          >
            Book My Free Audit Call
          </motion.button>

          <Objections />
        </Reveal>
      </div>
    </section>
  )
}

function Text({ name, label, type = 'text', value, onChange, error, registerRef, ...rest }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type={type}
        required
        ref={registerRef(name)}
        className={`input${error ? ' invalid' : ''}`}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        {...rest}
      />
      <AnimatePresence>{error && <ErrLine>{error}</ErrLine>}</AnimatePresence>
    </div>
  )
}

function ChipGroup({ legend, options, multi, value, onSelect, error, registerRef, reduce }) {
  const isOn = (val) => (multi ? value.includes(val) : value === val)
  return (
    <fieldset className="field" role="group">
      <legend>{legend}</legend>
      <div className="chips">
        {options.map((opt, i) => {
          const val = typeof opt === 'string' ? opt : opt.value
          const label = typeof opt === 'string' ? opt : opt.label
          const on = isOn(val)
          return (
            <motion.button
              key={val}
              type="button"
              ref={i === 0 ? registerRef : undefined}
              className={`chip${on ? ' chip--on' : ''}`}
              aria-pressed={on}
              onClick={() => onSelect(val)}
              whileTap={reduce ? {} : { scale: 0.95 }}
              whileHover={reduce ? {} : { y: -2 }}
            >
              <span className="chip__check" aria-hidden="true">
                <AnimatePresence initial={false}>
                  {on && (
                    <motion.span
                      key="c"
                      initial={reduce ? false : { scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={reduce ? {} : { scale: 0, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 22 }}
                    >
                      &#10003;
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              {label}
            </motion.button>
          )
        })}
      </div>
      <AnimatePresence>{error && <ErrLine>{error}</ErrLine>}</AnimatePresence>
    </fieldset>
  )
}

function ErrLine({ children }) {
  return (
    <motion.p
      className="err"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.p>
  )
}
