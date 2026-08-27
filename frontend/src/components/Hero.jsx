import React from 'react';
import { useAuth } from './AuthContext';

export default function Hero() {
  const { navigate } = useAuth();

  return (
    <section
      id="hero"
      className="sticky-hero-section"
      style={{
        position: 'sticky',
        top: 0,
        height: '100vh',
        minHeight: '600px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        overflow: 'hidden',
        background: '#090507',
        zIndex: 1,
        paddingTop: 'clamp(28px, 4.5vh, 55px)'
      }}
    >
      {/* Background Architectural Palace (Single High-Res Image) */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden' }}>
        <img
          src="/images/hero_building_bg.jpg"
          alt="Solomon Academy Architecture"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 48%',
            filter: 'brightness(0.95) contrast(1.04)'
          }}
        />
        {/* Soft Vignette Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(ellipse at 50% 20%, rgba(10, 6, 8, 0.4) 0%, rgba(10, 6, 8, 0.2) 40%, rgba(10, 6, 8, 0.85) 100%)'
          }}
        />
        {/* Subtle Bottom Fade */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '180px',
            background: 'linear-gradient(to bottom, transparent, rgba(12, 9, 11, 0.95))'
          }}
        />
      </div>

      {/* Hero Central Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '92%',
          maxWidth: '1000px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center'
        }}
      >
        {/* Golden Classical Temple Crest with Horizontal Wings */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '24px',
            width: '100%',
            maxWidth: '620px',
            marginBottom: '16px'
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.65))'
            }}
          />
          
          {/* Central Golden Crest Icon */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.45))'
            }}
          >
            <svg width="56" height="56" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="32" cy="32" r="29" stroke="#d4af37" strokeWidth="1.2" strokeDasharray="2 2" />
              <circle cx="32" cy="32" r="26" stroke="#e8c86d" strokeWidth="1.5" />
              <polygon points="32,15 18,24 46,24" fill="#d4af37" />
              <rect x="20" y="24" width="24" height="2" fill="#f5e2a3" />
              <rect x="22" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              <rect x="28.5" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              <rect x="35" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              <rect x="41.5" y="27" width="3" height="13" fill="#d4af37" rx="0.5" />
              <rect x="18" y="41" width="28" height="2" fill="#f5e2a3" />
              <rect x="16" y="43" width="32" height="3" fill="#d4af37" rx="0.5" />
              <path d="M12 36 C10 30 14 24 18 20" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M52 36 C54 30 50 24 46 20" stroke="#d4af37" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.65), transparent)'
            }}
          />
        </div>

        {/* Main Grand Title: სოლომონ აკადემია */}
        <h1
          style={{
            fontFamily: "'Noto Serif Georgian', 'Playfair Display', Georgia, serif",
            fontSize: 'clamp(2.8rem, 6.2vw, 4.9rem)',
            fontWeight: 400,
            lineHeight: 1.15,
            color: '#f6f4ee',
            letterSpacing: '0.02em',
            textShadow: '0 4px 24px rgba(0, 0, 0, 0.8), 0 0 40px rgba(0, 0, 0, 0.6)',
            marginBottom: '18px'
          }}
        >
          სოლომონ აკადემია
        </h1>

        {/* Subtitle with Flanking Gold Lines */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            width: '100%',
            maxWidth: '520px',
            marginBottom: '36px'
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.7))'
            }}
          />
          <p
            style={{
              fontFamily: "'Noto Serif Georgian', Georgia, serif",
              fontSize: 'clamp(1rem, 1.4vw, 1.25rem)',
              color: '#d6c8b0',
              fontWeight: 400,
              letterSpacing: '0.04em',
              margin: 0,
              textShadow: '0 2px 10px rgba(0,0,0,0.8)'
            }}
          >
            ცოდნის გზა იწყება აქ
          </p>
          <div
            style={{
              flex: 1,
              height: '1px',
              background: 'linear-gradient(90deg, rgba(212, 175, 55, 0.7), transparent)'
            }}
          />
        </div>

        {/* Primary CTA Button: შეიტყვეთ მეტი → */}
        <a
          href="/gallery"
          onClick={(e) => {
            e.preventDefault();
            navigate('/gallery');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            padding: '13px 36px',
            borderRadius: '10px',
            background: 'linear-gradient(180deg, #b88628 0%, #9e6f1a 100%)',
            color: '#1a1104',
            fontFamily: "'Noto Sans Georgian', sans-serif",
            fontSize: '1rem',
            fontWeight: 700,
            letterSpacing: '0.02em',
            textDecoration: 'none',
            border: '1px solid rgba(255, 230, 160, 0.45)',
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
            transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #ca9530 0%, #ad7c1f 100%)';
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 30px rgba(184, 134, 40, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(180deg, #b88628 0%, #9e6f1a 100%)';
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.35)';
          }}
        >
          <span>შეიტყვეთ მეტი</span>
          <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>→</span>
        </a>
      </div>
    </section>
  );
}
