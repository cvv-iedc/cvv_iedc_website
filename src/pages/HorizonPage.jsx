import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { initiatives } from '../data/initiatives'
import { Rocket, Lightbulb, TrendingUp, Handshake } from 'lucide-react'

const horizonData = initiatives.find(i => i.title === 'Horizon')

function HorizonCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let animationFrameId
    
    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    
    window.addEventListener('resize', init)
    init()
    
    const particles = Array.from({ length: 100 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      speed: Math.random() * 1.5 + 0.5,
      size: Math.random() * 2.5 + 0.5,
      wobble: Math.random() * Math.PI * 2,
      wobbleSpeed: Math.random() * 0.05 + 0.01,
      alpha: Math.random() * 0.8 + 0.2
    }))

    const animate = () => {
      ctx.fillStyle = '#FFFFFF' // Light background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      const cx = canvas.width / 2
      const horizonY = canvas.height * 0.7
      
      // Giant glowing background sun/horizon
      const bgGradient = ctx.createRadialGradient(cx, horizonY, 0, cx, horizonY, canvas.width * 0.6)
      bgGradient.addColorStop(0, 'rgba(220, 38, 38, 0.12)') // Lighter red glow
      bgGradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.03)')
      bgGradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
      
      ctx.fillStyle = bgGradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw embers (particles moving UP)
      particles.forEach(p => {
        p.y -= p.speed
        p.wobble += p.wobbleSpeed
        p.x += Math.sin(p.wobble) * 0.5

        if (p.y < 0) {
          p.y = canvas.height
          p.x = Math.random() * canvas.width
        }
        
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220, 38, 38, ${p.alpha})` // Clear red embers
        ctx.fill()
      })

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
      <HorizonCanvas />
      
      <motion.div 
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', y: y1, opacity, padding: '0 2rem', marginTop: '-10vh' }}
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
             background: 'rgba(220, 38, 38, 0.08)',
             border: '1px solid rgba(220, 38, 38, 0.2)',
             borderRadius: '999px',
             marginBottom: '2rem',
             backdropFilter: 'blur(10px)'
           }}
        >
          <Rocket size={18} color="#DC2626" />
          <span style={{ color: '#DC2626', fontFamily: 'var(--font-heading)', fontWeight: 600, letterSpacing: '0.1em', fontSize: '0.85rem', textTransform: 'uppercase' }}>
            {horizonData.subtitle}
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
            background: 'linear-gradient(to bottom, #0F172A, #991B1B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: '1.5rem'
          }}
        >
          {horizonData.title.toUpperCase()}
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
          {horizonData.description}
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
    { icon: <Handshake color="#DC2626" size={32} />, title: "Community Impact", desc: "Solving real-world challenges faced by the local community through actionable and sustainable solutions." },
    { icon: <Lightbulb color="#DC2626" size={32} />, title: "Problem Bank", desc: "A curated repository of pain points requiring technological intervention, open for students to tackle." },
    { icon: <TrendingUp color="#DC2626" size={32} />, title: "Scaling Ideas", desc: "Taking solutions built on campus and deploying them into the real world for measurable impact." }
  ]

  return (
    <section style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ color: '#DC2626', fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}
          >
            Our Scope
          </motion.p>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
            style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}
          >
            Expanding Reality
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
                background: '#FEF2F2',
                borderRadius: '1.5rem',
                padding: '3rem 2.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #FEE2E2',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #DC2626, #F87171)' }} />
              <div style={{
                width: '64px', height: '64px', borderRadius: '1rem', background: '#FEE2E2', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'
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
    <section style={{ padding: '6rem 2rem', background: '#FEF2F2', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(220,38,38,0.08) 0%, transparent 70%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
          Expand the Horizon
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: '#475569', marginBottom: '3rem' }}>
          Pick a real-world problem and build solutions that matter. The community is waiting for your next big idea.
        </p>
        <button style={{
          padding: '1.2rem 3rem',
          background: '#DC2626',
          color: '#FFF',
          border: 'none',
          borderRadius: '999px',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '1.1rem',
          letterSpacing: '0.05em',
          cursor: 'pointer',
          boxShadow: '0 10px 25px rgba(220,38,38,0.3)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(220,38,38,0.4)' }}
        onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(220,38,38,0.3)' }}
        >
          VIEW PROBLEM STATEMENTS
        </button>
      </motion.div>
    </section>
  )
}

export default function HorizonPage() {
  return (
    <div style={{ background: '#FFF' }}>
      <HeroSection />
      <AboutSection />
      <CTASection />
    </div>
  )
}
