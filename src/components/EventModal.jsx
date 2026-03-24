import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Clock, Calendar, ExternalLink } from 'lucide-react'

export default function EventModal({ event, onClose }) {
  if (!event) return null

  return (
    <AnimatePresence>
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(15,23,42,0.65)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
        }}
      >
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.93, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.93, y: 40 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: '#fff',
            borderRadius: 'var(--radius-modal)',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '860px',
            maxHeight: '90vh',
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)',
            boxShadow: '0 32px 80px rgba(0,0,0,0.25)',
          }}
          className="event-modal-grid"
        >
          {/* Left: Image */}
          <div style={{ position: 'relative', minHeight: '300px' }}>
            <img
              src={event.image}
              alt={event.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #2563EB22, #16A34A22)'
                e.target.src = ''
              }}
            />
            {/* Gradient overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.7) 0%, transparent 60%)',
            }} />
            {/* Date badge */}
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              background: 'var(--color-primary)', color: '#fff',
              borderRadius: '0.75rem', padding: '0.4rem 0.85rem',
              fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
            }}>
              {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
            {/* Tags */}
            <div style={{ position: 'absolute', bottom: '1rem', left: '1rem', display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {event.tags?.map((tag) => (
                <span key={tag} style={{
                  background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                  color: '#fff', borderRadius: '9999px', padding: '0.2rem 0.65rem',
                  fontSize: '0.72rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.3)',
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ padding: '2rem', overflowY: 'auto', position: 'relative' }}>
            {/* Close button */}
            <button
              onClick={onClose}
              style={{
                position: 'absolute', top: '1rem', right: '1rem',
                background: 'rgba(15,23,42,0.06)', border: 'none', borderRadius: '50%',
                width: '36px', height: '36px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-secondary)',
              }}
            >
              <X size={18} />
            </button>

            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.2rem, 3vw, 1.6rem)',
              fontWeight: 800,
              color: 'var(--color-text-primary)',
              lineHeight: 1.2,
              marginBottom: '1rem',
              paddingRight: '2rem',
            }}>
              {event.title}
            </h2>

            {/* Meta info */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
              {[
                { icon: Calendar, text: new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }) },
                { icon: Clock, text: event.time },
                { icon: MapPin, text: event.location },
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>
                  <Icon size={15} style={{ flexShrink: 0, color: 'var(--color-primary)' }} />
                  <span style={{ fontFamily: 'var(--font-body)' }}>{text}</span>
                </div>
              ))}
            </div>

            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              color: 'var(--color-text-secondary)',
              lineHeight: 1.7,
              marginBottom: '1.5rem',
            }}>
              {event.description}
            </p>

            {/* Tiers */}
            {event.tiers?.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-text-muted)', marginBottom: '0.75rem' }}>
                  Registration Tiers
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                  {event.tiers.map((tier, i) => (
                    <div
                      key={tier.name}
                      style={{
                        border: `1px solid ${i === 0 ? 'rgba(37,99,235,0.3)' : 'rgba(0,0,0,0.08)'}`,
                        borderRadius: '0.875rem',
                        padding: '0.75rem 1rem',
                        background: i === 0 ? 'rgba(37,99,235,0.04)' : '#fafafa',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-primary)' }}>{tier.name}</span>
                        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-primary)' }}>{tier.price}</span>
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                        {tier.perks.map((perk) => (
                          <span key={perk} style={{ background: 'rgba(22,163,74,0.1)', color: 'var(--color-secondary)', borderRadius: '9999px', padding: '0.15rem 0.55rem', fontSize: '0.72rem', fontWeight: 600 }}>
                            ✓ {perk}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <a
              href={event.registerUrl || '#'}
              style={{
                display: 'block', textAlign: 'center', textDecoration: 'none',
                padding: '0.8rem 1.5rem',
                background: 'var(--color-primary)', color: '#fff',
                borderRadius: 'var(--radius-button)',
                fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                marginBottom: '0.75rem',
              }}
              onMouseEnter={(e) => { e.target.style.background = 'var(--color-accent)'; e.target.style.transform = 'translateY(-2px)' }}
              onMouseLeave={(e) => { e.target.style.background = 'var(--color-primary)'; e.target.style.transform = 'translateY(0)' }}
            >
              Register Now →
            </a>
            <a
              href="#"
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                textDecoration: 'none', color: 'var(--color-text-secondary)',
                fontFamily: 'var(--font-body)', fontSize: '0.85rem',
              }}
            >
              <ExternalLink size={14} /> Add to Calendar
            </a>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
