import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { initiatives } from '../data/initiatives'
import { events } from '../data/events'
import EventModal from '../components/EventModal'
import { Lightbulb, Rocket, Users, Globe, Award, BookOpen } from 'lucide-react'

const iconMap = { Lightbulb, Rocket, Users, Globe, Award, BookOpen }

// ─── Word Cloud ───────────────────────────────────────────────────────────────
const words = ['innovation', 'build', 'pitch', 'disrupt', 'launch', 'ideate', 'scale', 'impact', 'prototype', 'hustle', 'dream', 'execute', 'venture', 'create', 'iterate', 'pivot', 'startup', 'grow', 'inspire']

function WordCloud() {
  const words_with_positions = useRef(
    words.map((word, i) => ({
      word,
      x: `${5 + Math.random() * 85}%`,
      y: `${5 + Math.random() * 85}%`,
      size: 0.7 + Math.random() * 0.8,
      duration: 15 + Math.random() * 25,
      delay: Math.random() * -20,
      xRange: (Math.random() - 0.5) * 200,
      yRange: (Math.random() - 0.5) * 150,
    }))
  ).current

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {words_with_positions.map(({ word, x, y, size, duration, delay, xRange, yRange }) => (
        <motion.span
          key={word}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            fontSize: `${size}rem`,
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-text-muted)',
            opacity: 0.35,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
          animate={{
            x: [0, xRange, 0],
            y: [0, yRange, 0],
          }}
          transition={{
            duration,
            delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}

// ─── Stick Figure SVG (replaces 'i') ──────────────────────────────────────────
function StickFigure() {
  return (
    <svg
      viewBox="0 0 24 48"
      width="0.55em"
      height="1.1em"
      style={{ display: 'inline-block', verticalAlign: 'middle', marginBottom: '0.1em' }}
      fill="none"
      stroke="#DC2626"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Head */}
      <circle cx="12" cy="6" r="4" />
      {/* Body */}
      <line x1="12" y1="10" x2="12" y2="28" />
      {/* Arms */}
      <line x1="12" y1="15" x2="2" y2="22" />
      <line x1="12" y1="15" x2="22" y2="22" />
      {/* Legs */}
      <line x1="12" y1="28" x2="4" y2="44" />
      <line x1="12" y1="28" x2="20" y2="44" />
    </svg>
  )
}

// ─── Logo Reveal Hero ─────────────────────────────────────────────────────────
function LogoRevealHero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const scale = useTransform(scrollYProgress, [0, 1], [1, 22])
  const opacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 1, 0])

  return (
    <div
      ref={containerRef}
      style={{
        height: '200vh',
        position: 'relative',
      }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #F0F4FF 0%, #FFFFFF 50%, #EFF6FF 100%)',
      }}>
        {/* Background seen through logo letters */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
          {/* Ambient gradient blobs */}
          <div style={{
            position: 'absolute', top: '10%', left: '10%',
            width: '40vw', height: '40vw',
            background: 'radial-gradient(circle, rgba(37,99,235,0.12) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', bottom: '10%', right: '10%',
            width: '35vw', height: '35vw',
            background: 'radial-gradient(circle, rgba(22,163,74,0.10) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
        </div>

        {/* Scroll hint */}
        <motion.div
          style={{
            position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
            zIndex: 10, textAlign: 'center',
          }}
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-secondary)', marginBottom: '0.4rem' }}>scroll to enter</p>
          <div style={{
            width: '1px', height: '40px', background: 'linear-gradient(to bottom, var(--color-text-muted), transparent)',
            margin: '0 auto',
          }} />
        </motion.div>

        {/* IEDC Logo — scales on scroll acting as clipping mask reveal */}
        <motion.div
          style={{ scale, opacity, position: 'relative', zIndex: 5 }}
        >
          <div style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(5rem, 18vw, 14rem)',
            letterSpacing: '-0.04em',
            lineHeight: 0.85,
            textAlign: 'center',
            color: 'transparent',
            WebkitTextStroke: '3px var(--color-primary)',
            textShadow: 'none',
            userSelect: 'none',
          }}>
            IEDC
          </div>
          <div style={{
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: 'clamp(0.6rem, 2vw, 1.1rem)',
            textAlign: 'center',
            letterSpacing: '0.3em',
            color: 'var(--color-text-secondary)',
            textTransform: 'uppercase',
            marginTop: '0.5rem',
          }}>
            Innovation & Entrepreneurship Development Cell
          </div>
          {/* Tagline */}
          <div style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
            textAlign: 'center',
            color: 'var(--color-text-muted)',
            marginTop: '0.5rem',
            letterSpacing: '0.15em',
          }}>
            College of Velankanni — Kerala Startup Mission
          </div>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Manifesto Section ────────────────────────────────────────────────────────
function ManifestoSection() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.4 })

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: '#fff',
        padding: '8rem 2rem',
      }}
    >
      <WordCloud />
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, x: -80 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -80 }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(3.5rem, 12vw, 10rem)',
            letterSpacing: '-0.04em',
            color: 'var(--color-text-primary)',
            lineHeight: 0.9,
          }}
        >
          CREATE.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: 'var(--font-accent-serif)',
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 'clamp(2.5rem, 10vw, 8rem)',
            letterSpacing: '-0.02em',
            color: 'var(--color-brand-red)',
            lineHeight: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.1em',
          }}
        >
          <StickFigure />nspire.
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 80 }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 10vw, 8.5rem)',
            letterSpacing: '-0.04em',
            color: 'var(--color-text-primary)',
            lineHeight: 0.9,
          }}
        >
          TRANSFORM.
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(0.95rem, 2vw, 1.15rem)',
            color: 'var(--color-text-secondary)',
            maxWidth: '520px',
            margin: '2rem auto 0',
            lineHeight: 1.7,
          }}
        >
          We are the engine of student-led innovation at CVV — building ideas into impact since 2018.
        </motion.p>
      </div>
    </section>
  )
}

// ─── Key Initiatives Grid ─────────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}
const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } },
}

function InitiativesSection() {
  return (
    <section style={{
      background: 'var(--color-surface)',
      padding: 'clamp(4rem, 10vw, 7rem) clamp(1.5rem, 5vw, 4rem)',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)' }}
      >
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          What We Do
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          letterSpacing: '-0.03em',
          color: 'var(--color-text-primary)',
          lineHeight: 1.1,
        }}>
          Key Initiatives
        </h2>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
          gap: '1.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {initiatives.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -6, boxShadow: '0 24px 48px rgba(0,0,0,0.13)' }}
              style={{
                background: '#fff',
                borderRadius: 'var(--radius-card)',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                transition: 'box-shadow 0.3s ease',
              }}
            >
              <div style={{
                width: '52px', height: '52px',
                borderRadius: '14px',
                background: `${item.color}15`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                {Icon && <Icon size={26} style={{ color: item.color }} />}
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1.15rem',
                color: 'var(--color-text-primary)',
                marginBottom: '0.6rem',
              }}>
                {item.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.9rem',
                color: 'var(--color-text-secondary)',
                lineHeight: 1.7,
              }}>
                {item.description}
              </p>
            </motion.div>
          )
        })}
      </motion.div>
    </section>
  )
}

// ─── Events Preview Carousel ──────────────────────────────────────────────────
function EventsPreview() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <section style={{
      background: '#fff',
      padding: 'clamp(4rem, 10vw, 7rem) 0',
      overflow: 'hidden',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(2rem, 5vw, 3.5rem)', padding: '0 2rem' }}
      >
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          Upcoming
        </p>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 6vw, 4rem)',
          letterSpacing: '-0.03em',
          color: 'var(--color-text-primary)',
          lineHeight: 1.1,
        }}>
          Events
        </h2>
      </motion.div>

      <div className="scroll-container" style={{ padding: '0 clamp(1.5rem, 5vw, 4rem) 1.5rem' }}>
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            className="scroll-item"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => setSelectedEvent(event)}
            style={{
              width: 'clamp(240px, 30vw, 320px)',
              height: '440px',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
              flexShrink: 0,
            }}
          >
            {/* Image */}
            <div style={{
              width: '100%', height: '100%',
              background: `linear-gradient(135deg, hsl(${220 + i * 30}, 70%, 60%), hsl(${220 + i * 30 + 40}, 60%, 40%))`,
            }}>
              <img
                src={event.image}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.85) 0%, rgba(15,23,42,0.2) 50%, transparent 100%)',
            }} />
            {/* Content */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.25rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.6rem' }}>
                {event.tags?.slice(0,2).map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: '9999px', padding: '0.15rem 0.55rem', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: '#fff', lineHeight: 1.3, marginBottom: '0.4rem' }}>
                {event.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)' }}>
                {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'long' })}
              </p>
            </div>
            {/* Hover: View Details */}
            <motion.div
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
              style={{
                position: 'absolute', inset: 0,
                background: 'rgba(37,99,235,0.65)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 'var(--radius-card)',
              }}
            >
              <span style={{
                color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700,
                fontSize: '1rem', border: '2px solid rgba(255,255,255,0.8)',
                padding: '0.5rem 1.25rem', borderRadius: '9999px',
              }}>
                View Details →
              </span>
            </motion.div>
          </motion.div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
        <a href="/events" style={{
          display: 'inline-block', textDecoration: 'none',
          padding: '0.8rem 2rem',
          background: 'var(--color-primary)', color: '#fff',
          borderRadius: 'var(--radius-button)',
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem',
        }}>
          View All Events →
        </a>
      </div>

      {/* Modal */}
      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
    </section>
  )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div>
      <LogoRevealHero />
      <ManifestoSection />
      <InitiativesSection />
      <EventsPreview />

      {/* Footer */}
      <footer style={{
        background: 'var(--color-brand-black)',
        color: 'rgba(255,255,255,0.6)',
        padding: '3rem 2rem',
        textAlign: 'center',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
      }}>
        <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.5rem', color: '#fff', marginBottom: '0.5rem' }}>
          IEDC<span style={{ color: 'var(--color-brand-red)' }}>●</span>CVV
        </div>
        <p>Innovation & Entrepreneurship Development Cell — College of Velankanni</p>
        <p style={{ marginTop: '0.25rem', opacity: 0.4 }}>Powered by Kerala Startup Mission (KSUM)</p>
      </footer>
    </div>
  )
}
