import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { gallery } from '../data/gallery'
import LightboxModal from '../components/LightboxModal'

// Place images in a scattered layout across a large canvas
const CANVAS_W = 4000
const CANVAS_H = 3000

const placements = [
  { x: 80, y: 80, w: 520, h: 360 },
  { x: 640, y: 60, w: 330, h: 480 },
  { x: 1010, y: 90, w: 500, h: 330 },
  { x: 1560, y: 50, w: 380, h: 560 },
  { x: 40, y: 490, w: 400, h: 560 },
  { x: 490, y: 600, w: 540, h: 360 },
  { x: 1090, y: 480, w: 360, h: 480 },
  { x: 1510, y: 680, w: 510, h: 350 },
  { x: 150, y: 1130, w: 480, h: 340 },
  { x: 700, y: 1030, w: 340, h: 500 },
  { x: 1110, y: 1040, w: 520, h: 360 },
  { x: 1700, y: 1100, w: 340, h: 480 },
]

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const [dragPos, setDragPos] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0, posX: 0, posY: 0 })

  const openLightbox = (i) => {
    if (!isDragging.current) setLightboxIndex(i)
  }

  const handleNav = (dir) => {
    setLightboxIndex((prev) => (prev + dir + gallery.length) % gallery.length)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', paddingTop: '6rem' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{ textAlign: 'center', padding: '2rem 2rem 1.5rem', pointerEvents: 'none' }}
      >
        <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
          Drag to explore
        </p>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 800,
          fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
          letterSpacing: '-0.04em',
          color: 'var(--color-text-primary)',
          lineHeight: 1,
        }}>
          Gallery
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
          Click &amp; drag to explore our journey. Click any image to view it.
        </p>
      </motion.div>

      {/* Canvas */}
      <div
        className="canvas-wrapper"
        style={{ height: 'calc(100vh - 14rem)', position: 'relative', touchAction: 'none' }}
        onMouseDown={(e) => {
          isDragging.current = false
          dragStart.current = { x: e.clientX, y: e.clientY, posX: dragPos.x, posY: dragPos.y }
          const onMove = (ev) => {
            const dx = ev.clientX - dragStart.current.x
            const dy = ev.clientY - dragStart.current.y
            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) isDragging.current = true
            const newX = Math.min(0, Math.max(-(CANVAS_W - window.innerWidth), dragStart.current.posX + dx))
            const newY = Math.min(0, Math.max(-(CANVAS_H - window.innerHeight), dragStart.current.posY + dy))
            setDragPos({ x: newX, y: newY })
          }
          const onUp = () => {
            window.removeEventListener('mousemove', onMove)
            window.removeEventListener('mouseup', onUp)
            setTimeout(() => { isDragging.current = false }, 50)
          }
          window.addEventListener('mousemove', onMove)
          window.addEventListener('mouseup', onUp)
        }}
        onTouchStart={(e) => {
          isDragging.current = false
          const t = e.touches[0]
          dragStart.current = { x: t.clientX, y: t.clientY, posX: dragPos.x, posY: dragPos.y }
        }}
        onTouchMove={(e) => {
          const t = e.touches[0]
          const dx = t.clientX - dragStart.current.x
          const dy = t.clientY - dragStart.current.y
          isDragging.current = true
          const newX = Math.min(0, Math.max(-(CANVAS_W - window.innerWidth), dragStart.current.posX + dx))
          const newY = Math.min(0, Math.max(-(CANVAS_H - window.innerHeight), dragStart.current.posY + dy))
          setDragPos({ x: newX, y: newY })
        }}
      >
        <div style={{
          position: 'absolute',
          top: 0, left: 0,
          width: CANVAS_W,
          height: CANVAS_H,
          transform: `translate(${dragPos.x}px, ${dragPos.y}px)`,
          transition: 'none',
        }}>
          {gallery.map((img, i) => {
            const p = placements[i % placements.length]
            const offsetX = Math.floor(i / placements.length) * 1900 + (i % 2 === 0 ? 0 : 50)
            const offsetY = Math.floor(i / placements.length) * 900

            return (
              <motion.div
                key={img.id}
                onClick={() => openLightbox(i)}
                whileHover={{ scale: 1.04, zIndex: 10 }}
                style={{
                  position: 'absolute',
                  left: (p.x + offsetX) % (CANVAS_W - p.w - 100),
                  top: (p.y + offsetY) % (CANVAS_H - p.h - 100),
                  width: p.w,
                  height: p.h,
                  borderRadius: '1rem',
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                  cursor: 'pointer',
                  zIndex: 1,
                }}
              >
                <div style={{
                  width: '100%', height: '100%',
                  background: `hsl(${200 + i * 20}, 40%, 75%)`,
                }}>
                  <img
                    src={img.src}
                    alt={img.title}
                    draggable={false}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', userSelect: 'none' }}
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                </div>
                {/* Hover overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(255,255,255,0.85)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '1rem',
                  }}
                >
                  <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1rem', color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '0.3rem' }}>{img.title}</p>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{img.date}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {lightboxIndex !== null && (
        <LightboxModal
          images={gallery}
          activeIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNav={handleNav}
        />
      )}
    </div>
  )
}
