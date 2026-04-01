import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Calendar, Clock } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEvents } from '../hooks/useEvents'
import EventModal from '../components/EventModal'

// ─── Small card for All Events page ───────────────────────────────────────────
function SmallEventCard({ event, onClick }) {
  const past = event.isPast
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: '0 16px 40px rgba(0,0,0,0.12)' }}
      onClick={onClick}
      className="cursor-pointer rounded-2xl overflow-hidden bg-white h-full flex flex-col"
      style={{ boxShadow: '0 2px 12px rgba(0,0,0,0.07)', border: '1px solid rgba(0,0,0,0.06)' }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Image strip */}
      <div className="relative h-44 overflow-hidden flex-shrink-0" style={{ background: event.gradient || 'var(--color-primary)' }}>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover"
          onError={e => { e.target.style.display = 'none' }} loading="lazy" />
        {past && (
          <div className="absolute top-3 left-3 bg-black/40 backdrop-blur-md rounded-full px-2.5 py-1 flex items-center gap-1.5 border border-white/10">
            <Clock size={10} className="text-white/80" />
            <span className="text-[0.65rem] text-white/80 font-bold uppercase tracking-wider">Past</span>
          </div>
        )}
      </div>

      {/* Text Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-bold text-slate-900 leading-tight mb-3 uppercase tracking-wide group-hover:text-primary transition-colors"
          style={{ fontFamily: 'var(--font-heading)', fontSize: '0.95rem' }}>
          {event.title}
        </h3>
        
        <div className="space-y-2 mb-4 mt-auto">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <Calendar size={13} className="text-primary/70" /> 
            <span>{event.dateLabel}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 text-xs font-medium">
            <MapPin size={13} className="text-primary/70" /> 
            <span className="truncate">{event.venue || event.location}</span>
          </div>
        </div>
        
        <p className="text-slate-400 text-[0.8rem] leading-relaxed line-clamp-2 font-body">
          {event.description}
        </p>
      </div>
    </motion.div>
  )
}

// ─── All Events Page ──────────────────────────────────────────────────────────
export default function AllEventsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const { events: ALL_EVENTS, loading } = useEvents()

  const sortedEvents = useMemo(() => {
    // Reverse chronological: newest date first
    return [...ALL_EVENTS].sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [ALL_EVENTS])

  const filtered = useMemo(() => {
    if (!query) return sortedEvents
    const q = query.toLowerCase()
    return sortedEvents.filter(e => e.searchString.includes(q))
  }, [query, sortedEvents])

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
    <div className="min-h-screen pb-20" style={{ background: 'linear-gradient(160deg, #f8f9fb 0%, #eef1f8 100%)', paddingTop: '6rem' }}>

      {/* ── Header Section ── */}
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="pt-8 pb-12"
        >
          <button 
            onClick={() => navigate('/events')}
            className="flex items-center gap-2 text-slate-400 hover:text-primary text-sm font-bold mb-8 transition-colors uppercase tracking-widest"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            ← Back to Events
          </button>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-extrabold text-slate-900 leading-none mb-4"
                style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 5.5rem)', letterSpacing: '-0.04em' }}>
                All Events
              </h1>
              <p className="text-slate-500 text-lg font-medium max-w-xl" style={{ fontFamily: 'var(--font-body)' }}>
                Exploring {ALL_EVENTS.length} milestones of innovation, learning, and growth.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search events, workshops..."
                className="w-full pl-12 pr-12 py-4 rounded-2xl bg-white text-slate-800 text-sm outline-none placeholder-slate-400 transition-all focus:ring-2 focus:ring-primary/10"
                style={{
                  fontFamily: 'var(--font-body)',
                  border: '1px solid rgba(0,0,0,0.06)',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                }}
              />
              {query && (
                <button 
                  onClick={() => setQuery('')} 
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* ── Results Info ── */}
        <div className="flex items-center gap-4 mb-10">
          <span className="text-slate-400 text-[0.7rem] font-black uppercase tracking-[0.2em]" style={{ fontFamily: 'var(--font-heading)' }}>
            Showing {filtered.length} results
          </span>
          <div className="h-px flex-1 bg-slate-200/60" />
        </div>

        {/* ── Grid Section ── */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-32 bg-white/40 rounded-[2rem] border border-dashed border-slate-200"
            >
              <div className="mb-4 flex justify-center text-slate-300">
                <Search size={48} strokeWidth={1.5} />
              </div>
              <p className="text-slate-500 text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                No events found for "{query}"
              </p>
              <p className="text-slate-400 text-sm font-medium">Try checking your spelling or using different keywords.</p>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              className="grid gap-6 md:gap-8"
              style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}
            >
              {filtered.map((event, i) => (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                >
                  <SmallEventCard 
                    event={event} 
                    onClick={() => setSelectedEvent(event)} 
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <EventModal 
        event={selectedEvent} 
        onClose={() => setSelectedEvent(null)} 
        past={selectedEvent?.isPast} 
      />
    </div>
  )
}
