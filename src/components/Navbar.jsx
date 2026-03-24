import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
  { label: 'Team', href: '/team' },
]

export default function Navbar() {
  const location = useLocation()
  const [visible, setVisible] = useState(true)
  const [mobileOpen, setMobileOpen] = useState(false)
  const lastScrollY = useRef(0)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (current) => {
    const diff = current - lastScrollY.current
    if (current < 80) {
      setVisible(true)
    } else if (diff > 5) {
      setVisible(false)
      setMobileOpen(false)
    } else if (diff < -5) {
      setVisible(true)
    }
    lastScrollY.current = current
  })

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.35, ease: 'easeInOut' }}
        style={{
          position: 'fixed',
          top: '1.25rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: 'rgba(255,255,255,0.15)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255,255,255,0.3)',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          borderRadius: '9999px',
          padding: '0.6rem 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          minWidth: 'auto',
          width: 'max-content',
          maxWidth: 'calc(100vw - 2rem)',
        }}
      >
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', flexShrink: 0 }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: '1.15rem',
            color: 'var(--color-primary)',
            letterSpacing: '-0.02em',
          }}>
            IEDC<span style={{ color: 'var(--color-brand-red)' }}>●</span>CVV
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex" style={{ gap: '0.25rem', alignItems: 'center' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.href
            return (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  textDecoration: 'none',
                  padding: '0.35rem 0.9rem',
                  borderRadius: '9999px',
                  fontSize: '0.875rem',
                  fontWeight: isActive ? 600 : 500,
                  fontFamily: 'var(--font-heading)',
                  color: isActive ? '#fff' : 'var(--color-text-primary)',
                  background: isActive ? 'var(--color-primary)' : 'transparent',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'rgba(37,99,235,0.08)'
                    e.target.style.color = 'var(--color-primary)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent'
                    e.target.style.color = 'var(--color-text-primary)'
                  }
                }}
              >
                {link.label}
              </Link>
            )
          })}
        </div>

        {/* CTA Button */}
        <a
          href="/events"
          className="hidden md:block"
          style={{
            textDecoration: 'none',
            padding: '0.4rem 1.1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            fontFamily: 'var(--font-heading)',
            color: '#fff',
            background: 'var(--color-primary)',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => { e.target.style.background = 'var(--color-accent)' }}
          onMouseLeave={(e) => { e.target.style.background = 'var(--color-primary)' }}
        >
          Events →
        </a>

        {/* Hamburger */}
        <button
          className="md:hidden"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-primary)', flexShrink: 0 }}
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </motion.nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'fixed',
              top: '4.5rem',
              left: '1rem',
              right: '1rem',
              zIndex: 999,
              background: 'rgba(255,255,255,0.96)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              border: '1px solid rgba(37,99,235,0.15)',
              borderRadius: '1.25rem',
              padding: '1rem',
              boxShadow: '0 20px 60px rgba(0,0,0,0.12)',
            }}
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 500,
                  fontSize: '1rem',
                  color: location.pathname === link.href ? 'var(--color-primary)' : 'var(--color-text-primary)',
                  borderRadius: '0.75rem',
                  background: location.pathname === link.href ? 'rgba(37,99,235,0.08)' : 'transparent',
                }}
              >
                {link.label}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', marginTop: '0.5rem', paddingTop: '0.75rem' }}>
              <Link
                to="/events"
                style={{
                  display: 'block',
                  padding: '0.75rem 1rem',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  color: '#fff',
                  background: 'var(--color-primary)',
                  borderRadius: '9999px',
                  textAlign: 'center',
                }}
              >
                View Events →
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
