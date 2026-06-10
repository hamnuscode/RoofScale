const ITEMS = [
  'No long term contracts',
  'Done for you, zero extra work on your end',
  'We only work with roofing companies',
  'Results in the first 30 days or we work for free',
]

export default function Objections() {
  return (
    <ul className="objections" role="list">
      {ITEMS.map((text) => (
        <li key={text}>
          <span className="tick" aria-hidden="true">&#10003;</span> {text}
        </li>
      ))}
    </ul>
  )
}
