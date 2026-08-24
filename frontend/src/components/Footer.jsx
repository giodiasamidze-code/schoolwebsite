import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Clock, Facebook, Instagram, Linkedin, ExternalLink, ShieldCheck, Award } from 'lucide-react';
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
        background: 'linear-gradient(180deg, rgba(24, 9, 11, 0.95) 0%, rgba(14, 4, 6, 0.99) 100%)',
        borderTop: '1px solid rgba(212, 175, 55, 0.25)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        padding: '70px 0 30px',
        color: '#f5eee8'
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #8b0000, #c41e3a)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 16px rgba(139, 0, 0, 0.5)',
                border: '1px solid rgba(255, 255, 255, 0.15)'
              }}>
                <GraduationCap size={22} color="#ffffff" />
              </div>
              <div>
                <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.01em' }}>
                  სოლომონ <span style={{ color: 'var(--accent-secondary, #d4af37)', fontWeight: 400 }}>აკადემია</span>
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'rgba(255, 255, 255, 0.72)', lineHeight: 1.7, marginBottom: '20px' }}>
              უმაღლესი საერთაშორისო სტანდარტების კერძო სკოლა — სადაც კლასიკური აკადემიური სიღრმე, STEM ინოვაციები და ლიდერული აღზრდა ერთიანდება.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(212, 175, 55, 0.1)',
                border: '1px solid rgba(212, 175, 55, 0.25)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: 'var(--accent-secondary, #d4af37)'
              }}>
                IB World School
              </span>
              <span style={{
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(196, 30, 58, 0.1)',
                border: '1px solid rgba(196, 30, 58, 0.25)',
                fontSize: '0.74rem',
                fontWeight: 700,
                color: '#ff8598'
              }}>
                Cambridge International
              </span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
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
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px', padding: 0 }}>
              <li>
                <a href="#hero" onClick={(e) => handleNavClick(e, '#hero')} style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}>
                  მთავარი გვერდი
                </a>
              </li>
              <li>
                <a href="#teachers" onClick={(e) => handleNavClick(e, '#teachers')} style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}>
                  პედაგოგები & გუნდი
                </a>
              </li>
              <li>
                <a href="#news" onClick={(e) => handleNavClick(e, '#news')} style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}>
                  სკოლის სიახლეები
                </a>
              </li>
              <li>
                <a href="/gallery" onClick={(e) => handleNavClick(e, '/gallery')} style={{ color: 'rgba(255, 255, 255, 0.75)', textDecoration: 'none', fontSize: '0.92rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.75)'}>
                  სასკოლო გალერეა
                </a>
              </li>
              <li>
                <a href="#admissions" onClick={(e) => handleNavClick(e, '#admissions')} style={{ color: 'var(--accent-secondary, #d4af37)', textDecoration: 'none', fontSize: '0.92rem', fontWeight: 600, transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = '#fff'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--accent-secondary, #d4af37)'}>
                  მიღება & ონლაინ რეგისტრაცია
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact Details */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              color: '#ffffff',
              marginBottom: '20px',
              fontWeight: 700
            }}>
              კონტაქტი & სამუშაო საათები
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <MapPin size={18} color="#ff8598" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', lineHeight: 1.5 }}>
                  ილია ჭავჭავაძის გამზირი 45, თბილისი, საქართველო
                </span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="var(--accent-secondary, #d4af37)" style={{ flexShrink: 0 }} />
                <a href="tel:+995322100000" style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none' }}>
                  +995 32 210 00 00 / +995 599 12 34 56
                </a>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} color="#ff8598" style={{ flexShrink: 0 }} />
                <a href="mailto:info@solomonacademy.ge" style={{ fontSize: '0.9rem', color: 'rgba(255, 255, 255, 0.85)', textDecoration: 'none' }}>
                  info@solomonacademy.ge
                </a>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={18} color="var(--accent-secondary, #d4af37)" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '0.88rem', color: 'rgba(255, 255, 255, 0.7)' }}>
                  ორშაბათი – პარასკევი: 09:00 – 18:00
                </span>
              </div>
            </div>
          </div>

          {/* Col 4: Interactive Campus Map Box & Socials */}
          <div>
            <h4 style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              color: '#ffffff',
              marginBottom: '20px',
              fontWeight: 700
            }}>
              კამპუსის ლოკაცია
            </h4>

            {/* Map Card */}
            <div
              style={{
                background: 'rgba(28, 10, 14, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 12px 30px rgba(0,0,0,0.5)',
                marginBottom: '16px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(196, 30, 58, 0.2)',
                  border: '1px solid rgba(196, 30, 58, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <MapPin size={16} color="#ff8598" />
                </div>
                <div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#ffffff' }}>სოლომონ აკადემია</div>
                  <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.6)' }}>ვაკე, ჭავჭავაძის გამზ. 45</div>
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
                  color: 'var(--accent-secondary, #d4af37)',
                  textDecoration: 'none',
                  fontWeight: 600,
                  marginTop: '8px'
                }}
              >
                <span>Google Maps-ში ნახვა</span>
                <ExternalLink size={13} />
              </a>
            </div>

            {/* Social Icons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <a
                href="#facebook"
                aria-label="Facebook"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#c41e3a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#c41e3a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
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
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#c41e3a'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <Linkedin size={17} />
              </a>
            </div>

          </div>

        </div>

        {/* Bottom Copyright & Portal Shortcuts */}
        <div style={{
          paddingTop: '24px',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '14px'
        }}>
          <p style={{ fontSize: '0.86rem', color: 'rgba(255, 255, 255, 0.55)', margin: 0 }}>
            &copy; 2026 სოლომონ აკადემია. ყველა უფლება დაცულია.
          </p>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick(e, '#admissions');
              }}
              style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.84rem', cursor: 'pointer', textDecoration: 'underline' }}
              onMouseEnter={(e) => e.currentTarget.style.color = '#ffffff'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
            >
              პედაგოგის პორტალი
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              style={{ background: 'none', border: 'none', color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.84rem', cursor: 'pointer', textDecoration: 'underline' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-secondary, #d4af37)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.65)'}
            >
              ადმინისტრაცია
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
}
