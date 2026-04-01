import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Calendar, ArrowRight, Clock, Ticket } from 'lucide-react'

export default function EventModal({ event, onClose, past }) {
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          className="fixed inset-0 z-[2000] flex items-center justify-center p-4 md:p-8"
          style={{ background: 'rgba(255,255,255,0.72)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 24 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white overflow-hidden shadow-2xl flex flex-col md:flex-row"
            style={{ maxWidth: '850px', maxHeight: 'min(90vh, 700px)', borderRadius: '1.5rem', border: '1px solid rgba(0,0,0,0.05)' }}
          >
            {/* Left image area */}
            <div className="relative flex-shrink-0 md:w-[45%] h-[200px] md:h-auto" style={{ background: event.gradient || 'var(--color-primary)' }}>
              <img src={event.image} alt={event.title} className="absolute inset-0 w-full h-full object-cover opacity-60" onError={(e) => { e.target.style.display = 'none' }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {past && (
                <div className="absolute top-4 right-4 bg-black/40 backdrop-blur rounded-full px-3 py-1 flex items-center gap-1.5">
                  <Clock size={11} className="text-white/70" /><span className="text-white/70 text-[0.65rem] font-bold uppercase tracking-wide">Past</span>
                </div>
              )}

              <div className="absolute bottom-5 left-6 right-6">
                <p className="text-white/60 text-xs font-medium mb-1 tracking-wider uppercase">{event.dateLabel}</p>
                <p className="text-white text-sm font-semibold">{event.venue || event.location}</p>
              </div>
            </div>

            {/* Right content area */}
            <div className="flex-1 p-6 md:p-10 flex flex-col overflow-y-auto relative bg-white">
              <button onClick={onClose} className="absolute top-5 right-5 w-9 h-9 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 transition-colors z-10 text-slate-500">
                <X size={18} />
              </button>
              
              <div className="mb-6">
                <h2 className="font-extrabold text-slate-900 leading-tight pr-10 mb-2" style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 4vw, 2rem)', letterSpacing: '-0.02em' }}>
                  {event.title}
                </h2>
                <div className="h-1 w-12 bg-primary rounded-full" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  { id: 'date', Icon: Calendar, text: event.dateLabel, label: 'Date' },
                  { id: 'time', Icon: Clock, text: event.time, label: 'Time' },
                  { id: 'venue', Icon: MapPin, text: event.venue || event.location, label: 'Location' },
                  { id: 'fee', Icon: Ticket, text: event.fee, label: 'Registration Fee' },
                ]
                  .filter((item) => item.text)
                  .map(({ id, Icon, text, label }) => (
                    <div key={id} className="flex flex-col gap-1">
                      <span className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-widest">{label}</span>
                      <div className="flex items-center gap-2 text-slate-600">
                        <Icon size={14} className="text-primary" />
                        <span className="text-sm font-medium">{text}</span>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="space-y-4 mb-8 flex-1">
                 <p className="text-[0.92rem] text-slate-500 leading-relaxed font-body">
                   {event.description}
                 </p>
              </div>

              <div className="mt-auto">
                {past ? (
                  <div className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-slate-100 text-slate-400 font-bold text-sm tracking-wide">
                    <Clock size={16} /> EVENT CONCLUDED
                  </div>
                ) : (
                  (event.register_url || event.registerUrl) ? (
                    <motion.a
                      href={event.register_url || event.registerUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-bold text-sm tracking-wide shadow-lg shadow-primary/20"
                      style={{ background: event.accent || 'var(--color-primary)', fontFamily: 'var(--font-heading)', textDecoration: 'none' }}
                    >
                      REGISTER NOW <ArrowRight size={16} />
                    </motion.a>
                  ) : (
                    <div
                      className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-sm font-bold bg-slate-50 text-slate-400 border border-slate-100"
                    >
                      REGISTRATION NOT OPEN YET
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
