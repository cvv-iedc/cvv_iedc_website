import { MapPin, Mail, Instagram, Linkedin, Youtube, User } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="footer-root">
      <div className="footer-grid">

        {/* Column 1: Brand */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <img src="/iedc_logo_white.png" alt="IEDC CVV Logo" style={{ height: '42px', width: 'auto', objectFit: 'contain', alignSelf: 'flex-start' }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.6, maxWidth: '240px' }}>
            Fostering innovation and the spirit of entrepreneurship at Chinmaya Vishwa Vidyapeeth.
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
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>Nodal Officer: <strong>Ms. Anupama Jims</strong></span>
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
          <div className="footer-social-pills">
            <a href="https://instagram.com/cvviedc/" target="_blank" rel="noreferrer" className="footer-pill instagram">
              <Instagram size={18} strokeWidth={2} />
              <span>Instagram</span>
            </a>
            <a href="https://www.linkedin.com/company/cvv-iedc-2024" target="_blank" rel="noreferrer" className="footer-pill linkedin">
              <Linkedin size={18} strokeWidth={2} />
              <span>LinkedIn</span>
            </a>
            <a href="https://youtube.com/@CVVIEDC" target="_blank" rel="noreferrer" className="footer-pill youtube">
              <Youtube size={18} strokeWidth={2} />
              <span>YouTube</span>
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Copyright Bar */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} IEDC Chinmaya Vishwa Vidyapeeth. All rights reserved.</p>
        <p>Built with innovation by CVV IEDC Tech Team.</p>
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
        .footer-social-pills {
          display: flex;
          flex-direction: column;
          gap: 0.7rem;
        }
        .footer-pill {
          display: flex;
          align-items: center;
          gap: 1em;
          padding: 0.35em 0.75em 0.35em 0.6em;
          border-radius: 999px;
          font-size: 0.95em;
          font-family: var(--font-heading);
          font-weight: 600;
          background: rgba(255,255,255,0.08);
          color: #fff;
          text-decoration: none;
          transition: background 0.2s, color 0.2s, transform 0.2s;
          box-shadow: 0 1px 4px rgba(0,0,0,0.08);
          justify-content: flex-start;
          width: fit-content;
        }
        .footer-pill:hover {
          color: #fff;
          transform: translateY(-2px) scale(1.04);
        }
        .footer-pill.instagram:hover {
          background: #E1306C;
        }
        .footer-pill.linkedin:hover {
          background: #0A66C2;
        }
        .footer-pill.youtube:hover {
          background: #FF0000;
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
          .footer-social-pills {
            gap: 0.5rem;
          }
          .footer-pill {
            font-size: 1.05em;
            padding: 0.7em 1.1em 0.7em 0.9em;
          }
        }
      `}</style>
    </footer>
  )
}
