import { useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { initiatives } from '../data/initiatives'
import { Fingerprint, Activity, Network, ChevronRight } from 'lucide-react'

const eclipseData = initiatives.find(i => i.title === 'Eclipse')
const horizonData = initiatives.find(i => i.title === 'Horizon')

function HeroSection() {
  const { scrollY } = useScroll()
  const y1 = useTransform(scrollY, [0, 500], [0, 150])
  const opacity = useTransform(scrollY, [0, 300], [1, 0])

  const particles = useMemo(() => {
    return Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      size: Math.random() * 4 + 3,
      duration: Math.random() * 4 + 4,
      delay: Math.random() * 4,
      targetXFactor: (Math.random() - 0.5),
      targetYFactor: (Math.random() - 0.5),
      color: Math.random() > 0.5 ? '#FFD700' : '#001F3F',
    }))
  }, [])

  return (
    <section style={{ position: 'relative', height: '110vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        style={{ position: 'relative', zIndex: 10, textAlign: 'center', y: y1, opacity, padding: '0 2rem' }}
      >
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          style={{ position: 'relative', display: 'inline-block' }}
        >
          {/* Animated Glow Aura */}
          <motion.div
            animate={{
              opacity: [0.15, 0.4, 0.15],
              scale: [0.9, 1.1, 0.9]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              width: '140%',
              height: '140%',
              background: `radial-gradient(circle, ${eclipseData.color} 0%, transparent 65%)`,
              filter: 'blur(30px)',
              zIndex: -1,
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
          />

          {/* Drifting Particles */}
          {particles.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
              animate={{
                opacity: [0, 0.6, 0],
                scale: [0.5, 1.5, 0.5],
                x: [0, `calc(${p.targetXFactor} * 80vw)`],
                y: [0, `calc(${p.targetYFactor} * 80vh)`],
              }}
              transition={{
                duration: p.duration,
                repeat: Infinity,
                ease: "easeOut",
                delay: p.delay
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: p.size,
                height: p.size,
                background: p.color,
                borderRadius: '50%',
                zIndex: -1,
                pointerEvents: 'none',
              }}
            />
          ))}

          <motion.img
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: 'spring', stiffness: 100 }}
            src={`/${eclipseData.logo}`}
            alt={eclipseData.title}
            style={{
              height: 'clamp(5.5rem, 13vw, 15rem)',
              width: 'auto',
              display: 'block',
              margin: '0 auto 1.5rem',
              objectFit: 'contain',
              position: 'relative',
              zIndex: 1,
              filter: `drop-shadow(0 15px 35px rgba(0, 31, 63, 0.2))`
            }}
          />
        </motion.div>

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
          <i>{eclipseData.description}</i>
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
    { icon: <Fingerprint color="#001F3F" size={32} />, title: "Identity & Origin", desc: "A centralized record of submitted ideas, mapping the DNA of every pitch generated during our events." },
    { icon: <Activity color="#001F3F" size={32} />, title: "Progress Tracking", desc: "Structured guidance and monitoring to ensure fledgling concepts receive the momentum they need." },
    { icon: <Network color="#001F3F" size={32} />, title: "Startup Registration", desc: "Facilitating the transition from a mere concept to a recognized, registered startup entity." }
  ]

  return (
    <section style={{ padding: 'clamp(5rem, 10vw, 8rem) clamp(1.5rem, 5vw, 4rem)', background: '#FFFFFF' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
          <motion.p
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ color: '#001F3F', fontFamily: 'var(--font-heading)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}
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
                width: '64px', height: '64px', borderRadius: '1rem', background: 'rgba(0,31,63,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '2rem'
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
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(0,31,63,0.06) 0%, transparent 70%)' }} />
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', zIndex: 10, maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, color: '#0F172A', marginBottom: '1.5rem' }}>
          Step out of the Shadow
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1.2rem', color: '#475569', marginBottom: '3rem' }}>
          Have an idea that could change the world? Pitch it to us and let's start tracking your journey to a successful startup.
        </p>
        <button
          onClick={() => window.open("https://forms.gle/qkHkpbApKCYHXvDc9", "_blank")}
          style=
          {{
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
            boxShadow: '0 10px 25px rgba(0,31,63,0.2)',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease'

          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,31,63,0.3)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 25px rgba(0,31,63,0.2)' }}
        >
          SUBMIT YOUR IDEA
        </button>
      </motion.div>
    </section>
  )
}

export default function EclipsePage() {
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
          onClick={() => navigate('/horizon')}
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
          {horizonData.title}
          <ChevronRight size={18} color="#FFD700" strokeWidth={3} />
        </motion.button>
      </motion.div>
    </div>
  )
}
