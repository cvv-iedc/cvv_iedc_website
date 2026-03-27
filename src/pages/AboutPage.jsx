import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { milestones } from '../data/milestones'

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
        style={{ textAlign: 'center' }}
      >

        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 6rem)',
          letterSpacing: '-0.04em',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
          marginBottom: '2rem',
        }}>
          About Us
        </h1>

        {/* Partner Logos */}
        <div style={{ display: 'flex', gap: '4rem', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', marginBottom: '4rem' }}>
          <img src="/ksum_logo.png" alt="KSUM Logo" style={{ height: '100px', width: 'auto', objectFit: 'contain' }} />
          <img src="/ksum_iedc_logo.png" alt="KSUM IEDC Logo" style={{ height: '125px', width: 'auto', objectFit: 'contain' }} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '2rem' }}>
          {[
            { title: 'Our Mission', body: 'To cultivate a thriving ecosystem where students can explore, experiment, and execute their entrepreneurial ideas — transforming them from concepts into impactful startups.' },
            { title: 'Our Vision', body: 'To be the most dynamic student innovation hub in Kerala, producing tomorrow\'s startup founders, changemakers, and technology leaders from the campus of Chinmaya Vishwa Vidyapeeth.' },
            { title: 'About Us', body: 'IEDC CVV is a Kerala Startup Mission (KSUM) initiative at Chinmaya Vishwa Vidyapeeth. Since 2018, we\'ve hosted 50+ events, incubated 5 startups, and built a 500+ member strong community.' },
          ].map(({ title, body }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              style={{ textAlign: 'center' }}
            >
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.15rem', color: 'var(--color-text-primary)', marginBottom: '0.7rem' }}>{title}</h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-secondary)', lineHeight: 1.75 }}>{body}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>


    </section>
  )
}

// ─── Interactive Particle Canvas ────────────────────────────────────────────────
function InteractiveParticles() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let particles = []

    // Mouse state
    let mouse = { x: -1000, y: -1000, radius: 150 }

    const init = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      createParticles()
    }

    const createParticles = () => {
      particles = []
      // calculate density based on screen size (decreased divisor for more particles)
      const numParticles = Math.floor((canvas.width * canvas.height) / 3500)
      const colors = ['#2563eb', '#dc2626', '#60a5fa', '#f87171']

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          baseRadius: Math.random() * 1.5 + 0.5,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    window.addEventListener('resize', init)
    init()

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const handleMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }

    canvas.addEventListener('mousemove', handleMouseMove)
    canvas.addEventListener('mouseleave', handleMouseLeave)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach(p => {
        p.x += p.vx
        p.y += p.vy

        // Wrap around gracefully
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        // Repel mouse
        let dx = mouse.x - p.x
        let dy = mouse.y - p.y
        let distance = Math.sqrt(dx * dx + dy * dy)
        let forcedRadius = mouse.radius

        if (distance < forcedRadius) {
          let forceDirectionX = dx / distance
          let forceDirectionY = dy / distance
          let force = (forcedRadius - distance) / forcedRadius

          // push particles away from cursor
          let directionX = forceDirectionX * force * 2.5
          let directionY = forceDirectionY * force * 2.5

          p.x -= directionX
          p.y -= directionY
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.baseRadius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = 0.6
        ctx.fill()
      })

      // Connections
      ctx.lineWidth = 0.5
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.beginPath()
            ctx.strokeStyle = `rgba(100, 100, 150, ${0.15 * (1 - distance / 80)})`
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', init)
      canvas.removeEventListener('mousemove', handleMouseMove)
      canvas.removeEventListener('mouseleave', handleMouseLeave)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'auto',
        borderRadius: '2rem'
      }}
    />
  )
}

// ─── About Logo Section ───────────────────────────────────────────────────────
function AboutLogoSection() {
  return (
    <section style={{
      padding: '4rem clamp(1.5rem, 6vw, 5rem) 8rem',
      maxWidth: '1100px',
      margin: '0 auto'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: 'center' }}
      >
        {/* Section Title */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-0.03em',
          color: 'var(--color-text-primary)',
          marginBottom: '0.5rem'
        }}>
          About our Logo
        </h2>

        {/* Animated Glowing Logo - NOW IN THE MIDDLE */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', minHeight: '300px', marginBottom: '0.5rem' }}>

          {/* Interactive Background Particles */}
          <InteractiveParticles />

          {/* Clean Foreground Logo */}
          <motion.img
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.6 }}
            src="/iedc_logo_white.png"
            alt="IEDC Logo Elements"
            draggable={false}
            style={{
              width: 'min(100%, 380px)',
              height: 'auto',
              objectFit: 'contain',
              filter: 'invert(1) drop-shadow(0 25px 55px rgba(0,0,0,0.2))',
              position: 'relative',
              zIndex: 1,
            }}
          />
        </div>

        {/* Text Content - NOW AT THE BOTTOM */}
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '1.1rem',
            color: 'var(--color-text-secondary)',
            lineHeight: 1.8,
            textAlign: 'center'
          }}>
            Our logo is a symbol of synergy between innovation, technology, and entrepreneurship. The clean, modern typography represents our commitment to clarity and professional excellence, while the red dot signifies the spark of an idea that ignites the engine of progress.
          </p>
        </div>
      </motion.div>
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
      style={{ height: `${milestones.length * 100}vh`, position: 'relative', zIndex: 1 }}
    >
      <div style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        background: 'transparent',
      }}>

        {/* Dynamic Static Background Year */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0, overflow: 'hidden'
        }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={milestones[activeIdx]?.year}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 0.04, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 900,
                fontSize: 'clamp(14rem, 30vw, 35rem)',
                color: 'var(--color-text-primary)',
                lineHeight: 1,
                userSelect: 'none',
                pointerEvents: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {milestones[activeIdx]?.year}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Section header */}
        <div style={{ position: 'relative', zIndex: 10, padding: '0 3rem', marginBottom: '1rem', textAlign: 'center' }}>
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
      <AboutLogoSection />
      {isMobile ? <VerticalTimeline /> : <HorizontalTimeline />}


    </div>
  )
}
