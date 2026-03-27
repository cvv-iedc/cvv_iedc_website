import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/Layout'
import LandingPage from './pages/LandingPage'
import EventsPage from './pages/EventsPage'
import GalleryPage from './pages/GalleryPage'
import TeamPage from './pages/TeamPage'
import AboutPage from './pages/AboutPage'
import AllEventsPage from './pages/AllEventsPage'
import OrbitPage from './pages/OrbitPage'
import HorizonPage from './pages/HorizonPage'
import EclipsePage from './pages/EclipsePage'

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/all-events" element={<AllEventsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/team" element={<TeamPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/orbit" element={<OrbitPage />} />
        <Route path="/horizon" element={<HorizonPage />} />
        <Route path="/eclipse" element={<EclipsePage />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  )
}
