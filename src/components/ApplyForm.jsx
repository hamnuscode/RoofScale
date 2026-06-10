import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
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

  const registerRef = (name) => (el) => { if (el) fieldRefs.current[name] = el }

  return (
    <section className="section apply" id="apply" aria-labelledby="apply-h">
      <div className="wrap wrap--narrow">
        <Reveal as="h2" className="apply-h" id="apply-h">
          Apply For Your Free Growth Audit, Limited Spots Available
        </Reveal>

        <Reveal as="form" className="form" onSubmit={handleSubmit} noValidate>
          <Text name="fullName" label="Full name" autoComplete="name"
            value={values.fullName} onChange={setField} error={errors.fullName} registerRef={registerRef} />
          <Text name="businessName" label="Business name" autoComplete="organization"
            value={values.businessName} onChange={setField} error={errors.businessName} registerRef={registerRef} />
          <Text name="phone" label="Phone number" type="tel" inputMode="tel" autoComplete="tel"
            value={values.phone} onChange={setField} error={errors.phone} registerRef={registerRef} />
          <Text name="location" label="City / State" autoComplete="address-level2"
            value={values.location} onChange={setField} error={errors.location} registerRef={registerRef} />

          <div className="field">
            <label htmlFor="jobsPerMonth">How many jobs/month on average?</label>
            <select id="jobsPerMonth" name="jobsPerMonth" required
              ref={registerRef('jobsPerMonth')}
              className={errors.jobsPerMonth ? 'invalid' : undefined}
              value={values.jobsPerMonth}
              onChange={(e) => setField('jobsPerMonth', e.target.value)}>
              <option value="" disabled>Select one...</option>
              {JOB_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
            {errors.jobsPerMonth && <p className="err">{errors.jobsPerMonth}</p>}
          </div>

          <fieldset className="field">
            <legend>Biggest challenge right now?</legend>
            <div className="checks">
              {CHALLENGES.map((c, i) => (
                <label className="check" key={c}>
                  <input
                    type="checkbox"
                    name="challenges"
                    value={c}
                    ref={i === 0 ? registerRef('challenges') : undefined}
                    checked={values.challenges.includes(c)}
                    onChange={() => toggleChallenge(c)}
                  />
                  {c}
                </label>
              ))}
            </div>
            {errors.challenges && <p className="err">{errors.challenges}</p>}
          </fieldset>

          <Radios name="isOwner" legend="Are you the owner and decision maker?" options={['Yes', 'No']}
            value={values.isOwner} onChange={setField} error={errors.isOwner} registerRef={registerRef} />

          <Radios name="budget" legend="Can you invest $1,500 to $3,000/month if we show you a clear plan?"
            options={['Yes', 'No', 'Maybe']}
            value={values.budget} onChange={setField} error={errors.budget} registerRef={registerRef} />

          <motion.button
            type="submit"
            className="btn btn--cta btn--full"
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
        className={error ? 'invalid' : undefined}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        {...rest}
      />
      {error && <p className="err">{error}</p>}
    </div>
  )
}

function Radios({ name, legend, options, value, onChange, error, registerRef }) {
  return (
    <fieldset className="field">
      <legend>{legend}</legend>
      <div className="radios">
        {options.map((opt, i) => (
          <label className="radio" key={opt}>
            <input
              type="radio"
              name={name}
              value={opt}
              ref={i === 0 ? registerRef(name) : undefined}
              checked={value === opt}
              onChange={() => onChange(name, opt)}
            />
            {opt}
          </label>
        ))}
      </div>
      {error && <p className="err">{error}</p>}
    </fieldset>
  )
}
