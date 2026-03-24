import { motion } from 'framer-motion'
import { team } from '../data/team'

// Duplicate array for infinite seamless scroll
const doubledTeam = [...team, ...team]

export default function TeamPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#fff', paddingTop: '6rem', paddingBottom: '5rem', overflow: 'hidden' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', padding: '2rem 2rem 3rem' }}
      >
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          The People Behind IEDC
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
          letterSpacing: '-0.04em',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}>
          Our Team
        </h1>
      </motion.div>

      {/* Marquee section with LEADS background */}
      <div style={{ position: 'relative', padding: '2rem 0 4rem', overflow: 'hidden' }}>
        {/* Big LEADS background text */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontFamily: 'var(--font-display)',
          fontWeight: 900,
          fontSize: 'clamp(8rem, 25vw, 22rem)',
          letterSpacing: '-0.06em',
          color: 'transparent',
          WebkitTextStroke: '2px rgba(203,213,225,0.45)',
          whiteSpace: 'nowrap',
          pointerEvents: 'none',
          zIndex: 0,
          userSelect: 'none',
        }}>
          LEADS
        </div>

        {/* Marquee */}
        <div style={{ position: 'relative', zIndex: 1, overflow: 'hidden' }}>
          <div className="animate-marquee">
            {doubledTeam.map((member, i) => (
              <motion.div
                key={`${member.id}-${i}`}
                whileHover={{ scale: 1.06 }}
                transition={{ duration: 0.25 }}
                style={{
                  flexShrink: 0,
                  width: '200px',
                  marginRight: '1.5rem',
                  textAlign: 'center',
                  cursor: 'default',
                }}
              >
                {/* Photo */}
                <div style={{
                  width: '160px',
                  height: '200px',
                  borderRadius: '1.25rem',
                  overflow: 'hidden',
                  margin: '0 auto',
                  background: `linear-gradient(135deg, hsl(${(i * 37 + 200) % 360}, 50%, 75%), hsl(${(i * 37 + 240) % 360}, 50%, 60%))`,
                  boxShadow: '0 8px 32px rgba(0,0,0,0.10)',
                  border: '3px solid rgba(255,255,255,0.9)',
                }}>
                  <img
                    src={member.photo}
                    alt={member.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                {/* Name & Role */}
                <div style={{ marginTop: '0.85rem' }}>
                  <p style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '0.95rem',
                    color: 'var(--color-text-primary)',
                    marginBottom: '0.25rem',
                  }}>
                    {member.name}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    color: i % 2 === 0 ? 'var(--color-primary)' : 'var(--color-secondary)',
                  }}>
                    {member.role}
                  </p>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.72rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.15rem',
                  }}>
                    {member.department}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Join CTA */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          textAlign: 'center',
          padding: '4rem 2rem',
          background: 'var(--color-surface)',
          margin: '2rem 2rem 0',
          borderRadius: 'calc(var(--radius-card) * 2)',
        }}
      >
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(1.75rem, 5vw, 3rem)',
          color: 'var(--color-text-primary)',
          letterSpacing: '-0.03em',
          marginBottom: '1rem',
        }}>
          Want to join the team?
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '1rem', color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem' }}>
          We recruit passionate innovators, designers, developers, and storytellers each year.
        </p>
        <a href="mailto:iedc@cvv.ac.in" style={{
          display: 'inline-block', textDecoration: 'none',
          padding: '0.9rem 2.5rem',
          background: 'var(--color-primary)', color: '#fff',
          borderRadius: 'var(--radius-button)',
          fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem',
        }}>
          Apply Now →
        </a>
      </motion.div>

      {/* Footer */}
      <footer style={{
        marginTop: '5rem',
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
      </footer>
    </div>
  )
}
