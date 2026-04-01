import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, ArrowRight, ChevronLeft, ChevronRight, Clock, Ticket } from 'lucide-react'
import { useEvents } from '../hooks/useEvents'
import EventModal from '../components/EventModal'

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
    el.style.transition = 'box-shadow 0.2s ease'
    el.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg) scale(1.04)`
  }
  const handleMouseLeave = (e) => {
    const el = cardRef.current
    if (el) {
      el.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s ease'
      el.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)'
    }
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
        transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94), box-shadow 0.2s ease',
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
      <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.55) 40%, transparent 70%)' }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />

      {/* ── TOP ROW: time (left) ── */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-3.5 pt-3.5">
        {/* Time */}
        <span
          className="text-white/90 text-xs font-bold"
          style={{ fontFamily: 'var(--font-heading)', textShadow: '0 1px 6px rgba(0,0,0,0.8)' }}
        >
          {event.time}
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

  const isSingle = events.length <= 1
  // Double the list so the seam is invisible
  const displayEvents = isSingle ? events : [...events, ...events]

  // Track manual native scroll (trackpad/touch)
  const handleNativeScroll = () => {
    if (isSingle) return
    if (scrollRef.current && isManualStuck) {
      exactPos.current = scrollRef.current.scrollLeft
    }
  }

  // Trigger manual scroll block
  const blockAutoScroll = () => {
    if (isSingle) return
    setIsManualStuck(true)
    if (manualTimeout.current) clearTimeout(manualTimeout.current)
    manualTimeout.current = setTimeout(() => {
      setIsManualStuck(false)
      if (scrollRef.current) exactPos.current = scrollRef.current.scrollLeft
    }, 1500) // resume auto-scroll 1.5s after last manual interaction
  }

  // Button click smooth scroll
  const scrollManually = () => {
    if (isSingle) return
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
    if (isSingle) return
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
  }, [paused, isManualStuck, reverse, isSingle])

  return (
    <div
      className="relative group overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Edge fades */}
      {!isSingle && (
        <>
          <div className="hidden md:block absolute left-0 top-0 bottom-0 w-24 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, #f5f5f7, transparent)' }} />
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-24 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to left, #ebebed, transparent)' }} />
        </>
      )}

      {/* Floating Manual Advance Button (Only in moving direction) */}
      {!isSingle && (
        <div className={`absolute top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${reverse ? 'left-4 opacity-0 group-hover:opacity-100' : 'right-4 opacity-0 group-hover:opacity-100'}`}>
          <button 
            onClick={scrollManually}
            className="w-14 h-14 rounded-full bg-white text-slate-900 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform"
            style={{ boxShadow: '0 8px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.05)' }}
          >
            {reverse ? <ChevronLeft size={28} /> : <ChevronRight size={28} />}
          </button>
        </div>
      )}

      {/* Track */}
      <div
        ref={scrollRef}
        onScroll={handleNativeScroll}
        onTouchStart={blockAutoScroll}
        onWheel={blockAutoScroll}
        className={`flex overflow-x-auto ${isSingle ? 'justify-start px-8 md:px-16' : ''}`}
        style={{
          gap: '1.25rem',
          scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
          touchAction: 'pan-x',
          paddingBottom: '1.5rem',
          paddingTop: '1.5rem',
        }}
      >
        {displayEvents.map((event, i) => (
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
function SectionHeading({ title, sub }) {
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
    </motion.div>
  )
}

// ─── Main export ──────────────────────────────────────────────────────────────
export default function EventsSection() {
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [isSelectedPast, setIsSelectedPast] = useState(false)
  const { events, loading } = useEvents()

  const upcoming = events.filter((e) => !e.isPast)
  const featuredOnly = events.filter((e) => e.featured)

  if (loading) return (
    <div style={{
      height: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg,#f5f5f7 0%,#ebebed 100%)',
      fontFamily: 'var(--font-body)', color: 'var(--color-text-secondary)',
      fontSize: '0.95rem'
    }}>
      Loading events...
    </div>
  )

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
        <SectionHeading title="Upcoming" sub="Events you can't afford to miss." />
        <div className="mt-2">
          {upcoming.length > 0 ? (
            <CarouselRow events={upcoming} reverse={false} onCardClick={(ev) => openModal(ev, false)} past={false} />
          ) : (
            <div className="px-8 md:px-16 py-12 flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="max-w-2xl text-center px-8 py-12 rounded-[2rem] border border-slate-200/50 bg-white/50 backdrop-blur-sm shadow-[0_8px_30px_rgb(0,0,0,0.04)]"
              >
                <p className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                  Looks like our event calendar is taking a quick breather right now! 🚀<br className="hidden md:block mt-2" />
                  <span className="text-base md:text-lg text-slate-500 font-normal mt-2 inline-block">
                    Keep an eye out for upcoming opportunities, or dive into our past highlights to see what we've been building.
                  </span>
                </p>
              </motion.div>
            </div>
          )}
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
        <SectionHeading title="Featured" sub="Handpicked highlights & flagships." />
        <div className="mt-2 text-center pb-8">
          {/* Featured carousel scrolls in reverse */}
          <CarouselRow events={featuredOnly} reverse={true} onCardClick={(ev) => openModal(ev, ev.isPast)} past={false} />
          
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
