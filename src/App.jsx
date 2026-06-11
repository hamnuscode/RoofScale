import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing.jsx'
import ThankYou from './pages/ThankYou.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash)
      if (el) {
        // wait a frame so the freshly-mounted page has laid out
        requestAnimationFrame(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }))
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/thank-you" element={<ThankYou />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </>
  )
}
