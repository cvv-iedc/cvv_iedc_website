import { useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { initiatives } from '../data/initiatives'
import { Lightbulb, TrendingUp, Handshake, ChevronRight } from 'lucide-react'

const horizonData = initiatives.find(i => i.title === 'Horizon')
const orbitData = initiatives.find(i => i.title === 'Orbit')

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
      alpha: Math.random() * 0.8 + 0.2,
      color: Math.random() > 0.5 ? '#FFD700' : '#001F3F'
    }))

    const animate = () => {
      ctx.fillStyle = '#FFFFFF' // Light background
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const cx = canvas.width / 2
      const horizonY = canvas.height * 0.7

      // Giant glowing background sun/horizon
      const bgGradient = ctx.createRadialGradient(cx, horizonY, 0, cx, horizonY, canvas.width * 0.6)
      bgGradient.addColorStop(0, 'rgba(0, 31, 63, 0.08)') // Navy horizon glow
      bgGradient.addColorStop(0.5, 'rgba(0, 31, 63, 0.02)')
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
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1.0 // Reset
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
    <section style={{ position: 'relative', height: '120vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <HorizonCanvas />

      <motion.div
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', y: y1, opacity, padding: '0 2rem' }}
      >
        <motion.img
          initial={{ opacity: 0, scale: 1, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
          src={`/${horizonData.logo}`}
          alt={horizonData.title}
          style={{
            height: 'clamp(5.5rem, 13vw, 15rem)',
            width: 'auto',
            display: 'block',
            margin: '0 auto 1.5rem',
            objectFit: 'contain'
          }}
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(1rem, 1.5vw, 1.15rem)',
            color: '#475569',
            maxWidth: '700px',
            margin: '0 auto',
            lineHeight: 1.6,
          }}
        >
          <i>{horizonData.description}</i>
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
    { icon: <Handshake color="#001F3F" size={32} />, title: "Community Impact", desc: "Solving real-world challenges faced by the local community through actionable and sustainable solutions." },
    { icon: <Lightbulb color="#001F3F" size={32} />, title: "Problem Bank", desc: "A curated repository of pain points requiring technological intervention, open for students to tackle." },
    { icon: <TrendingUp color="#001F3F" size={32} />, title: "Scaling Ideas", desc: "Taking solutions built on campus and deploying them into the real world for measurable impact." }
  ]

  return (
    <section style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ color: '#001F3F', fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}
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
                background: '#F8FAFC',
                borderRadius: '1.5rem',
                padding: '3rem 2.5rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                border: '1px solid #E2E8F0',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '4px', background: 'linear-gradient(to right, #001F3F, #FFD700)' }} />
              <div style={{
                width: '64px', height: '64px', borderRadius: '1rem', background: 'rgba(0, 31, 63, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'
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
    <section style={{ padding: '6rem 2rem', background: '#FFFFFF', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0, 31, 63, 0.06) 0%, transparent 70%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
          Expand the Horizon
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: '#475569', marginBottom: '3rem' }}>
          Pick a real-world problem and build solutions that matter. The community is waiting for your next big idea.
        </p>
        <button
          onClick={() => window.open("https://forms.gle/amCZqvpKi3eVHiXy7", "_blank")}
          style={{
            padding: '1.2rem 3rem',
            background: '#001F3F',
            color: '#FFF',
            border: 'none',
            borderRadius: '999px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(0, 31, 63, 0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 31, 63, 0.3)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 31, 63, 0.2)' }}
        >
          SUBMIT PROBLEM STATEMENTS
        </button>
      </motion.div>
    </section>
  )
}

export default function HorizonPage() {
  const navigate = useNavigate()

  return (
    <div style={{ background: '#FFF', position: 'relative' }}>
      <HeroSection />
      <AboutSection />
      <CTASection />

      {/* Next Initiative Pill */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          zIndex: 100,
        }}
      >
        <motion.button
          onClick={() => navigate('/orbit')}
          whileHover={{ scale: 1.05, x: -5 }}
          whileTap={{ scale: 0.95 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.8rem 1.5rem',
            background: '#001F3F',
            color: '#FFF',
            border: '1px solid rgba(255, 215, 0, 0.3)',
            borderRadius: '999px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '0.9rem',
            letterSpacing: '0.05em',
            cursor: 'pointer',
            boxShadow: '0 10px 30px rgba(0,0,0,0.2), 0 0 15px rgba(255, 215, 0, 0.1)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span style={{ opacity: 0.7, fontSize: '0.8rem', fontWeight: 500 }}>NEXT:</span>
          {orbitData.title}
          <ChevronRight size={18} color="#FFD700" strokeWidth={3} />
        </motion.button>
      </motion.div>
    </div>
  )
}
