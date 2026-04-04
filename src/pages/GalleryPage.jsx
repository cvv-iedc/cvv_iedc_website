import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { supabase } from '../lib/supabaseClient'

// --- Performance Utilities ---
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Pattern for Main layer mapping
const mainPattern = [
  { y: '-12vh', r: -8, z: 2 },
  { y: '16vh', r: 5, z: 1 },
  { y: '-6vh', r: -3, z: 3 },
  { y: '22vh', r: 10, z: 2 },
  { y: '-18vh', r: -9, z: 1 },
  { y: '10vh', r: 4, z: 4 },
  { y: '-4vh', r: -5, z: 2 },
  { y: '14vh', r: 7, z: 3 },
]

// Pattern for Background layer
const bgPattern = [
  { y: '-22vh', r: 12, s: 0.85 },
  { y: '28vh', r: -8, s: 0.9 },
  { y: '-8vh', r: 16, s: 0.75 },
  { y: '10vh', r: -14, s: 0.8 },
  { y: '-30vh', r: 6, s: 0.7 },
  { y: '18vh', r: -11, s: 0.85 },
  { y: '0vh', r: 9, s: 0.9 },
  { y: '25vh', r: -17, s: 0.75 },
]

// Pure CSS geometric decorations moving in foreground
const SHAPES = ['circle', 'plus', 'circle-outline']
const COLORS = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)', 'var(--color-text-secondary)']

// Hardware-accelerated shape rendering
const DecorShape = ({ shape, left, top, size, rot, color }) => {
  if (shape === 'circle') {
    return <div style={{ position: 'absolute', left, top, width: size, height: size, borderRadius: '50%', backgroundColor: color, opacity: 0.15, willChange: 'transform' }} />
  }
  if (shape === 'circle-outline') {
    return <div style={{ position: 'absolute', left, top, width: size, height: size, borderRadius: '50%', border: `4px solid ${color}`, opacity: 0.2, willChange: 'transform' }} />
  }
  if (shape === 'plus') {
    return (
      <div style={{ position: 'absolute', left, top, width: size, height: size, opacity: 0.2, transform: `rotate(${rot}deg) translateZ(0)`, willChange: 'transform', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ position: 'absolute', width: '100%', height: '4px', backgroundColor: color, borderRadius: '2px' }} />
        <div style={{ position: 'absolute', height: '100%', width: '4px', backgroundColor: color, borderRadius: '2px' }} />
      </div>
    )
  }
  return null
}

export default function GalleryPage() {
  const targetRef = useRef(null)
  const trackRef = useRef(null)
  const [scrollRange, setScrollRange] = useState(0)
  const [gallery, setGallery] = useState([])
  const [loading, setLoading] = useState(true)

  const [decorations, setDecorations] = useState([])

  useEffect(() => {
    supabase.storage
      .from('gallery')
      .list('')
      .then(({ data, error }) => {
        if (!error && data) {
          const files = data.filter(f => f.name !== '.emptyFolderPlaceholder' && f.name !== '.DS_Store' && !(f.id && f.id.startsWith('placeholder')))
          const mappedGallery = files.map(f => ({
            id: f.id || f.name,
            image_url: supabase.storage.from('gallery').getPublicUrl(f.name).data.publicUrl
          }))
          setGallery(mappedGallery)
          
          // Performance: Limit DOM nodes drastically (max 12 shapes instead of N*2)
          const numDecor = Math.min(12, mappedGallery.length)
          const generatedDecor = Array.from({ length: Math.max(4, numDecor) }).map((_, i) => ({
            id: i,
            shape: SHAPES[i % SHAPES.length],
            left: `${i * 30 + Math.random() * 20}vw`,
            top: `${10 + Math.random() * 75}vh`,
            size: `${20 + Math.random() * 50}px`,
            rot: Math.random() * 360,
            color: COLORS[i % COLORS.length]
          }))
          setDecorations(generatedDecor)

        } else {
          setGallery([])
        }
        setLoading(false)
      })
  }, [])

  // Performance: Debounce heavy width recalculations on resize and initial load updates
  const updateScrollRange = useCallback(
    debounce(() => {
      if (trackRef.current) {
        setScrollRange(Math.max(0, trackRef.current.scrollWidth - window.innerWidth))
      }
    }, 150),
    []
  )

  useEffect(() => {
    let observer;
    updateScrollRange()
    window.addEventListener("resize", updateScrollRange)
    
    // Performance: Only track initial DOM mounting sizes, preventing infinite reflows
    if (trackRef.current) {
      observer = new ResizeObserver(() => updateScrollRange())
      observer.observe(trackRef.current)
    }

    return () => {
      window.removeEventListener("resize", updateScrollRange)
      if (observer) observer.disconnect()
    }
  }, [gallery, updateScrollRange])

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end end"]
  })

  // Direct scroll mapping for zero Spring compounding calculation lag
  const xBg = useTransform(scrollYProgress, [0, 1], [0, -scrollRange * 0.4])
  const xMid = useTransform(scrollYProgress, [0, 1], [0, -scrollRange])
  const xFg = useTransform(scrollYProgress, [0, 1], [0, -scrollRange * 1.5])

  // Performance: Cap extreme background nodes to save heavy rendering load (max 10)
  const bgGallery = [...gallery].reverse().slice(0, 10)

  if (loading) return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>

  const scrollHeightMultiplier = Math.max(3, gallery.length * 0.4) 

  return (
    <div ref={targetRef} style={{ height: `${scrollHeightMultiplier * 100}vh`, background: '#FFFFFF', position: 'relative' }}>

      {/* Fixed Sticky Viewer Container */}
      <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>

        <motion.div
           initial={{ opacity: 0, y: 24 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.6 }}
           style={{
             textAlign: 'center',
             padding: '6rem 2rem 1.5rem',
             pointerEvents: 'none',
             position: 'absolute',
             width: '100%',
             top: 0,
             zIndex: 50,
             willChange: 'transform, opacity' // Hardware accelerate the header entrance
           }}
        >
          <h1 style={{
             fontFamily: 'var(--font-display)',
             fontWeight: 800,
             fontSize: 'clamp(3rem, 10vw, 8rem)',
             letterSpacing: '-0.04em',
             color: 'var(--color-text-primary)',
             lineHeight: 1,
             textShadow: '0 4px 12px #FFFFFF'
          }}>
             Gallery
          </h1>
          <p style={{
             fontFamily: 'var(--font-heading)',
             fontWeight: 500,
             fontSize: 'clamp(1rem, 1.5vw, 1.25rem)',
             color: 'var(--color-text-secondary)',
             marginTop: '1.25rem',
             textShadow: '0 2px 8px #FFFFFF'
          }}>
             A collection of moments and milestones.
          </p>
        </motion.div>

        {/* --- TRACK LAYER 1: BACKGROUND (Slowest) --- */}
        {/* Performance: GPU acceleration explicitly forced */}
        <motion.div
          style={{ 
            x: xBg, position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', width: 'max-content', padding: '0 10vw 0 10vw', pointerEvents: 'none', zIndex: 1,
            willChange: 'transform', transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {bgGallery.map((img, i) => {
            const p = bgPattern[i % bgPattern.length]
            return (
              <div key={`bg-${img.id}-${i}`} style={{
                width: 'clamp(100px, 25vw, 3.5in)',
                aspectRatio: '3.5 / 4.2',
                height: 'auto',
                marginRight: 'clamp(1rem, 4vw, 5rem)',
                y: p.y, transform: `rotate(${p.r}deg) scale(${p.s})`,
                opacity: 0.15, filter: 'blur(4px) grayscale(60%)',
                flexShrink: 0,
                contentVisibility: 'auto' // Native CSS Virtualization implicitly culls offscreen elements
              }}>
                <img src={img.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', borderRadius: '0' }} draggable={false} loading="lazy" />
              </div>
            )
          })}
        </motion.div>

        {/* --- TRACK LAYER 2: MIDDLE MAIN (Normal Speed) --- */}
        {/* Performance: GPU acceleration and Backface culling active */}
        <motion.div
           ref={trackRef}
           style={{
             x: xMid, position: 'relative', height: '100%', display: 'flex', alignItems: 'center', width: 'max-content',
             padding: '0 30vw 0 10vw', zIndex: 10,
             willChange: 'transform', transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden' 
           }}
        >
          {gallery.map((img, i) => {
            const p = mainPattern[i % mainPattern.length]

            return (
              <motion.div
                 key={img.id}
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 style={{
                   position: 'relative',
                   width: 'clamp(130px, 35vw, 3.5in)', // Shrinks proportionally on mobile while maxing out at 3.5in Desktop
                   aspectRatio: '3.5 / 4.2', // Sustains exact ratio requested
                   height: 'auto',
                   marginRight: 'clamp(-1rem, -1vw, 1rem)',
                   y: p.y,
                   rotate: p.r,
                   zIndex: p.z,
                   borderRadius: '0',
                   overflow: 'hidden',
                   boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
                   cursor: 'pointer',
                   flexShrink: 0,
                   display: 'flex',
                   contentVisibility: 'auto', // Native CSS Virtualization
                   willChange: 'transform', // HW accel individually
                   WebkitBackfaceVisibility: 'hidden'
                 }}
              >
                <img
                  src={img.image_url}
                  alt="Gallery Polaroid"
                  draggable={false}
                  loading={i > 2 ? "lazy" : "eager"} // Aggressively lazy load further
                  style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', userSelect: 'none', pointerEvents: 'none' }}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </motion.div>
            )
          })}
        </motion.div>

        {/* --- TRACK LAYER 3: FOREGROUND DECOR (Fastest Speed) --- */}
        {/* Performance: GPU acceleration manually enforced */}
        <motion.div
          style={{ 
            x: xFg, position: 'absolute', inset: 0, height: '100%', width: `100%`, pointerEvents: 'none', zIndex: 20,
            willChange: 'transform', transform: 'translateZ(0)', WebkitBackfaceVisibility: 'hidden'
          }}
        >
          {decorations.map((decor) => (
            <DecorShape key={decor.id} {...decor} />
          ))}
        </motion.div>

      </div>
    </div>
  )
}
