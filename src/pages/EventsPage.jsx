import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight, Clock, Ticket } from 'lucide-react'

// ─── Current time: 2026-03-25 ─────────────────────────────────────────────────
const NOW = new Date('2026-03-25T18:00:00+05:30')

const ALL_EVENTS = [
  // ── Upcoming (future relative to NOW) ────────────────────────────────
  {
    id: 1,
    title: 'STARTUP PITCH SUMMIT',
    subtitle: 'SPRING 2026',
    date: '2026-04-12',
    dateLabel: 'April 12, 2026',
    time: '10:00 AM',
    fee: 'Free Registration',
    venue: 'College Auditorium, CVV',
    featured: true,
    description:
      'The flagship pitching event of IEDC CVV. Student entrepreneurs present their startup ideas to a panel of industry experts, VCs, and mentors. Top 3 teams win mentorship grants and incubation support.',
    image: '/images/event1.jpg',
    tag: 'Pitch',
    accent: '#2563EB',
    gradient: 'linear-gradient(160deg,#0f2b5b 0%,#1a4a8a 100%)',
  },
  {
    id: 2,
    title: 'INNOVATEX HACKATHON',
    subtitle: '24 HOURS',
    date: '2026-05-03',
    dateLabel: 'May 3–4, 2026',
    time: '9:00 AM',
    fee: '₹200 per Team',
    venue: 'CS Lab Block, CVV',
    featured: true,
    description:
      '24-hour hackathon challenging participants to build solutions for real-world problems across health, agriculture, education, and sustainability. Open to all disciplines.',
    image: '/images/event2.jpg',
    tag: 'Hackathon',
    accent: '#7C3AED',
    gradient: 'linear-gradient(160deg,#1a0a4a 0%,#3b1f8a 100%)',
  },
  {
    id: 3,
    title: 'DESIGN THINKING BOOTCAMP',
    subtitle: 'WORKSHOP',
    date: '2026-06-20',
    dateLabel: 'June 20, 2026',
    time: '2:00 PM',
    fee: '₹150 per Head',
    venue: 'Seminar Hall B, CVV',
    featured: false,
    description:
      'A hands-on design thinking bootcamp led by practising UX designers. Learn empathy mapping, rapid prototyping, and user testing through live case studies.',
    image: '/images/event3.jpg',
    tag: 'Workshop',
    accent: '#059669',
    gradient: 'linear-gradient(160deg,#022c22 0%,#065f46 100%)',
  },
  {
    id: 4,
    title: 'FOUNDER FIRESIDE CHAT',
    subtitle: 'ALUMNI SERIES',
    date: '2026-07-08',
    dateLabel: 'July 8, 2026',
    time: '4:00 PM',
    fee: 'Free (Invite Only)',
    venue: 'Innovation Hub, CVV',
    featured: true,
    description:
      'An intimate fireside session with successful alumni founders. Raw stories about failure, pivots, fundraising, and hypergrowth — followed by an open Q&A.',
    image: '/images/event4.jpg',
    tag: 'Talk',
    accent: '#D97706',
    gradient: 'linear-gradient(160deg,#3b1c08 0%,#92400e 100%)',
  },

  // ── Past (before NOW) ─────────────────────────────────────────────────
  {
    id: 5,
    title: 'IDEA SPRINT 2026',
    subtitle: 'FEB 2026',
    date: '2026-02-14',
    dateLabel: 'February 14, 2026',
    time: '11:00 AM',
    fee: 'Free Registration',
    venue: 'Innovation Hub, CVV',
    featured: false,
    description:
      'A 6-hour rapid ideation sprint where teams brainstorm, sketch, and prototype ideas in real time. Winning concepts get featured in the IEDC annual report.',
    image: '/images/event5.jpg',
    tag: 'Workshop',
    accent: '#0891B2',
    gradient: 'linear-gradient(160deg,#082f49 0%,#0c4a6e 100%)',
  },
  {
    id: 6,
    title: 'SOCIAL INNOVATION CHALLENGE',
    subtitle: 'SEED GRANT',
    date: '2025-09-10',
    dateLabel: 'September 10, 2025',
    time: '9:00 AM',
    fee: '₹100 per Team',
    venue: 'Mini Auditorium, CVV',
    featured: true,
    description:
      'Teams present actionable social solutions addressing local community problems. Winning proposals receive IEDC seed funding from the social impact fund.',
    image: '/images/event6.jpg',
    tag: 'Competition',
    accent: '#16A34A',
    gradient: 'linear-gradient(160deg,#052e16 0%,#14532d 100%)',
  },
  {
    id: 7,
    title: 'IP & PATENT WORKSHOP',
    subtitle: 'PROTECT IDEAS',
    date: '2025-08-15',
    dateLabel: 'August 15, 2025',
    time: '10:00 AM',
    fee: '₹50 per Head',
    venue: 'Conference Room 1, CVV',
    featured: false,
    description:
      'Understand intellectual property rights, how to file patents, and protect your innovations — led by a practising patent attorney with startup industry experience.',
    image: '/images/event1.jpg',
    tag: 'Workshop',
    accent: '#6366F1',
    gradient: 'linear-gradient(160deg,#1e1b4b 0%,#3730a3 100%)',
  },
  {
    id: 8,
    title: 'STARTUP WEEKEND CVV',
    subtitle: 'DEC 2025',
    date: '2025-12-05',
    dateLabel: 'December 5–7, 2025',
    time: '9:00 AM',
    fee: '₹300 per Head (incl. food)',
    venue: 'CS Block, CVV',
    featured: false,
    description:
      '54-hour weekend startup experience — learn, network, and build. Teams form on Day 1, validate on Day 2, and pitch to judges on Day 3.',
    image: '/images/event2.jpg',
    tag: 'Competition',
    accent: '#DC2626',
    gradient: 'linear-gradient(160deg,#450a0a 0%,#991b1b 100%)',
  },
  {
    id: 9,
    title: 'OPEN INNOVATION FORUM',
    subtitle: 'NOV 2025',
    date: '2025-11-12',
    dateLabel: 'November 12, 2025',
    time: '3:00 PM',
    fee: 'Free Registration',
    venue: 'Seminar Hall A, CVV',
    featured: true,
    description:
      'Industry partners present real unsolved problems to student innovators. The best solutions get piloted with the partner organisation over the next semester.',
    image: '/images/event3.jpg',
    tag: 'Hackathon',
    accent: '#CA8A04',
    gradient: 'linear-gradient(160deg,#422006 0%,#713f12 100%)',
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
const isPast = (e) => new Date(e.date) < NOW

// ─── Parallax auto-scroll (CSS transform — truly endless) ───────────────────
// Injects a one-time <style> tag with the keyframes we need
const STYLE_ID = 'iedc-marquee-styles'
if (typeof document !== 'undefined' && !document.getElementById(STYLE_ID)) {
  const s = document.createElement('style')
  s.id = STYLE_ID
  s.textContent = `
    @keyframes iedc-marquee {
      from { transform: translateX(0); }
      to   { transform: translateX(-50%); }
    }
    @keyframes iedc-marquee-reverse {
      from { transform: translateX(-50%); }
      to   { transform: translateX(0%); }
    }
    @keyframes iedc-float {
      0%   { transform: translateY(0px) scale(1); }
      50%  { transform: translateY(-10px) scale(1.01); }
      100% { transform: translateY(0px) scale(1); }
    }
  `
  document.head.appendChild(s)
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function EventModal({ event, onClose, past }) {
  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
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
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white overflow-hidden"
            style={{ maxWidth: '800px', maxHeight: '90vh', borderRadius: '1.5rem', boxShadow: '0 40px 100px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)' }}
          >
            <div className="flex flex-col md:flex-row" style={{ maxHeight: '90vh' }}>
              {/* Left image */}
              <div className="relative flex-shrink-0 md:w-[42%] min-h-[240px]" style={{ background: event.gradient }}>
                <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-50" onError={(e) => { e.target.style.display = 'none' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {past && (
                  <div className="absolute top-5 right-5 bg-black/40 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5">
                    <Clock size={11} className="text-white/70" /><span className="text-white/70 text-[0.65rem] font-bold uppercase tracking-wide">Past</span>
                  </div>
                )}
                <div className="absolute top-5 left-5">
                  <span className="text-white text-[0.65rem] font-black px-3 py-1 rounded-full uppercase tracking-widest" style={{ background: event.accent }}>{event.tag}</span>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full border border-white/25 p-4 text-center flex flex-col items-center justify-center" style={{ width: '108px', height: '108px', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(6px)' }}>
                    <p className="text-white/50 text-[0.5rem] tracking-[0.2em] uppercase font-bold mb-0.5">IEDC CVV</p>
                    <p className="text-white font-black text-xs leading-tight text-center" style={{ fontFamily: 'var(--font-display)', letterSpacing: '-0.01em' }}>{event.subtitle}</p>
                  </div>
                </div>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="text-white/50 text-xs font-medium mb-0.5">{event.dateLabel}</p>
                  <p className="text-white text-xs font-semibold">{event.venue}</p>
                </div>
              </div>

              {/* Right details */}
              <div className="flex-1 p-8 flex flex-col overflow-y-auto relative">
                <button onClick={onClose} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors">
                  <X size={15} className="text-slate-500" />
                </button>
                <p className="text-xs font-black uppercase tracking-[0.18em] mb-3" style={{ color: event.accent, fontFamily: 'var(--font-heading)' }}>{event.tag}</p>
                <h2 className="font-extrabold text-slate-900 leading-none mb-5 pr-8" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.3rem,3.5vw,1.8rem)', letterSpacing: '-0.03em' }}>{event.title}</h2>
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
                  <motion.a href="#" whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}
                    className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full text-white font-bold text-sm"
                    style={{ background: event.accent, fontFamily: 'var(--font-heading)' }}
                  >
                    Register Now <ArrowRight size={15} />
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Single poster card ──────────────────────────────────────────────────────
function EventCard({ event, onClick, past }) {
  const cardRef = useRef(null)

  // Per-card parallax: track mouse position over the card
  const handleMouseMove = (e) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 8
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.04)`
  }
  const handleMouseLeave = (e) => {
    const el = cardRef.current
    if (el) el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      className="relative flex-shrink-0 overflow-hidden cursor-pointer"
      style={{
        width: 'clamp(260px, 26vw, 380px)',
        height: 'clamp(360px, 46vw, 500px)',
        borderRadius: '1.25rem',
        transition: 'transform 0.25s ease, box-shadow 0.25s ease',
        transformStyle: 'preserve-3d',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        filter: past ? 'brightness(0.85) saturate(0.7)' : 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.18)' }}
    >
      {/* BG */}
      <div className="absolute inset-0" style={{ background: event.gradient }}>
        <img src={event.image} alt={event.title} className="w-full h-full object-cover object-top"
          style={{ opacity: past ? 0.45 : 0.65, transition: 'opacity 0.4s ease' }}
          onError={(e) => { e.target.style.display = 'none' }} loading="lazy" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 40%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

      {/* ── TOP ROW: time (left) | tag pill (right) — same baseline ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3.5 pt-3.5">
        {/* Time */}
        <span
          className="text-white/90 text-xs font-bold"
          style={{ fontFamily: 'var(--font-heading)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
        >
          {event.time}
        </span>

        {/* Tag pill */}
        <span
          className="text-[0.68rem] font-black uppercase tracking-wider px-3 py-1 rounded-full"
          style={{ background: event.accent, color: '#fff' }}
        >
          {event.tag}
        </span>
      </div>



      {/* ── BOTTOM CENTER: event name + date ── */}
      <div className="absolute bottom-0 left-0 right-0 px-3 pb-5 pt-8 text-center">
        <h3
          className="text-white leading-tight mb-1.5 uppercase"
          style={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 800,
            fontSize: 'clamp(1.1rem, 1.8vw, 1.35rem)',
            letterSpacing: '0.04em',
            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
            color: '#ffffff',
          }}
        >
          {event.title}
        </h3>
        {/* Date: dd Month format */}
        <p
          className="text-white/55 font-normal leading-none"
          style={{ fontFamily: 'var(--font-body)', fontSize: '0.7rem' }}
        >
          {new Date(event.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Accent bottom bar */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: event.accent, opacity: 0.85 }} />
    </div>
  )
}

// ─── Auto-scroll carousel row (Native Scroll + RAF + Overlay Buttons) ───────────
function CarouselRow({ events, reverse = false, onCardClick, past }) {
  const scrollRef = useRef(null)
  const exactPos = useRef(0)
  const [paused, setPaused] = useState(false)
  const [isManualStuck, setIsManualStuck] = useState(false) // temporary disable auto-scroll after manual interaction
  const manualTimeout = useRef(null)

  // Double the list so the seam is invisible
  const doubled = [...events, ...events]

  // Track manual native scroll (trackpad/touch)
  const handleNativeScroll = () => {
    if (scrollRef.current && isManualStuck) {
      exactPos.current = scrollRef.current.scrollLeft
    }
  }

  // Trigger manual scroll block
  const blockAutoScroll = () => {
    setIsManualStuck(true)
    if (manualTimeout.current) clearTimeout(manualTimeout.current)
    manualTimeout.current = setTimeout(() => {
      setIsManualStuck(false)
      if (scrollRef.current) exactPos.current = scrollRef.current.scrollLeft
    }, 1500) // resume auto-scroll 1.5s after last manual interaction
  }

  // Button click smooth scroll
  const scrollManually = () => {
    blockAutoScroll()
    const el = scrollRef.current
    if (!el) return
    const cardWidth = window.innerWidth < 768 ? 260 : 380 // approx width
    const gap = 20
    const scrollAmount = (cardWidth + gap) * 2
    el.scrollBy({ left: reverse ? -scrollAmount : scrollAmount, behavior: 'smooth' })
  }

  // RAF Loop
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // Start midway so loop is ready
    exactPos.current = reverse ? el.scrollWidth / 2 : 0
    el.scrollLeft = exactPos.current

    let rafId
    const speed = 0.65

    const tick = () => {
      if (!paused && !isManualStuck && el) {
        exactPos.current += reverse ? -speed : speed
        
        const half = el.scrollWidth / 2
        
        // Loop seamlessly
        if (!reverse && exactPos.current >= half) {
          exactPos.current -= half
          el.style.scrollBehavior = 'auto'
          el.scrollLeft = exactPos.current
        } else if (reverse && exactPos.current <= 0) {
          exactPos.current += half
          el.style.scrollBehavior = 'auto'
          el.scrollLeft = exactPos.current
        } else {
          el.style.scrollBehavior = 'auto'
          el.scrollLeft = exactPos.current
        }
      }
      rafId = requestAnimationFrame(tick)
    }

    rafId = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafId)
  }, [paused, isManualStuck, reverse])

  return (
    <div
      className="relative group overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Edge fades */}
      <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to right, #f5f5f7, transparent)' }} />
      <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to left, #ebebed, transparent)' }} />

      {/* Floating Manual Advance Button (Only in moving direction) */}
      <div className={`absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${reverse ? 'left-4 opacity-0 group-hover:opacity-100' : 'right-4 opacity-0 group-hover:opacity-100'}`}>
        <button 
          onClick={scrollManually}
          className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
          style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)' }}
        >
          {reverse ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
        </button>
      </div>

      {/* Track */}
      <div
        ref={scrollRef}
        onScroll={handleNativeScroll}
        onTouchStart={blockAutoScroll}
        onWheel={blockAutoScroll}
        className="flex overflow-x-auto"
        style={{
          gap: '1.25rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          paddingBottom: '1.5rem',
          paddingTop: '1.5rem',
        }}
      >
        {doubled.map((event, i) => (
          <div
            key={`${event.id}-${i}`}
            style={{
              animation: `iedc-float ${3.5 + (i % 5) * 0.6}s ease-in-out infinite`,
              animationDelay: `${(i % 7) * -0.8}s`,
              animationPlayState: (paused || isManualStuck) ? 'paused' : 'running',
            }}
          >
            <EventCard
              event={event}
              onClick={() => onCardClick(event)}
              past={past}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Section header ───────────────────────────────────────────────────────────
function SectionHeading({ title, sub, count }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="px-8 md:px-16 pt-16 pb-0 flex items-end justify-between"
    >
      <div>
        <h2
          className="font-extrabold text-slate-900 leading-none"
          style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem,10vw,8rem)', letterSpacing: '-0.05em', marginBottom: '-0.15em' }}
        >
          {title}
        </h2>
        <p className="text-slate-400 font-medium mt-4 text-base" style={{ fontFamily: 'var(--font-body)' }}>{sub}</p>
      </div>
      <span className="text-slate-300 font-black text-5xl mb-2 select-none" style={{ fontFamily: 'var(--font-display)' }}>
        {String(count).padStart(2, '0')}
      </span>
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isSelectedPast, setIsSelectedPast] = useState(false)

  const upcoming = ALL_EVENTS.filter((e) => !isPast(e))
  const featuredOnly = ALL_EVENTS.filter((e) => e.featured)

  const openModal = (event, pastFlag) => {
    setSelectedEvent(event)
    setIsSelectedPast(pastFlag)
  }

  return (
    <div className="min-h-screen overflow-hidden" style={{ background: 'linear-gradient(180deg,#f5f5f7 0%,#ebebed 100%)' }}>

      {/* ── Top spacer for navbar ── */}
      <div className="h-20" />

      {/* ══════════════════════════════════════════
          UPCOMING EVENTS
      ══════════════════════════════════════════ */}
      <section>
        <SectionHeading title="Upcoming" sub="Events you can't afford to miss." count={upcoming.length} />
        <div className="mt-2">
          <CarouselRow events={upcoming} reverse={false} onCardClick={(ev) => openModal(ev, false)} past={false} />
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="mx-8 md:mx-16 my-4">
        <div className="h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </div>

      {/* ══════════════════════════════════════════
          FEATURED EVENTS
      ══════════════════════════════════════════ */}
      <section className="pb-16 flex flex-col">
        <SectionHeading title="Featured" sub="Handpicked highlights & flagships." count={featuredOnly.length} />
        <div className="mt-2 text-center pb-8">
          {/* Featured carousel scrolls in reverse */}
          <CarouselRow events={featuredOnly} reverse={true} onCardClick={(ev) => openModal(ev, isPast(ev))} past={false} />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="mt-12 inline-flex"
          >
            <a href="/all-events"
               className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold group"
               style={{ fontFamily: 'var(--font-heading)', boxShadow: '0 8px 20px rgba(15,23,42,0.15)' }}>
              Explore All Events 
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </motion.div>
        </div>
      </section>



      {/* ── Modal ── */}
      <EventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} past={isSelectedPast} />
    </div>
  )
}
