import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionTemplate } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
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
  const maskScale = useTransform(scrollYProgress, [0, 0.4], [40, 2000])
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
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
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
            fontSize: 'clamp(1rem, 1.2vw, 1.25rem)',
            lineHeight: 1.8,
            color: 'var(--color-text-secondary)',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          We are the engine of student-led innovation @ Chinmaya Vishwa Vidyapeeth, building ideas into impact since 2024.
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
  const navigate = useNavigate()

  return (
    <section style={{
      position: 'relative',
      overflow: 'hidden',
      padding: 'clamp(5rem, 12vw, 8rem) clamp(1.5rem, 5vw, 4rem)',
    }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', marginBottom: 'clamp(3rem, 7vw, 5rem)' }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
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
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2.5rem',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
        {initiatives.map((item) => {
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              whileHover={{ y: -12 }}
              style={{
                position: 'relative',
                borderRadius: '1.5rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden', // Clip the rotating border
              }}
            >
              {/* Spinning Neon Border Layer */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  width: '150%',
                  height: '150%',
                  background: `conic-gradient(from 0deg, transparent 70%, ${item.color} 80%, ${item.color} 100%)`,
                  animation: 'border-rotate 2s linear infinite', // Increased speed
                  zIndex: 0,
                }}
              />

              {/* Inner Frosted Glass Card Content */}
              <div style={{
                background: '#ffffff', // Opaque to hide the light behind text
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: 'calc(1.5rem - 2px)',
                margin: '2px', // The actual border thickness
                padding: '3.5rem 2.5rem',
                display: 'flex',
                flexDirection: 'column',
                height: 'calc(100% - 4px)',
                position: 'relative',
                zIndex: 1,
                minHeight: '476px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
                boxShadow: `
                  0 20px 40px rgba(0,0,0,0.04), 
                  inset 0 1px 0 rgba(255,255,255,0.8)
                `,
              }}>

                {/* Logo as Title */}
                <div style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2.5rem',
                }}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                  >
                    <img
                      src={item.logo}
                      loading="lazy"
                      alt={item.title}
                      style={{
                        height: 'clamp(4rem, 8vw, 5.5rem)',
                        width: 'auto',
                        objectFit: 'contain',
                        filter: `drop-shadow(0px 8px 24px ${item.color}35)`
                      }}
                    />
                  </motion.div>
                </div>

                {/* Description */}
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '1.05rem',
                  color: 'var(--color-text-secondary)',
                  lineHeight: 1.7,
                  marginBottom: '3rem',
                  textAlign: 'center',
                  flex: 1
                }}>
                  {item.description}
                </p>

                {/* Themed Button - Dark Navy Refinement */}
                <motion.button
                  onClick={() => navigate(`/${item.title.toLowerCase()}`)}
                  initial="initial"
                  whileHover="hovered"
                  whileTap="pressed"
                  variants={{
                    initial: {
                      scale: 1,
                      backgroundColor: `rgba(0, 31, 63, 0.05)`, // Subtle navy tint
                      color: '#001F3F', // Dark Navy
                      borderColor: `rgba(0, 31, 63, 0.15)`,
                    },
                    hovered: {
                      scale: 1, // Removed pop-up scale
                      backgroundColor: '#001F3F', // Dark Navy background
                      color: '#ffffff',
                      borderColor: '#001F3F',
                    },
                    pressed: { scale: 0.98 }
                  }}
                  style={{
                    width: '100%',
                    padding: '1.1rem',
                    borderRadius: '1rem',
                    border: '1px solid',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    marginTop: 'auto',
                    outline: 'none',
                    transition: 'border 0.15s ease, background-color 0.15s ease, color 0.15s ease' // Faster speed
                  }}
                >
                  Explore {item.title}
                  <motion.span
                    variants={{
                      initial: { x: 0, opacity: 0.8 },
                      hovered: { x: 6, opacity: 1 }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    →
                  </motion.span>
                </motion.button>
              </div> {/* Close Inner Card Content */}
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
