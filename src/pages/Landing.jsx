import Navbar from '../components/Navbar.jsx'
import Hero from '../components/Hero.jsx'
import VSL from '../components/VSL.jsx'
import Problem from '../components/Problem.jsx'
import SystemDiagram from '../components/SystemDiagram.jsx'
import ROI from '../components/ROI.jsx'
import SocialProof from '../components/SocialProof.jsx'
import ApplyForm from '../components/ApplyForm.jsx'
import Footer from '../components/Footer.jsx'
import PitchDivider from '../components/PitchDivider.jsx'

export default function Landing() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <VSL />
        <PitchDivider />
        <Problem />
        <PitchDivider />
        <SystemDiagram />
        <ROI />
        <PitchDivider />
        <SocialProof />
        <PitchDivider />
        <ApplyForm />
      </main>
      <Footer />
    </>
  )
}
