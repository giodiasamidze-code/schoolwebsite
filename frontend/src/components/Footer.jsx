import React from 'react';
import { GraduationCap, MapPin, Facebook, Instagram, Linkedin } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Footer() {
  const { path, navigate } = useAuth();

  const handleNavClick = (e, href) => {
    e.preventDefault();

    if (path === '/register') {
      navigate('/');
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          scrollToElement(element);
        }
      }, 150);
    } else {
      const element = document.querySelector(href);
      if (element) {
        scrollToElement(element);
      }
    }
  };

  const scrollToElement = (element) => {
    const offset = 80;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="footer-redesign" id="contact">
      <div className="footer-container-inner">
        {/* Top Area: Logo + Tagline & Quick Links */}
        <div className="footer-top-row">
          <div className="footer-brand-section">
            <div className="footer-logo">
              <GraduationCap className="footer-logo-cap" />
              <span className="footer-logo-txt">სოლომონ <span className="footer-logo-sub">აკადემია</span></span>
            </div>
            <p className="footer-tagline">სადაც კლასიკური განათლება ხვდება მომავალს</p>
          </div>

          <nav className="footer-nav-links">
            <a href="#programs" className="footer-nav-item" onClick={(e) => handleNavClick(e, '#programs')}>პროგრამები</a>
            <a href="#teachers" className="footer-nav-item" onClick={(e) => handleNavClick(e, '#teachers')}>მასწავლებლები</a>
            <a href="#school-life" className="footer-nav-item" onClick={(e) => handleNavClick(e, '#school-life')}>სკოლის ცხოვრება</a>
            <a href="#admissions" className="footer-nav-item" onClick={(e) => handleNavClick(e, '#admissions')}>მიღება</a>
          </nav>
        </div>

        {/* Content Area: Contacts & Map */}
        <div className="footer-content-layout">
          <div className="footer-info-details">
            <div className="footer-detail-block">
              <span className="footer-detail-label">მისამართი</span>
              <span className="footer-detail-value">ილია ჭავჭავაძის გამზირი 45, თბილისი, საქართველო</span>
            </div>
            <div className="footer-detail-block">
              <span className="footer-detail-label">ტელეფონი</span>
              <span className="footer-detail-value">+995 32 210 00 00</span>
            </div>
            <div className="footer-detail-block">
              <span className="footer-detail-label">ელ-ფოსტა</span>
              <span className="footer-detail-value">info@solomonacademy.ge</span>
            </div>

            <div className="footer-social-wrapper">
              <a href="#facebook" className="footer-social-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="#instagram" className="footer-social-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#linkedin" className="footer-social-link" aria-label="LinkedIn">
                <Linkedin size={18} />
              </a>
            </div>
          </div>

          <div className="footer-map-wrapper">
            <div className="compact-map-box">
              <div className="compact-map-grid-layer"></div>
              <div className="compact-map-pin">
                <div className="compact-pulse-ring"></div>
                <MapPin size={18} className="compact-pin-ico" />
              </div>
              <span className="compact-map-label">სოლომონ აკადემია</span>
              <span className="compact-map-sub">ჭავჭავაძის გამზ. 45</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Staff Links */}
        <div className="footer-bottom-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <p className="footer-copyright-note">
            &copy; 2026 სოლომონ აკადემია. ყველა უფლება დაცულია.
          </p>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => navigate('/register')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              მასწავლებლის შესვლა / რეგისტრაცია
            </button>
            <button
              type="button"
              onClick={() => navigate('/register#admin')}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted, #94a3b8)', fontSize: '0.82rem', cursor: 'pointer', textDecoration: 'underline' }}
            >
              ადმინისტრაცია
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
