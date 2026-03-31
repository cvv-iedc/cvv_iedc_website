import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { TEAM } from '../data/team'

// ─── Row Configuration ────────────────────────────────────────────────────────
// Each row picks a slice of team members and scrolls at different speed/direction
const ROW_CONFIG = [
  { ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], direction: 'left', duration: '70s', heights: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450, 450] },
  { ids: [16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28], direction: 'right', duration: '70s', heights: [450, 450, 450, 450, 450, 450, 450, 450, 450, 450] }
]

// Map id → member object
const TEAM_MAP = Object.fromEntries(TEAM.map((m) => [m.id, m]))

// ─── LinkedIn Icon ────────────────────────────────────────────────────────────
function LinkedInLogo() {
  return (
    <img
      src="/linkedin_logo.svg"
      alt="LinkedIn"
      style={{
        height: '18px',
        width: 'auto',
        display: 'block',
        flexShrink: 0
      }}
    />
  )
}

// ─── Portrait Card ─────────────────────────────────────────────────────────────
function Portrait({ member, height }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      style={{
        position: 'relative',
        flexShrink: 0,
        width: `${Math.round(height * 0.85)}px`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        userSelect: 'none',
      }}
    >
      {/* Portrait image wrapper */}
      <div
        style={{ display: 'block', width: '100%', height: `${height}px`, position: 'relative' }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Performance-friendly "drop-shadow" background layer */}
        <img
          src={member.imageUrl}
          alt=""
          draggable={false}
          style={{
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
            opacity: isHovered ? 0.65 : 0.35,
            transition: 'opacity 0.3s, transform 0.3s',
            transformOrigin: 'bottom center',
            transform: isHovered ? 'scale(1.04) translateY(12px)' : 'scale(1) translateY(8px)',
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />

        {/* Crisp foreground layer */}
        <img
          src={member.imageUrl}
          alt={member.name}
          draggable={false}
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            objectPosition: 'bottom center',
            display: 'block',
            transition: 'transform 0.3s',
            transformOrigin: 'bottom center',
            transform: isHovered ? 'scale(1.04)' : 'scale(1)',
          }}
          onError={(e) => { e.target.style.display = 'none' }}
        />
      </div>

      {/* Label: name + role + LinkedIn icon */}
      <div style={{ marginTop: '14px', textAlign: 'center' }}>
        <p style={{ margin: 0, fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--color-text-primary)' }}>
          {member.name}
        </p>
        <p style={{ margin: '4px 0 6px', fontFamily: 'var(--font-sans)', fontSize: '0.95rem', color: 'var(--color-text-secondary)', fontWeight: 500 }}>
          {member.role}
        </p>
        <a
          href={member.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${member.name} on LinkedIn`}
          style={{
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
            marginTop: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
            e.currentTarget.style.background = '#fefefe'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
            e.currentTarget.style.background = '#ffffff'
          }}
        >
          <LinkedInLogo />
        </a>
      </div>
    </div>
  )
}

// ─── Marquee Row ──────────────────────────────────────────────────────────────
function MarqueeRow({ memberIds, direction, duration, heights }) {
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

    const halfWidth = el.scrollWidth / 2
    const prevBehavior = el.style.scrollBehavior

    if (dir === 'left') {
      if (el.scrollLeft < amount) {
        el.style.scrollBehavior = 'auto'
        el.scrollLeft += halfWidth
        const _ = el.offsetWidth // force reflow
        el.style.scrollBehavior = prevBehavior
      }
      el.scrollBy({ left: -amount, behavior: 'smooth' })
    } else {
      if (el.scrollLeft >= halfWidth) {
        el.style.scrollBehavior = 'auto'
        el.scrollLeft -= halfWidth
        const _ = el.offsetWidth // force reflow
        el.style.scrollBehavior = prevBehavior
      }
      el.scrollBy({ left: amount, behavior: 'smooth' })
    }
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
          className={`team-marquee-track go-${direction}${rowHovered ? ' paused' : ''}`}
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
          paddingTop: 'clamp(7rem, 14vw, 9rem)',
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
