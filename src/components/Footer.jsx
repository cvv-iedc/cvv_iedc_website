import { MapPin, Mail, Instagram, Linkedin, Youtube, User } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-grid">

        {/* Column 1: Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img src="/iedc_logo_white.png" alt="IEDC CVV Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '240px' }}>
            Cultivating innovation and the spirit of entrepreneurship at Chinmaya Vishwa Vidyapeeth.
          </p>
        </div>

        {/* Column 2: Location */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', fontSize: '0.9rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Location</h4>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
            <MapPin size={16} color="var(--color-brand-red)" style={{ flexShrink: 0, marginTop: '3px' }} />
            <span style={{ lineHeight: 1.6, color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>
              Room 217,<br />
              Innovation & Business Incubation Centre,<br />
              Chinmaya Vishwa Vidyapeeth,<br />
              Anthiyal-Onakkoor Road,<br />
              Ernakulam, Kerala 686667
            </span>
          </div>
        </div>

        {/* Column 3: Contact Us */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', fontSize: '0.9rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Contact Us</h4>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <User size={16} color="var(--color-brand-red)" style={{ flexShrink: 0 }} />
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Nodal Officer: <strong>[Name]</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Mail size={16} color="var(--color-brand-red)" style={{ flexShrink: 0 }} />
            <a href="mailto:iedc@cvv.ac.in" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none', fontSize: '0.85rem', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#fff'}
              onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
              iedc@cvv.ac.in
            </a>
          </div>
        </div>

        {/* Column 4: Find us on */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#fff', letterSpacing: '0.05em', fontSize: '0.9rem', marginBottom: '0.25rem', textTransform: 'uppercase' }}>Find us on</h4>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer"
              style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.05)', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', textDecoration: 'none' }}
              onMouseOver={e => { e.currentTarget.style.background = '#E1306C'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <Instagram size={16} strokeWidth={2} />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer"
              style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.05)', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', textDecoration: 'none' }}
              onMouseOver={e => { e.currentTarget.style.background = '#0A66C2'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <Linkedin size={16} strokeWidth={2} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noreferrer"
              style={{ color: 'rgba(255,255,255,0.8)', background: 'rgba(255,255,255,0.05)', width: '34px', height: '34px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s ease', textDecoration: 'none' }}
              onMouseOver={e => { e.currentTarget.style.background = '#FF0000'; e.currentTarget.style.color = '#fff'; e.currentTarget.style.transform = 'translateY(-2px)' }}
              onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; e.currentTarget.style.transform = 'translateY(0)' }}>
              <Youtube size={16} strokeWidth={2} />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} IEDC Chinmaya Vishwa Vidyapeeth. All rights reserved.</p>
        <p>Built with innovation by IEDC Tech Team.</p>
      </div>
      <style>{`
        .footer-root {
          background: var(--color-brand-black);
          color: rgba(255,255,255,0.7);
          padding: 3rem 2rem 1.5rem;
          font-family: var(--font-body);
          font-size: 0.9rem;
          width: 100%;
        }
        .footer-grid {
          max-width: 1200px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 2rem;
          align-items: flex-start;
        }
        .footer-bottom {
          max-width: 1200px;
          margin: 2.5rem auto 0;
          padding-top: 1.5rem;
          border-top: 1px solid rgba(255,255,255,0.08);
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          font-size: 0.8rem;
          color: rgba(255,255,255,0.4);
        }
        @media (max-width: 900px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 600px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 2.2rem;
          }
          .footer-root {
            padding: 2.2rem 1rem 1.2rem;
            font-size: 0.98rem;
          }
          .footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.5rem;
            padding-top: 1.1rem;
            font-size: 0.85rem;
          }
        }
      `}</style>
    </footer>
  )
}
