import { useState } from 'react'
import { motion } from 'framer-motion'
import { events } from '../data/events'
import EventModal from '../components/EventModal'

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', paddingTop: '7rem', paddingBottom: '5rem' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 4rem)', padding: '0 2rem' }}
      >
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.75rem' }}>
          IEDC CVV
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
          letterSpacing: '-0.04em',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}>
          Events
        </h1>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.95rem, 2vw, 1.1rem)',
          color: 'var(--color-text-secondary)',
          maxWidth: '500px',
          margin: '1.25rem auto 0',
          lineHeight: 1.7,
        }}>
          Workshops, hackathons, talks, and competitions — all designed to spark your entrepreneurial journey.
        </p>
      </motion.div>

      {/* Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))',
        gap: '1.5rem',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 clamp(1.5rem, 5vw, 4rem)',
      }}>
        {events.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.07 }}
            whileHover={{ scale: 1.02, y: -4 }}
            onClick={() => setSelectedEvent(event)}
            style={{
              height: '420px',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
              position: 'relative',
              cursor: 'pointer',
              boxShadow: '0 8px 32px rgba(0,0,0,0.09)',
            }}
          >
            {/* Background */}
            <div style={{
              position: 'absolute', inset: 0,
              background: `linear-gradient(135deg, hsl(${210 + i * 25}, 65%, 55%), hsl(${210 + i * 25 + 35}, 55%, 35%))`,
            }}>
              <img
                src={event.image}
                alt={event.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => { e.target.style.display = 'none' }}
              />
            </div>
            {/* Overlay */}
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(to top, rgba(15,23,42,0.90) 0%, rgba(15,23,42,0.15) 55%, transparent 100%)',
            }} />
            {/* Date badge */}
            <div style={{
              position: 'absolute', top: '1rem', left: '1rem',
              background: 'var(--color-primary)', color: '#fff',
              borderRadius: '0.75rem', padding: '0.35rem 0.8rem',
              fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
            }}>
              {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
            </div>
            {/* Content */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                {event.tags?.slice(0, 2).map(tag => (
                  <span key={tag} style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', borderRadius: '9999px', padding: '0.15rem 0.6rem', fontSize: '0.7rem', fontWeight: 600, border: '1px solid rgba(255,255,255,0.25)' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h3 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.2rem', color: '#fff', lineHeight: 1.3, marginBottom: '0.45rem' }}>
                {event.title}
              </h3>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)', marginBottom: '1rem' }}>
                {event.location}
              </p>
              <div style={{
                display: 'inline-block',
                padding: '0.45rem 1.1rem',
                background: 'rgba(255,255,255,0.15)',
                border: '1px solid rgba(255,255,255,0.35)',
                borderRadius: '9999px',
                color: '#fff',
                fontFamily: 'var(--font-heading)',
                fontWeight: 600,
                fontSize: '0.8rem',
                backdropFilter: 'blur(8px)',
              }}>
                View Details →
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {selectedEvent && <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />}

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
