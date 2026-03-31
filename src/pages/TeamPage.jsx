import { useState, useRef, useCallback, useMemo, memo } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TEAM } from '../data/team'

// ─── Row Configuration ────────────────────────────────────────────────────────
const ROW_CONFIG = [
  { ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], direction: 'left', duration: '70s' },
  { ids: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], direction: 'right', duration: '70s' },
]

// Map id → member object (module-level, computed once)
const TEAM_MAP = Object.fromEntries(TEAM.map((m) => [m.id, m]))

// Module-level static style objects to avoid recreating on every render
const LINKEDIN_LOGO_STYLE = { height: '18px', width: 'auto', display: 'block', flexShrink: 0 }
const LINKEDIN_LINK_STYLE = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#ffffff',
  border: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
  borderRadius: '9999px',
  transition: 'transform 0.2s, box-shadow 0.2s, background 0.2s',
  padding: '8px 16px',
  textDecoration: 'none',
  marginTop: '8px',
}
const LABEL_WRAPPER_STYLE = { marginTop: '14px', textAlign: 'center' }
const IMAGE_WRAPPER_STYLE = { display: 'block', width: '100%', position: 'relative' }
const SHADOW_IMG_STYLE = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'bottom center',
  display: 'block',
  pointerEvents: 'none',
  zIndex: 0,
  filter: 'blur(24px) saturate(1.2)',
  opacity: 0.35,
  transition: 'opacity 0.3s, transform 0.3s',
  transformOrigin: 'bottom center',
  transform: 'scale(1) translateY(8px)',
  willChange: 'transform, opacity',
}
const SHADOW_IMG_HOVER_STYLE = {
  ...SHADOW_IMG_STYLE,
  opacity: 0.65,
  transform: 'scale(1.04) translateY(12px)',
}
const FOREGROUND_IMG_STYLE = {
  position: 'relative',
  zIndex: 1,
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  objectPosition: 'bottom center',
  display: 'block',
  transition: 'transform 0.3s',
  transformOrigin: 'bottom center',
  transform: 'scale(1)',
  willChange: 'transform',
}
const FOREGROUND_IMG_HOVER_STYLE = {
  ...FOREGROUND_IMG_STYLE,
  transform: 'scale(1.04)',
}

// ─── LinkedIn Icon ────────────────────────────────────────────────────────────
// Memoized so it never re-renders (it's purely static)
const LinkedInLogo = memo(function LinkedInLogo() {
  return <img src="/linkedin_logo.svg" alt="LinkedIn" style={LINKEDIN_LOGO_STYLE} />
})

// ─── Portrait Card ─────────────────────────────────────────────────────────────
// Memoized — only re-renders when `member`, `height`, or `isGloballyHovered` changes.
// `onHoverChange` is a stable ref-based callback from the parent, so it won't cause re-renders.
const Portrait = memo(function Portrait({ member, height, isGloballyHovered, onHoverChange }) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    setIsHovered(true)
    onHoverChange(true)
  }, [onHoverChange])

  const handleMouseLeave = useCallback(() => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    setIsHovered(false)
    onHoverChange(false)
  }, [onHoverChange])

  const handleLinkEnter = useCallback((e) => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    e.currentTarget.style.transform = 'translateY(-2px)'
    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
    e.currentTarget.style.background = '#fefefe'
  }, [])

  const handleLinkLeave = useCallback((e) => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    e.currentTarget.style.transform = 'translateY(0)'
    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
    e.currentTarget.style.background = '#ffffff'
  }, [])

  // Only compute the card width once per height value (stable primitive)
  const cardWidth = Math.round(height * 0.85)

  const cardStyle = useMemo(() => ({
    position: 'relative',
    flexShrink: 0,
    width: `${cardWidth}px`,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    userSelect: 'none',
    opacity: isGloballyHovered && !isHovered ? 0.35 : 1,
    filter: isGloballyHovered && !isHovered ? 'grayscale(80%)' : 'grayscale(0%)',
    transform: isGloballyHovered && !isHovered ? 'scale(0.96)' : 'scale(1)',
    transition: 'opacity 0.4s ease, filter 0.4s ease, transform 0.4s ease',
    willChange: 'opacity, filter, transform',
  }), [cardWidth, isGloballyHovered, isHovered])

  const imageWrapperStyle = useMemo(() => ({
    ...IMAGE_WRAPPER_STYLE,
    height: `${height}px`,
  }), [height])

  const namePStyle = useMemo(() => ({
    margin: 0,
    fontFamily: 'var(--font-heading)',
    fontWeight: 700,
    fontSize: '1.2rem',
    color: 'var(--color-text-primary)',
    transition: 'color 0.4s ease',
  }), [])

  const rolePStyle = useMemo(() => ({
    margin: '4px 0 6px',
    fontFamily: 'var(--font-sans)',
    fontSize: '0.95rem',
    color: 'var(--color-text-secondary)',
    fontWeight: 500,
    transition: 'color 0.4s ease',
  }), [])

  return (
    <div style={cardStyle} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <div style={imageWrapperStyle}>
        {/* Blurred drop-shadow layer */}
        <img
          src={member.imageUrl}
          alt=""
          draggable={false}
          loading="lazy"
          decoding="async"
          style={isHovered ? SHADOW_IMG_HOVER_STYLE : SHADOW_IMG_STYLE}
          onError={(e) => { e.target.style.display = 'none' }}
        />
        {/* Crisp foreground layer */}
        <img
          src={member.imageUrl}
          alt={member.name}
          draggable={false}
          loading="lazy"
          decoding="async"
          style={isHovered ? FOREGROUND_IMG_HOVER_STYLE : FOREGROUND_IMG_STYLE}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      <div style={LABEL_WRAPPER_STYLE}>
        <p style={namePStyle}>{member.name}</p>
        <p style={rolePStyle}>{member.role}</p>
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          style={LINKEDIN_LINK_STYLE}
          onMouseEnter={handleLinkEnter}
          onMouseLeave={handleLinkLeave}
        >
          <LinkedInLogo />
        </a>
      </div>
    </div>
  )
})

// ─── Marquee Row ──────────────────────────────────────────────────────────────
function MarqueeRow({ memberIds, direction, duration, isGloballyHovered, onHoverChange }) {
  // Memoize the expensive array building — only recomputes when memberIds changes
  const doubled = useMemo(() => {
    const baseMembers = memberIds.map((id) => TEAM_MAP[id]).filter(Boolean)
    if (baseMembers.length === 0) return []
    let singleSet = [...baseMembers]
    while (singleSet.length < 12) {
      singleSet = [...singleSet, ...baseMembers]
    }
    return [...singleSet, ...singleSet]
  }, [memberIds])

  const scrollRef = useRef(null)
  const [rowHovered, setRowHovered] = useState(false)

  // Cache card width so we don't recompute it on every click
  const CARD_WIDTH = useMemo(() => Math.round(450 * 0.85), [])

  const scrollManually = useCallback((dir) => {
    const el = scrollRef.current
    if (!el) return

    // Read scrollWidth once; avoid touching offsetWidth (layout thrash) unless needed
    const halfWidth = el.scrollWidth / 2
    // Use a fixed gap estimate to avoid window.innerWidth read (layout query)
    const gap = 20
    const amount = (CARD_WIDTH + gap) * 2

    if (dir === 'left') {
      if (el.scrollLeft < amount) {
        // Jump silently to provide infinite scroll room — use requestAnimationFrame
        // to batch the DOM write away from React's commit phase
        const jump = el.scrollLeft + halfWidth
        requestAnimationFrame(() => {
          el.scrollLeft = jump
          el.scrollBy({ left: -amount, behavior: 'smooth' })
        })
      } else {
        el.scrollBy({ left: -amount, behavior: 'smooth' })
      }
    } else {
      if (el.scrollLeft >= halfWidth) {
        const jump = el.scrollLeft - halfWidth
        requestAnimationFrame(() => {
          el.scrollLeft = jump
          el.scrollBy({ left: amount, behavior: 'smooth' })
        })
      } else {
        el.scrollBy({ left: amount, behavior: 'smooth' })
      }
    }
  }, [CARD_WIDTH])

  const handleRowEnter = useCallback(() => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    setRowHovered(true)
  }, [])
  const handleRowLeave = useCallback(() => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    setRowHovered(false)
  }, [])
  const handleScrollLeft = useCallback(() => scrollManually('left'), [scrollManually])
  const handleScrollRight = useCallback(() => scrollManually('right'), [scrollManually])

  const btnEnter = useCallback((e) => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    e.currentTarget.style.transform = 'scale(1.08)'
  }, [])
  const btnLeave = useCallback((e) => {
    if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
    e.currentTarget.style.transform = 'scale(1)'
  }, [])

  if (doubled.length === 0) return null

  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      onMouseEnter={handleRowEnter}
      onMouseLeave={handleRowLeave}
    >
      {/* Left scroll button */}
      <div style={{
        position: 'absolute', left: '1rem', top: '50%',
        transform: 'translateY(-50%)', zIndex: 20,
        transition: 'opacity 0.3s',
        opacity: rowHovered ? 1 : 0,
        pointerEvents: rowHovered ? 'auto' : 'none',
      }}>
        <button
          onClick={handleScrollLeft}
          style={BTN_STYLE}
          onMouseEnter={btnEnter}
          onMouseLeave={btnLeave}
          aria-label="Scroll left"
        >
          <ChevronLeft size={26} color="#1a1a1a" />
        </button>
      </div>

      {/* Right scroll button */}
      <div style={{
        position: 'absolute', right: '1rem', top: '50%',
        transform: 'translateY(-50%)', zIndex: 20,
        transition: 'opacity 0.3s',
        opacity: rowHovered ? 1 : 0,
        pointerEvents: rowHovered ? 'auto' : 'none',
      }}>
        <button
          onClick={handleScrollRight}
          style={BTN_STYLE}
          onMouseEnter={btnEnter}
          onMouseLeave={btnLeave}
          aria-label="Scroll right"
        >
          <ChevronRight size={26} color="#1a1a1a" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="native-scroll-container"
        style={SCROLL_CONTAINER_STYLE}
      >
        <div
          className={`team-marquee-track go-${direction}${rowHovered ? ' paused' : ''}`}
          style={{ '--dur': duration, gap: '0px' }}
        >
          {doubled.map((member, i) => (
            <div
              key={`${member.id}-${i}`}
              style={CARD_WRAPPER_STYLE}
            >
              <Portrait
                member={member}
                height={450}
                isGloballyHovered={isGloballyHovered}
                onHoverChange={onHoverChange}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Static button and container styles (outside component to avoid recreation)
const BTN_STYLE = {
  width: '3.5rem', height: '3.5rem',
  borderRadius: '9999px', background: '#fff',
  border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
  transition: 'transform 0.15s',
  willChange: 'transform',
}

const SCROLL_CONTAINER_STYLE = {
  overflowX: 'auto', overflowY: 'hidden',
  position: 'relative', width: '100%',
  paddingTop: '50px', paddingBottom: '20px',
}

const CARD_WRAPPER_STYLE = {
  display: 'flex',
  alignItems: 'flex-end',
  padding: '0 clamp(8px, 1.5vw, 20px)',
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeamPage() {
  // Use a ref for the actual hover state so that Portrait mouse events
  // don't cause the *entire* tree to re-render on every mouseenter/leave.
  // We only sync to React state (causing a re-render) when transitioning
  // between "any card hovered" vs "no card hovered".
  const hoverCountRef = useRef(0)
  const [globalHover, setGlobalHover] = useState(false)

  // Stable callback passed to all Portraits — won't cause re-renders by itself
  const handlePortraitHover = useCallback((entering) => {
    if (entering) {
      hoverCountRef.current += 1
      if (hoverCountRef.current === 1) setGlobalHover(true)
    } else {
      hoverCountRef.current = Math.max(0, hoverCountRef.current - 1)
      if (hoverCountRef.current === 0) setGlobalHover(false)
    }
  }, [])

  const pageStyle = useMemo(() => ({
    minHeight: '100vh',
    backgroundColor: globalHover ? '#0A0A0A' : '#F5F5F0',
    overflow: 'hidden',
    transition: 'background-color 0.5s ease',
    '--color-text-primary': globalHover ? '#FFFFFF' : '#0F172A',
    '--color-text-secondary': globalHover ? 'rgba(255,255,255,0.7)' : '#475569',
    '--color-text-muted': globalHover ? 'rgba(255,255,255,0.4)' : '#CBD5E1',
  }), [globalHover])

  const headerStyle = useMemo(() => ({
    paddingTop: 'clamp(7rem, 14vw, 9rem)',
    paddingBottom: '0.5rem',
    paddingInline: 'clamp(1.5rem, 6vw, 5rem)',
    opacity: globalHover ? 0.15 : 1,
    transition: 'opacity 0.5s ease',
    pointerEvents: globalHover ? 'none' : 'auto',
  }), [globalHover])

  const ctaStyle = useMemo(() => ({
    margin: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 6vw, 5rem) 0',
    padding: 'clamp(2.5rem, 6vw, 4.5rem) clamp(2rem, 6vw, 4rem)',
    backgroundColor: globalHover ? 'rgba(255,255,255,0.03)' : '#fff',
    borderRadius: '24px',
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '2rem',
    border: globalHover ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(0,0,0,0.07)',
    opacity: globalHover ? 0.2 : 1,
    transition: 'opacity 0.5s ease, background-color 0.5s ease, border-color 0.5s ease',
  }), [globalHover])

  return (
    <div style={pageStyle}>
      {/* ── Page Header ── */}
      <div style={headerStyle}>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 600,
            fontSize: 'clamp(0.68rem, 1.4vw, 0.8rem)',
            textTransform: 'uppercase',
            letterSpacing: '0.22em',
            color: 'var(--color-text-secondary)',
            marginTop: 0,
            marginBottom: '0.2rem',
          }}
        >
          Meet the people behind the idea
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08 }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(3rem, 10vw, 8rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.88,
            color: 'var(--color-text-primary)',
            marginTop: 0,
            marginBottom: 0,
            marginLeft: '-0.05em',
          }}
        >
          Execom
        </motion.h1>
      </div>

      {/* ── Thin separator ── */}
      <div
        style={{
          height: '1px',
          background: 'rgba(0,0,0,0.08)',
          marginInline: 'clamp(1.5rem, 6vw, 5rem)',
          marginBottom: '0',
        }}
      />

      {/* ── Marquee Rows ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {ROW_CONFIG.map((row, rowIdx) => (
          <MarqueeRow
            key={rowIdx}
            memberIds={row.ids}
            direction={row.direction}
            duration={row.duration}
            isGloballyHovered={globalHover}
            onHoverChange={handlePortraitHover}
          />
        ))}
      </div>

      {/* ── Join CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        style={ctaStyle}
      >
        <div>
          <p
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 600,
              fontSize: '0.75rem',
              textTransform: 'uppercase',
              letterSpacing: '0.2em',
              color: 'var(--color-text-muted)',
              marginBottom: '0.6rem',
            }}
          >
            Join Us
          </p>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(1.6rem, 4vw, 2.8rem)',
              letterSpacing: '-0.03em',
              color: 'var(--color-text-primary)',
              lineHeight: 1.1,
              maxWidth: '480px',
            }}
          >
            Want to be part of the team?
          </h2>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.95rem',
              color: 'var(--color-text-secondary)',
              marginTop: '0.8rem',
              lineHeight: 1.7,
              maxWidth: '400px',
            }}
          >
            We recruit passionate innovators, designers, developers, and storytellers each year.
          </p>
        </div>
        <a
          href="mailto:iedc@cvv.ac.in"
          style={{
            display: 'inline-block',
            textDecoration: 'none',
            padding: '0.95rem 2.5rem',
            background: 'var(--color-text-primary)',
            color: globalHover ? '#0F172A' : '#fff',
            borderRadius: '9999px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s, color 0.5s ease',
          }}
          onMouseEnter={(e) => {
            if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
            e.currentTarget.style.background = 'var(--color-primary)'
          }}
          onMouseLeave={(e) => {
            if (window.matchMedia && window.matchMedia('(hover: none)').matches) return;
            e.currentTarget.style.background = 'var(--color-text-primary)'
          }}
        >
          Apply Now →
        </a>
      </motion.div>
    </div>
  )
}
