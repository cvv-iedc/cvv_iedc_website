import { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence, animate } from 'framer-motion'
import { milestones } from '../data/milestones'
import { useEvents } from '../hooks/useEvents'

// ─── Vertical Intro ───────────────────────────────────────────────────────────
function AboutIntro() {
  return (
    <section style={{
      padding: 'clamp(5rem, 12vw, 9rem) clamp(1.5rem, 6vw, 5rem) 2rem',
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

    // ─── Radial Wave Settings ───
    const minDistance = 100 // Area for the logo
    const maxDistance = 800 // Far edge

    const init = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      createParticles()
    }

    const createParticles = () => {
      particles = []
      // High-performance count while maintaining a lush feel
      const numParticles = 600
      const colors = ['#e32636', '#ff55a3', '#8b008b', '#00693e', '#f87171']

      for (let i = 0; i < numParticles; i++) {
        particles.push({
          angle: Math.random() * Math.PI * 2,
          distance: minDistance + Math.random() * (maxDistance - minDistance),
          speed: 0.8 + Math.random() * 1.5,
          size: Math.random() * 1.8 + 0.6,
          color: colors[Math.floor(Math.random() * colors.length)]
        })
      }
    }

    const animate = () => {
      if (!canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      particles.forEach(p => {
        // Simple outward propagation
        p.distance += p.speed

        // Wrap around when reaching the outer boundary
        if (p.distance > maxDistance) {
          p.distance = minDistance
          p.angle = Math.random() * Math.PI * 2 // Randomize new angle for organic growth
        }

        // Polar to Cartesian conversion
        const x = centerX + Math.cos(p.angle) * p.distance
        const y = centerY + Math.sin(p.angle) * p.distance

        // Opacity scaling based on distance (fade in at centre, fade out at edge)
        const dRatio = (p.distance - minDistance) / (maxDistance - minDistance)
        // Highest opacity in the "mid-field"
        const opacity = Math.sin(dRatio * Math.PI) * 0.7

        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = Math.max(0, opacity)
        ctx.fill()

        // Occasional sparkles for particles closer to the center
        if (dRatio < 0.25 && Math.random() > 0.98) {
          ctx.beginPath()
          ctx.arc(x, y, p.size * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = '#ffffff'
          ctx.globalAlpha = 0.9
          ctx.fill()
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', init)

    // Smooth deferred start
    const startTimeout = setTimeout(() => {
      init()
      animate()
    }, 600)

    return () => {
      clearTimeout(startTimeout)
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', init)
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
        pointerEvents: 'none',
        borderBottomLeftRadius: '2rem',
        borderBottomRightRadius: '2rem',
        willChange: 'transform'
      }}
    />
  )
}

// ─── Our Impact Section ───────────────────────────────────────────────────────
function AnimatedCounter({ from = 0, to, duration = 2.5 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: "0px 0px -50px 0px" })

  useEffect(() => {
    if (inView) {
      const controls = animate(from, to, {
        duration,
        ease: "easeOut",
        onUpdate(value) {
          if (ref.current) {
            ref.current.textContent = Math.round(value)
          }
        }
      })
      return () => controls.stop()
    }
  }, [inView, from, to, duration])

  return <span ref={ref}>{from}</span>
}

function OurImpactSection() {
  const { events } = useEvents()
  const totalEvents = events?.length || 0

  const metrics = [
    { id: 1, label: 'Total Events', value: totalEvents },
    { id: 2, label: 'Total Members', value: 350 },
    { id: 3, label: 'Validated Ideas', value: 15 },
  ]

  return (
    <section style={{
      padding: '0rem clamp(1.5rem, 6vw, 5rem) 4rem',
      maxWidth: '1100px',
      margin: '0 auto',
      background: '#fff'
    }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2rem, 5vw, 3.5rem)',
          letterSpacing: '-0.03em',
          color: 'var(--color-text-primary)'
        }}>
          Our Impact
        </h2>
      </motion.div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '2.5rem',
      }}>
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0,0,0,0.08)' }}
            transition={{
              duration: 0.6,
              delay: index * 0.15,
              ease: [0.25, 0.46, 0.45, 0.94]
            }}
            style={{
              background: '#fff',
              border: '1px solid rgba(0,0,0,0.06)',
              borderRadius: '2rem',
              padding: '3.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Subtle glow internally */}
            <div style={{
              position: 'absolute',
              top: '-50px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100px',
              height: '100px',
              background: 'var(--color-primary)',
              filter: 'blur(70px)',
              opacity: 0.15,
              pointerEvents: 'none'
            }} />
            <div style={{
              fontFamily: 'var(--font-display)',
              fontWeight: 800,
              fontSize: '4.5rem',
              color: 'var(--color-text-primary)',
              lineHeight: 1,
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <AnimatedCounter to={metric.value} duration={2.5} />
              <span style={{ color: '#D71515', fontSize: '3.5rem' }}>+</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '1.05rem',
              color: 'var(--color-text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em'
            }}>
              {metric.label}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
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
            <i style={{ color: '#d71515', fontWeight: 'bold' }}>Our logo represents the spirit of innovation, continuity, and transformation at IEDC.</i>
            <br />
            The bold, flowing typography reflects creativity in motion, ideas that are not static, but constantly evolving. The continuous line forming the initial strokes symbolizes an unbroken journey of innovation, where one idea seamlessly leads to another.
            The interplay between curves and sharp edges reflects the balance between creativity and precision, a core principle of every successful startup.
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
        top: isActive ? 'calc(50% - 185px)' : 'calc(50% - 130px)',
        left: 0,
        right: 0,
        textAlign: 'center',
        fontFamily: 'var(--font-heading)',
        fontWeight: 700,
        fontSize: '0.85rem',
        color: isActive ? '#d71515' : 'var(--color-text-muted)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        transition: 'all 0.4s ease',
        zIndex: 10,
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
          width: isActive ? '250px' : '140px',
          height: isActive ? '250px' : '140px',
          borderRadius: '50%',
          overflow: 'hidden',
          border: `4px solid ${isActive ? '#d71515' : '#fff'}`,
          boxShadow: isActive ? '0 8px 32px rgba(215,21,21,0.35)' : '0 4px 16px rgba(0,0,0,0.12)',
          background: `hsl(${milestone.id * 45 + 200}, 50%, 70%)`,
          transition: 'all 0.4s ease',
          flexShrink: 0,
          marginBottom: '0.8rem',
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
          background: isActive ? '#d71515' : '#fff',
          border: `3px solid ${isActive ? '#d71515' : 'var(--color-text-muted)'}`,
          transition: 'all 0.4s ease',
          boxShadow: isActive ? '0 0 0 6px rgba(215,21,21,0.15)' : 'none',
        }} />
      </div>

      {/* Description below center */}
      <div style={{
        position: 'absolute',
        top: isActive ? 'calc(50% + 155px)' : 'calc(50% + 110px)',
        left: '1.5rem',
        right: '1.5rem',
        textAlign: 'center',
        opacity: isActive ? 1 : 0.45,
        transition: 'all 0.4s ease',
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
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d71515' }}>
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
              background: i === activeIdx ? '#d71515' : 'var(--color-text-muted)',
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
    <section style={{ padding: 'clamp(3rem, 8vw, 6rem) clamp(1.5rem, 5vw, 3rem)', background: '#FFFFFF' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#d71515', marginBottom: '0.5rem' }}>Our Journey</p>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '2.5rem', color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}>Milestones</h2>
      </div>

      <div style={{ position: 'relative', maxWidth: '600px', margin: '0 auto' }}>
        {/* Vertical line */}
        <div style={{
          position: 'absolute', left: '20px', top: 0, bottom: 0,
          width: '2px',
          background: 'linear-gradient(to bottom, transparent, #d71515, transparent)',
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
              background: '#d71515',
              border: '3px solid #fff',
              boxShadow: '0 0 0 3px rgba(215,21,21,0.2)',
              flexShrink: 0,
            }} />
            <div>
              <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.75rem', color: '#d71515', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{m.month}</p>
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
      <OurImpactSection />
      <AboutLogoSection />
      {isMobile ? <VerticalTimeline /> : <HorizontalTimeline />}


    </div>
  )
}
