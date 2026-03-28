import { useEffect, useRef, useState, memo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion'

const navLinksLeft = [
  { label: 'Events', href: '/events' },
  { label: 'Gallery', href: '/gallery' },
]

const navLinksRight = [
  { label: 'Team', href: '/team' },
  { label: 'About', href: '/about' },
]

const allLinks = [
  { label: 'Home', href: '/' },
  ...navLinksLeft,
  ...navLinksRight,
]

const Navbar = memo(function Navbar() {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  
  // Track viewport safely
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Collapse island on route change
  useEffect(() => {
    setExpanded(false)
  }, [location.pathname])

  const renderDesktopLink = (link) => {
    const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
    return (
      <Link
        key={link.href}
        to={link.href}
        className="relative px-5 py-2.5 rounded-full text-[0.85rem] transition-colors duration-300 flex items-center justify-center"
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          color: isActive ? '#000' : '#d4d4d8',
          textDecoration: 'none'
        }}
        onMouseEnter={(e) => {
          if (!isActive) e.currentTarget.style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          if (!isActive) e.currentTarget.style.color = '#d4d4d8'
        }}
      >
        <span className="relative z-10">{link.label}</span>
        {isActive && (
          <motion.div
            layoutId="activeNavTab"
            className="absolute inset-0 bg-white rounded-full z-0"
            transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>
    )
  }

  const renderMobileLink = (link) => {
    const isActive = location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
    return (
      <Link
        key={link.href}
        to={link.href}
        onClick={(e) => e.stopPropagation()}
        className="block px-5 py-3.5 rounded-2xl text-[0.95rem] tracking-wide text-center transition-all"
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          color: isActive ? '#000' : '#e4e4e7',
          background: isActive ? '#fff' : 'rgba(255,255,255,0.06)',
          textDecoration: 'none',
          marginBottom: '0.4rem'
        }}
      >
        {link.label}
      </Link>
    )
  }

  const Logo = (
    <Link 
      to="/" 
      // In mobile, clicking the logo expands the notch, it doesn't navigate
      onClick={(e) => { if (isMobile) { e.preventDefault() } }} 
      className="flex items-center justify-center pointer-events-auto hover:scale-[1.03] active:scale-[0.97] transition-transform duration-300"
    >
      <img src="/iedc_logo_white.png" alt="IEDC Chinmaya Vishwa Vidyapeeth" className="h-[2rem] md:h-[2.2rem] object-contain drop-shadow-[0_2px_12px_rgba(255,255,255,0.2)]" />
    </Link>
  )

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[1000] flex justify-center pointer-events-none"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{ willChange: 'transform, opacity' }}
    >
      <nav
        className="pointer-events-auto relative bg-black transition-all ease-[cubic-bezier(0.22,1,0.36,1)]"
        style={{
          boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
          borderBottomLeftRadius: expanded ? '2rem' : '1.5rem',
          borderBottomRightRadius: expanded ? '2rem' : '1.5rem',
          borderTopLeftRadius: '0px',
          borderTopRightRadius: '0px',
          width: isMobile ? (expanded ? '100vw' : '200px') : 'auto', // 200px to fit scaling logo
          transitionDuration: '500ms',
        }}
      >
        {/* ── SVG Ears to create the classic Notch look ── */}
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute top-0 -left-[24px] pointer-events-none z-10 transition-opacity duration-300" style={{ opacity: expanded && isMobile ? 0 : 1 }}>
          <path d="M24 0H0C13.2548 0 24 10.7452 24 24V0Z" fill="black" />
        </svg>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="absolute top-0 -right-[24px] pointer-events-none z-10 transition-opacity duration-300" style={{ opacity: expanded && isMobile ? 0 : 1 }}>
          <path d="M0 0H24C10.7452 0 0 10.7452 0 24V0Z" fill="black" />
        </svg>

        {!isMobile ? (
          /* ── DESKTOP NOTCH ── */
          <div className="flex items-center justify-center pt-2 pb-3 px-3 gap-6">
            <div className="flex items-center gap-1 pl-1">
              {navLinksLeft.map(renderDesktopLink)}
            </div>
            
            <div className="flex items-center justify-center px-2">
              {Logo}
            </div>

            <div className="flex items-center gap-1 pr-1">
              {navLinksRight.map(renderDesktopLink)}
            </div>
          </div>
        ) : (
          /* ── MOBILE NOTCH ── */
          <div 
            className="flex flex-col cursor-pointer"
            onClick={() => setExpanded(!expanded)}
          >
            {/* Pill/Notch Header */}
            <div className="flex items-center justify-center pt-2 pb-2 min-h-[64px]">
              {Logo}
            </div>

            {/* Expanded Menu - Pure CSS Animation */}
            <div 
              className="grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" 
              style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}
            >
              <div className="overflow-hidden">
                <div 
                  className="px-4 pb-8 flex flex-col pt-1 transition-opacity duration-500" 
                  style={{ opacity: expanded ? 1 : 0, transitionDelay: expanded ? '100ms' : '0ms' }}
                >
                  <div className="w-full h-px bg-white/10 mb-5 mt-2 transition-transform duration-500" style={{ transform: expanded ? 'scaleX(1)' : 'scaleX(0.5)' }} />
                  {allLinks.map((link, i) => (
                    <div 
                      key={link.href} 
                      className="transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                      style={{ 
                        transform: expanded ? 'translateY(0)' : 'translateY(-20px)',
                        transitionDelay: expanded ? `${i * 30 + 100}ms` : '0ms'
                      }}
                    >
                       {renderMobileLink(link)}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </motion.div>
  )
})

export default Navbar
