import { useState, useMemo, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Calendar, ArrowRight, Clock, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'

// ─── Small card for All Events page ───────────────────────────────────────────
function SmallEventCard({ event, onClick }) {
  const past = event.isPast
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl overflow-hidden bg-white"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Image strip */}
      <div className="relative h-40 overflow-hidden" style={{ background: event.gradient }}>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-40 mix-blend-luminosity"
          onError={e => { e.target.style.display = 'none' }} loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        {past && (
          <div className="absolute top-2.5 left-2.5 bg-black/40 backdrop-blur rounded-full px-2 py-0.5 flex items-center gap-1">
            <Clock size={9} className="text-white/70" />
            <span className="text-[0.6rem] text-white/70 font-bold uppercase tracking-wide">Past</span>
          </div>
        )}
      </div>

      {/* Text */}
      <div className="p-4">
        <h3 className="font-bold text-slate-900 leading-tight mb-2 uppercase tracking-wide"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '0.9rem' }}>
          {event.title}
        </h3>
        <div className="flex flex-col gap-1 mb-3">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Calendar size={11} /> <span>{event.dateLabel}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <MapPin size={11} /> <span className="truncate">{event.venue}</span>
          </div>
        </div>
        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">{event.description}</p>
      </div>
    </motion.div>
  )
}

// ─── Event detail modal (reused from EventsPage) ──────────────────────────────
function EventModal({ event, onClose }) {
  const past = event ? event.isPast : false

  useEffect(() => {
    if (event) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
      document.body.style.overflow = 'hidden'
      document.body.style.paddingRight = `${scrollbarWidth}px`
    } else {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
    return () => {
      document.body.style.overflow = ''
      document.body.style.paddingRight = ''
    }
  }, [event])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={e => e.stopPropagation()}
            className="w-full bg-white overflow-hidden"
            style={{ maxWidth: '800px', maxHeight: '90vh', borderRadius: '1.5rem', boxShadow: '0 40px 100px rgba(0,0,0,0.15)' }}
          >
            <div className="flex flex-col md:flex-row" style={{ maxHeight: '90vh' }}>
              <div className="relative flex-shrink-0 md:w-[42%] min-h-[240px]" style={{ background: event.gradient }}>
                <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-50" onError={(e) => { e.target.style.display = 'none' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {past && (
                  <div className="absolute top-5 right-5 bg-black/40 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5">
                    <Clock size={11} className="text-white/70" /><span className="text-white/70 text-[0.65rem] font-bold uppercase tracking-wide">Past</span>
                  </div>
                )}

                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white/50 text-xs font-medium mb-0.5">{event.dateLabel}</p>
                  <p className="text-white text-xs font-semibold">{event.venue}</p>
                </div>
              </div>
              <div className="flex-1 p-8 flex flex-col overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                  <X size={15} className="text-slate-500" />
                </button>
                <h2 className="font-extrabold text-slate-900 leading-none mb-5 pr-8"
                  style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,3.5vw,1.8rem)', letterSpacing: '-0.03em' }}>
                  {event.title}
                </h2>
                <div className="flex flex-col gap-2.5 mb-5">
                  {[
                    { id: 'date', Icon: Calendar, text: event.dateLabel },
                    { id: 'time', Icon: Clock, text: event.time },
                    { id: 'venue', Icon: MapPin, text: event.venue },
                    { id: 'fee', Icon: Ticket, text: event.fee },
                  ]
                    .filter((item) => item.text)
                    .map(({ id, Icon, text }) => (
                      <div key={id} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${event.accent}18` }}>
                          <Icon size={13} style={{ color: event.accent }} />
                        </div>
                        <span className="text-sm text-slate-500">{text}</span>
                      </div>
                    ))}
                </div>
                <div className="h-px bg-slate-100 mb-5" />
                <p className="text-[0.88rem] text-slate-500 leading-relaxed flex-1 mb-6">{event.description}</p>
                {past ? (
                  <div className="flex items-center justify-center gap-2 w-full py-3 rounded-full bg-slate-100 text-slate-400 font-bold text-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                    <Clock size={15} /> Event Concluded
                  </div>
                ) : (
                  event.register_url ? (
                    <motion.a
                      href={event.register_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white font-bold text-sm"
                      style={{ background: event.accent, fontFamily: 'var(--font-heading)', textDecoration: 'none' }}
                    >
                      Register Now <ArrowRight size={15} />
                    </motion.a>
                  ) : (
                    <div
                      className="flex items-center justify-center gap-2 w-full py-3 rounded-full text-sm font-bold"
                      style={{
                        background: 'var(--color-surface)',
                        color: 'var(--color-text-secondary)',
                        fontFamily: 'var(--font-heading)'
                      }}
                    >
                      Registration not open yet
                    </div>
                  )
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

// ─── All Events Page ──────────────────────────────────────────────────────────
export default function AllEventsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { events: ALL_EVENTS, loading } = useEvents()

  const filtered = useMemo(() => {
    if (!query) return ALL_EVENTS
    const q = query.toLowerCase()
    return ALL_EVENTS.filter(e => e.searchString.includes(q))
  }, [query, ALL_EVENTS])

  if (loading) return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', fontFamily: 'var(--font-body)',
      color: 'var(--color-text-secondary)', fontSize: '0.95rem'
    }}>
      Loading events...
    </div>
  )

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(160deg, #f8f9fb 0%, #eef1f8 100%)', paddingTop: '6rem' }}>

      {/* ── Header ── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="px-6 md:px-16 pt-8 pb-8"
      >
        <button onClick={() => navigate('/events')}
          className="flex items-center gap-2 text-slate-400 hover:text-slate-700 text-sm font-medium mb-6 transition-colors"
          style={{ fontFamily: 'var(--font-heading)' }}>
          ← Back to Events
        </button>
        <h1 className="font-extrabold text-slate-900 leading-none mb-2"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem,8vw,5rem)', letterSpacing: '-0.04em' }}>
          All Events
        </h1>
        <p className="text-slate-400 text-base" style={{ fontFamily: 'var(--font-body)' }}>
          {ALL_EVENTS.length} events across workshops, hackathons, talks &amp; more.
        </p>
      </motion.div>

      {/* ── Search + Filter bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.45 }}
        className="px-6 md:px-16 mb-8 flex flex-col sm:flex-row gap-3"
      >
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search events..."
            className="w-full pl-10 pr-10 py-3.5 rounded-full bg-white text-slate-800 text-sm outline-none placeholder-slate-400"
            style={{
              fontFamily: 'var(--font-body)',
              border: '1px solid rgba(0,0,0,0.08)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={14} />
            </button>
          )}
        </div>
      </motion.div>

      {/* ── Results count ── */}
      <div className="px-6 md:px-16 mb-5 flex items-center gap-3">
        <span className="text-slate-400 text-xs font-medium" style={{ fontFamily: 'var(--font-body)' }}>
          {filtered.length} event{filtered.length !== 1 ? 's' : ''}
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* ── Grid ── */}
      <div className="px-6 md:px-16 pb-20">
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="text-center py-24"
            >
              <p className="text-slate-400 text-lg mb-2" style={{ fontFamily: 'var(--font-heading)' }}>No events found</p>
              <p className="text-slate-300 text-sm">Try a different search or filter.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid gap-5"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))' }}
            >
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <SmallEventCard event={event} onClick={() => setSelectedEvent(event)} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />
    </div>
  )
}
