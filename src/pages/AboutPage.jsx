import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { milestones } from '../data/milestones'
import AnimatedCounter from '../components/AnimatedCounter'

const stats = [
  { value: 500, suffix: '+', label: 'Active Members' },
  { value: 7, suffix: '+', label: 'Years of Innovation' },
  { value: 50, suffix: '+', label: 'Events Organised' },
  { value: 5, suffix: '+', label: 'Startups Incubated' },
]

// ─── Vertical Intro ───────────────────────────────────────────────────────────
function AboutIntro() {
  return (
    <section style={{
      padding: 'clamp(5rem, 12vw, 9rem) clamp(1.5rem, 6vw, 5rem)',
      maxWidth: '1100px', margin: '0 auto',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '1rem' }}>
          Who We Are
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          letterSpacing: '-0.04em',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
          marginBottom: '2rem',
        }}>
          About IEDC CVV
        </h1>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
          {[
            { title: 'Our Mission', body: 'To cultivate a thriving ecosystem where students can explore, experiment, and execute their entrepreneurial ideas — transforming them from concepts into impactful startups.' },
            { title: 'Our Vision', body: 'To be the most dynamic student innovation hub in Kerala, producing tomorrow\'s startup founders, changemakers, and technology leaders from the campus of CVV.' },
            { title: 'About Us', body: 'IEDC CVV is a Kerala Startup Mission (KSUM) initiative at College of Velankanni. Since 2018, we\'ve hosted 50+ events, incubated 5 startups, and built a 500+ member strong community.' },
          ].map(({ title, body }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-text-primary)', marginBottom: '0.7rem' }}>{title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
        gap: '1.5rem',
        marginTop: '5rem',
        padding: '3rem',
        background: 'var(--color-surface)',
        borderRadius: 'calc(var(--radius-card) * 1.5)',
      }}>
        {stats.map(({ value, suffix = '+', label }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              letterSpacing: '-0.04em',
              color: 'var(--color-primary)',
            }}>
              <AnimatedCounter end={value} suffix={suffix} />
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.35rem' }}>
              {label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

// ─── Horizontal Timeline (desktop) / Vertical (mobile) ───────────────────────
function TimelineNode({ milestone, isActive }) {
  return (
    <div style={{
      position: 'relative',
      width: '380px',
      flexShrink: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Year faded background */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)',
        fontWeight: 900,
        fontSize: 'clamp(6rem, 15vw, 11rem)',
        color: 'var(--color-text-muted)',
        opacity: 0.25,
        pointerEvents: 'none',
        userSelect: 'none',
        whiteSpace: 'nowrap',
      }}>
        {milestone.year}
      </div>

      {/* Month label */}
      <div style={{
        position: 'absolute',
        top: 'calc(50% - 120px)',
        left: '2rem',
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: '0.8rem',
        color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transition: 'color 0.3s ease',
      }}>
        {milestone.month}
      </div>

      {/* Center dot on timeline line */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Circle photo */}
        <div style={{
          width: isActive ? '100px' : '80px',
          height: isActive ? '100px' : '80px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `4px solid ${isActive ? 'var(--color-primary)' : '#fff'}`,
          boxShadow: isActive ? '0 8px 32px rgba(37,99,235,0.35)' : '0 4px 16px rgba(0,0,0,0.12)',
          background: `hsl(${milestone.id * 45 + 200}, 50%, 70%)`,
          transition: 'all 0.4s ease',
          flexShrink: 0,
          marginBottom: '1rem',
        }}>
          <img
            src={milestone.image}
            alt={milestone.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => { e.target.style.display = 'none' }}
          />
        </div>

        {/* Dot marker */}
        <div style={{
          width: isActive ? '20px' : '12px',
          height: isActive ? '20px' : '12px',
          borderRadius: '50%',
          background: isActive ? 'var(--color-primary)' : '#fff',
          border: `3px solid ${isActive ? 'var(--color-primary)' : 'var(--color-text-muted)'}`,
          transition: 'all 0.4s ease',
          boxShadow: isActive ? '0 0 0 6px rgba(37,99,235,0.15)' : 'none',
        }} />
      </div>

      {/* Description below center */}
      <div style={{
        position: 'absolute',
        top: 'calc(50% + 100px)',
        left: '1.5rem',
        right: '1.5rem',
        textAlign: 'center',
        opacity: isActive ? 1 : 0.45,
        transition: 'opacity 0.3s ease',
      }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>
          {milestone.title}
        </h3>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.82rem', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          {milestone.description}
        </p>
      </div>
    </div>
  )
}

function HorizontalTimeline() {
  const sectionRef = useRef(null)
  const [activeIdx, setActiveIdx] = useState(0)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  const xTranslate = useTransform(
    scrollYProgress,
    [0, 1],
    [0, -(milestones.length - 1) * 380]
  )

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      const idx = Math.round(v * (milestones.length - 1))
      setActiveIdx(Math.max(0, Math.min(idx, milestones.length - 1)))
    })
    return unsub
  }, [scrollYProgress])

  return (
    <div
      ref={sectionRef}
      style={{ height: `${milestones.length * 100}vh`, position: 'relative' }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        background: 'var(--color-surface)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        {/* Section header */}
        <div style={{ padding: '0 3rem', marginBottom: '1rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)' }}>
            Our Journey
          </p>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(1.5rem, 4vw, 3rem)',
            color: 'var(--color-text-primary)',
            letterSpacing: '-0.03em',
          }}>
            Milestones
          </h2>
        </div>

        {/* Timeline line */}
        <div style={{ position: 'relative', height: '70vh', display: 'flex', alignItems: 'center' }}>
          <div className="timeline-line" />

          {/* Scrolling nodes */}
          <motion.div
            style={{
              x: xTranslate,
              display: 'flex',
              width: 'max-content',
              height: '100%',
              paddingLeft: '50vw',
              paddingRight: '50vw',
              alignItems: 'center',
            }}
          >
            {milestones.map((m, i) => (
              <TimelineNode key={m.id} milestone={m} isActive={i === activeIdx} />
            ))}
          </motion.div>
        </div>

        {/* Progress indicator */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          {milestones.map((_, i) => (
            <div key={i} style={{
              width: i === activeIdx ? '24px' : '8px',
              height: '8px',
              borderRadius: '9999px',
              background: i === activeIdx ? 'var(--color-primary)' : 'var(--color-text-muted)',
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Mobile vertical timeline
function VerticalTimeline() {
  return (
    <section style={{ padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)', background: 'var(--color-surface)' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>Our Journey</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Milestones</h2>
      </div>

      <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: '20px', top: 0, bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, transparent, var(--color-primary), transparent)',
        }} />

        {milestones.map((m) => (
          <motion.div
            key={m.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', gap: '1.5rem', marginBottom: '2.5rem', paddingLeft: '48px', position: 'relative' }}
          >
            {/* Dot */}
            <div style={{
              position: 'absolute', left: '10px', top: '4px',
              width: '20px', height: '20px', borderRadius: '50%',
              background: 'var(--color-primary)',
              border: '3px solid #fff',
              boxShadow: '0 0 0 3px rgba(37,99,235,0.2)',
              flexShrink: 0,
            }} />
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.75rem', color: 'var(--color-primary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{m.month}</p>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.05rem', color: 'var(--color-text-primary)', marginBottom: '0.4rem' }}>{m.title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.88rem', color: 'var(--color-text-secondary)', lineHeight: 1.65 }}>{m.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <div style={{ background: '#fff' }}>
      <AboutIntro />
      {isMobile ? <VerticalTimeline /> : <HorizontalTimeline />}


    </div>
  )
}
