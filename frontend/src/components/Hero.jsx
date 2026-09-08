import React from 'react';
import { Users, Newspaper, DollarSign, Image as ImageIcon, FileText, ChevronDown, ArrowRight } from 'lucide-react';
import { useAuth } from './AuthContext';

export default function Hero() {
  const { navigate } = useAuth();

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      style={{
        position: 'relative',
        height: '100vh',
        minHeight: '720px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        overflow: 'hidden',
        background: '#090507',
        backgroundImage: `linear-gradient(180deg, rgba(12, 6, 8, 0.2) 0%, rgba(12, 6, 8, 0.1) 40%, rgba(12, 6, 8, 0.75) 100%), url(/assets/palace-exterior.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 45%',
        backgroundRepeat: 'no-repeat',
        paddingTop: '110px',
        paddingBottom: '28px',
        paddingLeft: '32px',
        paddingRight: '32px',
        color: '#ffffff'
      }}
    >
      {/* Top spacer */}
      <div style={{ width: '100%' }} />

      {/* Hero Central Content (Photo 13) */}
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
        {/* Main Grand Title: სოლომონ აკადემია */}
        <h1
          style={{
            fontFamily: 'var(--font-serif, "Noto Serif Georgian", Georgia, serif)',
            fontSize: 'clamp(3rem, 6.5vw, 5rem)',
            fontWeight: 700,
            lineHeight: 1.12,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            textShadow: '0 4px 30px rgba(0, 0, 0, 0.9), 0 2px 10px rgba(0, 0, 0, 0.7)',
            marginBottom: '10px'
          }}
        >
          სოლომონ აკადემია
        </h1>

        {/* Subtitle: ცოდნის გზა იწყება აქ */}
        <p
          style={{
            fontFamily: 'var(--font-sans, "Noto Sans Georgian", sans-serif)',
            fontSize: 'clamp(1.15rem, 1.8vw, 1.55rem)',
            color: 'rgba(255, 255, 255, 0.95)',
            fontWeight: 400,
            letterSpacing: '0.04em',
            marginBottom: '36px',
            textShadow: '0 2px 16px rgba(0, 0, 0, 0.9)'
          }}
        >
          ცოდნის გზა იწყება აქ
        </p>

        {/* Action Buttons (Photo 13) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {/* Primary Solid Gold Button: შედით აკადემიაში → */}
          <button
            onClick={() => scrollToSection('spaces-hub')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              padding: '15px 34px',
              borderRadius: '10px',
              background: 'linear-gradient(180deg, #d4af37 0%, #b88628 100%)',
              color: '#1a1104',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '1.02rem',
              fontWeight: 700,
              letterSpacing: '0.02em',
              border: '1px solid rgba(255, 230, 160, 0.7)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)',
              transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
              e.currentTarget.style.boxShadow = '0 12px 30px rgba(212, 175, 55, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.4)';
            }}
          >
            <span>შედით აკადემიაში</span>
            <ArrowRight size={18} />
          </button>

          {/* Secondary Translucent Button: სკოლის გალერეა */}
          <button
            onClick={() => {
              navigate('/gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '15px 30px',
              borderRadius: '10px',
              background: 'rgba(30, 18, 22, 0.6)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              color: '#ffffff',
              fontFamily: 'var(--font-sans, sans-serif)',
              fontSize: '1.02rem',
              fontWeight: 500,
              border: '1px solid rgba(212, 175, 55, 0.4)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.5)',
              transition: 'all 0.25s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(45, 25, 32, 0.85)';
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(30, 18, 22, 0.6)';
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            სკოლის გალერეა
          </button>
        </div>

        {/* Down Arrow Chevron */}
        <button
          onClick={() => scrollToSection('spaces-hub')}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.8)',
            cursor: 'pointer',
            marginTop: '36px'
          }}
          aria-label="Scroll down"
        >
          <ChevronDown size={28} />
        </button>
      </div>

      {/* Bottom Dock Bar (Photo 13) */}
      <div
        style={{
          position: 'relative',
          zIndex: 3,
          width: '100%',
          maxWidth: '1320px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Page counter 01 / 18 (Bottom Left) */}
        <div
          style={{
            background: 'rgba(0, 0, 0, 0.55)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '20px',
            padding: '5px 16px',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: '#d4af37',
            letterSpacing: '0.08em'
          }}
        >
          01 / 18
        </div>

        {/* Central Floating Quick Dock (Photo 13) */}
        <div
          style={{
            background: 'rgba(28, 16, 20, 0.72)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '18px',
            padding: '8px 24px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.65)'
          }}
        >
          {[
            { label: 'პედაგოგები', icon: Users, target: 'teachers' },
            { label: 'სიახლეები', icon: Newspaper, target: 'news' },
            { label: 'საფასური', icon: DollarSign, target: 'admissions' },
            { label: 'გალერეა', icon: ImageIcon, action: () => navigate('/gallery') },
            {
              label: 'ონლაინ განაცხადი',
              icon: FileText,
              action: () => {
                window.dispatchEvent(new CustomEvent('set-auth-mode', { detail: { mode: 'register' } }));
                scrollToSection('admissions');
              }
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <button
                key={idx}
                onClick={item.action || (() => scrollToSection(item.target))}
                style={{
                  background: 'none',
                  border: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '8px 16px',
                  borderRadius: '10px',
                  color: 'rgba(255, 255, 255, 0.88)',
                  fontSize: '0.82rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                  e.currentTarget.style.color = '#d4af37';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'none';
                  e.currentTarget.style.color = 'rgba(255, 255, 255, 0.88)';
                }}
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right side spacer to keep dock centered */}
        <div style={{ width: '80px' }} />
      </div>
    </section>
  );
}
