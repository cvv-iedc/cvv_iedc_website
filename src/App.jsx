import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import ScrollToTop from './components/ScrollToTop'
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
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', willChange: 'opacity, transform' }}
      >
        <Routes location={location}>
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
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Layout>
        <AnimatedRoutes />
      </Layout>
    </BrowserRouter>
  )
}
