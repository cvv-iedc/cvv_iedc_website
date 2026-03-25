import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionTemplate } from 'framer-motion'
import { initiatives } from '../data/initiatives'

import { Lightbulb, Rocket, Users, Globe, Award, BookOpen } from 'lucide-react'

const iconMap = { Lightbulb, Rocket, Users, Globe, Award, BookOpen }

// ─── Word Cloud (Horizontal Tracks) ───────────────────────────────────────────
const words = ['innovation', 'build', 'pitch', 'disrupt', 'launch', 'ideate', 'scale', 'impact', 'prototype', 'hustle', 'dream', 'execute', 'venture', 'create', 'iterate', 'pivot', 'startup', 'grow', 'inspire', 'design', 'code', 'lead', 'fund', 'accelerate', 'mentor', 'network', 'learn', 'adapt', 'solve']

function WordCloud() {
  const tracks = 7;
  const words_with_positions = useRef(
    words.map((word, i) => {
      const trackIdx = i % tracks;
      const step = 100 / Math.ceil(words.length / tracks);
      const xPos = (Math.floor(i / tracks) * step) - 20;

      return {
        word,
        y: `${(trackIdx + 1) * (100 / (tracks + 1))}%`,
        x: `${xPos}vw`,
        size: 1.5 + Math.random() * 2,
        duration: 40 + Math.random() * 20,
        delay: Math.random() * -40,
        direction: trackIdx % 2 === 0 ? 1 : -1,
      }
    })
  ).current

  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}>
      {words_with_positions.map(({ word, x, y, size, duration, delay, direction }, i) => (
        <motion.span
          key={`${word}-${i}`}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            transform: 'translateY(-50%)',
            fontSize: `${size}rem`,
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            color: 'var(--color-text-muted)',
            opacity: 0.25,
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
          animate={{ x: [`0vw`, `${150 * direction}vw`, `0vw`] }}
          transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
        >
          {word}
        </motion.span>
      ))}
    </div>
  )
}



// ─── Logo Reveal Hero (Inverted Zoom Mask) ────────────────────────────────────
function LogoRevealHero() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  // Add buttery smooth spring physics to absorb harsh mouse-wheel staggered jumps
  // We remove useSpring entirely to prevent the physics engine from fighting with native browser scroll interpolation!
  // The zoom effect will now be buttery smooth because it directly syncs to the physical hardware scroll.

  // We use useMotionTemplate to dynamically construct a CSS string and inject it directly into the CSSOM.
  // This bypasses the React Render Engine completely AND avoids hitting the Chrome GPU texture size limit (>8192px).
  const maskScale = useTransform(scrollYProgress, [0, 0.4], [40, 25000])
  const webkitMaskSize = useMotionTemplate`${maskScale}vw, 100% 100%`

  const opacity = useTransform(scrollYProgress, [0.4, 0.45], [1, 0])
  const pointerEvents = useTransform(scrollYProgress, (v) => v >= 0.4 ? 'none' : 'auto')

  // Fade out scroll hint immediately as user starts moving
  const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <div ref={containerRef} style={{ height: '250vh', position: 'relative' }}>
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>

        {/* The real background: Manifesto */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 10 }}>
          <ManifestoSection scrollYProgress={scrollYProgress} />
        </div>

        {/* The inverted mask overlay: Escapes stacking context via Portal to cover the Navbar */}
        {createPortal(
          <motion.div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: '#000000',
              zIndex: 2000, // Now cleanly overtakes the Notch's 1000 z-index
              opacity,
              pointerEvents,
              WebkitMaskImage: `url(/iedc_logo_black.png), linear-gradient(#000, #000)`,
              WebkitMaskSize: webkitMaskSize,
              WebkitMaskPosition: 'center, center',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskComposite: 'destination-out',
              maskComposite: 'exclude',
              willChange: 'mask-size, -webkit-mask-size, opacity',
            }}
          >
            {/* Scroll hint appended inside the Portaled canvas */}
            <motion.div
              style={{
                position: 'absolute', bottom: '2rem', left: '50%', x: '-50%',
                textAlign: 'center', zIndex: 60, opacity: hintOpacity,
              }}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.2em' }}>scroll to explore</p>
              <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(255,255,255,0.4), transparent)', margin: '0 auto' }} />
            </motion.div>
          </motion.div>,
          document.body
        )}

      </div>
    </div>
  )
}

// ─── Manifesto Section (Animated Scroll Layer) ─────────────────────────────────
function ManifestoSection({ scrollYProgress = 0 }) {
  // Animate the words coming from the sides while zooming
  const createX = useTransform(scrollYProgress, [0, 0.4], ['-25vw', '0vw'])
  const createOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1])

  const inspireScale = useTransform(scrollYProgress, [0, 0.4], [0.8, 1])
  const inspireOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1])

  const transformX = useTransform(scrollYProgress, [0, 0.4], ['25vw', '0vw'])
  const transformOpacity = useTransform(scrollYProgress, [0.05, 0.35], [0, 1])

  const descY = useTransform(scrollYProgress, [0.15, 0.4], ['3vh', '0vh'])
  const descOpacity = useTransform(scrollYProgress, [0.15, 0.4], [0, 1])

  return (
    <section
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
      <div style={{ position: 'relative', zIndex: 5, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
        <motion.div
          style={{
            x: createX,
            opacity: createOpacity,
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
          style={{
            scale: inspireScale,
            opacity: inspireOpacity,
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
            marginTop: '-0.25em',
          }}
        >
          inspire.
        </motion.div>

        <motion.div
          style={{
            x: transformX,
            opacity: transformOpacity,
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
          style={{
            y: descY,
            opacity: descOpacity,
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



// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
      <LogoRevealHero />
      <InitiativesSection />
    </div>
  )
}
