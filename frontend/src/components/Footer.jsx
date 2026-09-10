import React from 'react';
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, ExternalLink, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Footer() {
  const { path, navigate } = useAuth();

  const handleNavClick = (e, href) => {
    e.preventDefault();

    if (href.startsWith('/')) {
      navigate(href);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (path !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 150);
    } else {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <footer
      id="contact"
      style={{
        position: 'relative',
        zIndex: 10,
        background: 'linear-gradient(180deg, rgba(14, 7, 10, 0.82) 0%, rgba(8, 4, 6, 0.96) 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.3)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        padding: '70px 0 30px',
        color: '#f5eee8',
        boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)'
      }}
    >
      <div style={{ width: '92%', maxWidth: '1360px', margin: '0 auto' }}>
        
        {/* Top 4-Column Bento Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '40px',
          marginBottom: '50px'
        }}>

          {/* Col 1: Brand & Accreditation */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              {/* Classical Temple Gold Emblem Roundel matching Header */}
              <div
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(30, 18, 22, 0.85) 100%)',
                  border: '1.4px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37',
                  boxShadow: '0 4px 16px rgba(212, 175, 55, 0.25)',
                  flexShrink: 0
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 21h18M3 10h18M5 10v11M19 10v11M9 10v11M15 10v11M12 2l9 6H3l9-6z"/>
                </svg>
              </div>

              <div>
                <span style={{ fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  სოლომონ <span style={{ color: '#d4af37', fontWeight: 500 }}>აკადემია</span>
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.7, marginBottom: '22px' }}>
              უმაღლესი საერთაშორისო სტანდარტების კერძო სკოლა — სადაც კლასიკური აკადემიური სიღრმე, STEM ინოვაციები და ლიდერული აღზრდა ერთიანდება.
            </p>

            {/* Accreditation Badges harmonized with gold palace theme */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{
                padding: '5px 12px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.12)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#d4af37',
                letterSpacing: '0.02em'
              }}>
                IB World School
              </span>
              <span style={{
                padding: '5px 12px',
                borderRadius: '8px',
                background: 'rgba(212, 175, 55, 0.08)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                fontSize: '0.76rem',
                fontWeight: 700,
                color: '#e8cb75',
                letterSpacing: '0.02em'
              }}>
                Cambridge International
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.15rem',
              color: '#ffffff',
              marginBottom: '20px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ნავიგაცია
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0, margin: 0 }}>
              <li>
                <a
                  href="#hero"
                  onClick={(e) => handleNavClick(e, '#hero')}
                  style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'all 0.2s', display: 'inline-block' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  მთავარი გვერდი
                </a>
              </li>
              <li>
                <a
                  href="#teachers"
                  onClick={(e) => handleNavClick(e, '#teachers')}
                  style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'all 0.2s', display: 'inline-block' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  პედაგოგები & გუნდი
                </a>
              </li>
              <li>
                <a
                  href="#news"
                  onClick={(e) => handleNavClick(e, '#news')}
                  style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'all 0.2s', display: 'inline-block' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  სკოლის სიახლეები
                </a>
              </li>
              <li>
                <a
                  href="/gallery"
                  onClick={(e) => handleNavClick(e, '/gallery')}
                  style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'all 0.2s', display: 'inline-block' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  სასკოლო გალერეა
                </a>
              </li>
              <li>
                <a
                  href="#admissions"
                  onClick={(e) => handleNavClick(e, '#admissions')}
                  style={{ color: '#d4af37', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600, transition: 'all 0.2s', display: 'inline-block' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#d4af37'; e.currentTarget.style.transform = 'translateX(0)'; }}
                >
                  მიღება & ონლაინ რეგისტრაცია
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details with Harmonious Gold Icons */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.15rem',
              color: '#ffffff',
              marginBottom: '20px',
              fontWeight: 700
            }}>
              კონტაქტი & სამუშაო საათები
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <MapPin size={16} />
                </div>
                <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5, marginTop: '4px' }}>
                  ილია ჭავჭავაძის გამზირი 45, თბილისი, საქართველო
                </span>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <Phone size={16} />
                </div>
                <a
                  href="tel:+995322100000"
                  style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                >
                  +995 32 210 00 00 / +995 599 12 34 56
                </a>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <Mail size={16} />
                </div>
                <a
                  href="mailto:info@solomonacademy.ge"
                  style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.85)'}
                >
                  info@solomonacademy.ge
                </a>
              </div>

              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(212, 175, 55, 0.12)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: '#d4af37'
                }}>
                  <Clock size={16} />
                </div>
                <span style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  ორშაბათი – პარასკევი: 09:00 – 18:00
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Campus Map Box (Refactored to Harmonious Luxury Gold Theme) & Socials */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
              fontSize: '1.15rem',
              color: '#ffffff',
              marginBottom: '20px',
              fontWeight: 700
            }}>
              კამპუსის ლოკაცია
            </h4>

            {/* Harmonized Palace Gold Glass Card */}
            <div
              style={{
                background: 'rgba(32, 20, 25, 0.72)',
                border: '1.2px solid rgba(212, 175, 55, 0.35)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 14px 35px rgba(0, 0, 0, 0.55)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                marginBottom: '18px',
                transition: 'all 0.25s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: 'radial-gradient(circle, rgba(212, 175, 55, 0.25) 0%, rgba(30, 18, 22, 0.8) 100%)',
                  border: '1px solid #d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#d4af37',
                  flexShrink: 0
                }}>
                  <MapPin size={18} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                    სოლომონ აკადემია
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
                  fontSize: '0.82rem',
                  color: '#d4af37',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '8px',
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
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Social Icons with Luxury Gold Hover */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="#facebook"
                aria-label="Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
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
                <Facebook size={17} />
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
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
                <Instagram size={17} />
              </a>
              <a
                href="#linkedin"
                aria-label="LinkedIn"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
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
                <Linkedin size={17} />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Copyright & Portal Shortcuts */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.6)', margin: 0 }}>
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
                padding: '7px 16px',
                color: '#d4af37',
                fontSize: '0.84rem',
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
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
