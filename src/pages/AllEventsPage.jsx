import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, MapPin, Calendar, ArrowRight, Clock, SlidersHorizontal, Ticket } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

// ─── All events data (shared source) ─────────────────────────────────────────
const ALL_EVENTS = [
  {
    id: 1, title: 'STARTUP PITCH SUMMIT', date: '2026-04-12', dateLabel: 'April 12, 2026',
    time: '10:00 AM', fee: 'Free Registration', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Pitch', featured: true,
    accent: '#2563EB', gradient: 'linear-gradient(160deg,#0f2b5b,#1a4a8a)',
    description: 'The flagship pitching event of IEDC CVV. Top 3 teams win mentorship grants and incubation support.',
    image: '/images/event1.jpg'
  },
  {
    id: 2, title: 'INNOVATEX HACKATHON', date: '2026-05-03', dateLabel: 'May 3–4, 2026',
    time: '9:00 AM', fee: '₹200 per Team', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Hackathon', featured: true,
    accent: '#7C3AED', gradient: 'linear-gradient(160deg,#1a0a4a,#3b1f8a)',
    description: '24-hour hackathon challenging participants to build solutions for real-world problems.',
    image: '/images/event2.jpg'
  },
  {
    id: 3, title: 'DESIGN THINKING BOOTCAMP', date: '2026-06-20', dateLabel: 'June 20, 2026',
    time: '2:00 PM', fee: '₹150 per Head', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Workshop', featured: false,
    accent: '#059669', gradient: 'linear-gradient(160deg,#022c22,#065f46)',
    description: 'A hands-on design thinking bootcamp led by practising UX designers.',
    image: '/images/event3.jpg'
  },
  {
    id: 4, title: 'FOUNDER FIRESIDE CHAT', date: '2026-07-08', dateLabel: 'July 8, 2026',
    time: '4:00 PM', fee: 'Free (Invite Only)', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Talk', featured: true,
    accent: '#D97706', gradient: 'linear-gradient(160deg,#3b1c08,#92400e)',
    description: 'An intimate session with alumni founders — failure, pivots, fundraising, and growth.',
    image: '/images/event4.jpg'
  },
  {
    id: 5, title: 'IDEA SPRINT 2026', date: '2026-02-14', dateLabel: 'February 14, 2026',
    time: '11:00 AM', fee: 'Free Registration', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Workshop', featured: false,
    accent: '#0891B2', gradient: 'linear-gradient(160deg,#082f49,#0c4a6e)',
    description: 'A 6-hour rapid ideation sprint where teams brainstorm and prototype ideas in real time.',
    image: '/images/event5.jpg'
  },
  {
    id: 6, title: 'SOCIAL INNOVATION CHALLENGE', date: '2025-09-10', dateLabel: 'September 10, 2025',
    time: '9:00 AM', fee: '₹100 per Team', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Competition', featured: true,
    accent: '#16A34A', gradient: 'linear-gradient(160deg,#052e16,#14532d)',
    description: 'Teams present actionable social solutions. Winners receive IEDC seed funding.',
    image: '/images/event6.jpg'
  },
  {
    id: 7, title: 'IP & PATENT WORKSHOP', date: '2025-08-15', dateLabel: 'August 15, 2025',
    time: '10:00 AM', fee: '₹50 per Head', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Workshop', featured: false,
    accent: '#6366F1', gradient: 'linear-gradient(160deg,#1e1b4b,#3730a3)',
    description: 'Understand intellectual property rights and how to protect your innovations.',
    image: '/images/event1.jpg'
  },
  {
    id: 8, title: 'STARTUP WEEKEND CVV', date: '2025-12-05', dateLabel: 'December 5–7, 2025',
    time: '9:00 AM', fee: '₹300 per Head (incl. food)', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Competition', featured: false,
    accent: '#DC2626', gradient: 'linear-gradient(160deg,#450a0a,#991b1b)',
    description: '54-hour weekend startup experience — learn, network, and build.',
    image: '/images/event2.jpg'
  },
  {
    id: 9, title: 'OPEN INNOVATION FORUM', date: '2025-11-12', dateLabel: 'November 12, 2025',
    time: '3:00 PM', fee: 'Free Registration', venue: 'Chinmaya Vishwa Vidyapeeth (CVV)', tag: 'Hackathon', featured: true,
    accent: '#CA8A04', gradient: 'linear-gradient(160deg,#422006,#713f12)',
    description: 'Industry partners present real unsolved problems to student innovators.',
    image: '/images/event3.jpg'
  },
]

const TAG_COLORS = {
  Pitch: '#2563EB', Hackathon: '#7C3AED', Workshop: '#059669',
  Talk: '#D97706', Competition: '#DC2626',
}
const ALL_TAGS = ['All', ...Array.from(new Set(ALL_EVENTS.map(e => e.tag)))]
const NOW = new Date('2026-03-25T18:00:00+05:30')

// ─── Small card for All Events page ───────────────────────────────────────────
function SmallEventCard({ event, onClick }) {
  const past = new Date(event.date) < NOW
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
        <span className="absolute top-2.5 right-2.5 text-[0.6rem] font-black uppercase tracking-wide px-2.5 py-0.5 rounded-full text-white"
          style={{ background: event.accent }}>
          {event.tag}
        </span>
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
  if (!event) return null
  const past = new Date(event.date) < NOW
  return (
    <AnimatePresence>
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
            <div className="relative flex-shrink-0 md:w-[42%] min-h-[220px]" style={{ background: event.gradient }}>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              <div className="absolute top-5 left-5">
                <span className="text-white text-[0.65rem] font-black px-3 py-1 rounded-full uppercase tracking-widest"
                  style={{ background: event.accent }}>{event.tag}</span>
              </div>
              <div className="absolute bottom-5 left-5 right-5">
                <p className="text-white/50 text-xs font-medium mb-0.5">{event.dateLabel}</p>
                <p className="text-white text-xs font-semibold">{event.venue}</p>
              </div>
            </div>
            <div className="flex-1 p-8 flex flex-col overflow-y-auto relative">
              <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                <X size={15} className="text-slate-500" />
              </button>
              <p className="text-xs font-black uppercase tracking-[0.18em] mb-3" style={{ color: event.accent }}>{event.tag}</p>
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
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

// ─── All Events Page ──────────────────────────────────────────────────────────
export default function AllEventsPage() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [activeTag, setActiveTag] = useState('All')
  const [selectedEvent, setSelectedEvent] = useState(null)

  const filtered = useMemo(() => {
    return ALL_EVENTS.filter(e => {
      const matchTag = activeTag === 'All' || e.tag === activeTag
      const q = query.toLowerCase()
      const matchQ = !q || e.title.toLowerCase().includes(q) || e.venue.toLowerCase().includes(q) || e.tag.toLowerCase().includes(q)
      return matchTag && matchQ
    })
  }, [query, activeTag])

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
            placeholder="Search by event name, tags..."
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

        {/* Tag filters */}
        <div className="flex items-center gap-2 flex-wrap">
          {ALL_TAGS.map(tag => (
            <button key={tag} onClick={() => setActiveTag(tag)}
              className="px-4 py-2 rounded-full text-xs font-bold transition-all duration-200"
              style={{
                fontFamily: 'var(--font-heading)',
                background: activeTag === tag ? '#0f172a' : 'white',
                color: activeTag === tag ? '#fff' : '#64748b',
                border: `1px solid ${activeTag === tag ? '#0f172a' : 'rgba(0,0,0,0.08)'}`,
                boxShadow: activeTag === tag ? '0 4px 12px rgba(0,0,0,0.15)' : '0 1px 4px rgba(0,0,0,0.04)',
              }}>
              {tag}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Results count ── */}
      <div className="px-6 md:px-16 mb-5 flex items-center gap-3">
        <span className="text-slate-400 text-xs font-medium" style={{ fontFamily: 'var(--font-body)' }}>
          {filtered.length} result{filtered.length !== 1 ? 's' : ''}
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
