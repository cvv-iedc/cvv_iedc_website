import { useState, useRef, useEffect } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'
import LightboxModal from '../components/LightboxModal'

const pattern = [
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '-18vh', w: 'clamp(260px, 28vw, 450px)', r: '4/3' },
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '22vh', w: 'clamp(220px, 24vw, 360px)', r: '3/4' },
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '-8vh', w: 'clamp(300px, 32vw, 550px)', r: '16/9' },
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '28vh', w: 'clamp(200px, 20vw, 320px)', r: '4/5' },
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '-25vh', w: 'clamp(240px, 26vw, 420px)', r: '1/1' },
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '15vh', w: 'clamp(280px, 30vw, 500px)', r: '3/2' },
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '-5vh', w: 'clamp(220px, 24vw, 350px)', r: '3/4' },
  { mr: 'clamp(1rem, 2vw, 3rem)', y: '20vh', w: 'clamp(260px, 28vw, 450px)', r: '16/9' },
]

export default function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState(null)
  const targetRef = useRef(null)
  const trackRef = useRef(null)
  const [scrollRange, setScrollRange] = useState(0)
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('gallery')
      .select('id, title, image_url, date')
      .order('date', { ascending: true })
      .then(({ data, error }) => {
        if (!error) setGallery(data ?? [])
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const updateScrollRange = () => {
      if (trackRef.current) {
        setScrollRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth))
      }
    }
    updateScrollRange()
    window.addEventListener("resize", updateScrollRange)
    return () => window.removeEventListener("resize", updateScrollRange)
  }, [gallery])

  // Use framer-motion useScroll to map exactly to the target element
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  const x = useTransform(scrollYProgress, [0, 1], [0, -scrollRange])

  const openLightbox = (i) => setLightboxIndex(i)
  const handleNav = (dir) => setLightboxIndex((prev) => (prev + dir + gallery.length) % gallery.length)

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>

  return (
    <div ref={targetRef} style={{ height: '400vh', background: 'var(--color-surface)', position: 'relative' }}>

      {/* Sticky viewport content */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        {/* Header - Fixed inside sticky container */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{
            textAlign: 'center',
            padding: '8rem 2rem 1.5rem',
            pointerEvents: 'none',
            position: 'absolute',
            width: '100%',
            top: 0,
            zIndex: 10,
          }}
        >
          <p style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
            Scroll to explore
          </p>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: 'clamp(2.5rem, 8vw, 5.5rem)',
            letterSpacing: '-0.04em',
            color: 'var(--color-text-primary)',
            lineHeight: 1,
            textShadow: '0 4px 12px var(--color-surface)'
          }}>
            Gallery
          </h1>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.95rem', color: 'var(--color-text-secondary)', marginTop: '0.75rem' }}>
            Scroll down to explore our journey. Click any image to view it.
          </p>
        </motion.div>

        {/* Scrolling Track */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
          <motion.div
            ref={trackRef}
            style={{
              x, // framer-motion horizontally slides this container
              display: 'flex',
              alignItems: 'center',
              height: '100%',
              width: 'max-content',
              padding: '0 15vw 0 10vw', // 10vw runway before first image, 15vw runway at end
            }}
          >
            {gallery.map((img, i) => {
              const p = pattern[i % pattern.length]

              return (
                <motion.div
                  key={img.id}
                  onClick={() => openLightbox(i)}
                  whileHover={{ scale: 1.04 }}
                  style={{
                    position: 'relative',
                    width: p.w,
                    aspectRatio: p.r,
                    marginRight: p.mr,
                    y: p.y, // vertical scatter offset via framer-motion shortcut
                    borderRadius: '1rem',
                    overflow: 'hidden',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <div style={{
                    width: '100%', height: '100%',
                    background: `hsl(${200 + i * 20}, 40%, 75%)`,
                  }}>
                    <img
                      src={img.image_url}
                      alt={img.title}
                      draggable={false}
                      loading={i > 3 ? "lazy" : "eager"}
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
          </motion.div>
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
