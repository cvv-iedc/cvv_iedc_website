import { MapPin, Mail, Instagram, Linkedin, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-brand-black)',
      color: 'rgba(255,255,255,0.7)',
      padding: '4rem 2rem',
      fontFamily: 'var(--font-body)',
      fontSize: '0.9rem',
      width: '100%',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '3rem',
      }}>
        
        {/* Left Side: Logo & Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxWidth: '400px' }}>
          <img src="/iedc_logo_white.png" alt="IEDC CVV Logo" style={{ height: '48px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start', marginBottom: '0.25rem' }} />
          
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <MapPin size={20} color="var(--color-brand-red)" style={{ flexShrink: 0, marginTop: '2px' }} />
            <span style={{ lineHeight: 1.5, color: 'rgba(255,255,255,0.85)' }}>College of Velankanni (CVV),<br/>Kerala, India</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Mail size={20} color="var(--color-brand-red)" style={{ flexShrink: 0 }} />
            <a href="mailto:iedc@cvv.ac.in" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none', transition: 'color 0.2s' }} onMouseOver={e => e.target.style.color = '#fff'} onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.85)'}>iedc@cvv.ac.in</a>
          </div>
        </div>

        {/* Right Side: Social Media */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', letterSpacing: '0.1em', fontSize: '0.9rem' }}>CONNECT WITH US</h4>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.85)', transition: 'all 0.2s transform', textDecoration: 'none', display: 'flex', alignItems: 'center' }} 
               onMouseOver={e => {e.currentTarget.style.color = '#E1306C'; e.currentTarget.style.transform = 'scale(1.1)'}} 
               onMouseOut={e => {e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'scale(1)'}}>
              <Instagram size={24} strokeWidth={1.5} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.85)', transition: 'all 0.2s transform', textDecoration: 'none', display: 'flex', alignItems: 'center' }} 
               onMouseOver={e => {e.currentTarget.style.color = '#0A66C2'; e.currentTarget.style.transform = 'scale(1.1)'}} 
               onMouseOut={e => {e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'scale(1)'}}>
              <Linkedin size={24} strokeWidth={1.5} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer" style={{ color: 'rgba(255,255,255,0.85)', transition: 'all 0.2s transform', textDecoration: 'none', display: 'flex', alignItems: 'center' }} 
               onMouseOver={e => {e.currentTarget.style.color = '#FF0000'; e.currentTarget.style.transform = 'scale(1.1)'}} 
               onMouseOut={e => {e.currentTarget.style.color = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'scale(1)'}}>
              <Youtube size={24} strokeWidth={1.5} />
            </a>
          </div>
        </div>

      </div>
    </footer>
  )
}
