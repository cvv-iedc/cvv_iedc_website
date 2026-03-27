import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { initiatives } from '../data/initiatives'
import { Lightbulb, Fingerprint, Activity, Network } from 'lucide-react'

const eclipseData = initiatives.find(i => i.title === 'Eclipse')

function EclipseCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    let time = 0
    
    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', init)
    init()
    
    const particles = Array.from({ length: 80 }, () => ({
      angle: 0,
      radius: 0, 
      speed: Math.random() * 1.5 + 0.5,
      size: Math.random() * 2 + 0.5,
      alpha: 1,
      reset: function(cx, cy, baseRadius) {
         this.angle = Math.random() * Math.PI * 2
         this.radius = baseRadius + Math.random() * 5
         this.alpha = Math.random() * 0.6 + 0.4
      }
    }))
    
    let isInitialized = false

    const animate = () => {
      time += 0.015
      ctx.fillStyle = '#FFFFFF' // Light background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const cx = canvas.width / 2
      const cy = canvas.height * 0.45 // slightly higher than center
      const eclipseRadius = Math.min(canvas.width, canvas.height) * 0.22
      
      if (!isInitialized) {
         particles.forEach(p => p.reset(cx, cy, eclipseRadius))
         isInitialized = true
      }

      // Corona glow (pulsing slightly)
      const pulse = Math.sin(time) * 15
      const coronaGradient = ctx.createRadialGradient(cx, cy, eclipseRadius * 0.8, cx, cy, eclipseRadius * 3 + pulse)
      coronaGradient.addColorStop(0, 'rgba(124, 58, 237, 0.4)') // vivid purple base
      coronaGradient.addColorStop(0.4, 'rgba(124, 58, 237, 0.1)')
      coronaGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = coronaGradient
      ctx.beginPath()
      ctx.arc(cx, cy, eclipseRadius * 3.5, 0, Math.PI * 2)
      ctx.fill()
      
      // Solar flares / Particles escaping
      particles.forEach(p => {
        p.radius += p.speed
        p.alpha -= 0.008
        
        if (p.alpha <= 0) {
           p.reset(cx, cy, eclipseRadius)
        }
        
        const x = cx + Math.cos(p.angle) * p.radius
        const y = cy + Math.sin(p.angle) * p.radius
        
        ctx.beginPath()
        ctx.arc(x, y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(124, 58, 237, ${p.alpha})` // solid purple particles
        ctx.fill()
      })
      
      // The Dark Moon (blocks the center)
      ctx.fillStyle = '#0F172A' // Dark slate on light sky
      ctx.beginPath()
      ctx.arc(cx, cy, eclipseRadius, 0, Math.PI * 2)
      ctx.fill()
      
      // Inner shadow for spherical volume
      const moonShadow = ctx.createRadialGradient(cx - eclipseRadius*0.4, cy - eclipseRadius*0.4, 0, cx, cy, eclipseRadius)
      moonShadow.addColorStop(0, 'rgba(255,255,255,0.05)')
      moonShadow.addColorStop(1, 'rgba(0,0,0,0.6)')
      ctx.fillStyle = moonShadow
      ctx.fill()

      animationFrameId = requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', init)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }} 
    />
  )
}

function HeroSection() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  return (
    <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <EclipseCanvas />
      
      <motion.div 
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', y: y1, opacity, padding: '0 2rem', marginTop: '10vh' }}
      >
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1, ease: 'easeOut' }}
           style={{
             display: 'inline-flex',
             alignItems: 'center',
             gap: '0.75rem',
             padding: '0.5rem 1.5rem',
             background: 'rgba(124, 58, 237, 0.08)',
             border: '1px solid rgba(124, 58, 237, 0.2)',
             borderRadius: '999px',
             marginBottom: '2rem',
             backdropFilter: 'blur(10px)'
           }}
        >
          <Lightbulb size={18} color="#7C3AED" />
          <span style={{ color: '#7C3AED', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.85rem', textTransform: 'uppercase' }}>
            {eclipseData.subtitle}
          </span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: 'clamp(4rem, 12vw, 9rem)', 
            fontWeight: 800, 
            lineHeight: 0.9,
            letterSpacing: '-0.04em',
            background: 'linear-gradient(to bottom, #FFFFFF, #E9D5FF)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 4px 16px rgba(0,0,0,0.4))',
            marginBottom: '1.5rem'
          }}
        >
          {eclipseData.title.toUpperCase()}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1.1rem, 2vw, 1.35rem)',
            color: '#475569',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6
          }}
        >
          {eclipseData.description}
        </motion.p>
      </motion.div>
      
      {/* Scroll Down Indicator */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        style={{ position: 'absolute', bottom: '2rem', left: '50%', x: '-50%', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <span style={{ color: '#94A3B8', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1rem' }}>Discover</span>
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2 }}>
          <div style={{ width: '1px', height: '40px', background: 'linear-gradient(to bottom, rgba(148,163,184,0.5), transparent)' }} />
        </motion.div>
      </motion.div>
    </section>
  )
}

function AboutSection() {
  const features = [
    { icon: <Fingerprint color="#7C3AED" size={32} />, title: "Identity & Origin", desc: "A centralized record of submitted ideas, mapping the DNA of every pitch generated during our events." },
    { icon: <Activity color="#7C3AED" size={32} />, title: "Progress Tracking", desc: "Structured guidance and monitoring to ensure fledgling concepts receive the momentum they need." },
    { icon: <Network color="#7C3AED" size={32} />, title: "Startup Registration", desc: "Facilitating the transition from a mere concept to a recognized, registered startup entity." }
  ]

  return (
    <section style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ color: '#7C3AED', fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}
          >
            Our Mechanism
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}
          >
            Illuminating Ideas
          </motion.h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2.5rem' }}>
          {features.map((f, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ y: -10 }}
              style={{
                background: '#FAF5FF',
                borderRadius: '1.5rem',
                padding: '3rem 2.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #F3E8FF',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #7C3AED, #A78BFA)' }} />
              <div style={{
                width: '64px', height: '64px', borderRadius: '1rem', background: '#F3E8FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'
              }}>
                {f.icon}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '1rem' }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section style={{ padding: '6rem 2rem', background: '#FAF5FF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(124,38,237,0.08) 0%, transparent 70%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
          Step out of the Shadow
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: '#475569', marginBottom: '3rem' }}>
          Have an idea that could change the world? Pitch it to us and let's start tracking your journey to a successful startup.
        </p>
        <button style={{
          padding: '1.2rem 3rem',
          background: '#7C3AED',
          color: '#FFF',
          border: 'none',
          borderRadius: '999px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(124,58,237,0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(124,58,237,0.4)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(124,58,237,0.3)' }}
        >
          PITCH YOUR IDEA
        </button>
      </motion.div>
    </section>
  )
}

export default function EclipsePage() {
  return (
    <div style={{ background: '#FFF' }}>
      <HeroSection />
      <AboutSection />
      <CTASection />
    </div>
  )
}
