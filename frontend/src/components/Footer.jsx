import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, ExternalLink, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Footer() {
  const { navigate } = useAuth();

  return (
    <footer
      id="contact"
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(14, 7, 10, 0.92) 0%, rgba(8, 4, 6, 0.98) 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        padding: '20px 0 14px',
        color: '#f5eee8',
        boxShadow: '0 -8px 30px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div id="footer-contact" style={{ width: '92%', maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Compact Horizontal Main Row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '18px 24px',
          paddingBottom: '16px'
        }}>

          {/* Left: Contact info (Address, Phone, Mail) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', minWidth: '260px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.88)' }}>
              <MapPin size={14} color="#d4af37" style={{ flexShrink: 0 }} />
              <span>ილია ჭავჭავაძის გამზ. 45, თბილისი</span>
              <a
                href="https://maps.google.com/?q=Ilia+Chavchavadze+Avenue+45+Tbilisi"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: '#d4af37',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  fontSize: '0.76rem',
                  textDecoration: 'none',
                  borderBottom: '1px dotted rgba(212, 175, 55, 0.6)',
                  marginLeft: '4px'
                }}
              >
                <span>რუკა</span>
                <ExternalLink size={10} />
              </a>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Phone size={13} color="#d4af37" style={{ flexShrink: 0 }} />
                <a href="tel:+995322100000" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                  +995 32 210 00 00
                </a>
              </div>
              <span style={{ color: 'rgba(212, 175, 55, 0.4)' }}>•</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Mail size={13} color="#d4af37" style={{ flexShrink: 0 }} />
                <a href="mailto:info@solomonacademy.ge" style={{ color: 'rgba(255, 255, 255, 0.8)', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'}>
                  info@solomonacademy.ge
                </a>
              </div>
            </div>
          </div>

          {/* Middle: Working Hours & Accreditation Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.72)' }}>
              <Clock size={13} color="#d4af37" style={{ flexShrink: 0 }} />
              <span>ორშაბათი – პარასკევი: 09:00 – 18:00</span>
            </div>

            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
              <span style={{
                padding: '2px 8px',
                borderRadius: '5px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.3)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#d4af37'
              }}>
                IB World School
              </span>
              <span style={{
                padding: '2px 8px',
                borderRadius: '5px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#e8cb75'
              }}>
                Cambridge International
              </span>
            </div>
          </div>

          {/* Right: Socials & Teacher Portal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <a
                href="#facebook"
                aria-label="Facebook"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Facebook size={15} />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Instagram size={15} />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '7px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(212, 175, 55, 0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255, 255, 255, 0.85)',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.2)';
                  e.currentTarget.style.color = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <Linkedin size={15} />
              </a>
            </div>

            {/* Teacher Portal Button */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '7px',
                padding: '6px 12px',
                color: '#d4af37',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                whiteSpace: 'nowrap'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.22)';
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.12)';
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                e.currentTarget.style.color = '#d4af37';
              }}
            >
              <span>პედაგოგის პორტალი</span>
              <ArrowRight size={12} />
            </button>
          </div>

        </div>

        {/* Bottom Copyright & Subtle Developer Note in Single Row */}
        <div style={{
          paddingTop: '12px',
          borderTop: '1px solid rgba(212, 175, 55, 0.15)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          {/* Left: Copyright */}
          <p style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.45)', margin: 0 }}>
            &copy; 2026 სოლომონ აკადემია. ყველა უფლება დაცულია.
          </p>

          {/* Right: Discreet Developer Info */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.74rem',
            color: 'rgba(255, 255, 255, 0.5)'
          }}>
            <span>დეველოპერი: <span style={{ color: 'rgba(212, 175, 55, 0.85)', fontWeight: 600 }}>გიორგი დიასამიძე</span></span>

            <span style={{ color: 'rgba(212, 175, 55, 0.3)' }}>•</span>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <a
                href="mailto:gdiasamidze848@gmail.com"
                title="gdiasamidze848@gmail.com"
                aria-label="Gmail"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                <Mail size={13} />
                <span>gdiasamidze848@gmail.com</span>
              </a>

              <a
                href="https://github.com/giodiasamidze-code"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub: giodiasamidze-code"
                aria-label="GitHub"
                style={{
                  color: 'rgba(255, 255, 255, 0.5)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)'}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub</span>
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
