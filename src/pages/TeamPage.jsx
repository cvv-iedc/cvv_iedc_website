import { useState, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'


const TEAM = [
  { id: 1, name: 'Ms Anupama Jims', role: 'Nodal Officer', department: 'Faculty', linkedinUrl: 'https://linkedin.com', imageUrl: '/krisshhhhh.png' },
  { id: 2, name: 'Krishna K', role: 'Student Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/images/krishna.png' },
  { id: 3, name: 'Anuja S Nair', role: 'Student Lead', department: 'Electronics', linkedinUrl: 'https://linkedin.com', imageUrl: '/divvvvvvvvvvv.png' },
  { id: 4, name: 'Daewik Prasheen', role: 'Technology Lead', department: 'Mechanical', linkedinUrl: 'https://linkedin.com', imageUrl: '/poth.png' },
  { id: 5, name: 'Anjana Prakash', role: 'Quality & Operations Lead', department: 'Civil', linkedinUrl: 'https://linkedin.com', imageUrl: '/ramdas.png' },
  { id: 6, name: 'Amrutha S Nair', role: 'Documentation Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/daeeeeeeee.png' },
  { id: 7, name: 'Nibha Bhaskar', role: 'Creative & Innovation Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 8, name: 'Niranjana Uday', role: 'Women Entreprenuership Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 9, name: 'Adithyadev Saji', role: 'Marketing & Engagement Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 10, name: 'Nakshathra S Nair', role: 'Community Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 11, name: 'Niranjana Gireesh', role: 'Orbit & Talent Development Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 12, name: 'Kashinathan S', role: 'IPR Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 13, name: 'Vaishnav Darsan', role: 'Finance Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 14, name: 'Srihari Krishnakumar', role: 'Media Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 15, name: 'Easwer Dev N S', role: 'Create Lead', department: 'Computer Science', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 16, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 17, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 18, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 19, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 20, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 21, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 22, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 23, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 24, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
  { id: 25, name: '[Name]', role: '[Role]', department: '[Department]', linkedinUrl: 'https://linkedin.com', imageUrl: '/narayana.png' },
]

// ─── Row Configuration ────────────────────────────────────────────────────────
// Each row picks a slice of team members and scrolls at different speed/direction
const ROW_CONFIG = [
  { ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], direction: 'left', duration: '70s', heights: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450] },
  { ids: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25], direction: 'right', duration: '70s', heights: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450] }
]

// Map id → member object
const TEAM_MAP = Object.fromEntries(TEAM.map((m) => [m.id, m]))

// ─── LinkedIn Icon ────────────────────────────────────────────────────────────
function LinkedInIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

// ─── Portrait Card ─────────────────────────────────────────────────────────────
function Portrait({ member, height, onHoverStart, onHoverEnd }) {
  const [hovered, setHovered] = useState(false)
  const [popupPos, setPopupPos] = useState({ side: 'right' })
  const ref = useRef(null)

  const handleMouseEnter = useCallback(() => {
    setHovered(true)
    onHoverStart()
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect()
      // Detect if the portrait is on the right half of the screen
      const side = rect.left > window.innerWidth / 2 ? 'left' : 'right'
      setPopupPos({ side })
    }
  }, [onHoverStart])

  const handleMouseLeave = useCallback(() => {
    setHovered(false)
    onHoverEnd()
  }, [onHoverEnd])

  const popupStyle = {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 50,
    ...(popupPos.side === 'right'
      ? { left: 'calc(100% + 12px)' }
      : { right: 'calc(100% + 12px)' }),
  }

  return (
    <div
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        flexShrink: 0,
        width: `${Math.round(height * 0.85)}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      {/* Portrait — transparent cutout PNG/SVG, NO card/box */}
      <a
        href={member.linkedinUrl}
        target="_blank"
        rel="noopener noreferrer"
        style={{ display: 'block', width: '100%', height: `${height}px` }}
        tabIndex={-1}
        aria-label={`${member.name} — ${member.role}`}
      >
        <motion.img
          src={member.imageUrl}
          alt={member.name}
          draggable={false}
          animate={{ scale: hovered ? 1.06 : 1, filter: hovered ? 'drop-shadow(0 12px 24px rgba(0,0,0,0.22))' : 'drop-shadow(0 4px 8px rgba(0,0,0,0.10))' }}
          transition={{ duration: 0.35, ease: [0.34, 1.56, 0.64, 1] }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            display: 'block',
            transformOrigin: 'bottom center',
          }}
          onError={(e) => {
            // Fallback: show initials silhouette
            e.target.style.display = 'none'
          }}
        />
      </a>

      {/* Persistent Label below Portrait */}
      <div style={{ marginTop: '16px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>{member.name}</p>
        <p style={{ margin: '4px 0 0', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>{member.role}</p>
      </div>

      {/* Hover Popup */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.88, y: '-46%' }}
            animate={{ opacity: 1, scale: 1, y: '-50%' }}
            exit={{ opacity: 0, scale: 0.88, y: '-46%' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            style={{
              ...popupStyle,
              background: '#fff',
              borderRadius: '12px',
              padding: '14px 18px',
              boxShadow: '0 8px 40px rgba(0,0,0,0.14), 0 1px 4px rgba(0,0,0,0.06)',
              minWidth: '170px',
              pointerEvents: 'auto',
              border: '1px solid rgba(0,0,0,0.06)',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '0.9rem',
                color: 'var(--color-text-primary)',
                marginBottom: '2px',
                whiteSpace: 'nowrap',
              }}
            >
              {member.name}
            </p>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.76rem',
                color: 'var(--color-primary)',
                fontWeight: 600,
                marginBottom: '10px',
                whiteSpace: 'nowrap',
              }}
            >
              {member.role}
            </p>
            <a
              href={member.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.72rem',
                color: '#0A66C2',
                textDecoration: 'none',
                padding: '5px 10px',
                border: '1.5px solid #0A66C2',
                borderRadius: '9999px',
                transition: 'background 0.2s, color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#0A66C2'
                e.currentTarget.style.color = '#fff'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#0A66C2'
              }}
            >
              <LinkedInIcon /> View LinkedIn
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Marquee Row ──────────────────────────────────────────────────────────────
function MarqueeRow({ memberIds, direction, duration, heights, paused, onHoverStart, onHoverEnd }) {
  const baseMembers = memberIds.map((id) => TEAM_MAP[id]).filter(Boolean)
  if (baseMembers.length === 0) return null

  // Ensure 'singleSet' is wide enough to cover the screen (at least ~12 portraits)
  let singleSet = [...baseMembers]
  while (singleSet.length < 12) {
    singleSet = [...singleSet, ...baseMembers]
  }

  // The duplication trick: two identical sets side by side. CSS translates exactly -50%
  const doubled = [...singleSet, ...singleSet]

  const scrollRef = useRef(null)
  const [rowHovered, setRowHovered] = useState(false)

  const scrollManually = (dir) => {
    const el = scrollRef.current
    if (!el) return
    const cardWidth = Math.round(450 * 0.85) // approx portrait width
    const gap = Math.round(window.innerWidth * 0.015)
    const amount = (cardWidth + gap) * 2
    el.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div
      style={{ position: 'relative', width: '100%' }}
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      {/* Left scroll button */}
      <div
        style={{
          position: 'absolute',
          left: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          transition: 'opacity 0.3s',
          opacity: rowHovered ? 1 : 0,
          pointerEvents: rowHovered ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => scrollManually('left')}
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            background: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          aria-label="Scroll left"
        >
          <ChevronLeft size={26} color="#1a1a1a" />
        </button>
      </div>

      {/* Right scroll button */}
      <div
        style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 20,
          transition: 'opacity 0.3s',
          opacity: rowHovered ? 1 : 0,
          pointerEvents: rowHovered ? 'auto' : 'none',
        }}
      >
        <button
          onClick={() => scrollManually('right')}
          style={{
            width: '3.5rem',
            height: '3.5rem',
            borderRadius: '9999px',
            background: '#fff',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)',
            transition: 'transform 0.15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.08)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          aria-label="Scroll right"
        >
          <ChevronRight size={26} color="#1a1a1a" />
        </button>
      </div>

      <div
        ref={scrollRef}
        className="native-scroll-container"
        style={{ overflowX: 'auto', overflowY: 'hidden', position: 'relative', width: '100%', paddingTop: '50px', paddingBottom: '20px' }}
      >
        <div
          className={`team-marquee-track go-${direction}${paused ? ' paused' : ''}`}
          style={{ '--dur': duration, gap: '0px' }}
        >
          {doubled.map((member, i) => (
            <div
              key={`${member.id}-${i}`}
              style={{
                display: 'flex',
                alignItems: 'flex-end',
                padding: '0 clamp(8px, 1.5vw, 20px)',
              }}
            >
              <Portrait
                member={member}
                height={450}
                onHoverStart={onHoverStart}
                onHoverEnd={onHoverEnd}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TeamPage() {
  const [paused, setPaused] = useState(false)
  const hoverCount = useRef(0)

  const onHoverStart = useCallback(() => {
    hoverCount.current += 1
    setPaused(true)
  }, [])

  const onHoverEnd = useCallback(() => {
    hoverCount.current = Math.max(0, hoverCount.current - 1)
    if (hoverCount.current === 0) setPaused(false)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#F5F5F0',
        overflow: 'hidden',
      }}
    >
      {/* ── Page Header ── */}
      <div
        style={{
          paddingTop: 'clamp(3.5rem, 8vw, 5.5rem)',
          paddingBottom: '0.5rem',
          paddingInline: 'clamp(1.5rem, 6vw, 5rem)',
        }}
      >
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
            marginBottom: '0.8rem',
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
            fontSize: 'clamp(4rem, 16vw, 13rem)',
            letterSpacing: '-0.05em',
            lineHeight: 0.88,
            color: 'var(--color-text-primary)',
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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0',
        }}
      >
        {ROW_CONFIG.map((row, rowIdx) => (
          <MarqueeRow
            key={rowIdx}
            memberIds={row.ids}
            direction={row.direction}
            duration={row.duration}
            heights={row.heights}
            paused={paused}
            onHoverStart={onHoverStart}
            onHoverEnd={onHoverEnd}
          />
        ))}
      </div>

      {/* ── Join CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        style={{
          margin: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 6vw, 5rem) 0',
          padding: 'clamp(2.5rem, 6vw, 4.5rem) clamp(2rem, 6vw, 4rem)',
          background: '#fff',
          borderRadius: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          border: '1px solid rgba(0,0,0,0.07)',
        }}
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
            color: '#fff',
            borderRadius: '9999px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.95rem',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--color-primary)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--color-text-primary)' }}
        >
          Apply Now →
        </a>
      </motion.div>
    </div>
  )
}
