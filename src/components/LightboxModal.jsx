import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'

export default function LightboxModal({ images, activeIndex, onClose, onNav }) {
  const image = images?.[activeIndex]
  if (!image) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(15,23,42,0.92)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 3000,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.85 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          onClick={(e) => e.stopPropagation()}
          style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }}
        >
          <img
            src={image.src}
            alt={image.title}
            style={{
              maxWidth: '90vw', maxHeight: '80vh',
              objectFit: 'contain', borderRadius: '1rem',
              boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
              display: 'block',
            }}
          />
          {/* Caption */}
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <p style={{ color: '#fff', fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.1rem' }}>{image.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: '0.875rem', marginTop: '0.25rem' }}>{image.date}</p>
          </div>

          {/* Close */}
          <button onClick={onClose} style={{
            position: 'absolute', top: '-1rem', right: '-1rem',
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: '40px', height: '40px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', backdropFilter: 'blur(8px)',
          }}>
            <X size={18} />
          </button>

          {/* Prev/Next */}
          {onNav && (
            <>
              <button onClick={() => onNav(-1)} style={{
                position: 'absolute', left: '-3rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                width: '44px', height: '44px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}>
                <ChevronLeft size={20} />
              </button>
              <button onClick={() => onNav(1)} style={{
                position: 'absolute', right: '-3rem', top: '50%', transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
                width: '44px', height: '44px', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff',
              }}>
                <ChevronRight size={20} />
              </button>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
