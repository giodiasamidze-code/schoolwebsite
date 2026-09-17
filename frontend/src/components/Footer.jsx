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
        background: 'linear-gradient(180deg, rgba(14, 7, 10, 0.88) 0%, rgba(8, 4, 6, 0.98) 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        padding: '38px 0 22px',
        color: '#f5eee8',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div id="footer-contact" style={{ width: '92%', maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* Compact 2-Column Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))',
          gap: '32px',
          marginBottom: '26px'
        }}>

          {/* Col 1: Contact Details & Accreditation Badges */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.12rem',
              color: '#ffffff',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              კონტაქტი & სამუშაო საათები
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '18px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <MapPin size={15} />
                </div>
                <span style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, marginTop: '3px' }}>
                  ილია ჭავჭავაძის გამზირი 45, თბილისი, საქართველო
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <Phone size={15} />
                </div>
                <a
                  href="tel:+995322100000"
                  style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                >
                  +995 32 210 00 00 / +995 599 12 34 56
                </a>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <Mail size={15} />
                </div>
                <a
                  href="mailto:info@solomonacademy.ge"
                  style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                >
                  info@solomonacademy.ge
                </a>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '30px',
                  height: '30px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <Clock size={15} />
                </div>
                <span style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  ორშაბათი – პარასკევი: 09:00 – 18:00
                </span>
              </div>
            </div>

            {/* Accreditation Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.32)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#d4af37',
                letterSpacing: '0.02em'
              }}>
                IB World School
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#e8cb75',
                letterSpacing: '0.02em'
              }}>
                Cambridge International
              </span>
            </div>
          </div>

          {/* Col 2: Campus Map Box & Socials */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.12rem',
              color: '#ffffff',
              marginBottom: '16px',
              fontWeight: 700
            }}>
              კამპუსის ლოკაცია
            </h4>

            {/* Harmonized Palace Gold Glass Card */}
            <div
              style={{
                background: 'rgba(32, 20, 25, 0.72)',
                border: '1.2px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '14px',
                padding: '16px 18px',
                boxShadow: '0 10px 28px rgba(0, 0, 0, 0.45)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                marginBottom: '14px',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(30, 18, 22, 0.8) 100%)',
                  border: '1px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37',
                  flexShrink: 0
                }}>
                  <MapPin size={16} />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    ცენტრალური კამპუსი
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.65)', marginTop: '2px' }}>
                    ვაკე, ჭავჭავაძის გამზ. 45
                  </div>
                </div>
              </div>

              <a
                href="https://maps.google.com/?q=Ilia+Chavchavadze+Avenue+45+Tbilisi"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.8rem',
                  color: '#d4af37',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '5px 12px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 600,
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.22)';
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
                  e.currentTarget.style.color = '#d4af37';
                }}
              >
                <span>Google Maps-ში ნახვა</span>
                <ExternalLink size={12} />
              </a>
            </div>

            {/* Social Icons with Luxury Gold Hover */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="#facebook"
                aria-label="Facebook"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
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
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.color = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Facebook size={16} />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
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
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.color = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Instagram size={16} />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
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
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.color = '#d4af37';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 15px rgba(212, 175, 55, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.25)';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)';
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <Linkedin size={16} />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Copyright & Portal Shortcuts */}
        <div style={{
          paddingTop: '20px',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <p style={{ fontSize: '0.84rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
            &copy; 2026 სოლომონ აკადემია. ყველა უფლება დაცულია.
          </p>

          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '8px',
                padding: '6px 14px',
                color: '#d4af37',
                fontSize: '0.82rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px'
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
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
